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
  "fullName": "John Doe"
}
```

Response

```json
{
  "success": true,
  "userId": "uuid"
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

# Profile

## Get Profile

GET /profile

Response

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "nationality": "Myanmar",
  "preferredLanguage": "en",
  "occupation": "Caregiver",
  "prefecture": "Tokyo"
}
```

---

## Update Profile

PUT /profile

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
