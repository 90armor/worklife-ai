# RAG_DESIGN.md

# Retrieval-Augmented Generation Design

## Objective

Provide accurate information while minimizing hallucinations.

---

# Knowledge Sources

## Immigration

* Residence Card
* Visa Procedures
* Address Change

## Tax

* Resident Tax
* Income Tax

## Insurance

* National Health Insurance
* Pension

## Workplace

* Labor Rules
* Workplace Culture
* Safety Policies

## Housing

* Moving Process
* Utility Registration

## Banking

* Bank Account Opening
* Money Transfers
* ATM and Card Usage

---

# Ingestion Pipeline

Document Collection

↓

Content Validation

↓

Text Extraction

↓

Chunking

↓

Embedding Generation

↓

Vector Storage

---

# Chunking Strategy

Chunk Size

```text
500-800 tokens
```

Overlap

```text
100 tokens
```

---

# Metadata

Each chunk contains:

```json
{
  "title": "",
  "category": "",
  "source": "",
  "language": "",
  "updatedAt": ""
}
```

---

# Retrieval Flow

User Question

↓

Embedding

↓

Similarity Search

↓

Top K Results

↓

Prompt Construction

↓

LLM Response

---

# Search Configuration

Top K

```text
5
```

Similarity Threshold

```text
0.75
```

---

# Prompt Strategy

System Prompt

* Use retrieved content first
* Do not invent procedures
* Cite source when available
* Ask clarification if uncertain

---

# Hallucination Prevention

Rules

1. Retrieved knowledge has priority
2. No legal advice
3. No immigration decisions
4. No tax calculations
5. Encourage official verification when necessary

---

# Embedding Model

Recommended

* text-embedding-3-small

Alternative

* text-embedding-3-large

---

# Future Enhancements

* Hybrid Search
* Reranking
* Multi-language Retrieval
* Knowledge Graph Integration
