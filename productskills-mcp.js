#!/usr/bin/env node
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// IMPORTANT: stdio servers must not write to stdout (Claude Desktop uses stdout for protocol)
const log = (...args) => console.error("[productskills-mcp]", ...args);

// Make paths independent of Claude Desktop working directory
const ROOT = path.dirname(fileURLToPath(import.meta.url));

const IGNORE_FILES = new Set([
  "README.md",
  "CONTRIBUTING.md",
  "LICENSE.md",
  "CHANGELOG.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
]);

function findMarkdownFiles(dir, depth = 0, maxDepth = 6) {
  const out = [];
  if (!fs.existsSync(dir) || depth > maxDepth) return out;

  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (
        ent.name === "node_modules" ||
        ent.name === ".git" ||
        ent.name === "dist" ||
        ent.name === "build" ||
        ent.name === ".next" ||
        ent.name.startsWith(".")
      ) {
        continue;
      }
      out.push(...findMarkdownFiles(path.join(dir, ent.name), depth + 1, maxDepth));
      continue;
    }

    if (!ent.isFile()) continue;
    if (!ent.name.toLowerCase().endsWith(".md")) continue;
    if (IGNORE_FILES.has(ent.name)) continue;

    out.push(path.join(dir, ent.name));
  }
  return out;
}

// Guaranteed-valid tool id: ps_<12 hex chars>
function toolIdFromRelPath(rel) {
  const h = crypto.createHash("sha256").update(rel).digest("hex").slice(0, 12);
  return `ps_${h}`;
}

/**
 * Human-friendly aliases that match how ProductSkills is structured.
 *
 * Examples:
 *  - skills/bet-sizing/SKILL.md                     -> bet-sizing
 *  - skills/competitor-analysis/SKILL.md            -> competitor-analysis
 *  - skills/user-interview/references/foo.md        -> user-interview-foo
 *  - CLAUDE.md                                      -> productskills-docs
 */
function aliasFromRel(rel) {
  const norm = rel.replace(/\\/g, "/");

  // Primary: skills/<skill-name>/SKILL.md => <skill-name>
  const m = norm.match(/^skills\/([^/]+)\/SKILL\.md$/i);
  if (m) return m[1].toLowerCase();

  // References: skills/<skill-name>/references/<file>.md => <skill-name>-<file>
  const r = norm.match(/^skills\/([^/]+)\/references\/(.+)\.md$/i);
  if (r) {
    const skill = r[1].toLowerCase();
    const leaf = r[2]
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "");
    return `${skill}-${leaf}`;
  }

  // Root docs
  if (/^CLAUDE\.md$/i.test(norm)) return "productskills-docs";

  // Fallback: basename
  const base = norm.split("/").pop().replace(/\.md$/i, "");
  return base
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

const server = new McpServer({ name: "productskills", version: "1.3.0" });

// Collect markdown files
const files = findMarkdownFiles(ROOT);

// Build tool list (stable)
const tools = files
  .map((file) => {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    return { id: toolIdFromRelPath(rel), file, rel };
  })
  .sort((a, b) => a.rel.localeCompare(b.rel));

log(`Found skills: ${tools.length}`);

// Register hashed tools (always safe)
for (const t of tools) {
  server.registerTool(
    t.id,
    {
      title: t.id,
      description: `Returns template from ${t.rel}`,
      inputSchema: z.object({}).shape,
      annotations: { readOnlyHint: true },
    },
    async () => {
      const text = fs.readFileSync(t.file, "utf8");
      return {
        content: [{ type: "text", text }],
        structuredContent: { content: text },
      };
    }
  );
}

// Register human-friendly aliases (skip collisions, but keep hashes available)
const aliasMap = new Map(); // alias -> tool id
const aliasCollisions = new Map(); // alias -> [rel,...]

for (const t of tools) {
  const alias = aliasFromRel(t.rel);
  if (!alias) continue;

  if (aliasMap.has(alias)) {
    const existingId = aliasMap.get(alias);
    const existingRel = tools.find((x) => x.id === existingId)?.rel ?? "(unknown)";
    const prev = aliasCollisions.get(alias) ?? [existingRel];
    aliasCollisions.set(alias, [...new Set([...prev, t.rel])]);
    continue;
  }

  aliasMap.set(alias, t.id);

  server.registerTool(
    alias,
    {
      title: alias,
      description: `Alias for ${t.id} (${t.rel})`,
      inputSchema: z.object({}).shape,
      annotations: { readOnlyHint: true },
    },
    async () => {
      const text = fs.readFileSync(t.file, "utf8");
      return {
        content: [{ type: "text", text }],
        structuredContent: { content: text },
      };
    }
  );
}

// Discoverability helpers
server.registerTool(
  "list_skills",
  {
    title: "list_skills",
    description: "Lists ProductSkills tools (human alias -> ps_hash -> source file).",
    inputSchema: z.object({}).shape,
    annotations: { readOnlyHint: true },
  },
  async () => {
    const rows = [...aliasMap.entries()]
      .map(([alias, id]) => {
        const rel = tools.find((t) => t.id === id)?.rel ?? "(unknown)";
        return { alias, id, rel };
      })
      .sort((a, b) => a.alias.localeCompare(b.alias));

    const collisionLines = [...aliasCollisions.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([alias, rels]) => `- ${alias}: ${rels.join("  |  ")}`);

    const header = "Named Aliases (shortcuts):";
    const body = rows.length
      ? rows.map((r) => `${r.alias}  ->  ${r.id}  <-  ${r.rel}`).join("\n")
      : "(no aliases registered)";

    const collisions = collisionLines.length
      ? `\n\nAlias collisions (kept hashes; skipped alias registration):\n${collisionLines.join("\n")}`
      : "";

    const text = `${header}\n${body}${collisions}`;

    return { content: [{ type: "text", text }], structuredContent: { content: text } };
  }
);

server.registerTool(
  "list_hashes",
  {
    title: "list_hashes",
    description: "Lists ps_<hash> tools (ps_hash -> source file).",
    inputSchema: z.object({}).shape,
    annotations: { readOnlyHint: true },
  },
  async () => {
    const text = tools.length
      ? tools.map((t) => `${t.id}  <-  ${t.rel}`).join("\n")
      : "(no skills found)";
    return { content: [{ type: "text", text }], structuredContent: { content: text } };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

