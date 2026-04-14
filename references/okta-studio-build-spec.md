# Okta IDV Integration: Studio Build Specification

*Engineering reference for the Studio connector and workflow task required to support the Okta IDV integration. Companion to [prd-okta-integration.md](../prd-okta-integration.md) and [okta-integration-spec.md](okta-integration-spec.md).*

*Source: [Okta IDV Integration Guide](https://developer.okta.com/docs/guides/idv-integration/main/)*

---

## Overview

Two distinct Studio artifacts are required:

1. **Okta IDV Connector** — the configuration object that stores the Okta-to-Entrust connection credentials and handles the OIDC/PAR protocol transparently. Admins configure this once per Okta tenant.
2. **Okta Onboarding Workflow Template** — a prebuilt workflow that uses the connector and implements the New Hire Onboarding use case end-to-end, enabling AE/SE demo in under 30 minutes without per-deal engineering.

The connector is the dependency; the template is the demo and deployment accelerator. Both are P0 for GA.

---

## Part 1: Okta IDV Connector

### What it is

A named connector in Studio that stores the credentials and configuration needed to act as an Okta IDV vendor. The connector implements the OIDC/PAR back-channel transparently — the admin fills in fields; Studio handles the protocol.

### Configuration Panel Fields

#### Required Fields

| Field | Label (UI) | Maps to | Notes |
|-------|-----------|---------|-------|
| Okta Org Domain | Okta Domain | PAR callback construction; `redirect_uri` allowlist | Format: `company.okta.com`. Used to construct and allowlist `https://{domain}/idp/identity-verification/callback`. |
| Client ID | Client ID | `client_id` in PAR request | Issued by Entrust to the customer for this Okta tenant registration. |
| Client Secret | Client Secret | `client_secret` in PAR request | Stored encrypted. If this secret expires or is rotated without updating the connector, all IDV flows will fail. Surface a last-rotated date in the UI. |
| IDV Flow / Template ID | Verification Flow | `scope: idv_flow_{idv_flow_id}` | Identifies which Entrust verification flow to invoke. Drives document type, biometric requirements, and result structure. |
| OIDC Signing Certificate | Signing Certificate | Signs the returned ID token JWT | Admin selects from certificates provisioned in Entrust's portal. Okta fetches the corresponding public key via the JWKS endpoint to verify. |

#### Optional Fields

| Field | Label (UI) | Maps to | Notes |
|-------|-----------|---------|-------|
| User ID Mapping Attribute | User ID Mapping | `login_hint` in PAR request | Which Okta user profile attribute to send as the user identifier. Default: User Principal Name (email). Must be populated in all Okta user profiles or the PAR request will fail. |
| ID Token Signing Algorithm | Signing Algorithm | `alg` header in signed JWT | Default: RS256. Supported: RS384, RS512. |
| ID Token Timeout | Token Timeout | `exp` claim in returned JWT | How long the ID token remains valid after issuance. Default: 300 seconds. |
| Verification Timeout | Verification Timeout | PAR session / user-facing ceremony timeout | How long the user has to complete the IDV ceremony before the session expires. Default: 600 seconds. Separate from token timeout. |
| Fail Behavior | On Timeout / Error | Studio routing on non-VERIFIED result | Toggle: fail-closed (block the Okta flow) vs. fail-open (allow through). Must be explicitly set — no silent default. P0 decision per the PRD. |
| Callback URL Override | Callback URL | `redirect_uri` | Override for non-standard Okta tenant configurations. Leave blank in standard deployments. |

### PAR Abstraction

The PAR flow is a server-to-server back-channel call. Studio should handle this transparently — the admin does not configure a PAR endpoint field; the connector constructs and sends the PAR call internally using the Okta Org Domain and credentials above. See Open Question 13 in the PRD.

---

## Part 2: Okta Onboarding Workflow Template

### What it is

A prebuilt Studio workflow template implementing the New Hire Onboarding use case. Uses the Okta IDV Connector. Deployable from a template gallery; configurable in under 30 minutes without engineering on the call.

### Trigger

The template is triggered by an Okta account management policy event — a new user enrollment or provisioning action that the Okta admin has configured to require IDV. The Studio workflow receives user context from Okta via the PAR request payload. See Open Question 14 in the PRD for the three trigger options; the recommended default is the Okta authentication policy rule on first enrollment.

### Workflow Task: Okta IDV Verification

The core task in the template. Wraps the full OIDC/PAR ceremony.

#### Inputs

| Input | Required | Source | Notes |
|-------|----------|--------|-------|
| `given_name` | Yes | Okta Universal Directory | Mapped from Okta user profile. PAR fails if absent. |
| `family_name` | Yes | Okta Universal Directory | Mapped from Okta user profile. PAR fails if absent. |
| `login_hint` | Yes | Okta user identifier | Determined by User ID Mapping Attribute in connector config. Default: UPN / email. |
| `customer_user_id` | Yes | Entrust internal | Stable identifier for this user across multiple workflow runs. Required for encrypted biometric token storage and reuse — without it, biometric data from repeat verifications cannot be linked to the same individual. |
| `email` | Optional | Okta Universal Directory | Included if mapped. Dropped silently if absent. |
| `birthdate` | Optional | Okta Universal Directory | ISO 8601 format required. |
| `phone_number` | Optional | Okta Universal Directory | E.164 format required. |
| `middle_name` | Optional | Okta Universal Directory | Included if mapped. |
| Address fields | Optional | Okta Universal Directory | `street_address`, `locality`, `region`, `postal_code`, `country`. Included if mapped. |

#### Outputs

| Output | Value | Notes |
|--------|-------|-------|
| `assurance_level` | `VERIFIED` or `FAILED` | Primary result. Okta's policy engine resolves on this. |
| `verification_time` | ISO 8601 timestamp | When the IDV check occurred. Required in the JWT. |
| `verification_process` | Session reference string | Optional. Entrust's internal session ID for audit trail linkage. |
| `claims` | Object | Verified claim values returned. May return `MATCHED` instead of raw values — Okta accepts this as confirmation without disclosing PII. Include `fuzzy: true` extension on any claim passed with fuzzy matching enabled. |

#### Result Routing

| Result | Default Action | Configurable? |
|--------|---------------|---------------|
| `VERIFIED` | Continue provisioning; proceed in Okta flow | No — always continue |
| `FAILED` | Block provisioning; route to configured failure path | Yes — notification, retry, or helpdesk ticket |
| Timeout / Vendor unavailable | Determined by Fail Behavior setting in connector | Yes — fail-open or fail-closed |
| User abandons mid-flow | Treated as FAILED; route to failure path | Yes — separate toggle for retry vs. hard block |

Retry logic: if FAILED, the template should support a configurable number of retries (default: 1) before hard-blocking and routing to helpdesk. See Open Question 16 in the PRD.

#### Error States

Three conditions require explicit handling before GA (Open Question 17):

| Condition | Trigger | Required Behavior |
|-----------|---------|------------------|
| Entrust timeout | IDV APIs do not respond within Verification Timeout window | Fail-closed: block and notify. Fail-open: allow through with audit flag. Controlled by Fail Behavior toggle. |
| Vendor unavailable | Entrust IDV service returns 5xx or is unreachable | Same as timeout. Enforce a hard timeout cutoff — must not hang the Okta auth flow. |
| User abandons | User closes browser or does not complete ceremony | Session expires after Verification Timeout. Route to failure path. Do not leave a dangling session. |

---

## Part 3: API Endpoints

Full endpoint specification is in [okta-integration-spec.md](okta-integration-spec.md). Summary for cross-reference:

| Endpoint | Method | Priority |
|----------|--------|----------|
| `/oauth2/par` | POST | P0 |
| `/oauth2/authorize` | GET | P0 — Okta recommends naming this `/oauth2/idv-authorize` to distinguish it from a general-purpose authorization endpoint |
| `/oauth2/token` | POST | P0 |
| JWKS | GET | P0 |
| Inline hook endpoint | POST | P1 — OAuth 2.0 token auth on incoming Okta requests |

The Studio connector calls these endpoints internally. Admins do not configure them directly.

---

## Open Questions (Studio-specific)

Carried from the PRD, unresolved:

- **OQ12:** Does the connector panel need a different field shape than what is proposed here? Needs Andrew and Jelena sign-off.
- **OQ13:** PAR abstraction is the recommendation above. Needs Andrew sign-off before implementation.
- **OQ14:** Trigger mechanism — Okta provisioning hook vs. authentication policy rule vs. manual admin enrollment. Needs Jelena confirmation.
- **OQ15:** Which Entrust IDV flow does the template invoke by default? Needs Jelena input.
