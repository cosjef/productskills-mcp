# Okta IDV Integration: Technical Reference

*Sourced from the [Okta IDV Integration Guide](https://developer.okta.com/docs/guides/idv-integration/main/). Companion to [prd-okta-integration.md](../prd-okta-integration.md).*

---

## Endpoints Entrust must implement

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/oauth2/par` | POST | Receives PAR request from Okta; returns `request_uri`. Response: `{"request_uri": "urn:ietf:params:oauth:request_uri:...", "expires_in": 60}` with HTTP 201. |
| `/oauth2/authorize` | GET | Receives `request_uri`; initiates the IDV ceremony for the user. |
| `/oauth2/token` | POST | Exchanges authorization code for signed ID token; validates `code_verifier` against `code_challenge`. |
| JWKS endpoint | GET | Publishes Entrust's public key so Okta can verify the signed ID token. |

---

## Authorization flow (step by step)

1. User triggers an Okta policy step: authenticator enrollment, password recovery, or account unlock.
2. Okta sends a PAR request (server-to-server) to Entrust's `/oauth2/par` with: `response_type=code`, `client_id`, `client_secret`, `code_challenge` + `code_challenge_method=S256`, `scope`, `nonce`, `redirect_uri`, `state`, `login_hint` (user identifier), and mapped user profile claims.
3. Entrust validates credentials, creates a verification session, and returns a `request_uri`.
4. Okta redirects the user's browser to Entrust's `/oauth2/authorize` carrying only the `request_uri` — not the full parameter set.
5. User completes the IDV ceremony (doc scan + biometric match).
6. Entrust redirects to Okta's callback with an `authorization_code`: `https://{yourOktadomain}/idp/identity-verification/callback`.
7. Okta POSTs to Entrust's `/oauth2/token`, exchanging the code (with `code_verifier`) for a signed ID token.
8. Okta evaluates policy based on `assurance_level` in the returned token.

**Required scope format:** `openid profile identity_assurance idv_flow_{idv_flow_id}`

---

## ID token claims

Entrust returns a signed JWT. Okta does not receive the full verification payload — only the claims below.

### Required JWT claims

| Claim | Value | Notes |
|-------|-------|-------|
| `iss` | Entrust's IDV service URL | HTTPS required. |
| `aud` | Okta `client_id` | Must match the registered app. |
| `sub` | User identifier | — |
| `exp`, `iat` | Timestamps | Standard JWT expiry/issued-at. |
| `nonce` | Matches PAR request nonce | Okta validates this to prevent replay. |
| `verified_claims[].verification.trust_framework` | `IDV-DELEGATED` | Identifies Entrust as the delegated IDV authority. |
| `verified_claims[].verification.assurance_level` | `VERIFIED` or `FAILED` | Okta's policy engine resolves on this value only. |
| `verified_claims[].verification.time` | ISO 8601 timestamp | When verification occurred. |

### Optional identity claims (within `verified_claims`)

`given_name` and `family_name` are required by default — PAR fails if these are unmapped or absent in the user's Okta profile. All other identity claims are optional:

- `middle_name`, `email`, `birthdate` (ISO 8601), `phone_number` (E.164)
- Address: `street_address`, `locality`, `region`, `postal_code`, `country`

All claims support a `fuzzy` extension for match flexibility. Optional claims are excluded from the PAR request if unmapped or absent; they drop silently without breaking the flow. Misconfigured required claims fail the PAR request.

---

## Okta Admin Console configuration

The Okta admin performs these steps — no customer-side code or custom endpoint wiring required:

1. Enable the Okta account management policy on their tenant.
2. Register Entrust as an `ID_PROOFING` IdP using `client_id` and `client_secret` (generated from Entrust's portal).
3. Map Okta user profile attributes to the OIDC claims Entrust will receive, designating each as required or optional.
4. Set the redirect URI to `https://{yourOktadomain}/idp/identity-verification/callback`.
5. Add Entrust as a policy step in the relevant authentication policy rules.

---

## Error handling

PAR response errors follow RFC 9126: `{"error": "...", "error_description": "..."}`.

**Policy evaluation failure reason codes:**

| Code | Meaning |
|------|---------|
| `PARSING_ERROR` | Malformed ID token response |
| `MISSING_*` | Required claim absent |
| `RESPONSE_PROCESSING_ERROR` | Token endpoint communication failure |
| `CLAIMS_NOT_VERIFIED` | `assurance_level` returned FAILED |
| `CLAIM_*_NOT_VERIFIED` | Specific claim verification failed |

---

## Observability

Okta emits two system log events per IDV attempt:

- `user.identity_verification.start` — fires when the policy step triggers; includes `IdvFlowId` and `IdvReferenceId`.
- `user.identity_verification` — fires after policy resolution; includes ALLOW/DENY result and failure reason code if applicable.

Entrust's audit trail holds the full verification record. Okta's System Log holds the policy outcome.
