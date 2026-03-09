# Account Recovery SES Setup Guide

Use this guide to configure Amazon SES for forgot-password email delivery in this project.

## Scope
- Lambda: `showcaseForgotPassword`
- Lambda: `showcaseResetPassword` (password-changed confirmation email)
- Region: `us-east-2` (match your existing Lambda/API stack)
- Email flow: forgot-password reset link email + post-reset confirmation email

## Project Status Snapshot (2026-03-08)
- Sender email identity verification: complete (`noreply@nickhanson.me`).
- SES production access: granted (`us-east-2`).
- Lambda SES IAM send policy: applied and validated.
- Forgot-password delivery test: successful end-to-end.
- Password-changed confirmation email: successful end-to-end.
- SES bounce/complaint alerting: deferred (cost-aware), tracked in TODO backlog.

## 1) Confirm AWS/SES starting point
1. Sign in to AWS Console.
2. Switch to region `us-east-2`.
3. Open **Amazon SES**.
4. If this is your first SES use, complete any onboarding prompts.

Note: There is no separate “SES account” to create. SES is a service inside your AWS account.

## 2) Verify sender identity

### Option A (recommended): verify domain
1. SES -> **Configuration** -> **Verified identities** -> **Create identity**.
2. Choose **Domain**.
3. Enter your domain (example: `nickhanson.me`).
4. Enable **Easy DKIM**.
5. Create identity, then add all DNS records SES gives you (DKIM + verification) at your DNS provider.
6. Wait until identity status is **Verified**.

### Option B (quick start): verify single email
1. SES -> **Verified identities** -> **Create identity**.
2. Choose **Email address**.
3. Enter sender address you will use for Lambda (example: `no-reply@yourdomain.com`).
4. Open the verification email and click the link.

## 3) Handle SES sandbox vs production
1. SES -> **Account dashboard**.
2. Check **Sending status** and whether account is in **Sandbox**.

If in Sandbox:
- You can only send to verified recipients.
- For full live sending, request production access:
  - SES -> **Account dashboard** -> **Request production access**.
  - Use case: transactional password reset emails.

## 4) Grant Lambda permission to send email
Attach this policy to execution roles for both `showcaseForgotPassword` and `showcaseResetPassword`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSesSendEmail",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

You can tighten `Resource` later to specific identity ARNs after baseline validation.

## 5) Configure Lambda environment variables
Set these on `showcaseForgotPassword`:

- `PASSWORD_RESET_FROM_EMAIL`
  - Must be verified in SES (or belong to verified domain).
- `RESET_URL_BASE`
  - Frontend reset page base URL, for example:
  - `https://your-site/reset-password`
- `PASSWORD_RESET_REPLY_TO` (optional)
  - Reply-to mailbox for support.

Set these on `showcaseResetPassword`:
- `PASSWORD_RESET_FROM_EMAIL`
  - Sender for password-changed confirmation emails.
- `PASSWORD_RESET_REPLY_TO` (optional)
  - Reply-to mailbox for password-changed notifications.
- `PASSWORD_CHANGE_SUPPORT_EMAIL` (optional)
  - Support address shown in confirmation email body.
  - Current value: `nick@nickhanson.com`.

Keep existing recovery env vars unchanged:
- `USERS_TABLE_NAME`
- `RESET_TOKENS_TABLE_NAME`
- `RESET_TOKEN_TTL_MINUTES`
- `TOKEN_HASH_PEPPER`
- `RETURN_RESET_TOKEN_FOR_TESTING`

## 6) Deploy updated Lambda code
1. Package from repo root:

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseForgotPassword -InstallDependencies
```

2. Upload/update Lambda code.
3. Publish a new version.
4. Move alias `prod` to that version.
5. Verify API route integration still targets `showcaseForgotPassword:prod`.

## 7) Validate sending
1. Invoke `POST /forgot-password` with a real account (`username + email`).
2. Expected API result: generic `200` response.
3. Verify:
   - New item appears in `PasswordResetTokens`.
   - SES delivery attempt appears in CloudWatch logs for lambda.
   - Recipient mailbox receives reset email (check spam/junk).

## 8) Common failure modes
- `MessageRejected`:
  - Sender not verified, or recipient not verified while in sandbox.
- `AccessDenied` for SES:
  - Missing `ses:SendEmail`/`ses:SendRawEmail` on lambda role.
- No email but token record created:
  - `PASSWORD_RESET_FROM_EMAIL` or `RESET_URL_BASE` missing/invalid.
- Wrong link destination:
  - `RESET_URL_BASE` has typo or wrong environment URL.

## 9) Security notes
- Keep `RETURN_RESET_TOKEN_FOR_TESTING=false` in normal operation.
- Do not log raw reset tokens.
- Keep `TOKEN_HASH_PEPPER` consistent between forgot/reset lambdas.
