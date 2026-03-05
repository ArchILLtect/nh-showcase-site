# Registration Test Account Data (P0)

Prepared test inputs for duplicate and invalid registration cases.

## Test Identity Set

Use these values as your working set for P0 validation.

- Existing username for duplicate test: `SSAFNewUser`
- Existing email (reference only): `nickhansonsr@gmail.com`
- Throwaway username (new): `p0test_user_20260304`
- Throwaway email (new): `p0test_user_20260304@example.com`
- Strong password sample: `P0Test!Secure123`
- Weak password sample: `abc123`

If `p0test_user_20260304` was already created during prior tests, change the suffix and rerun.

## Request Payloads

### 1) Valid New Registration (expected P0 target: 201)
```json
{
  "username": "p0test_user_20260304",
  "email": "p0test_user_20260304@example.com",
  "password": "P0Test!Secure123",
  "confirmPassword": "P0Test!Secure123",
  "role": "user"
}
```

### 2) Duplicate Username (expected P0 target: 409)
```json
{
  "username": "SSAFNewUser",
  "email": "dup-check-20260304@example.com",
  "password": "P0Test!Secure123",
  "confirmPassword": "P0Test!Secure123",
  "role": "user"
}
```

### 3) Missing Username (expected P0 target: 400)
```json
{
  "email": "missing-username-20260304@example.com",
  "password": "P0Test!Secure123",
  "confirmPassword": "P0Test!Secure123",
  "role": "user"
}
```

### 4) Invalid Email Format (expected P0 target: 400)
```json
{
  "username": "bad_email_case_20260304",
  "email": "not-an-email",
  "password": "P0Test!Secure123",
  "confirmPassword": "P0Test!Secure123",
  "role": "user"
}
```

### 5) Weak Password (expected P0 target: 400)
```json
{
  "username": "weak_pass_case_20260304",
  "email": "weak-pass-case-20260304@example.com",
  "password": "abc123",
  "confirmPassword": "abc123",
  "role": "user"
}
```

### 6) Extra Unexpected Fields (expected P0 target: should not break handler)
```json
{
  "username": "extra_fields_case_20260304",
  "email": "extra-fields-case-20260304@example.com",
  "password": "P0Test!Secure123",
  "confirmPassword": "P0Test!Secure123",
  "role": "user",
  "unexpected": "this field should be ignored or safely handled",
  "profile": {
    "displayName": "P0 Test"
  }
}
```

## Quick Execute (Postman or curl)

Endpoint:
- `POST https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com/register`

Headers:
- `Content-Type: application/json`

Run each payload above and capture:
- status code
- response body
- timestamp

Store outputs in:
- `docs/baselines/2026-03-04-registration/RAW_OUTPUTS.md`
