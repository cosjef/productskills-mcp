# PRD: Okta IDV Integration

**Owner:** Jeff Costa | **Date:** 2026-04-08 | **Status:** Draft

## Problem Statement

Okta is the dominant IAM platform in the Fortune 500 — the exact segment KYE targets. Of the 4 key KYE moments — Hiring, Onboarding, Privileged Access, Account Recovery — three require Okta to trigger or complete the workflow:

- **Onboarding:** Okta account provisioning is gated on ID verification
- **Account Recovery:** Okta is the MFA reset surface
- **Privileged Access:** Okta Privileged Access (OPA) is the PIM layer at most large enterprises

Without an Okta integration, every KYE deal requires custom engineering work, which extends sales cycles and creates dependencies on SE engineers. KYE is also the FY27 bridging strategy for $1.25M in NA bookings. Okta as a pre-configured, first-party, supported IDV vendor is a prerequisite to get there.

The absence of an integration has also had a partnership cost: Entrust was downgraded in Okta's "Okta Elevate" partner program due to lack of integrations. Competitors (Persona, CLEAR Verified, Incode) already have these integrations. The partner standing downgrade limits Okta-sourced pipeline, and shipping this integration recovers that standing.

**Integration mechanism context:** Okta supports a first-class IDV vendor type called `ID_PROOFING` — a native policy step in the Okta Admin Console, not a webhook or custom integration. Persona, CLEAR Verified, and Incode have achieved this status. Entrust has not. The gap is not just "no Okta integration" — it is "not in the vendor framework that makes IDV deployable by an Okta admin."

**Competitive Evidence:**

- State Farm: deal loss to Veriff in progress (not a native Okta integration)
- Active pipeline — Optum/UHG, Dell, PwC, Comcast — all likely Okta shops (confirm with AEs and Gnan before kickoff)
- Okta + Cisco Duo is a widely adopted and competitive integration, particularly in enterprise workforce identity scenarios
- Experian formally partnered with Incode (2025), giving Incode enterprise distribution to 1,800 customers via Experian Ascend and CrossCare products

## Goals

- Close 3+ deals from active KYE pipeline where Okta integration was a stated requirement or objection — within 6 months of GA
- Reduce time-to-demo for KYE prospects from days (custom SE setup) to under 60 minutes
- Publish OIN marketplace listing within 90 days of GA to enable inbound pipeline from Okta ecosystem
- Recover Okta Elevate partner tier and activate alliances channel (Optive, WWT, Guidepoint) for KYE distribution

## Target Users

**Primary — Okta IAM Admin / IT Security lead** at a Fortune 500 company who has been asked to add IDV to an existing Okta workflow (onboarding, account recovery, or privileged access) and needs to configure it without a custom engineering project or PS engagement.

**Secondary — HR / IT Ops lead** at the same company who owns the new hire onboarding process, experiences the pain of manual identity checks, and is the internal sponsor pushing for a solution. Does not configure the integration but approves and requests it.

**Tertiary — Entrust AE / SE** who needs to demo the Okta + Entrust story in under 30 minutes without engineering on the call.

This separates the buyer who feels the pain (HR/IT ops), the buyer who implements the fix (IAM admin), and the internal sales user (AE/SE) — three distinct jobs, three distinct success criteria.

## Requirements

**P0 — Does not ship without:**

**P0.1** An Okta admin can add Entrust as an `ID_PROOFING` provider in the Okta Admin Console and trigger an Entrust IDV flow (doc scan + biometric) from an Okta authentication policy — without writing custom code, hosting custom endpoints, or involving Entrust PS.

**P0.2** Verification result is returned to Okta as a signed JWT (`id_token`) containing `verified_claims` with `assurance_level: VERIFIED or FAILED` and `trust_framework: IDV-DELEGATED`. Okta uses this claim to gate the policy outcome. A confidence score or intermediate state is not sufficient — Okta's policy engine resolves on VERIFIED or FAILED only.

**P0.3** Integration covers at least 2 of 4 KYE moments: New Hire Onboarding and Account Recovery / MFA Reset.

**P0.4** End-user IDV flow is completable on mobile (iOS + Android) — many employees complete onboarding on phone.

**P0.5** Studio prebuilt template for Okta onboarding flow — removes SE setup time per deal and is required for the AE/SE demo motion to be repeatable without engineering on the call.

**P1 — Ships without, but materially degrades the KYE story:**

