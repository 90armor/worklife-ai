# API_SPEC.md

# REST API Specification

Base URL

```text
/api/v1
```

---

# Authentication

## Register

POST /auth/register

Request

```json
{
  "email": "user@example.com",
  "password": "password",
  "fullName": "John Doe",
  "forceFresh": false
}
```

`forceFresh` is optional (default `false`). When `true` and a soft-deleted account exists for
that email, the old account and all its data are hard-deleted before the new account is created.

Response — success (201)

```json
{
  "success": true,
  "userId": "uuid"
}
```

Response — email already active (422)

```json
{
  "success": false,
  "message": "The email address is already in use."
}
```

Response — email belongs to a soft-deleted account (409)

```json
{
  "success": false,
  "code": "ACCOUNT_SOFT_DELETED",
  "message": "An account with this email was deleted. Restore it or start fresh."
}
```

---

## Login

POST /auth/login

Request

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response

```json
{
  "accessToken": "jwt-token"
}
```

---

## Logout

POST /auth/logout

Requires: `Authorization: Bearer <token>`

Invalidates the current JWT via the blacklist (requires `JWT_BLACKLIST_ENABLED=true`).
Succeeds even if the token is already expired or invalid.

Response

```json
{
  "success": true
}
```

---

## Restore soft-deleted account

POST /auth/restore

Request

```json
{
  "email": "user@example.com",
  "password": "previous-password"
}
```

Verifies the password against the soft-deleted account. On match, restores the account and
returns a fresh login token. On mismatch, returns 401 with a generic error that does not
reveal whether the email maps to a deleted account.

Response — success

```json
{
  "accessToken": "jwt-token"
}
```

Response — wrong password / account not found (401)

```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

---

# Profile

## Get Profile

GET /profile

Requires: `Authorization: Bearer <token>`

Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "nationality": "Myanmar",
    "preferredLanguage": "en",
    "occupation": "Caregiver",
    "prefecture": "Tokyo"
  }
}
```

---

## Update Profile

PUT /profile

Requires: `Authorization: Bearer <token>`

Request — all fields optional (patch semantics)

```json
{
  "fullName": "John Doe",
  "nationality": "Myanmar",
  "preferredLanguage": "en",
  "occupation": "Caregiver",
  "prefecture": "Tokyo"
}
```

Response

```json
{
  "success": true,
  "data": { ... }
}
```

---

# Account

## Delete account (soft delete)

DELETE /account

Requires: `Authorization: Bearer <token>`

Soft-deletes the authenticated user (sets `deleted_at`). All related data is preserved.
The current JWT is invalidated. The user cannot log in or be returned by GET /profile
until the account is restored via POST /auth/restore.

Response

```json
{
  "success": true
}
```

---

# Documents

## Upload Document

POST /documents

Multipart Form Data

Response

```json
{
  "documentId": "uuid",
  "status": "PROCESSING"
}
```

---

## Get Document

GET /documents/{id}

Response

```json
{
  "documentType": "RESIDENT_TAX",
  "summary": "...",
  "actionRequired": "...",
  "status": "COMPLETED"
}
```

---

# Chat

## Create Session

POST /chat/sessions

Response

```json
{
  "sessionId": "uuid"
}
```

---

## Send Message

POST /chat/messages

Request

```json
{
  "sessionId": "uuid",
  "message": "How do I change my address?"
}
```

Response

```json
{
  "answer": "...",
  "sources": []
}
```

---

# Guides

## List Guides

GET /guides

---

## Guide Details

GET /guides/{id}

---

## Save Guide

POST /guides/{id}/save

---

## Remove Saved Guide

DELETE /guides/{id}/save

---

# Feedback

POST /feedback

Request

```json
{
  "chatMessageId": "uuid",
  "rating": 5,
  "comment": "Helpful answer"
}
```
