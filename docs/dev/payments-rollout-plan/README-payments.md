# Payments Rollout Plan

This plan defines a low-risk path for accepting client payments through the showcase site using Stripe-hosted payment flows.

The guiding principle is simple: accept money safely first, then add client-aware UX and automation only after the payment workflow proves useful.

## Current Direction

1. Phase 1: Simple variable payment page.
2. Phase 2: Client-aware payment and invoice UX.
3. Phase 3: Automated payment tracking and reconciliation.

## Goals

- Let clients make full or partial payments without creating a Stripe account.
- Support ACH/bank payments and card payments through Stripe-hosted checkout.
- Avoid handling raw card or bank details in app code.
- Keep Phase 1 small enough to launch quickly for real client use.
- Leave a clear path toward invoice-aware UX and payment records later.

## Non-Goals For Phase 1

- No custom payment form.
- No stored payment methods in this app.
- No automatic invoice balance updates.
- No client portal.
- No webhook-backed payment ledger.

## Recommended Sequence

### Phase 1 - Simple Payment Page

Create a public `/pay` page that links to a Stripe Payment Link configured with customer-entered amount. This supports full payments, partial payments, deposits, and project-balance payments.

Reconciliation is manual in this phase.

### Phase 2 - Client-Aware Payments

Improve the on-site experience by adding clearer payment options and invoice/project context. This can include a general variable payment option, Stripe-hosted invoice links for fixed invoice payments, and better client-facing instructions.

Client portal or magic-link invoice access can be evaluated here, but should not be treated as required for the first launch.

### Phase 3 - Automated Payment Tracking

Add Stripe webhooks, persisted payment records, admin visibility, and reconciliation workflows. This is where ACH pending/succeeded/failed states become visible in the app and payment records can be tied to clients, projects, or invoices.

## Scope Guardrails

- Prefer Stripe-hosted pages for payment collection.
- Keep Stripe secrets only in environment variables.
- Put serverless payment logic under `netlify/functions` or the future chosen backend boundary.
- Do not expose invoice details publicly unless using Stripe-hosted invoice links or a secure app access model.
- Treat ACH payment initiation as pending until Stripe confirms final success.

## Success Metrics

- A client can open `/pay` and make a full or partial payment.
- The client understands ACH timing before paying.
- The payment can be identified and manually reconciled from Stripe.
- Future phases can add invoice context and automation without replacing Phase 1.

## Estimated Timeline

- Phase 1: 0.5 to 1 day
- Phase 2: 1 to 3 days depending on UX scope
- Phase 3: 2 to 5 days depending on storage, admin UX, and testing depth

Total: about 3.5 to 9 working days if all phases are completed.