**P1.1** Entrust listed in Okta Integration Network (OIN) marketplace — enables customer self-serve discovery. *Current assessment: likely Phase 2. OIN certification timeline unknown (see Open Question 5); certification process may be 2 weeks or 6 months. The core OIDC integration is a prerequisite regardless — OIN listing is the packaging step on top of a working integration, not a separate build.*

**P1.2** Integration supports Privileged Access (PIM role elevation) trigger, required for Gov Cloud IAL-2 use case.

**P1.3** Entrust's inline hook endpoint authenticates incoming Okta calls via OAuth 2.0 access tokens, per Okta's published inline hook security guidance. This allows the integration to present as a higher-assurance security component in the Okta auth path, not just another webhook consumer — a meaningful positioning advantage for KYE deals where security posture is a buying criterion.

**P2 — Nice to haves:**

**P2.1** Okta-consistent UI for the IDV experience

**P2.2** Webhook-based real-time verification status back to Okta

**P2.3** Support for Okta Verify (passkey) as a downstream step post-IDV

## Integration Architecture & Data Flow

*Sourced from the [Okta IDV Integration Guide](https://developer.okta.com/docs/guides/idv-integration/main/). Full endpoint specs, JWT claim definitions, Admin Console configuration steps, and error codes: [references/okta-integration-spec.md](references/okta-integration-spec.md).*

Entrust must implement four endpoints: `POST /oauth2/par` (receives Okta's server-side authorization request and returns a `request_uri`), `GET /oauth2/authorize` (receives the `request_uri` and launches the IDV ceremony), `POST /oauth2/token` (exchanges the authorization code for a signed ID token using PKCE/S256), and a JWKS endpoint so Okta can verify the token signature. The flow is always PAR-first: Okta sends parameters server-to-server, gets back a short-lived `request_uri`, then redirects the user's browser carrying only that reference. The user completes doc scan and biometric, Entrust redirects to Okta's fixed callback URI, and Okta completes the code-for-token exchange.

The ID token Entrust returns must contain a `verified_claims` object with two required fields: `trust_framework: "IDV-DELEGATED"` and `assurance_level: "VERIFIED" | "FAILED"`. Okta's policy engine resolves on `assurance_level` only — VERIFIED allows the step, FAILED denies it. Entrust does not send the full verification payload to Okta; the audit record stays in Entrust's system. One implementation edge case: `given_name` and `family_name` are required claims by default in the PAR request — if a user's Okta profile is missing these fields, the PAR request fails before the ceremony starts.

---

## Technical Considerations

**Integration architecture: why Okta chose OIDC**

IDV is a user-facing flow. A webhook can notify a backend — it cannot redirect a browser, run a verification ceremony, or return control to Okta. OIDC's authorization code flow is built for exactly this: send the user to a vendor, run a ceremony, come back with a result. That result is a signed JWT (ID token) — cryptographically verifiable by Okta, with a standardized claims structure. Webhooks return JSON over HTTP with no built-in trust model. OIDC is a portable trust container; webhooks are a notification layer with no user interaction, no redirect flow, and no clean policy integration.

PAR (Pushed Authorization Requests) adds enterprise hardening: authorization parameters travel server-to-server first; the browser only carries a short-lived reference. The downstream effect: Okta's policy engine treats Entrust like any other authenticator — MFA, WebAuthn, risk-based step-up. "Require IDV if risk is high" becomes a policy rule, not a custom integration.

We are not building an API integration. We are building a standards-compliant identity system component. This distinction matters in security reviews and in how AEs position KYE against competitors.

**Inline hook security model:** Okta's inline and event hooks are outbound calls from Okta to Entrust's service, not inbound. Okta has published best-practice guidance for securing these integrations, including OAuth 2.0 access-token-based authentication on inline hook requests. If Entrust implements that auth model, the integration presents as a higher-assurance security component in the Okta auth path. This positioning matters in deals where the security team scrutinizes the integration and is the basis for P1.4.

## Success Metrics

| Metric | Target | Counter-metric |
|--------|--------|----------------|
| KYE pipeline deals closed citing Okta | 3 within 6 months of GA | Without increasing avg time-to-close |
| SE demo setup time | < 30 min from scratch | Without requiring SE to modify customer Okta config |
| OIN listing published | Within 90 days of GA | Okta certification requirements met — not bypassed |
| Pipeline unblocked | 50%+ of active KYE deals no longer cite Okta as a gap | — |
| Channel pipeline sourced via Okta Elevate / resellers | TBD with John Parish | Within 6 months of GA |

## Out of Scope

- **CIAM / customer-facing Okta use cases** — different buyer, different motion; this PRD covers KYE/workforce only
- **Custom per-customer Okta workflow engineering** — eliminating this pattern is the point
- **Inline hooks / token enrichment model** — Entrust acting as a risk/enrichment signal injected into Okta token claims via inline hook. Different positioning (decision provider vs. step provider), different buyer motion. Deferred.

## Open Questions

**1. Customer pain validation:** No documented evidence validating the problem statement, customer interest, or customers' preferred implementation methods.

**2. Integration path:** The native OIN listing path and the OIDC path are the same path. To register as an Okta `ID_PROOFING` vendor, Entrust must implement OIDC Authorization Code flow with PAR. The three required endpoints are: `POST /oauth2/par` (back-channel session creation), `GET /oauth2/idv-authorize` (browser-facing IDV UX entry), and `POST /oauth2/token` (code-for-JWT exchange). Entrust also needs a JWKS endpoint for token verification. The Studio task option is a separate, non-native workaround — it may unblock early deals but does not achieve OIN listing or admin-configurable policy integration. These are different outcomes. Decision needed: ship Studio task as interim, or go straight to OIDC/OIN?

**3. Fail-open vs. fail-closed:** Once Entrust is in the Okta auth path via `ID_PROOFING`, it becomes a synchronous, blocking dependency. If Entrust is slow or unavailable, Okta waits. Decision needed before GA: does the flow fail the verification (fail-closed) or skip it (fail-open) if Entrust times out? This affects SLO commitments, latency budgets, and customer trust. Engineering must define this before the integration is production-certified.

**4. MGM prototype (Andrew):** Jeff Hickman built an Okta integration for MGM in 2023/2024. Docs lost in OneDrive migration. Recovery or reconstruction could reduce build scope significantly and help directionally.

**5. OIN certification timeline (Jeff + Nicole Lam):** Is this a 2-week or 6-month process? Determines whether OIN listing is P1 this cycle or gets pushed.

**6. Engineering resource confirmation (Gnan):** Engineering does not have Okta work on committed roadmap. Gates all external commitments.

**7. Pipeline validation (AEs):** Confirm which active accounts specifically require Okta integration vs. just being Okta shops. Pull from Salesforce / recent call notes before kickoff.

**8. Architecture customer validation:** OIDC or Studio task? API or native integration?

**9. Nimble:** Nimble claims to have already built the Okta integration. Gnan recommends caution; prefers internal resources via Wipro. Evaluate: what did they build, does it meet P0 requirements, does it reduce internal build scope?

**10. MVI:** Define the minimum viable integration. Do not try to integrate everything. Select one critical use case ("step-up auth during account recovery") and scope it to the absolute minimum required for a successful, demonstrable flow within Okta's framework.

**11. Okta Marketplace:** Customers use the Okta/Auth0 marketplace primarily for discovery but request direct access to executable code during implementation. Clarify whether achieving a low-friction marketplace listing requires materially more investment to meet new "uniform integration standards," and whether that effort aligns with actual customer adoption behavior.

## Notable Not Doing

**SSF as a future expansion path:** Okta's Shared Signals Framework (SSF) supports continuous risk signal ingestion from third-party security providers (CrowdStrike, Omnissa). This is a separate integration model from `ID_PROOFING` — asynchronous, background, and security-posture-based rather than point-in-time verification. Worth flagging to Mark Lewin as a potential Phase 2 partnership angle. Not in scope for this cycle.

## Appendix

### Stakeholders

| Name | Role | Involvement |
|------|------|-------------|
| Gnan Gowda | Jeff's manager | Engineering resource confirmation; roadmap authority |
| Summer Gaasedelen | Customer Onboarding / PS | Requirements input before Andrew engagement |
| Andrew MacCuaig | Engineering Manager, Studio | Build scoping — only after Summer's input |
| Mark Lewin | BizDev & Partnerships | Okta partner relationship; warm intro to Nicole Lam |
| John Parish | Alliances | Reseller channel activation post-GA |
| Nicole Lam | Okta — Partnership Program | External partner contact; intro pending eng resource confirmation |
| Yelena Tarbuck | AE, New Customers | Pipeline validation; customer demand examples |
| Reed Schroeder | AE | State Farm deal; Okta customer discovery |
