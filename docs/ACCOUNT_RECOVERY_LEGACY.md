# Account Recovery Legacy Concerns

## Purpose
Identify compatibility and migration risks when introducing password reset/account recovery into an existing authentication system.

## Legacy Risk Categories

### 1) Identity Quality Risks
Potential issues:
- Missing email addresses in older user records.
- Non-unique or unverified emails.
- Inconsistent username casing/normalization.

Mitigation:
- Define canonical lookup strategy (preferred: unique, normalized email + username fallback).
- Block reset for records with no recoverable identifier and provide secure support fallback.
- Backfill normalization fields incrementally.

### 2) Password Hashing Variants
Potential issues:
- Mixed hash formats from older deployments.
- Deprecated bcrypt cost factors.

Mitigation:
- Build hash verification abstraction that supports known legacy formats.
- Rehash to current standard after successful reset/login.
- Track algorithm metadata per user when possible.

### 3) Session Model Debt
Potential issues:
- Long-lived tokens in localStorage.
- No centralized session revocation.

Mitigation:
- Add `tokenVersion` to user record.
- Include tokenVersion in auth tokens and reject stale versions.
- Force logout across devices after password reset.

### 4) API Behavior Inconsistency
Potential issues:
- Existing APIs may leak account existence via status/message timing.

Mitigation:
- Normalize forgot-password response body/status.
- Keep response timing as consistent as practical.
- Remove differentiated errors for unknown users.

### 5) Notification/Email Constraints
Potential issues:
- Legacy sender identities not fully configured (SPF/DKIM/DMARC).
- Deliverability issues to major providers.

Mitigation:
- Validate sender domain and authentication policies.
- Add bounce/complaint monitoring.
- Provide user instructions for spam/junk folder checks.

### 6) Observability Gaps
Potential issues:
- No baseline metrics for abuse or failures.

Mitigation:
- Add structured logs with event names and correlation IDs.
- Add dashboards for reset requests, success rates, failures, abuse blocks.
- Alert on anomaly thresholds.

### 7) Privacy/Compliance Gaps
Potential issues:
- Over-logging sensitive data.
- Retention policy undefined for recovery artifacts.

Mitigation:
- Never log raw tokens or plaintext passwords.
- Store only token hash and minimal metadata.
- Define retention/TTL for token records and logs.

## Migration Strategy

### Phase 0: Inventory
- Enumerate current user schema variants.
- Confirm uniqueness guarantees for username/email.
- Audit current token/session handling.

### Phase 1: Compatibility Layer
- Add tokenVersion and reset token table.
- Add new endpoints without changing existing login flow.
- Start collecting metrics.

### Phase 2: Controlled Rollout
- Enable UI links for a subset of users/environments.
- Monitor delivery, error rates, and abuse.
- Tune rate limits and cooldowns.

### Phase 3: Enforcement
- Require session invalidation on reset.
- Enforce current password policy for all resets.
- Disable old fallback behavior that weakens security.

## Legacy Readiness Checklist (Quick)
- Do all users have a unique recovery identifier?
- Can current sessions be invalidated globally per user?
- Are old hash formats identified and supported?
- Are reset responses enumeration-safe?
- Are logs safe, useful, and retention-bound?
- Are sender domain and deliverability controls in place?
