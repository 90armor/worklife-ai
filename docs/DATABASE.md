# DATABASE.md

## Overview

This document defines the database schema for the **WorkLife AI** platform.

The database is designed to support:

* User Management
* AI Document Explainer
* Procedure Navigator
* Workplace Guide
* RAG (Retrieval-Augmented Generation)
* Chat History
* Future Employer Portal
* Future Knowledge Transfer AI

---

# Database Technology

## Primary Database

* PostgreSQL

## Vector Search

* pgvector

## File Storage

* Supabase Storage

---

# Entity Relationship Diagram

```text
users
  │
  ├──────────────┐
  │              │
  ▼              ▼

documents    chat_sessions
                 │
                 ▼
          chat_messages
                 │
                 ▼
             feedbacks

guides
  │
  ├──────────────┐
  │              │
  ▼              ▼

knowledge_chunks
saved_guides
```

---

# Tables

---

## users

Stores user account information.

### Purpose

Represents foreign workers using the platform.

### Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),

    full_name VARCHAR(255) NOT NULL,

    nationality VARCHAR(100),
    preferred_language VARCHAR(50),

    prefecture VARCHAR(100),

    occupation VARCHAR(255),

    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Example

| Field              | Value     |
| ------------------ | --------- |
| nationality        | Myanmar   |
| preferred_language | Burmese   |
| prefecture         | Tokyo     |
| occupation         | Caregiver |

---

## documents

Stores uploaded files and AI processing results.

### Purpose

Used by the Document Explainer feature.

### Schema

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    file_name VARCHAR(255),
    file_url TEXT,

    file_type VARCHAR(50),

    document_category VARCHAR(100),

    ocr_text TEXT,

    ai_summary TEXT,

    ai_action_required TEXT,

    status VARCHAR(50),

    created_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);
```

### Document Categories

```text
RESIDENT_TAX
HEALTH_INSURANCE
PENSION
CITY_HALL
WORK_CONTRACT
OTHER
```

### Status Values

```text
UPLOADED
PROCESSING
COMPLETED
FAILED
```

---

## chat_sessions

Stores chat conversation containers.

### Purpose

Allows grouping messages into separate conversations.

### Schema

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    title VARCHAR(255),

    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);
```

### Example Titles

```text
How to Change Address
Resident Tax Questions
Workplace Rules
```

---

## chat_messages

Stores individual chat messages.

### Purpose

Maintains AI conversation history.

### Schema

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,

    session_id UUID NOT NULL,

    role VARCHAR(20),

    message TEXT,

    created_at TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES chat_sessions(id)
);
```

### Roles

```text
USER
ASSISTANT
SYSTEM
```

---

## guides

Stores curated procedural guides.

### Purpose

Provides reliable information independent of LLM responses.

### Schema

```sql
CREATE TABLE guides (
    id UUID PRIMARY KEY,

    title VARCHAR(255),

    category VARCHAR(100),

    language VARCHAR(50),

    summary TEXT,

    content TEXT,

    source_url TEXT,

    updated_at TIMESTAMP,

    created_at TIMESTAMP
);
```

### Example Guides

```text
Address Change Procedure
National Health Insurance Registration
Resident Tax Payment Guide
```

---

## saved_guides

Stores bookmarked guides.

### Purpose

Allows users to save important information.

### Schema

```sql
CREATE TABLE saved_guides (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    guide_id UUID NOT NULL,

    created_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (guide_id)
        REFERENCES guides(id)
);
```

---

## feedbacks

Stores user feedback on AI responses.

### Purpose

Supports quality improvement and analytics.

### Schema

```sql
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY,

    user_id UUID,

    chat_message_id UUID,

    rating INTEGER,

    comment TEXT,

    created_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (chat_message_id)
        REFERENCES chat_messages(id)
);
```

### Rating Scale

```text
1 = Bad
2 = Poor
3 = Okay
4 = Good
5 = Excellent
```

---

## knowledge_chunks

Core table used for Retrieval-Augmented Generation (RAG).

### Purpose

Stores vectorized knowledge for semantic search.

### Schema

```sql
CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY,

    guide_id UUID,

    title VARCHAR(255),

    category VARCHAR(100),

    content TEXT,

    embedding VECTOR(1536),

    source_url TEXT,

    language VARCHAR(20),

    created_at TIMESTAMP,

    FOREIGN KEY (guide_id)
        REFERENCES guides(id)
);
```

### Categories

```text
IMMIGRATION
TAX
INSURANCE
WORKPLACE
HOUSING
BANKING
```

### Example Chunk

```json
{
  "title": "Address Change",
  "category": "IMMIGRATION",
  "content": "...",
  "language": "ja"
}
```

---

## ai_processing_logs

Stores AI processing metadata.

### Purpose

Supports monitoring, debugging, and cost analysis.

### Schema

```sql
CREATE TABLE ai_processing_logs (
    id UUID PRIMARY KEY,

    user_id UUID,

    document_id UUID,

    operation_type VARCHAR(100),

    model_name VARCHAR(100),

    prompt_tokens INTEGER,

    completion_tokens INTEGER,

    processing_time_ms INTEGER,

    created_at TIMESTAMP
);
```

### Example Operations

```text
OCR
DOCUMENT_SUMMARY
PROCEDURE_GUIDE
TRANSLATION
WORKPLACE_EXPLANATION
```

---

# pgvector Index

Create vector search index for semantic retrieval.

```sql
CREATE INDEX idx_knowledge_chunks_embedding
ON knowledge_chunks
USING hnsw (embedding vector_cosine_ops);
```

---

# MVP Tables

The Hackathon MVP only requires the following tables:

```text
users

documents

chat_sessions

chat_messages

guides

knowledge_chunks

saved_guides

feedbacks
```

These tables are sufficient to support:

* AI Document Explainer
* Procedure Navigator
* Workplace Guide
* Chat History
* RAG Search

---

# Future Expansion

## Employer Portal

Future tables:

```text
companies
company_users
training_materials
worker_assignments
onboarding_progress
```

---

## Knowledge Transfer AI

Future tables:

```text
expert_interviews
training_videos
knowledge_extractions
translated_training_materials
```

---

# Design Principles

1. Keep the MVP simple.
2. Store authoritative knowledge separately from AI-generated responses.
3. Use RAG to reduce hallucinations.
4. Design for future multilingual support.
5. Maintain scalability for employer onboarding and workforce knowledge transfer.
6. Separate transactional data from vectorized knowledge data.
