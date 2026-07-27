# Phase 2 - Client-Aware Payment UX

## Outcome

Build on the simple `/pay` page by making payment options clearer and adding invoice/project context where it helps the client.

This phase improves trust, clarity, and usability while still relying on Stripe-hosted payment experiences.

## Scope

- Keep the general variable payment option from Phase 1.
- Add or document invoice-specific payment paths.
- Improve the on-site payment page with better guidance.
- Decide whether client-specific payment context should stay in Stripe or move into the app.

## Payment Options To Support

1. General payment
- Uses the variable Stripe Payment Link.
- Best for partial payments, deposits, and open-ended balances.
- Reconciled manually unless Phase 3 automation has been added.

2. Invoice payment
- Uses Stripe-hosted invoice links for fixed invoice payment.
- Best when the client should view and pay a specific invoice balance.
- Keeps invoice details inside Stripe-hosted pages.

3. Future client-aware payment context
- May use a login-required client dashboard.
- May use secure magic links.
- May remain Stripe-only if app-side invoice data is not needed.

## UX Tasks

1. Refine `/pay`.
- Clearly separate `Make a Payment` from `Pay an Invoice`, if both are present.
- Explain when to choose variable payment versus invoice payment.
- Include business name and support contact.
- Include concise ACH timing guidance.

2. Add payment method guidance.
- ACH/bank payment: lower fee, slower confirmation.
- Card payment: faster confirmation, higher processing cost.
- Avoid promising final payment completion before Stripe confirms it.

3. Add invoice/project context.
- Add guidance for entering invoice number, project name, or business name.
- If invoice links are displayed or sent from the app, avoid exposing sensitive invoice details publicly.
- Prefer Stripe-hosted invoice URLs for invoice detail viewing unless app access is secured.

4. Add route/navigation decisions.
- Decide whether `/pay` should be linked in the main nav, footer, contact page, or only shared directly.
- Add contextual payment CTA from `/contact` if useful.
- Keep the payment path easy to share in client emails.

5. Update supporting content.
- Privacy policy references Stripe as payment processor.
- Refund/cancellation terms are summarized or linked.
- Payment support email is visible.

## Client Access Options

### Option A - Stripe-Hosted Invoice Links

Lowest app complexity. Use Stripe invoices and send the hosted invoice URL directly to the client.

Best when:

- The invoice amount is fixed.
- The client should view invoice details in Stripe.
- App-side invoice storage is not needed yet.

Limitation:

- Not ideal for customer-entered partial payments on the invoice page.

### Option B - Login-Required Client Portal

Build protected client routes using the app's existing auth patterns.

Possible future routes:

```text
/client/dashboard
/client/invoices
/client/payments
/client/projects
```

Best when:

- Clients will return often.
- Project/invoice/payment history should live in the app.
- You want a long-term business portal.

Tradeoff:

- Higher security, privacy, testing, and maintenance responsibility.

### Option C - Magic-Link Invoice Access

Send a secure unique link that lets a client view limited payment context without creating an account.

Best when:

- You want lower friction than a login.
- The client only needs one invoice/payment experience.

Tradeoff:

- Requires careful token generation, expiration, access scope, and logging.

## Risks And Mitigations

- Risk: page becomes confusing with too many choices.
  Mitigation: lead with the common action and use short labels.

- Risk: invoice details are exposed publicly.
  Mitigation: keep invoice details in Stripe-hosted invoice pages or secure app routes.

- Risk: clients confuse payment initiation with cleared funds.
  Mitigation: repeat ACH clearing expectations near payment actions.

- Risk: app scope grows into a full client portal too early.
  Mitigation: keep portal/magic-link work as explicit optional decisions.

## Deliverables

- Improved `/pay` page.
- Clear split between general variable payments and invoice-specific payments.
- Updated support/privacy/refund copy.
- Decision record for invoice access model.

## Effort Estimate

- UX/content implementation: 4 to 10 hours
- Privacy/support copy updates: 1 to 3 hours
- QA and revisions: 2 to 4 hours
- Total: 1 to 3 days
