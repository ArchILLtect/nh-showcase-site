# Phase 3 - Automated Payment Tracking And Reconciliation

## Outcome

Move from manual Stripe review to reliable app-side payment records, webhook processing, and admin reconciliation.

This phase turns the payment feature into a real payment module.

## Scope

- Add a Stripe webhook endpoint.
- Verify webhook signatures.
- Persist normalized payment records.
- Track asynchronous payment states, especially ACH.
- Expose payment status and reconciliation tools in the admin area.

## Backend/serverless Tasks

1. Add webhook function.
- Add a serverless endpoint for Stripe webhooks.
- Store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in environment variables.
- Verify Stripe signatures before processing events.
- Reject unsigned or invalid events.

2. Add idempotency.
- Persist processed Stripe `event.id` values.
- Treat duplicate events as successful no-ops.
- Key payment records by Stripe payment identifiers where appropriate.

3. Normalize events.
- Convert Stripe event payloads into a consistent internal payment record.
- Capture enough metadata for manual and automated reconciliation.

Core events to evaluate:

```text
checkout.session.completed
payment_intent.processing
payment_intent.succeeded
payment_intent.payment_failed
charge.succeeded
charge.failed
charge.refunded
charge.dispute.created
invoice.paid
invoice.payment_failed
invoice_payment.paid
```

The exact event list should be finalized after choosing whether Phase 3 tracks only Payment Link/Checkout payments, invoice payments, or both.

## Payment Record Schema

Suggested fields:

```text
id
stripeEventId
externalPaymentId
checkoutSessionId
paymentIntentId
invoiceId
amount
currency
methodType
payerName
payerEmail
clientId
projectId
invoiceReference
status
failureReason
refundedAmount
disputeStatus
createdAt
updatedAt
rawEventStored
```

Status values should distinguish payment lifecycle states:

```text
pending
processing
succeeded
failed
refunded
partially_refunded
disputed
requires_review
```

## Storage Decision

Choose one storage path before implementation:

- DynamoDB, consistent with the current auth/serverless architecture.
- Existing/future app database if a broader backend migration is underway.
- Stripe-only reporting if the app does not need persistent payment records yet.

For the current site architecture, DynamoDB is the most aligned option if payment records need to live in the app.

## Admin UX

Add an admin payment panel with:

- Recent payments.
- Filters by date, status, amount, method, and client/reference.
- ACH processing/pending visibility.
- Failed payment visibility.
- Refund/dispute markers.
- Manual reconciliation note field.
- Link back to the Stripe payment/invoice record.

Optional later:

- Client payment history.
- Invoice/project balance display.
- Export CSV.
- Email notifications to admin or client.

## Reconciliation Rules

- Do not mark ACH payments as cleared until Stripe reports final success.
- Do not reduce invoice/project balance from a spoofable client-side redirect alone.
- Prefer webhook-confirmed events over browser return-page state.
- Keep manual override/admin notes for edge cases.
- Preserve enough Stripe identifiers to audit each record later.

## Reliability And Operations

- Log all webhook validation failures.
- Log all unhandled event types at a low severity for later review.
- Make webhook processing retry-safe.
- Add a runbook for replaying Stripe events.
- Add a runbook for manual reconciliation when automation fails.
- Define who receives payment failure or dispute alerts.

## Risks And Mitigations

- Risk: webhook spoofing.
  Mitigation: strict signature verification and secret rotation policy.

- Risk: duplicate events create duplicate records.
  Mitigation: persist and check Stripe `event.id`.

- Risk: out-of-order events create incorrect status.
  Mitigation: design status transitions to be monotonic where possible and preserve event timestamps.

- Risk: ACH failure after initial checkout completion is missed.
  Mitigation: track processing/succeeded/failed events and surface pending states in admin.

- Risk: app data diverges from Stripe.
  Mitigation: keep Stripe as source of truth and include admin reconciliation links.

## Deliverables

- Secure Stripe webhook endpoint.
- Persisted payment records.
- Idempotent event processing.
- Admin payment/reconciliation view.
- Operations runbook for failures, replay, and manual reconciliation.

## Effort Estimate

- Webhook/storage implementation: 8 to 18 hours
- Admin UI: 4 to 10 hours
- QA/testing/hardening: 6 to 14 hours
- Total: 2 to 5 days
