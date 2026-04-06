# PRD: Okta Integration for Workforce IDV

**Status:** Draft | **Owner:** Jeff Costa | **Date:** 2026-04-04 | **Updated:** 2026-04-06

---

## Problem

Entrust has no native Okta integration. Incode ships Okta + Cisco Duo integrations today and is winning on it. Veriff's Okta integration is a cited factor in the State Farm deal currently in progress as a loss. Okta is the dominant IAM platform in the Fortune 500 — the exact segment KYE targets.

Of the 4 key KYE moments — Hiring, Onboarding, Privileged Access, Account Recovery — three require Okta to trigger or complete the workflow:
- **Onboarding:** Okta account provisioning is gated on ID verification
- **Account Recovery:** Okta is the MFA reset surface
- **Privileged Access:** Okta Privileged Access (OPA) is the PIM layer at most large enterprises

Without an Okta integration, every KYE deal requires custom engineering, extending sales cycles and creating SE dependency. KYE is the FY27 bridging strategy for $1.25M in bookings. Okta is a prerequisite to getting there.

The absence of an integration has also had a partnership cost: Entrust was downgraded in Okta's "Okta Elevate" partner program due to lack of integrations. Competitors — Persona, Clear, Incode — already have these integrations. Technical support access (ticketing, engineer-to-engineer) is still intact, but the partner standing downgrade limits Okta-sourced pipeline. Shipping this integration recovers that standing.

**Evidence:**
- State Farm: deal loss in progress; Veriff's Okta integration is a cited factor
- Nashville Electric: active deal using new Okta framework — confirmed real demand
- Active pipeline — Optum/UHG, Dell, PwC, Comcast — all likely Okta shops *(confirm with Yelena Tarbuck before kickoff)*
- Sales team reports stalled opportunities due to missing Okta integration (per Mark Lewin call, 2026-04-06)
- Alliances team (John Parish): reseller network (Optive, WWT, Guidepoint, Accutive, Trace3) believes a working Okta integration unlocks significant channel opportunity — these firms have existing multi-million dollar Entrust hardware/HSM/PKI relationships
- Incode: Okta + Cisco Duo live; Experian partnered with Incode in 2025 — competitive channel now has distribution

---

## Goals

1. Close 3+ deals from active KYE pipeline where Okta integration was a stated requirement or objection — within 6 months of GA
2. Reduce time-to-demo for KYE prospects from days (custom SE setup) to under 30 minutes
3. Publish OIN marketplace listing within 90 days of GA to enable inbound pipeline from Okta ecosystem
4. Recover Okta Elevate partner tier and activate alliances channel (Optive, WWT, Guidepoint, etc.) for KYE distribution

---

## Target Users

**Primary:** Enterprise IT/Security teams (CISO, IAM leads) at Fortune 500 companies running Okta who need to add IDV to employee onboarding, MFA/account recovery, or privileged access workflows.

**Secondary:** Entrust AEs and SEs — they need a repeatable, self-serviceable demo that doesn't require custom Okta configuration.

---

## Stakeholders

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

---

## Requirements

**P0 — Does not ship without:**
- P0: An Okta admin can trigger an Entrust IDV flow (doc + biometric) from within an Okta workflow or policy without custom code on the customer side.
- P0: Verification result (pass/fail + confidence score) is returned to Okta and can gate provisioning, access grants, or recovery flows.
- P0: Integration covers at least 2 of 4 KYE moments: New Hire Onboarding and Account Recovery / MFA Reset.
- P0: End-user IDV flow is completable on mobile (iOS + Android) — most employees complete onboarding on phone.

**P1 — Ships without, but materially degrades the KYE story:**
- P1: Entrust listed in Okta Integration Network (OIN) marketplace — enables self-serve discovery.
- P1: Integration supports Privileged Access (PIM role elevation) trigger, required for Gov Cloud IAL-2 use case.
- P1: Studio prebuilt template for Okta onboarding flow — removes SE setup time per deal.
- P1: Integration supports Hiring / Applicant Pre-Screening moment (pre-Okta provisioning).

**P2:**
- P2: Okta-consistent UI for the IDV experience
- P2: Webhook-based real-time verification status back to Okta
- P2: Support for Okta Verify (passkey) as a downstream step post-IDV

---

## Success Metrics

| Metric | Target | Counter-metric |
|--------|--------|----------------|
| KYE pipeline deals closed citing Okta | 3 within 6 months of GA | Without increasing avg time-to-close |
| SE demo setup time | < 30 min from scratch | Without requiring SE to modify customer Okta config |
| OIN listing published | Within 90 days of GA | Okta certification requirements met — not bypassed |
| Pipeline unblocked | 50%+ of active KYE deals no longer cite Okta as a gap | — |
| Channel pipeline sourced via Okta Elevate / resellers | TBD with John Parish | Within 6 months of GA |

---

## Out of Scope

- **Cisco Duo** — Incode has it; important but not this cycle.
- **Workday** — separate no-webhook architecture problem; separate PRD.
- **CIAM / customer-facing Okta use cases** — different buyer, different motion; this PRD covers KYE/workforce only.
- **Custom per-customer Okta workflow engineering** — eliminating this pattern is the point.
- **Ping Identity feature parity** — separate initiative.

---

## Open Questions

1. **Integration path** (Jeff → Summer → Andrew, do not go to Andrew first): Three options — BYO IDV via OIDC, new Studio task, or native OIN listing. OIDC path is missing /oauth2/auth, /oauth2/token, /oauth2/jwks. OIN may require Okta certification — potential timeline blocker. **Path decision gates all scoping.** Target: [date?]

2. **Nimble evaluation** (Wednesday call, ~2026-04-08): Nimble claims to have already built the Okta integration. Gnan recommends caution; prefers internal resources via Wipro. Evaluate Wednesday: what did they build, does it meet P0 requirements, does it reduce internal build scope? Do not make external commitments until this is assessed.

3. **Engineering resource confirmation** (Jeff → Gnan, due 2026-04-07): Engineering is not yet confirmed on roadmap. **Gates all external commitments** — partner intro to Nicole Lam, Nimble evaluation framing, and AE pipeline promises all depend on this.

4. **MGM prototype** (Andrew): Jeff Hickman built an Okta integration for MGM in 2023/2024. Docs lost in OneDrive migration. Recovery or reconstruction could reduce build scope significantly.

5. **OIN certification SLA** (Jeff + Nicole Lam via Mark): Is this a 2-week or 6-month process? Determines whether OIN listing is P1 this cycle or gets pushed. Ask on intro call with Nicole.

6. **Pipeline validation** (Yelena Tarbuck, meeting in 2 days): Confirm which active accounts specifically require Okta integration vs. just being Okta shops. Pull from Salesforce / recent call notes before kickoff.
