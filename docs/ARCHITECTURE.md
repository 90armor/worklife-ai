# ARCHITECTURE.md

# System Architecture

## Overview

WorkLife AI follows a layered architecture.

The system consists of:

1. Presentation Layer
2. Application Layer
3. AI Layer
4. Knowledge Layer
5. Data Layer

---

# High-Level Architecture

```text
┌──────────────────────────┐
│        User Layer        │
│ Foreign Workers          │
└────────────┬─────────────┘
             │
             ▼

┌──────────────────────────┐
│   Application Layer      │
│                          │
│ Document Explainer       │
│ Procedure Navigator      │
│ Workplace Guide          │
└────────────┬─────────────┘
             │
             ▼

┌──────────────────────────┐
│        AI Layer          │
│                          │
│ OCR                      │
│ RAG                      │
│ LLM                      │
│ Translation              │
└────────────┬─────────────┘
             │
             ▼

┌──────────────────────────┐
│     Knowledge Layer      │
│                          │
│ Immigration              │
│ Tax                      │
│ Insurance                │
│ Workplace Rules          │
└────────────┬─────────────┘
             │
             ▼

┌──────────────────────────┐
│       Data Layer         │
│ PostgreSQL + pgvector    │
└──────────────────────────┘
```

---

# Component Architecture

```text
Frontend (Next.js)

        │

        ▼

Backend API (Laravel)

        │

 ┌──────┼────────────┐
 │      │            │

 ▼      ▼            ▼

PostgreSQL     Supabase Storage

                     │

                     ▼

                OCR Service

                     │

                     ▼

               AI Service Layer

                     │

                     ▼

                 RAG Engine

                     │

                     ▼

              Knowledge Base
```

---

# Frontend Layer

Responsibilities:

* Authentication
* Dashboard
* Chat Interface
* Document Upload
* Guide Browsing

Pages:

* Dashboard
* Documents
* Ask AI
* Workplace Guide
* Profile

---

# Backend Layer

Technology:

* Laravel REST API

Responsibilities:

* Authentication
* Authorization
* User Management
* File Processing
* AI Orchestration
* RAG Retrieval

Core APIs:

POST /auth/register

POST /auth/login

GET /profile

PUT /profile

POST /documents

GET /documents/{id}

POST /chat/sessions

POST /chat/messages

GET /guides

GET /guides/{id}

POST /guides/{id}/save

DELETE /guides/{id}/save

POST /feedback

---

# AI Layer

Purpose:

Provides intelligence for:

* Document understanding
* Procedure guidance
* Workplace explanations

Components:

## Document Agent

Responsible for:

* OCR
* Classification
* Summarization

## Procedure Agent

Responsible for:

* Administrative procedures
* Government processes

## Workplace Agent

Responsible for:

* Workplace terminology
* Culture explanations

---

# RAG Architecture

The system uses Retrieval-Augmented Generation.

Workflow:

User Question

↓

Embedding Generation

↓

Vector Search

↓

Relevant Knowledge Chunks

↓

Prompt Construction

↓

LLM Response

↓

Final Answer

---

# Knowledge Base

Categories:

* Immigration
* Tax
* Insurance
* Workplace
* Housing
* Banking

Knowledge sources must be reviewed before ingestion.

AI responses should prioritize retrieved content over model assumptions.

---

# Document Processing Flow

Document Upload

↓

Store File

↓

OCR Extraction

↓

Document Classification

↓

Knowledge Retrieval

↓

AI Summarization

↓

Response Generation

↓

Save Results

---

# Security Considerations

Authentication:

* JWT Authentication

Authorization:

* Role-Based Access Control

File Security:

* Virus scanning
* Size restrictions

Data Protection:

* Encrypted storage
* HTTPS only

---

# Scalability Strategy

Current:

* Monolithic Laravel API

Future:

* AI Service Separation
* Dedicated Vector Database
* Queue-Based Processing

---

# Future Architecture

Additional Components:

Employer Portal

↓

Training Platform

↓

Knowledge Transfer Engine

↓

Multilingual Workforce Training

This enables the transition from a support platform into a workforce knowledge ecosystem.
