# Phase 1 - Simple Variable Payment Page

## Outcome

Accept real client payments quickly through a public `/pay` page using a Stripe-hosted Payment Link with customer-entered amount.

This phase is designed for immediate use cases such as:

- Full invoice payment.
- Partial invoice payment.
- Project deposit.
- Progress payment.
- General client balance payment.

## Recommended Stripe Setup

Use a Stripe Payment Link configured as:

- Pricing model: customer chooses what to pay.
- Suggested amount: the current expected payment amount, if useful.
- Minimum amount: a reasonable lower bound for partial payments.
- Maximum amount: either the current invoice amount or a broader business-safe cap.
- Payment methods: ACH/bank account and card, controlled through Stripe settings.

Use a generic title such as:

```text
Client Payment
```

Use a description such as:

```text
Make a full or partial payment toward an active project, invoice, or deposit.
```

## User Flow

1. Client goes to `/pay`.
2. Client reads short payment instructions.
3. Client clicks `Make a Payment`.
4. Client is redirected to Stripe Checkout.
5. Client enters the payment amount.
6. Client pays by ACH/bank account or card.
7. Stripe sends confirmation/receipt.
8. Payment is manually reconciled against the invoice or project balance.

Note: the client does not need to create a Stripe account.

## Site Implementation Tasks

1. Add a public payment route.
- Add `/pay` to the React router.
- Create a `Pay` page component under `src/pages`.
- Keep the first version focused and clear.

2. Add payment copy.
- Explain that full and partial payments are accepted.
- State that payments are processed securely by Stripe.
- State that ACH/bank payments can take several business days to clear.
- Explain that card payments may confirm faster.

Suggested page copy:

```text
Use this page to make a full or partial payment toward an active project, invoice, or deposit. Payments are processed securely by Stripe. ACH/bank payments may take several business days to clear.
```

3. Add the payment call to action.
- Button label: `Make a Payment`.
- Button destination: Stripe Payment Link URL.
- Open in the same tab or a new tab; either is acceptable, but be consistent with the rest of the site.

4. Add basic reconciliation guidance.
- If Stripe custom fields are available for the Payment Link, collect `Invoice number, project name, or business name`.
- If custom fields are not used, include on-site copy asking the client to use the email/name associated with the invoice.

5. Add privacy/payment-provider disclosure.
- Update the privacy policy or payment page copy to note that Stripe processes payment information.
- Do not claim the app stores payment details.

## Operational Checklist

- Stripe business profile is complete.
- Payout bank is verified.
- ACH/bank payment method is enabled.
- Card payment method is enabled.
- Payment Link uses the intended suggested/min/max amounts.
- Payment Link description is clear enough for client receipts.
- Stripe receipt emails are enabled or understood.
- Return/success/cancel behavior is configured if applicable.
- Test-mode payment flow has been checked.
- First live payment amount/link is double-checked before sharing.

## Manual Reconciliation

Phase 1 does not automatically reduce invoice balances.

Manual process:

```text
Client pays through /pay
Stripe records the payment
Admin reviews Stripe payment details
Admin applies payment to invoice/project balance manually
```

This is acceptable for the fast launch because it keeps payment collection simple and avoids building an accounting system before it is needed.

## Risks And Mitigations

- Risk: customer expects ACH to clear immediately.
  Mitigation: state that bank payments can take several business days to clear.

- Risk: payment cannot be matched to the invoice.
  Mitigation: collect invoice/project/business-name context when possible.

- Risk: client pays the wrong amount.
  Mitigation: use suggested/min/max amounts and confirm balance separately when needed.

- Risk: card fees are unexpectedly high.
  Mitigation: explain ACH as the lower-fee option when appropriate.

## Deliverables

- Live Stripe variable Payment Link.
- Public `/pay` page.
- Clear payment instructions.
- Manual reconciliation workflow.

## Effort Estimate

- Stripe configuration: 1 to 2 hours
- Site implementation: 1 to 3 hours
- Validation and copy review: 1 to 2 hours
- Total: 0.5 to 1 day
