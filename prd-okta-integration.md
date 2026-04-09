# DRAFT: Okta IDV Integration PRD

| | |
|---|---|
| **Driver** | Jeff Costa |
| **Primary KPI** | FY27 KYE NA Bookings: $1.25M |
| **Status** | DRAFT |
| **Teams** | North America Expansion, Engineering, Design, Marketing |
| **ProductBoard** | TBD |
| **MRD** | TBD |
| **Dovetail (customer interviews)** | TBD |
| **Data sources** | Salesforce pipeline, Okta Elevate partner portal |
| **Miro** | TBD |
| **Figma Designs** | TBD |

---

## Table of Contents

- [1. Problem Statement](#1-problem-statement)
  - [1.1 What problem are we trying to solve and why?](#11-what-problem-are-we-trying-to-solve-and-why)
  - [1.2 Product Objectives](#12-product-objectives)
  - [1.3 Product Impact](#13-product-impact)
- [2. Target Audience and Users](#2-target-audience-and-users)
- [3. Success Measures & Key Performance Indicators](#3-success-measures--key-performance-indicators)
- [4. Solution](#4-solution)
  - [4.1 Solution Overview](#41-solution-overview)
  - [4.2 Customer Workflow](#42-customer-workflow)
  - [4.3 Deployment Model](#43-deployment-model)
  - [4.4 Uncertainty & Risks](#44-uncertainty--risks)
- [5. Technical Feasibility](#5-technical-feasibility)
- [6. Dependencies](#6-dependencies)
- [7. GA Scope](#7-ga-scope)
- [8. Build / Buy / Partner](#8-build--buy--partner)
- [9. Rollout Plan](#9-rollout-plan)
- [10. Go-To-Market Plan](#10-go-to-market-plan)
- [11. FAQ's](#11-faqs)
- [12. Relevant Links or Additional Information](#12-relevant-links-or-additional-information)

---

## 1. Problem Statement

### 1.1 What problem are we trying to solve and why?

> *Describe the discrete problem we are potentially solving with this. Stay clear of including solutions in the problem statement.*

Okta is the dominant IAM platform in the Fortune 500 — the exact segment KYE targets. Of the four key KYE moments — Hiring, Onboarding, Privileged Access, and Account Recovery — three require Okta to trigger or complete the workflow:

- **Onboarding:** Okta account provisioning is gated on ID verification
- **Account Recovery:** Okta is the MFA reset surface
- **Privileged Access:** Okta Privileged Access (OPA) is the PIM layer at most large enterprises

Without a native Okta integration, every KYE deal requires custom engineering work, which extends sales cycles and creates dependencies on SE engineers. KYE is the FY27 bridging strategy for $1.25M in NA bookings, and the absence of an Okta integration blocks that path.

The problem runs deeper than a missing API connection. Okta supports a first-class IDV vendor category — a native policy step configurable in the Okta Admin Console, not a webhook or custom integration. Competitors (Persona, CLEAR Verified, Incode) have achieved this status. Entrust has not. The gap is not just "no Okta integration" — it is "not in the vendor framework that makes IDV deployable by an Okta admin without engineering."

The partnership cost has been concrete: Entrust was downgraded in Okta's "Okta Elevate" partner program due to lack of integrations. This limits Okta-sourced pipeline and reduces Entrust's visibility to Okta field sellers.

**Competitive evidence:**

- State Farm: deal loss to Veriff in progress
- Active pipeline — Optum/UHG, Dell, PwC, Comcast — all likely Okta shops
- Incode secured a formal partnership with Experian (2025), gaining distribution to 1,800 enterprise customers via Experian Ascend and CrossCare products

#### Why This Problem Matters Now

KYE is the FY27 NA growth vehicle. The $1.25M bookings target is predicated on closing accounts that already run Okta. Competitors are entrenched. Every month without a native IDV integration is a month Entrust cannot win on deal criteria that are already in market.

#### Why We Are Solving It

By building a native Okta IDV integration, Entrust becomes selectable by an Okta IAM admin without a custom engineering project, recovers its Okta Elevate partner standing, and removes the single most-cited technical objection in the active KYE pipeline.

---

### 1.2 Product Objectives

> *Thought primers: Articulate the objectives of solving this problem.*

1. **Remove the integration blocker from the active KYE pipeline** by delivering a native Okta IDV integration that an IAM admin can configure in the Okta Admin Console without custom code or PS engagement.

2. **Recover Okta Elevate partner standing** and reactivate the Okta-sourced channel, enabling alliances partners (Optive, WWT, Guidepoint) to distribute Entrust KYE through Okta ecosystem motions.

3. **Eliminate per-deal SE setup overhead** by providing a Studio prebuilt template for the Okta onboarding flow, reducing demo setup to under 30 minutes without engineering on the call.

4. **Establish inbound discovery** via the Okta Integration Network (OIN) marketplace listing, enabling customer self-serve discovery of Entrust IDV within Okta's ecosystem.

---

### 1.3 Product Impact

> *Thought primers: Articulate the impact of solving this problem.*

**Business & Revenue**

- Directly accelerates the FY27 KYE $1.25M NA bookings target by converting active pipeline deals (Optum/UHG, Dell, PwC, Comcast) that currently cannot close without an Okta integration.
- Moves Entrust from "not selectable" to peer-of-Persona/CLEAR/Incode in Okta's IDV vendor framework, changing the competitive baseline in Fortune 500 deals.
- Reactivates the Okta-sourced channel as a pipeline source, unlocking co-sell motions and reseller distribution that are currently unavailable due to partner tier downgrade.

**Customer & Operational**

- Fortune 500 IAM admins can adopt Entrust IDV within existing Okta policies without a custom engineering project, removing the single most-cited technical objection in KYE deals.
- Reduces Entrust's per-deal delivery risk: no custom SE build, no PS dependency, no timeline extension for engineering setup.

---

## 2. Target Audience and Users

> *Thought primers: Who are the personas who will use this product or capability? This section should be informed by user research. Every target user should have a User Story.*
>
> *As a (user) I want to (action) so that (value).*
>
> **Why now?**
> - Why do we want to solve this now?
> - How does it connect with our Company Goals?
> - User/Data/Market Insights?
> - Are there regulatory requirements that make this important to solve now or soon?

**Target Institutions**

Fortune 500 enterprises running Okta as their primary IAM platform, specifically organizations experiencing one or more of the following:

- Active new hire onboarding programs where identity verification is a compliance requirement
- MFA reset and account recovery flows exposed to social engineering or account takeover risk
- Privileged access or PIM programs (Okta Privileged Access) requiring step-up identity assurance
- Regulated industries (Financial Services, Healthcare, Critical Infrastructure) with IDV compliance requirements

**Key Users**

- **Okta IAM Admin / IT Security Lead (Primary):** Owns authentication policy configuration in the Okta Admin Console. Accountable for adding IDV to an existing workflow without a custom engineering project. Controls adoption — if configuration is complex or requires PS, the product will not be enabled.

  *User Story: As an Okta IAM admin, I want to add Entrust as an IDV vendor in the Okta Admin Console so that I can require ID verification in our onboarding and account recovery policies without writing custom code or engaging a PS team.*

- **HR / IT Ops Lead (Secondary):** Owns the new hire onboarding process. Experiences the pain of manual identity checks. Does not configure the integration but is the internal sponsor requesting it. Approves vendor selection.

  *User Story: As an HR or IT ops lead, I want a verified, automated identity check embedded in our Okta onboarding flow so that we can eliminate manual ID review and meet compliance requirements without increasing cycle time.*

- **Entrust AE / SE (Tertiary):** Needs to demo the Okta + Entrust integration in under 30 minutes without engineering on the call. Adoption of the Studio prebuilt template is the primary dependency for this persona.

  *User Story: As an Entrust AE, I want a prebuilt Okta demo environment I can spin up in under 30 minutes so that I can run a credible discovery call without a 3-day SE setup.*

---

## 3. Success Measures & Key Performance Indicators

> *Describe what success looks like. Ideally measure customer outcomes numerically. How will we judge the performance of the product? This will be the bar against which we will measure performance of the product going forward. This can evolve as we move through the development phases.*

| Metric | Target | Counter-metric |
|--------|--------|----------------|
| KYE pipeline deals closed citing Okta integration | 3 within 6 months of GA | Without increasing avg time-to-close |
| SE demo setup time | Under 30 minutes from scratch | Without requiring SE to modify customer Okta config |
| OIN marketplace listing published | Within 90 days of GA | Okta certification requirements met, not bypassed |
| Active KYE pipeline unblocked | 50%+ of active KYE deals no longer cite Okta as a gap | — |
| Channel pipeline sourced via Okta Elevate / resellers | TBD with John Parish | Within 6 months of GA |
| Okta Elevate partner tier recovered | Restored within 60 days of OIN listing | — |

---

## 4. Solution

### 4.1 Solution Overview

The solution is a native Okta IDV integration that embeds Entrust IDV as a configurable authentication policy step in the Okta Admin Console. An Okta IAM admin selects Entrust from Okta's IDV vendor framework, configures it with standard fields (API key, region, flow settings), and enables it on target policies — without writing custom code, hosting custom endpoints, or engaging Entrust PS.

At the point an Okta policy triggers IDV, the user is redirected to the Entrust IDV ceremony (document scan + biometric), completes verification, and is returned to Okta with a signed identity token. Okta's policy engine evaluates the token and grants or denies access. The full audit record stays within Entrust's system; Okta receives only the policy-relevant outcome.

The integration covers the two highest-value KYE moments at launch:

- **New Hire Onboarding:** IDV as a gate on Okta account provisioning
- **Account Recovery / MFA Reset:** IDV as a step-up requirement before MFA credentials are reset

A Studio prebuilt template accompanies the integration, enabling AEs and SEs to run a complete, credible demo without per-deal engineering setup.

**Competitive differentiation in the Account Recovery use case:** Account recovery and MFA reset are the highest-risk identity moments in an enterprise Okta deployment — the primary vector for account takeover. Entrust's core advantage is fraud detection accuracy: ML-based document and biometric verification combined with external threat intelligence and a dedicated fraud lab, with lower false rejection rates than competitors (fewer legitimate users blocked). For security-focused buyers evaluating IDV vendors on the Account Recovery use case, Entrust's fraud detection depth is the lead differentiator — not just the ability to verify an ID.

---

### 4.2 Customer Workflow

> *What does the target customer environment look like? Key operating systems, applications, size of data? Business requirements that enable adoption of technology?*

**Administrator Workflow (Setup and Enablement)**

1. Admin navigates to Okta Admin Console > Security > Identity Verification.
2. Admin selects Entrust from the IDV vendor list (or adds via OIN marketplace).
3. Admin enters Entrust API credentials and selects supported document types and regions.
4. Admin runs a test verification to validate connectivity and flow.
5. Admin enables Entrust IDV on target authentication policies (e.g., new user enrollment, password reset, account unlock).

Outcome: IDV is active and enforced by Okta policy. No custom code, no external integration work, no PS engagement required.

**End-User Workflow — New Hire Onboarding**

1. New employee triggers Okta onboarding flow.
2. Okta policy determines IDV is required and redirects the user to the Entrust hosted IDV experience.
3. User completes document scan and biometric (liveness) check on mobile or desktop.
4. Entrust evaluates the verification and redirects to Okta's callback URI with a signed authorization code.
5. Okta exchanges the code for Entrust's signed ID token containing `assurance_level: VERIFIED` or `FAILED`.
6. Okta grants access (provisioning proceeds) or denies it (onboarding blocked pending remediation).

**End-User Workflow — Account Recovery / MFA Reset**

1. Employee initiates MFA reset or account recovery from the Okta sign-in experience.
2. Okta determines IDV is required and redirects the user to Entrust.
3. User completes ID capture and selfie/liveness check.
4. Entrust returns result to Okta.
5. If VERIFIED: Okta grants a Temporary Access Pass or allows MFA re-enrollment.
6. If FAILED: Recovery is denied or routed to IT helpdesk.

---

### 4.3 Deployment Model

The integration follows Okta's native IDV vendor architecture using OIDC Authorization Code flow with Pushed Authorization Requests (PAR).

**Why OIDC, not webhooks:** IDV is a user-facing flow. A webhook can notify a backend — it cannot redirect a browser, run a verification ceremony, or return control to Okta. OIDC's authorization code flow handles all three. The signed JWT result is cryptographically verifiable by Okta with a standardized claims structure. PAR adds enterprise hardening: authorization parameters travel server-to-server before the user is redirected; the browser only carries a short-lived `request_uri` reference. Okta's policy engine then treats Entrust like any other authenticator.

**Entrust-hosted components:**

- IDV web application (user-facing verification flow)
- IDV backend APIs (document verification, biometrics, fraud checks)
- Four required endpoints: `POST /oauth2/par`, `GET /oauth2/authorize`, `POST /oauth2/token`, JWKS public key endpoint

**Okta-hosted components:**

- Okta Admin Console (policy configuration)
- Okta authentication and enrollment policy engine
- Fixed callback URI: `https://{yourOktaDomain}/idp/identity-verification/callback`

**Token contract:** Entrust returns a signed JWT containing `verified_claims[].verification.trust_framework: "IDV-DELEGATED"` and `verified_claims[].verification.assurance_level: "VERIFIED" | "FAILED"`. Okta's policy engine resolves on `assurance_level` only. Intermediate states or confidence scores are not sufficient.

**Technical & Security Requirements**

- PKCE (S256) required on the authorization code exchange
- Mutual TLS or OAuth 2.0 token-based auth on inline hook requests (P1)
- `nonce` in the ID token must match the PAR request to prevent replay attacks
- `given_name` and `family_name` are required claims in Okta's PAR request by default — if a user's Okta profile is missing these, the PAR request fails before the ceremony starts; Entrust must handle this gracefully

---

### 4.4 Uncertainty & Risks

#### Assumptions

> *Avoid assumptions if possible, otherwise surface them here. Assumptions are hypotheses you accept as being true and won't test for explicitly.*

- Active pipeline accounts (Optum/UHG, Dell, PwC, Comcast) are confirmed Okta shops. **Not yet validated.** Requires AE/Salesforce pull before committing to scope.
- The MGM prototype built by Jeff Hickman in 2023/2024 is recoverable or reconstructible and would materially reduce build scope. **Unconfirmed.** Docs lost in OneDrive migration.
- Nimble's claimed Okta integration does not meet P0 requirements. **Unvalidated.** Gnan recommends caution; evaluation needed before ruling out.

#### Hypothesis

> *Define hypotheses that will be tested via experiments. Prioritize experiments to test the riskier hypotheses.*
>
> - Value risk: whether customers will buy it or users will choose to use it
> - Usability risk: whether users can figure out how to use it
> - Feasibility risk: whether we can build what we need with the time, skills, and technology we have
> - Business viability risk: whether this solution also works for the various aspects of our business
> - Regulatory and legal constraints/challenges

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Value Risk:** Active pipeline accounts are Okta shops but do not actually require a native IDV vendor integration — Studio task workaround is acceptable to buyers | Medium | High | Validate with AEs and pull Salesforce notes before kickoff; confirm whether "Okta integration" means OIN listing or any working flow |
| **Value Risk:** OIN marketplace listing does not materially accelerate inbound pipeline or Okta Elevate recovery | Medium | Medium | Treat OIN listing as Phase 2; do not gate the core OIDC integration on OIN certification timeline |
| **Feasibility Risk:** OIN certification takes 6+ months, extending the timeline beyond FY27 relevance | Medium | High | Decouple OIN listing from core OIDC integration; ship working IDV integration first, pursue OIN listing as Phase 2 packaging |
| **Feasibility Risk:** Engineering has no committed roadmap capacity for Okta work | High | High | Gnan confirmation required before any external commitments. Block all downstream planning until resolved |
| **Feasibility Risk:** Fail-open vs. fail-closed behavior undefined | Medium | High | Define SLO commitments, latency budgets, and failure behavior before GA. Entrust becomes a synchronous, blocking dependency in the Okta auth path |
| **Business Viability Risk:** Nimble or partner-built integration is available but does not meet P0 requirements | Medium | Medium | Evaluate Nimble build against P0 checklist before scoping internal build |

#### Privacy & Regulatory Screening

> *Early review with the Privacy team to identify the high-level data, regulatory and privacy considerations.*
>
> - Privacy: are there privacy concerns with the solution?
> - Data usage: what type of data will be used with this solution?
> - Regulatory compliance: does this product need to comply with any regulations?

| Privacy consideration | Risk status | Mitigation |
|-----------------------|-------------|------------|
| Use of government-issued ID documents and biometric data | High | Biometric processing and document data remain within Entrust-hosted IDV systems. Okta receives only derived signals (assurance level, trust framework). No raw biometric or document data transits to Okta. |
| Personally Identifiable Information in Okta PAR request | Medium | PAR request contains `login_hint` and mapped user profile claims. Entrust must not log or retain Okta-sourced PII beyond the verification session. Retention policy to be defined with Privacy team. |
| Data residency for enterprise customers | Medium | Entrust must document which regions IDV data is processed in and provide per-region deployment options for regulated customers (Healthcare, Financial Services, Government). |
| Regulatory compliance (GDPR, CCPA, HIPAA) | Medium | Assess applicable frameworks based on target customer verticals. Define DPA requirements before GA. |

#### Accessibility Screening

> *Early identification of high-level digital accessibility considerations. If your proposed solution impacts end-user experience, please ensure you design and build with accessibility in mind.*
>
> - How are you planning to ensure your proposal is designed and built with accessibility requirements in mind?
> - Does this solution comply with WCAG 2.1 AA?
> - What elements could impact accessibility?

| Accessibility consideration | Risk status | Mitigation |
|-----------------------------|-------------|------------|
| | | |
| | | |
| | | |

---

## 5. Technical Feasibility

> *T-shirt sizing to be worked on with Engineering. Can the product be built with our current technology, skills, and resources? What challenges might arise during development, and how can they be overcome?*

TBD — pending Engineering scoping session with Gnan and Andrew MacCuaig.

Key feasibility questions to resolve:

- Does Entrust's existing OIDC infrastructure support PAR (`POST /oauth2/par`) natively, or does this require a new service?
- What is the build estimate for the four required endpoints?
- Is the MGM prototype (Jeff Hickman, 2023/2024) recoverable? If yes, how much does it reduce scope?
- Does Nimble's existing build meet P0 requirements? Evaluate before committing to a full internal build.
- What does the Studio prebuilt template require beyond the core OIDC integration?

---

## 6. Dependencies

> *Highlight any risks for delivery and internal or external dependencies.*

### 6.A External Dependencies & Risks

**1. Okta IDV vendor certification**

- **Risk:** Becoming a registered Okta IDV vendor requires passing Okta's certification process. Timeline is unknown — may be 2 weeks or 6 months.
- **Impact:** OIN marketplace listing and formal IDV vendor status are blocked until certification is complete.
- **Mitigation:** Separate the OIDC integration build (which is the prerequisite) from the OIN listing/certification process. Ship the working integration first. Pursue OIN as Phase 2. Get timeline clarity from Nicole Lam (Okta Partnership Program) as early as possible.

**2. Okta Elevate partner tier recovery**

- **Risk:** Recovery of Okta Elevate standing depends on Okta's evaluation of the integration, not just delivery. Timeline and criteria are externally controlled.
- **Impact:** Channel pipeline from Okta-aligned resellers (Optive, WWT, Guidepoint) remains limited until tier is recovered.
- **Mitigation:** Mark Lewin to manage Okta relationship. Warm intro to Nicole Lam pending engineering resource confirmation from Gnan.

**3. Customer security and procurement review timelines**

- **Risk:** Enterprise prospects (Financial Services, Healthcare) have lengthy third-party risk review cycles, particularly for solutions embedded in authentication flows.
- **Impact:** Even with a working integration, time-to-production at target accounts may be 3-6 months post-GA.
- **Mitigation:** Prioritize documentation: security architecture overview, data flow diagrams, privacy policy, and compliance certifications (SOC 2, ISO 27001) before GA.

### 6.B Internal Dependencies & Risks

**4. Engineering roadmap capacity (Gnan)**

- **Status update (2026-04-09):** Gnan confirmed Okta is on the FY27 integration roadmap, alongside Microsoft, WorkDay, and ServiceNow. The previous blocker (no committed roadmap capacity) has been resolved in principle. Formal resource confirmation and staffing still required before external commitments.
- **Risk:** Roadmap intent confirmed but staffing and timeline not yet locked. Competing integration priorities (Microsoft, WorkDay, ServiceNow) could shift capacity.
- **Impact:** External commitments and partner outreach can now be initiated cautiously, but scope and timeline should not be communicated to prospects until resource allocation is confirmed.
- **Mitigation:** Get explicit staffing confirmation and build estimate from Gnan before engaging Nicole Lam (Okta) or making pipeline commitments.

**5. MGM prototype recovery (Andrew MacCuaig)**

- **Risk:** Jeff Hickman built an Okta integration for MGM in 2023/2024. Documentation was lost in a OneDrive migration. If unrecoverable, build scope increases.
- **Impact:** Build timeline and engineering estimate depend on whether this work is recoverable.
- **Mitigation:** Andrew to investigate before Engineering scoping. Recovery could meaningfully reduce build scope.

**6. Studio prebuilt template (Andrew MacCuaig / Summer Gaasedelen)**

- **Risk:** The Studio template is a dependency for the AE/SE demo motion. If it lags the core OIDC integration, the sales enablement goal is not met at GA.
- **Impact:** AEs cannot demo without engineering on the call until the template is available.
- **Mitigation:** Scope and staff the Studio template in parallel with the core integration, not as a follow-on phase. Summer to provide requirements input before Andrew begins.

**7. Cross-functional alignment (Product, Sales, PS, Support)**

- **Risk:** Misalignment on what "Okta integration" means across teams could lead to inconsistent messaging — particularly the distinction between the native IDV vendor path and the Studio task workaround.
- **Impact:** AEs may promise OIN listing or admin-configurable setup before the integration reaches that state.
- **Mitigation:** Define and communicate the phased delivery model internally before any external commitments. P0 is the working OIDC integration; OIN listing is Phase 2.

### 6.C Delivery & Technical Risks

**8. Fail-open vs. fail-closed behavior**

- **Risk:** Once Entrust is in the Okta auth path as an IDV vendor, it becomes a synchronous, blocking dependency. If Entrust is slow or unavailable, Okta waits.
- **Impact:** Undefined behavior affects SLO commitments, latency budgets, and customer trust in production.
- **Mitigation:** Engineering must define fail behavior before GA. Fail-closed (verification fails on timeout) is the safer default for regulated use cases. Document clearly in GA scope.

**9. Okta profile completeness requirement**

- **Risk:** Okta's PAR request includes `given_name` and `family_name` as required claims by default. Users with incomplete Okta profiles will cause PAR requests to fail before the IDV ceremony starts.
- **Impact:** Edge case that could block legitimate users silently.
- **Mitigation:** Handle gracefully in Entrust's PAR validation. Document the profile completeness requirement in admin setup guide.

---

## 7. GA Scope

> *What functionality is required to go GA — key features, supported devices (mobile/web/both), product lines, geo coverage, regulatory compliance, product performance targets, product integrations. Agreeing scope should be a decision made with product, PMM, SE, and CSM.*

General Availability for this integration means the solution is:

- Functional as a native Okta IDV vendor (configurable in Okta Admin Console)
- Production-ready for Fortune 500 Okta tenants
- Operationally supportable at scale with defined SLOs
- Accompanied by a Studio prebuilt template enabling AE/SE demo without engineering on the call

**P0 — Does not ship without:**

| Area | GA Requirement |
|------|----------------|
| IDV vendor integration | Entrust is selectable as an IDV vendor in the Okta Admin Console via Okta's native IDV vendor framework — no custom code, no PS engagement required for admin configuration |
| OIDC endpoint implementation | Four required endpoints operational: `POST /oauth2/par`, `GET /oauth2/authorize`, `POST /oauth2/token`, JWKS |
| ID token contract | Signed JWT returned with `verified_claims` containing `trust_framework: "IDV-DELEGATED"` and `assurance_level: "VERIFIED" \| "FAILED"` |
| KYE use case coverage | New Hire Onboarding and Account Recovery / MFA Reset |
| Mobile support | End-user IDV flow completable on iOS and Android |
| Studio prebuilt template | Okta onboarding flow template enabling demo in under 30 minutes without per-deal engineering |

**P1 — Ships without, but materially degrades the KYE story:**

| Area | Requirement |
|------|-------------|
| OIN marketplace listing | Entrust listed in Okta Integration Network for inbound customer discovery. *Assessment: likely Phase 2 — core OIDC integration is a prerequisite regardless; OIN is the packaging step on top of a working integration* |
| Privileged Access support | Integration supports Okta Privileged Access (OPA) trigger for PIM role elevation — required for Gov Cloud IAL-2 use case |
| Inline hook OAuth auth | Entrust's inline hook endpoint authenticates incoming Okta calls via OAuth 2.0 access tokens per Okta's published security guidance |

**P2 — Nice to haves:**

- Okta-consistent UI styling for the IDV experience
- Webhook-based real-time verification status back to Okta
- Support for Okta Verify (passkey) as a downstream step post-IDV

### 7.1 Out of Scope

- **CIAM / customer-facing Okta use cases** — different buyer, different motion; this PRD covers KYE/workforce only
- **Custom per-customer Okta workflow engineering** — eliminating this pattern is the point
- **Inline hooks / token enrichment model** — Entrust acting as a risk/enrichment signal injected into Okta token claims via inline hook. Different positioning (decision provider vs. step provider), different buyer motion. Deferred.
- **SSF (Shared Signals Framework)** — asynchronous, background risk signal ingestion. Separate integration model from the IDV vendor path. Worth flagging to Mark Lewin as potential Phase 2 partnership angle. Not in scope for this cycle.
- **Okta + Cisco Duo integration** — relevant competitive context but out of scope for this initiative.

### 7.2 Scalability & Maintenance

> *Consider what the product will require and how it may develop post GA launch.*
>
> - **Scale:** Can it handle a significant increase in users? Can more features or improvements be added over time?
> - **Maintenance:** How will the product be updated over time? What will user support look like?
> - **Sustainability:** Can the product continue in the long term? Consider potential costs and revenue streams.

**Scalability**

- Standard Entrust IDV scalability applies. Target: support concurrent verification load from multiple enterprise tenants without latency degradation.
- The integration must not introduce synchronous bottlenecks in Okta authentication flows. Latency SLO to be defined by Engineering before GA.

**Security**

- End-to-end encryption: TLS 1.2+ in transit
- Signed JWT tokens with JWKS-based verification
- PKCE (S256) on authorization code exchange
- Nonce validation to prevent replay attacks

**Compliance**

- SOC 2 Type II and ISO 27001 coverage for Entrust-hosted IDV services
- Data residency documentation required before GA for regulated customer verticals

**Availability**

- Target 99.9%+ uptime for Entrust IDV APIs
- Fail-open vs. fail-closed behavior defined and documented before GA

---

## 8. Build / Buy / Partner

> *If Buy (or partner): selection process is complete. If Build: acceptance criteria are defined. Risks are reviewed.*

**Buy:** Not applicable. No off-the-shelf product provides a pre-certified Okta IDV integration on Entrust's IDV platform.

**Build (Selected with conditions):** The core OIDC/PAR integration and Studio template will be built internally. Build scope is contingent on:

1. Engineering resource confirmation from Gnan
2. MGM prototype recovery evaluation (Andrew MacCuaig)
3. Nimble integration evaluation against P0 requirements

**Partner (Potential):** Nimble claims to have already built an Okta integration. Evaluate before committing to full internal build. If Nimble's build meets P0 requirements, a partner or licensed model may reduce internal scope.

---

## 9. Rollout Plan

> *How will this product be rolled out? By quarter, by version, etc.*

**Phase 0 — Pre-Launch (Internal Readiness)**

- Engineering resource confirmed (Gnan)
- MGM prototype recovery evaluated (Andrew)
- Nimble integration evaluated against P0
- OIN certification timeline confirmed (Nicole Lam via Mark Lewin)
- AE pipeline validation complete — confirm which accounts specifically require Okta integration
- Studio template scoped alongside core integration
- Internal enablement: AE/SE, PS, Support

**Phase 1 — Pilot / Limited GA**

- Core OIDC/PAR integration functional
- Studio prebuilt template available
- 2-3 design-partner customers live (from active KYE pipeline)
- Focus: New Hire Onboarding use case first, Account Recovery second
- Capture: demo conversion rate, SE setup time, customer IT approval timelines

**Phase 2 — General Availability**

- OIN marketplace listing live (pending Okta certification)
- Okta Elevate partner tier recovered
- Open to all eligible Okta tenants
- AE/SE enablement complete: battlecards, demo environment, objection handling guide

**Phase 3 — Scale**

- Okta co-sell motion activated
- Channel partners (Optive, WWT, Guidepoint) enabled
- Case studies published from Phase 1 design partners
- Privileged Access (P1.2) scope evaluated for Phase 3 inclusion

---

## 10. Go-To-Market Plan

> *How will this product be introduced into the market. Consider the Business Model and Pricing.*

**GTM Objective**

Successfully introduce Entrust as a native Okta IDV vendor for Fortune 500 KYE buyers, recover Okta Elevate partner standing, and close 3+ pipeline deals citing Okta integration within 6 months of GA — without requiring custom integration work per customer.

**Target Market**

- Fortune 500 enterprises running Okta as primary IAM platform
- Regulated industries: Financial Services, Healthcare, Critical Infrastructure, Government
- Organizations with active new hire onboarding, account recovery, or privileged access programs

**Co-Sell and Commercial Requirements**

Pursue Okta Integration Network (OIN) listing to enable customer discovery within Okta's marketplace. Provide Okta-recommended enablement assets including:

- Reference architecture diagram: "Okta Auth Flow + Entrust IDV" showing the IDV policy step
- Joint solution brief positioning Entrust IDV as the verification layer within Okta workflows
- AE/SE battlecard: Entrust vs. Persona, CLEAR Verified, Incode — specific to Okta IDV use cases

**Commercial Structure and Packaging**

TBD — pricing model for Okta-gated IDV checks to be aligned with existing Entrust transaction-based models. Determine whether Okta Marketplace billing applies and whether it affects existing commercial terms.

**Sales and Distribution Motion**

- **Primary:** Direct AE motion into active KYE pipeline where Okta is a stated requirement (Optum/UHG, Dell, PwC, Comcast — confirm with AEs)
- **Secondary:** Okta-sourced inbound via OIN marketplace and Okta Elevate co-sell
- **Tertiary:** Channel partners (Optive, WWT, Guidepoint) activated post-Okta Elevate tier recovery (John Parish)

**Marketing and Enablement**

- AE/SE demo guide and prebuilt Studio template
- Okta-specific landing page or solution brief
- Competitive positioning (Persona, CLEAR Verified, Incode) for Okta IDV use cases
- Customer-facing admin setup guide

---

## 11. FAQ's

| Question | Answer |
|----------|--------|
| What is Okta's IDV vendor framework and why does it matter? | Okta supports a native IDV vendor category that makes identity verification a configurable policy step in the Okta Admin Console — not a webhook or custom integration. Being listed as an IDV vendor means an Okta admin can add Entrust without writing code or engaging PS. Note: the exact vendor type identifier used in Okta's API is TBD — to be confirmed with Nicole Lam during partner onboarding. |
| Can we use the Studio task as an interim Okta integration? | Yes, as an interim unblocking measure for specific deals. However, a Studio task does not achieve OIN listing, does not qualify for Okta's IDV vendor framework, and is not configurable by an Okta admin. It is not a substitute for the native OIDC integration. |
| What happens if Entrust is slow or unavailable during an Okta auth flow? | TBD — fail-open vs. fail-closed behavior must be defined before GA. Entrust becomes a synchronous, blocking dependency in the Okta authentication path. This is a P0 decision for Engineering. |
| | |

---

## 12. Relevant Links or Additional Information

> *Any other relevant information or links to consider? E.g. Design, Decision Logs, RFCs, etc.*

- [Okta IDV Integration Guide](https://developer.okta.com/docs/guides/idv-integration/main/)
- [Technical Reference: Endpoints, JWT Claims, Flow Steps](references/okta-integration-spec.md)
- Okta Elevate partner portal: TBD (Mark Lewin)
- MGM prototype docs: lost in OneDrive migration — recovery pending (Andrew MacCuaig)

**Stakeholders**

| Name | Role | Involvement |
|------|------|-------------|
| Gnan Gowda | Jeff's manager | Engineering resource confirmation; roadmap authority — **gates all downstream planning** |
| Summer Gaasedelen | Customer Onboarding / PS | Requirements input before Andrew engagement |
| Andrew MacCuaig | Engineering Manager, Studio | Build scoping — only after Summer's input; MGM prototype recovery |
| Mark Lewin | BizDev and Partnerships | Okta partner relationship; warm intro to Nicole Lam |
| John Parish | Alliances | Reseller channel activation post-GA |
| Nicole Lam | Okta Partnership Program | External partner contact; intro pending engineering resource confirmation |
| Yelena Tarbuck | AE, New Customers | Pipeline validation; customer demand examples |
| Reed Schroeder | AE | State Farm deal; Okta customer discovery |
