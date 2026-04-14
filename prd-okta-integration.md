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

- [The Stakes: Identity Is the New Perimeter](#the-stakes-identity-is-the-new-perimeter)
- [1. Problem to be solved](#1-problem-to-be-solved)
- [2. Target Audience and Users](#2-target-audience-and-users)
- [3. Success Measures & Key Performance Indicators](#3-success-measures--key-performance-indicators)
- [4. Solution](#4-solution)
- [5. Technical Feasibility](#5-technical-feasibility)
- [6. Dependencies](#6-dependencies)
- [7. GA Scope](#7-ga-scope)
- [8. Build / Buy / Partner](#8-build--buy--partner)
- [9. Rollout Plan](#9-rollout-plan)
- [10. Go-To-Market Plan](#10-go-to-market-plan)
- [11. FAQ's](#11-faqs)
- [12. Relevant Links or Additional Information](#12-relevant-links-or-additional-information)
- [Open Questions](#open-questions)
- [Notable Not Doing](#notable-not-doing)
- [Appendix](#appendix)

---

## The Stakes: Identity Is the New Perimeter

For a decade, security teams protected a network boundary. That perimeter dissolved with cloud adoption and remote work. The new perimeter is identity — and AI is making it leakier.

Two dynamics are converging.

**AI lowers the cost of identity attacks.** The service desk impersonation and fake hire attacks described in this PRD are not new threat models. What AI changes is scale and quality: deepfakes defeat visual verification, voice cloning defeats phone-based identity checks, and AI-generated profiles pass resume and interview screens at volume. Scattered Spider, ShinyHunters, and LAPSUS$ breached MGM, Harrods, and Marks & Spencer using social engineering at the IT service desk — a human-layer attack. The North Korea fake hire operations, flagged by the FBI and Gartner, run the same playbook at the hiring stage. Both are identity attacks. Both are getting easier to execute.

**Agents multiply the identity surface.** Enterprises running Okta are no longer provisioning only human users. AI agents, RPA bots, service accounts, and automated workflows are being added to IAM tenants as first-class principals. Each represents an identity that can be impersonated, hijacked, or fabricated. The question of "who are you" now applies to software as much as to people — and most enterprises have no answer for it.

IDV embedded at the Okta policy layer is the logical response: verify identity at the moment of provisioning and recovery, before trust is granted, before the account is live. The integration this PRD describes is not a compliance checkbox. It is the control mechanism for the perimeter that actually exists.

---

## 1. Problem to be solved

### 1.1 What problem are we trying to solve and why?

Okta is the dominant IAM platform in the Fortune 500 — the exact segment KYE targets. Of the four key KYE moments — Hiring, Onboarding, Privileged Access, and Account Recovery — three require Okta to trigger or complete the workflow:

- **Onboarding:** Okta account provisioning is gated on ID verification
- **Account Recovery:** Okta is the MFA reset surface
- **Privileged Access:** Okta Privileged Access (OPA) is the PIM layer at most large enterprises

Without a native Okta integration, every KYE deal requires custom engineering work, which extends sales cycles and creates dependencies on SE engineers. KYE is the FY27 bridging strategy for $1.25M in NA bookings, and the absence of an Okta integration blocks that path.

The problem runs deeper than a missing API connection. Okta supports a first-class IDV vendor category — a native policy step configurable in the Okta Admin Console, not a webhook or custom integration. Competitors (Persona, CLEAR Verified, Incode) have achieved this status. Entrust has not. The gap is not just "no Okta integration" — it is "not in the vendor framework that makes IDV deployable by an Okta admin without engineering."

The partnership cost has been concrete: Entrust was downgraded in Okta's "Okta Elevate" partner program due to lack of integrations. This limits Okta-sourced pipeline and reduces Entrust's visibility to Okta field sellers.

**The threat context driving urgency is real and named.** Two attack patterns have made workforce IDV a board-level security issue:

- **Service desk impersonation:** Criminal groups including Scattered Spider, ShinyHunters, and LAPSUS$ breached MGM Resorts, Harrods, and Marks & Spencer by impersonating employees when contacting IT service desks to trigger account recovery. The attack vector was social engineering, not technical exploitation. IDV at the account recovery step closes this vector.

- **Fake hire infiltration:** Multiple organizations including KnowBe4 and companies flagged by the FBI and Amazon inadvertently hired bad actors from OFAC-sanctioned countries including North Korea. The attack vector was stolen or counterfeit identity data combined with deepfakes during remote video interviews. IDV at the hiring and onboarding step closes this vector. (Source: Gartner G00844298, February 2026)

**Integration mechanism context:** Okta uses OIDC as the transport and trust mechanism for IDV vendor integrations. Okta invokes the IDV vendor using OIDC Authorization Code Flow with PAR; the user completes document scan and biometric checks; the vendor returns a signed JWT containing a VERIFIED or FAILED outcome. Okta's policy engine continues or blocks accordingly. This is a protocol-level integration — not a webhook, not a redirect shim. Persona, CLEAR Verified, and Incode have built to this spec. Entrust has not.

**Customer validation (named):**

- DOS Systems (Dec 2024): prospect surfaced via Okta outreach to sales team. Okta integration was a stated requirement.
- Guardian Live (Nov 2024): existing Okta customer. Integration requested directly.

These are the only two documented instances. Further validation needed: SE outreach via Team Solutions Slack and ProductBoard review of historical requests.

**Competitive evidence:**

- State Farm: deal loss to Veriff in progress
- Active pipeline — Optum/UHG, Dell, PwC, Comcast — all likely Okta shops (confirm with AEs before kickoff)
- Incode secured a formal partnership with Experian (2025), gaining distribution to 1,800 enterprise customers via Experian Ascend and CrossCare

**Competitive landscape — KYE / Workforce IDV:**

The gap no current vendor owns: self-serve enterprise identity lifecycle — IDV + fraud + auth, no PS, works inside Entra/Okta/Workday. Persona cannot out-comply us. Jumio cannot out-deploy us. The category is available.

| Competitor | Type | Okta / Workforce Stack Integration | Where Overserving | Where Underserving | Switch Trigger |
|---|---|---|---|---|---|
| **Persona** | Direct | OIN-listed. HRIS triggers (Workday, BambooHR) on New Hire events; ITSM (ServiceNow) IDV links in onboarding tickets; no-code VC portal for Okta/Entra ID day-one access | Deep compliance / audit depth | Platform completeness, enterprise SSO | Compliance audit requires more than IDV alone |
| **Incode** | Direct | OIN-listed. Okta/Ping step-up authenticator for high-risk admin actions; Experian Ascend/CrossCare distribution (1,800 customers) | Biometric depth | Non-biometric risk flows, enterprise integrations | Customer needs doc verification + auth in one contract |
| **Jumio** | Direct | Enterprise IDV; compliance-heavy; PS-dependent; no native OIN listing | Compliance theater, complex contracts | Self-serve, modern integrations, speed | IT team can't deploy without 3-month PS engagement |
| **Veriff** | Direct | European heritage; limited NA enterprise reach; State Farm deal loss in progress | EU compliance workflows | NA risk-based flows, self-serve | Expanding to NA where compliance mandate doesn't exist |
| **Entra alone** | Indirect | Handles auth but not IDV; already deployed in most Fortune 500 environments | Auth coverage | Identity verification, new hire IDV | ATO incident or compliance audit surfaces the gap |
| **Manual IT onboarding** | Non-consumption | Tickets, spreadsheets, back-and-forth; current default for most enterprises | None | All KYE moments | Single breach or audit finding |
| **Workday native** | Indirect | Covers HR workflow and new hire record creation; does not perform identity verification | HR workflow | Identity verification | Integration required for IDV at hire moment |

#### Why This Problem Matters Now

KYE is the FY27 NA growth vehicle. The $1.25M bookings target is predicated on closing accounts that already run Okta. Competitors are entrenched. Every month without a native IDV integration is a month Entrust cannot win on deal criteria that are already in market.

#### Why We Are Solving It

By building a native Okta IDV integration, Entrust becomes selectable by an Okta IAM admin without a custom engineering project, recovers its Okta Elevate partner standing, and removes the single most-cited technical objection in the active KYE pipeline.

---

### 1.2 Product Objectives

1. **Remove the integration blocker from the active KYE pipeline** by delivering a native Okta IDV integration that an IAM admin can configure in the Okta Admin Console without custom code or PS engagement.

2. **Recover Okta Elevate partner standing** and reactivate the Okta-sourced channel, enabling alliances partners (Optive, WWT, Guidepoint) to distribute Entrust KYE through Okta ecosystem motions.

3. **Eliminate per-deal SE setup overhead** by providing a Studio prebuilt template for the Okta onboarding flow, reducing demo setup to under 30 minutes without engineering on the call.

4. **Establish inbound discovery** via the Okta Integration Network (OIN) marketplace listing, enabling customer self-serve discovery of Entrust IDV within Okta's ecosystem.

---

### 1.3 Product Impact

**Business & Revenue**

- Directly accelerates the FY27 KYE $1.25M NA bookings target by converting active pipeline deals (Optum/UHG, Dell, PwC, Comcast) that currently cannot close without an Okta integration.
- Moves Entrust from "not selectable" to peer-of-Persona/CLEAR/Incode in Okta's IDV vendor framework, changing the competitive baseline in Fortune 500 deals.
- Reactivates the Okta-sourced channel as a pipeline source, unlocking co-sell motions and reseller distribution that are currently unavailable due to partner tier downgrade.

**Customer & Operational**

- Fortune 500 IAM admins can adopt Entrust IDV within existing Okta policies without a custom engineering project, removing the single most-cited technical objection in KYE deals.
- Reduces Entrust's per-deal delivery risk: no custom SE build, no PS dependency, no timeline extension for engineering setup.

---

## 2. Target Audience and Users

**Target Institutions**

Fortune 500 enterprises running Okta as their primary IAM platform, specifically organizations experiencing one or more of the following:

- Active new hire onboarding programs where identity verification is a compliance requirement
- MFA reset and account recovery flows exposed to social engineering or account takeover risk
- Privileged access or PIM programs (Okta Privileged Access) requiring step-up identity assurance
- Regulated industries (Financial Services, Healthcare, Critical Infrastructure) with IDV compliance requirements

**Key Users**

- **Okta IAM Admin / IT Security Lead (Primary):** Owns authentication policy configuration in the Okta Admin Console. Accountable for adding IDV to an existing workflow without a custom engineering project. Controls adoption — if configuration is complex or requires PS, the product will not be enabled.

  *User Story: As an Okta IAM admin, I want to add Entrust as an IDV vendor in the Okta Admin Console so that I can require ID verification in our onboarding and account recovery policies without writing custom code or engaging a PS team.*

- **HR / IT Ops Lead (Secondary):** Owns the new hire onboarding process. Experiences the pain of manual identity checks. Does not configure the integration but is the internal sponsor requesting it.

  *User Story: As an HR or IT ops lead, I want a verified, automated identity check embedded in our Okta onboarding flow so that we can eliminate manual ID review and meet compliance requirements without increasing cycle time.*

- **Entrust AE / SE (Tertiary):** Needs to demo the Okta + Entrust integration in under 30 minutes without engineering on the call.

  *User Story: As an Entrust AE, I want a prebuilt Okta demo environment I can spin up in under 30 minutes so that I can run a credible discovery call without a 3-day SE setup.*

---

## 3. Success Measures & Key Performance Indicators

| Metric | Baseline | Target | Counter-metric | Timeline |
|--------|----------|--------|----------------|----------|
| KYE pipeline deals closed citing Okta integration | 0 | 3+ | Without increasing avg time-to-close | 6 months of GA |
| SE demo setup time | Days (custom SE) | Under 30 minutes from scratch | Without requiring SE to modify customer Okta config | At GA |
| OIN marketplace listing published | Not listed | Listed | Okta certification requirements met, not bypassed | Within 90 days of GA |
| Active KYE pipeline unblocked | — | 50%+ of active KYE deals no longer cite Okta as a gap | — | At GA |
| Channel pipeline sourced via Okta Elevate / resellers | Downgraded | TBD with John Parish | — | Within 6 months of GA |
| Okta Elevate partner tier recovered | Downgraded | Restored | — | Within 60 days of OIN listing |

---

## 4. Solution

### Solution Overview

The solution is a native Okta IDV integration that embeds Entrust IDV as a configurable authentication policy step in the Okta Admin Console. An Okta IAM admin selects Entrust from Okta's IDV vendor framework, configures it with standard fields (API key, region, flow settings), and enables it on target policies — without writing custom code, hosting custom endpoints, or engaging Entrust PS.

At the point an Okta policy triggers IDV, the user is redirected to the Entrust IDV ceremony (document scan + biometric), completes verification, and is returned to Okta with a signed identity token. Okta's policy engine evaluates the token and grants or denies access. The full audit record stays within Entrust's system; Okta receives only the policy-relevant outcome.

The integration covers the two highest-value KYE moments at launch:

- **New Hire Onboarding:** IDV as a gate on Okta account provisioning
- **Account Recovery / MFA Reset:** IDV as a step-up requirement before MFA credentials are reset

A Studio prebuilt template accompanies the integration, enabling AEs and SEs to run a complete, credible demo without per-deal engineering setup.

**Competitive differentiation in the Account Recovery use case:** Account recovery and MFA reset are the highest-risk identity moments in an enterprise Okta deployment — the primary vector for account takeover (see Scattered Spider, ShinyHunters, LAPSUS$ above). Entrust's core advantage is fraud detection accuracy: ML-based document and biometric verification combined with external threat intelligence and a dedicated fraud lab, with lower false rejection rates than competitors. For security-focused buyers evaluating IDV vendors on the Account Recovery use case, Entrust's fraud detection depth is the lead differentiator — not just the ability to verify an ID.

---

### 4.1 Customer Workflow

**Administrator Workflow (Setup and Enablement)**

1. Admin navigates to Okta Admin Console > Security > Identity Verification.
2. Admin selects Entrust from the IDV vendor list (or adds via OIN marketplace).
3. Admin enters Entrust API credentials and selects supported document types and regions.
4. Admin runs a test verification to validate connectivity and flow.
5. Admin enables Entrust IDV on target authentication policies (new user enrollment, password reset, account unlock).

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

### 4.2 Deployment Model

The integration follows Okta's native IDV vendor architecture using OIDC Authorization Code Flow with Pushed Authorization Requests (PAR).

**Why OIDC, not webhooks:** IDV is a user-facing flow. A webhook can notify a backend — it cannot redirect a browser, run a verification ceremony, or return control to Okta. OIDC's authorization code flow handles all three. The signed JWT result is cryptographically verifiable by Okta with a standardized claims structure. PAR adds enterprise hardening: authorization parameters travel server-to-server before the user is redirected; the browser only carries a short-lived `request_uri` reference. Okta's policy engine then treats Entrust like any other authenticator.

**Entrust-hosted components:**

- IDV web application (user-facing verification flow)
- IDV backend APIs (document verification, biometrics, fraud checks)
- Four required endpoints: `POST /oauth2/par`, `GET /oauth2/authorize`, `POST /oauth2/token`, JWKS public key endpoint

**Okta-hosted components:**

- Okta Admin Console (policy configuration)
- Okta authentication and enrollment policy engine
- Fixed callback URI: `https://{yourOktaDomain}/idp/identity-verification/callback`

**Token contract:** Entrust returns a signed JWT containing `verified_claims[].verification.trust_framework: "IDV-DELEGATED"` and `verified_claims[].verification.assurance_level: "VERIFIED" | "FAILED"`. Okta's policy engine resolves on `assurance_level` only.

**Technical & Security Requirements**

- PKCE (S256) required on the authorization code exchange
- Mutual TLS or OAuth 2.0 token-based auth on inline hook requests (P1)
- `nonce` in the ID token must match the PAR request to prevent replay attacks
- `given_name` and `family_name` are required claims by default — PAR request fails if absent in Okta profile; Entrust must handle gracefully

**Studio Configuration Fields**

Required fields in the Entrust Studio connector configuration panel:

| Field | Notes |
|-------|-------|
| Okta Org Domain | `company.okta.com` — used to construct the allowlist callback URL |
| Entrust API Key | Production key from Entrust Dashboard. Staging keys rejected in IDV flow. |
| IDV Flow / Template ID | Identifies which Entrust verification flow to invoke |
| First Name mapping | Passed from Okta Universal Directory. Required. |
| Last Name mapping | Passed from Okta Universal Directory. Required. |
| Email mapping | Passed from Okta Universal Directory. Required per Persona integration docs. |

Optional fields: Verification Timeout, Fail Behavior toggle (fail-open vs. fail-closed), Callback URL Override.

Open question: does PAR endpoint handling require an Okta-specific field with no Entra equivalent? See Open Questions 12 and 13.

---

### 4.3 Uncertainty & Risks

#### Assumptions

- Active pipeline accounts (Optum/UHG, Dell, PwC, Comcast) are confirmed Okta shops. **Not yet validated.** Requires AE/Salesforce pull before committing to scope.
- The MGM prototype built by Jeff Hickman in 2023/2024 is recoverable and would materially reduce build scope. **Unconfirmed.** Docs lost in OneDrive migration.
- Nimble's claimed Okta integration does not meet P0 requirements. **Unvalidated.** Evaluation needed before ruling out.

#### Hypothesis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Value Risk:** Active pipeline accounts do not actually require native IDV vendor integration — Studio task workaround is acceptable to buyers | Medium | High | Validate with AEs and pull Salesforce notes before kickoff |
| **Value Risk:** OIN marketplace listing does not materially accelerate inbound pipeline or Okta Elevate recovery | Medium | Medium | Treat OIN listing as Phase 2; do not gate the core OIDC integration on OIN certification timeline |
| **Feasibility Risk:** OIN certification takes 6+ months, extending the timeline beyond FY27 relevance | Medium | High | Decouple OIN listing from core OIDC integration; ship working integration first |
| **Feasibility Risk:** Engineering has no committed roadmap capacity for Okta work | High | High | Gnan confirmation required before any external commitments |
| **Feasibility Risk:** Fail-open vs. fail-closed behavior undefined | Medium | High | Define SLO commitments and failure behavior before GA |
| **Business Viability Risk:** Nimble or partner-built integration available but does not meet P0 requirements | Medium | Medium | Evaluate Nimble build against P0 checklist before scoping internal build |

#### Privacy & Regulatory Screening

| Privacy consideration | Risk status | Mitigation |
|-----------------------|-------------|------------|
| Use of government-issued ID documents and biometric data | High | Biometric processing and document data remain within Entrust-hosted IDV systems. Okta receives only derived signals (assurance level, trust framework). No raw biometric or document data transits to Okta. |
| PII in Okta PAR request | Medium | PAR request contains `login_hint` and mapped user profile claims. Entrust must not log or retain Okta-sourced PII beyond the verification session. Retention policy to be defined with Privacy team. |
| Data residency for enterprise customers | Medium | Entrust must document which regions IDV data is processed in and provide per-region deployment options for regulated customers. |
| Regulatory compliance (GDPR, CCPA, HIPAA) | Medium | Assess applicable frameworks based on target customer verticals. Define DPA requirements before GA. |

#### Accessibility Screening

| Accessibility consideration | Risk status | Mitigation |
|-----------------------------|-------------|------------|
| | | |

---

## 5. Technical Feasibility

TBD — pending Engineering scoping session with Gnan and Andrew MacCuaig.

Key feasibility questions to resolve:

- Does Entrust's existing OIDC infrastructure support PAR (`POST /oauth2/par`) natively, or does this require a new service?
- What is the build estimate for the four required endpoints?
- Is the MGM prototype (Jeff Hickman, 2023/2024) recoverable? If yes, how much does it reduce scope?
- Does Nimble's existing build meet P0 requirements? Evaluate before committing to a full internal build.
- What does the Studio prebuilt template require beyond the core OIDC integration?
- Does Entrust's current IDV meet PAD (ISO 30107-3 Level 3) and IAD (CEN 18099) standards? (Gartner rates these as baseline buying criteria — see Appendix.)

---

## 6. Dependencies

### 6.A External Dependencies & Risks

**1. Okta IDV vendor certification**

- **Risk:** Becoming a registered Okta IDV vendor requires passing Okta's certification process. Timeline is unknown — may be 2 weeks or 6 months.
- **Impact:** OIN marketplace listing and formal IDV vendor status are blocked until certification is complete.
- **Mitigation:** Separate the OIDC integration build from the OIN listing/certification process. Ship the working integration first. Pursue OIN as Phase 2. Get timeline clarity from Nicole Lam (Okta Partnership Program) early.

**2. Okta Elevate partner tier recovery**

- **Risk:** Recovery depends on Okta's evaluation of the integration, not just delivery. Timeline and criteria are externally controlled.
- **Impact:** Channel pipeline from Okta-aligned resellers (Optive, WWT, Guidepoint) remains limited until tier is recovered.
- **Mitigation:** Mark Lewin to manage Okta relationship. Warm intro to Nicole Lam pending engineering resource confirmation from Gnan.

**3. Customer security and procurement review timelines**

- **Risk:** Enterprise prospects (Financial Services, Healthcare) have lengthy third-party risk review cycles, particularly for solutions embedded in authentication flows.
- **Impact:** Even with a working integration, time-to-production at target accounts may be 3-6 months post-GA.
- **Mitigation:** Prioritize documentation: security architecture overview, data flow diagrams, privacy policy, and compliance certifications (SOC 2, ISO 27001) before GA.

### 6.B Internal Dependencies & Risks

**4. Engineering roadmap capacity (Gnan)**

- **Status (2026-04-09):** Gnan confirmed Okta is on the FY27 integration roadmap alongside Microsoft, WorkDay, and ServiceNow. Formal resource confirmation and staffing still required before external commitments.
- **Risk:** Roadmap intent confirmed but staffing and timeline not yet locked. Competing integration priorities could shift capacity.
- **Mitigation:** Get explicit staffing confirmation and build estimate from Gnan before engaging Nicole Lam or making pipeline commitments.

**5. MGM prototype recovery (Andrew MacCuaig)**

- **Risk:** Jeff Hickman built an Okta integration for MGM in 2023/2024. Documentation was lost in a OneDrive migration.
- **Impact:** Build timeline and engineering estimate depend on whether this work is recoverable.
- **Mitigation:** Andrew to investigate before Engineering scoping.

**6. Studio prebuilt template (Andrew MacCuaig / Summer Gaasedelen)**

- **Risk:** The Studio template is a dependency for the AE/SE demo motion. If it lags the core OIDC integration, the sales enablement goal is not met at GA.
- **Impact:** AEs cannot demo without engineering on the call until the template is available.
- **Mitigation:** Scope and staff the Studio template in parallel with the core integration. Summer to provide requirements input before Andrew begins.

**7. Cross-functional alignment (Product, Sales, PS, Support)**

- **Risk:** Misalignment on what "Okta integration" means across teams — particularly the distinction between the native IDV vendor path and the Studio task workaround.
- **Mitigation:** Define and communicate the phased delivery model internally before any external commitments.

### 6.C Delivery & Technical Risks

**8. Fail-open vs. fail-closed behavior**

- **Risk:** Once Entrust is in the Okta auth path as an IDV vendor, it becomes a synchronous, blocking dependency. If Entrust is slow or unavailable, Okta waits.
- **Impact:** Undefined behavior affects SLO commitments, latency budgets, and customer trust in production.
- **Mitigation:** Engineering must define fail behavior before GA. Fail-closed is the safer default for regulated use cases.

**9. Okta profile completeness requirement**

- **Risk:** Okta's PAR request includes `given_name` and `family_name` as required claims by default. Users with incomplete Okta profiles will cause PAR requests to fail before the IDV ceremony starts.
- **Mitigation:** Handle gracefully in Entrust's PAR validation. Document the profile completeness requirement in admin setup guide.

---

## 7. GA Scope

General Availability means the solution is functional as a native Okta IDV vendor, production-ready for Fortune 500 Okta tenants, operationally supportable at scale, and accompanied by a Studio prebuilt template enabling AE/SE demo without engineering on the call.

**P0 — Does not ship without:**

| Area | GA Requirement |
|------|----------------|
| IDV vendor integration | Entrust is selectable as an IDV vendor in the Okta Admin Console — no custom code, no PS engagement required |
| OIDC endpoint implementation | Four required endpoints operational: `POST /oauth2/par`, `GET /oauth2/authorize`, `POST /oauth2/token`, JWKS |
| ID token contract | Signed JWT with `verified_claims` containing `trust_framework: "IDV-DELEGATED"` and `assurance_level: "VERIFIED" \| "FAILED"`; `given_name` and `family_name` required; `nonce` echoed for replay protection |
| KYE use case coverage | New Hire Onboarding and Account Recovery / MFA Reset |
| Mobile support | End-user IDV flow completable on iOS and Android |
| PKCE + security hardening | PKCE (S256) on auth code exchange; PAR session expiry 60 seconds; HTTPS-only redirect URIs; client_id/client_secret auth on all requests |
| Studio prebuilt template | Okta onboarding flow template enabling demo in under 30 minutes without per-deal engineering |

**P1 — Ships without, but materially degrades the KYE story:**

| Area | Requirement |
|------|-------------|
| OIN marketplace listing | Entrust listed in Okta Integration Network for inbound customer discovery |
| Privileged Access support | Integration supports Okta Privileged Access (OPA) trigger for PIM role elevation — required for Gov Cloud IAL-2 use case |
| Automated identity attribute matching | After a VERIFIED result, IDV outcome matched against employee record in Okta Universal Directory without surfacing PII to a service-desk agent. Must support fuzzy name matching (given_name + family_name) and name + DOB at minimum. (Gartner G00844298 rates this "highly desirable" for workforce IDV procurement.) |
| Inline hook OAuth auth | Entrust's inline hook endpoint authenticates incoming Okta calls via OAuth 2.0 access tokens |

**P2 — Nice to haves:**

- Okta-consistent UI styling for the IDV experience
- Webhook-based real-time verification status back to Okta
- Support for Okta Verify (passkey) as a downstream step post-IDV

### 7.1 Out of Scope

- **CIAM / customer-facing Okta use cases** — different buyer, different motion; this PRD covers KYE/workforce only
- **Custom per-customer Okta workflow engineering** — eliminating this pattern is the point
- **Inline hooks / token enrichment model** — Entrust acting as a risk/enrichment signal injected into Okta token claims. Different position (decision provider vs. step provider), different buyer motion. Deferred.
- **SSF (Shared Signals Framework)** — asynchronous background risk signal ingestion. Separate integration model. Worth flagging to Mark Lewin as potential Phase 2 partnership angle.

### 7.2 Scalability & Maintenance

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

**Buy:** Not applicable. No off-the-shelf product provides a pre-certified Okta IDV integration on Entrust's IDV platform.

**Build (Selected with conditions):** The core OIDC/PAR integration and Studio template will be built internally. Build scope is contingent on:

1. Engineering resource confirmation from Gnan
2. MGM prototype recovery evaluation (Andrew MacCuaig)
3. Nimble integration evaluation against P0 requirements

**Partner (Potential):** Nimble claims to have already built an Okta integration. Evaluate before committing to full internal build. If Nimble's build meets P0 requirements, a partner or licensed model may reduce internal scope.

### Operational Readiness & Support Requirements

Regardless of build path, Entrust must be operationally ready to support the integration before GA. The Okta integration places Entrust in the synchronous Okta authentication path — production failures are customer-visible and time-sensitive.

Support and deployment teams must be trained on:

- Okta's IDV vendor framework — how the OIDC/PAR flow works, what Okta expects, and where failures surface
- Common failure modes: PAR request rejections, JWT claim mismatches, callback URI errors, PKCE validation failures
- Diagnosing Okta System Log events (`user.identity_verification.start`, `user.identity_verification`) to trace a failed verification to a root cause
- Studio template deployment: configuring the Okta connector, mapping required fields, handling fail-open vs. fail-closed scenarios

Entrust must be able to:

- Support customer onboarding from initial admin configuration through first production verification
- Diagnose and resolve production issues without requiring Okta engineering involvement on every ticket
- Maintain and update the Studio template as Entrust's IDV flows or Okta's integration spec evolve
- Communicate proactively with customers when Entrust availability affects their Okta auth flows

This readiness must be confirmed by PS and Support leads before GA. It is a gate, not a best effort.

---

## 9. Rollout Plan

**Phase 0 — Pre-Launch (Internal Readiness)**

- Engineering resource confirmed (Gnan)
- MGM prototype recovery evaluated (Andrew)
- Nimble integration evaluated against P0
- OIN certification timeline confirmed (Nicole Lam via Mark Lewin)
- AE pipeline validation complete
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
- ServiceNow integration scoped: Okta > Workday > ServiceNow is the target partner-led integration sequence. ServiceNow follows Workday in the roadmap — ITSM workflows (onboarding tickets, account recovery requests) are the natural next surface after IAM and HR are covered.

---

## 10. Go-To-Market Plan

**GTM Objective**

Successfully introduce Entrust as a native Okta IDV vendor for Fortune 500 KYE buyers, recover Okta Elevate partner standing, and close 3+ pipeline deals citing Okta integration within 6 months of GA — without requiring custom integration work per customer.

**Target Market**

- Fortune 500 enterprises running Okta as primary IAM platform
- Regulated industries: Financial Services, Healthcare, Critical Infrastructure, Government
- Organizations with active new hire onboarding, account recovery, or privileged access programs

**Co-Sell and Commercial Requirements**

Pursue Okta Integration Network (OIN) listing to enable customer discovery within Okta's marketplace. Provide Okta-recommended enablement assets:

- Reference architecture diagram: "Okta Auth Flow + Entrust IDV" showing the IDV policy step
- Joint solution brief positioning Entrust IDV as the verification layer within Okta workflows
- AE/SE battlecard: Entrust vs. Persona, CLEAR Verified, Incode — specific to Okta IDV use cases

**Commercial Structure and Packaging**

Define a clear pricing and SKU structure before GA. Two distinct considerations:

- **IDV transaction fees** — the primary revenue-generating product. Pricing follows standard Entrust transaction-based models (volume-tiered or contracted rates). Billing paths: direct contract with Entrust, or via Okta Marketplace / GCP billing where supported by the GTM motion.
- **Okta Marketplace billing** — determine whether listing in OIN triggers a revenue share or billing integration requirement, and whether that affects existing commercial terms with current customers.

**Commercial Model & Pricing**

*IDV checks are the revenue product. Okta Marketplace is the distribution channel, not a separate SKU.*

1. **IDV Checks (Entrust Revenue)**

   Entrust IDV checks are the primary, revenue-generating product. Pricing follows standard transaction-based models:

   | Tier | Monthly Verification Volume | Indicative Price / Verification |
   |------|-----------------------------|---------------------------------|
   | Entry | 1 — 1,000 | TBD |
   | Growth | 1,001 — 10,000 | TBD |
   | Scale | 10,001 — 100,000 | TBD |
   | Enterprise | 100,000+ | Negotiated / contracted |

   Flexible billing paths (procurement convenience, not product change): IDV checks may be contracted directly with Entrust, or purchased via Okta Marketplace where supported. Regardless of billing path, IDV remains the core monetized offering.

2. **Okta Marketplace Consumption (Customer Procurement Path)**

   Where customers prefer Okta Marketplace procurement: align with Okta's billing and revenue share model. Confirm terms with Nicole Lam (Okta Partnership Program) before GA. Marketplace billing is a convenience layer — it does not change the IDV transaction pricing structure.

*Note: Specific per-tier pricing to be confirmed with Gnan and Finance before GA. The structure above reflects the template; numbers are placeholders.*

**Sales and Distribution Motion**

- **Primary:** Direct AE motion into active KYE pipeline where Okta is a stated requirement
- **Secondary:** Okta-sourced inbound via OIN marketplace and Okta Elevate co-sell
- **Tertiary:** Channel partners (Optive, WWT, Guidepoint) activated post-Okta Elevate tier recovery (John Parish)

**Field Readiness (Pre-GA Blocker)**

Current field responses to Okta integration questions are inconsistent: some AEs reference a legacy integration, others say "not available," others say "build your own." A unified reference architecture document — what the integration is, what it does, and how customers adopt it — is required before any external commitments or pipeline conversations. This is a pre-GA gate, not a post-GA deliverable.

**Marketing and Enablement**

- AE/SE demo guide and prebuilt Studio template
- Unified reference architecture: "Okta Auth Flow + Entrust IDV" — required for consistent field response to integration questions
- Okta-specific solution brief
- Competitive positioning (Persona, CLEAR Verified, Incode) for Okta IDV use cases
- Customer-facing admin setup guide
- Internal KYE enablement session for expansion team: expansion AEs are trained on KYC personas and KYC stakeholder contacts; KYE requires different conversations with IT Security and IAM buyers. Use TaskUs case study as the anchor example.

---

## 11. FAQ's

| Question | Answer |
|----------|--------|
| What is Okta's IDV vendor framework and why does it matter? | Okta supports a native IDV vendor category that makes identity verification a configurable policy step in the Okta Admin Console — not a webhook or custom integration. Being listed as an IDV vendor means an Okta admin can add Entrust without writing code or engaging PS. Note: the exact vendor type identifier used in Okta's API is TBD — to be confirmed with Nicole Lam during partner onboarding. |
| Can we use the Studio task as an interim Okta integration? | Yes, as an interim unblocking measure for specific deals. However, a Studio task does not achieve OIN listing, does not qualify for Okta's IDV vendor framework, and is not configurable by an Okta admin. It is not a substitute for the native OIDC integration. |
| What happens if Entrust is slow or unavailable during an Okta auth flow? | TBD — fail-open vs. fail-closed behavior must be defined before GA. Entrust becomes a synchronous, blocking dependency in the Okta authentication path. This is a P0 decision for Engineering. |

---

## 12. Relevant Links or Additional Information

- [Okta IDV Integration Guide](https://developer.okta.com/docs/guides/idv-integration/main/)
- [Technical Reference: Endpoints, JWT Claims, Flow Steps](references/okta-integration-spec.md)
- [Studio Build Specification: Connector, Workflow Task, API Endpoints](references/okta-studio-build-spec.md)
- Okta Elevate partner portal: TBD (Mark Lewin)
- MGM prototype docs: lost in OneDrive migration — recovery pending (Andrew MacCuaig)

**Stakeholders**

| Name | Role | Involvement |
|------|------|-------------|
| Gnan Gowda | Jeff's manager | Engineering resource confirmation; roadmap authority — gates all downstream planning |
| Summer Gaasedelen | Customer Onboarding / PS | Requirements input before Andrew engagement |
| Andrew MacCuaig | Engineering Manager, Studio | Build scoping — only after Summer's input; MGM prototype recovery |
| Mark Lewin | BizDev and Partnerships | Okta partner relationship; warm intro to Nicole Lam |
| John Parish | Alliances | Reseller channel activation post-GA |
| Nicole Lam | Okta Partnership Program | External partner contact; intro pending engineering resource confirmation |
| Yelena Tarbuck | AE, New Customers | Pipeline validation; customer demand examples |
| Reed Schroeder | AE | State Farm deal; Okta customer discovery |

---

## Open Questions

**1. Customer pain validation (Jeff + AEs):** Partially addressed. Two named instances documented: DOS Systems (Dec 2024, prospect) and Guardian Live (Nov 2024, existing customer). Remaining gaps: broader SE validation via Team Solutions Slack (tag @solution engineering, focus US/Europe), ProductBoard review of historical Okta requests, and confirmation of preferred implementation method (native OIDC vs. Studio task) from customers who actually raised the request.

**2. Integration path (Jeff + Andrew):** The native OIN listing path and the OIDC path are the same path. The Studio task option is a separate non-native workaround that may unblock early deals but does not achieve OIN listing. Decision needed: ship Studio task as interim, or go straight to OIDC/OIN?

**3. Fail-open vs. fail-closed (Jeff + Andrew + Gnan):** Once Entrust is in the Okta synchronous auth path as an IDV vendor, it becomes a blocking dependency. Decision needed before GA: fail the verification (fail-closed) or skip it (fail-open) if Entrust times out?

**4. MGM prototype (Andrew):** Jeff Hickman built an Okta integration for MGM in 2023/2024. Docs lost in OneDrive migration. Recovery or reconstruction could reduce build scope significantly.

**5. OIN certification timeline (Jeff + Nicole Lam):** Is this a 2-week or 6-month process? Determines whether OIN listing is P1 this cycle or gets pushed.

**6. Engineering resource confirmation (Gnan):** Roadmap intent confirmed but staffing and timeline not yet locked. Gates all external commitments.

**7. Pipeline validation (AEs):** Confirm which active accounts specifically require Okta integration vs. just being Okta shops. Pull from Salesforce / recent call notes before kickoff.

**8. Architecture customer validation (Jeff + Andrew):** OIDC or Studio task? API or native integration?

**9. Nimble (Gnan):** Nimble claims to have already built the Okta integration. Gnan recommends caution; prefers internal resources via Wipro. Evaluate: what did they build, does it meet P0 requirements, does it reduce internal build scope?

**10. MVI (Jeff + Andrew):** Define the minimum viable integration. Select one critical use case ('step-up auth during account recovery') and scope it to the absolute minimum required for a successful, demonstrable flow within Okta's IDV vendor framework.

**11. Okta Marketplace (Jeff + Nicole Lam):** Clarify whether achieving a marketplace listing requires materially more investment to meet 'uniform integration standards,' and whether that aligns with actual customer adoption behavior.

**12. Studio configuration fields (Jeff + Jelena):** Do the required fields match the Entra connector panel exactly, or does the Okta connector need a different Studio UI shape?

**13. PAR endpoint handling in Studio (Jeff + Andrew):** Okta requires `POST /oauth2/par` as a back-channel pre-authorization step with no Entra equivalent. Decision needed: does Studio abstract the PAR call transparently (simpler admin config, more engineering complexity) or expose it as a visible Studio config field?

**14. Studio template trigger (Jeff + Jelena):** What Okta event fires the IDV step? Options: (a) Okta provisioning hook during new hire account creation, (b) authentication policy rule triggered on first login, (c) manual admin-initiated enrollment.

**15. Studio template IDV step config (Jeff + Jelena):** Which Entrust IDV flow does the template invoke by default, and what attributes does it pass?

**16. Studio template result routing (Jeff + Jelena):** How does the template route on verification outcome? VERIFIED: continue provisioning. FAILED: block and notify, or allow retry (how many)? Pending state: does the template hold the flow open or fail-closed?

**17. Studio template error states (Jeff + Jelena):** Three conditions: (a) Entrust timeout, (b) vendor unavailable, (c) user abandons mid-flow. These affect SLO commitments and must be resolved before GA.

**18. PAD and IAD standards compliance (Jeff + Engineering):** Gartner (G00844298) identifies PAD (ISO 30107-3 Level 3) and IAD (CEN 18099) as baseline buying criteria for enterprise CISOs evaluating workforce IDV vendors. Does Entrust's current IDV meet these standards? If yes, differentiator to surface in sales and OIN listing. If not, a gap that will surface in enterprise security reviews.

**19. Automated matching approach for Okta (Jeff + Andrew + Jelena):** P1.4 requires automated matching of the IDV result against employee records. For Okta specifically: does Entrust match against Okta Universal Directory in real time, or does matching require a separate HR system connection (e.g., Workday)?

---

## Notable Not Doing

**1. SSF as a future expansion path:** Okta's Shared Signals Framework supports continuous risk signal ingestion from third-party security providers. This is a separate integration model — asynchronous, background, and security-posture-based rather than point-in-time verification. Worth flagging to Mark Lewin as a potential Phase 2 partnership angle.

**2. Token inline hook / decision provider model:** As a future phase, Entrust could act as a risk/enrichment signal injected into Okta token claims via token inline hook — adding trust scores, risk levels, or step-up flags at token minting time. Different position (decision provider vs. step provider), different buyer motion. Deferred.

---

## Appendix

### Market Context: Gartner on Workforce IDV

Source: Gartner, 'Workforce Identity Verification Requires Unique Capabilities,' 25 February 2026, ID G00844298. Authors: Akif Khan, Nayara Sangiorgio, James Hoover.

Key finding: The majority of IDV vendors in the market do not focus on workforce use cases. Using a vendor that focuses only on customer use cases leads to increased implementation costs and inability to service some workforce scenarios. Vendors who focus on workforce IDV will have built integrations with the workforce IAM stack (AM, HR, ITSM, PAM) and features for matching identities to employee records.

Gartner workforce-specific capability framework (Figure 1):

- Foundational: Presentation attack detection (PAD) to ISO 30107-3 Level 3; Injection attack detection (IAD) to CEN 18099
- Integrations with enterprise applications: AM, ITSM, HR systems of record, PAM, applicant tracking systems (ATS), background check services
- Automated identity attribute matching: fuzzy name matching (with LLMs), name + DOB, biometric comparison vs. employee headshot
- Configurable PII and biometric data handling: consent management, purge on completion, configurable retention, geo-specific storage, customer-managed environment option
- Enabling passwordless authentication: IDV as enrollment step for subsequent biometric-only re-authentication

### PII and Biometric Data Handling (Enterprise Procurement)

Per Gartner G00844298, CISOs treat PII and biometric data handling as a shortlisting criterion. Entrust should be prepared to answer the following before an enterprise security review:

- **Consent management:** user consent notices managed and modifiable per organizational requirements
- **Purge on completion:** all PII and biometric data purgeable immediately after an IDV check
- **Configurable retention:** retention and deletion policies configurable per customer
- **Geographic data residency:** PII and biometric data storable within specific geographies (US-only, EU-only)
- **Customer-managed storage:** option for data to be stored in an environment managed by the customer

These are not in scope for the Okta integration build but will surface in every enterprise deal. Confirm Entrust's current posture on each before the first enterprise security review.

### Future Capability: IDV as Foundation for Biometric Authentication

Gartner notes that workforce IDV vendors increasingly use the initial IDV check as an enrollment step for subsequent biometric-only authentication. After IDV, the employee's biometric data (with consent) is stored. Future actions requiring IDV can be completed with a selfie alone, reducing repeated full IDV for service desk interactions and PAM tool access.

An alternative is issuing a verifiable credential (VC) after IDV that the employee stores on their phone and presents to relying-party applications via biometric authentication within the vendor app. Gartner notes organizational discomfort with long-term biometric storage by third parties is a headwind; the VC model mitigates this.

Neither path is in scope for this cycle but both are relevant to the KYE Phase 2 roadmap.
