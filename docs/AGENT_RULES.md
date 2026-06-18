# AGENT_RULES.md

# AI Agent Rules

These rules apply to all AI coding agents.

Examples:

* Codex
* Claude Code
* Cursor Agent
* GitHub Copilot Agent
* Gemini CLI

---

# Primary Objective

Build WorkLife AI.

A platform that helps foreign workers navigate life and work in Japan.

Always prioritize MVP delivery over technical perfection.

---

# Before Making Changes

Always read:

1. PROJECT_OVERVIEW.md
2. ARCHITECTURE.md
3. DATABASE.md
4. FEATURES.md
5. CURRENT_TASK.md

before implementing any task.

---

# Development Principles

## Rule 1

Implement only the current task.

Do not build future features.

Avoid speculative development.

---

## Rule 2

Keep solutions simple.

Prefer:

* readability
* maintainability
* clarity

over complexity.

---

## Rule 3

Do not introduce unnecessary dependencies.

Before adding a package:

* justify why it is needed
* check existing alternatives

---

## Rule 4

Follow existing architecture.

Do not:

* redesign architecture
* replace frameworks
* restructure the project

without explicit approval.

---

# Frontend Rules

Technology:

* Next.js
* TypeScript
* Tailwind CSS

Requirements:

* Mobile responsive
* Accessible
* Reusable components

Avoid:

* inline styles
* duplicated components
* unnecessary state management

---

# Backend Rules

Technology:

* Laravel

Requirements:

* REST API
* Service Layer Pattern
* Request Validation
* Resource Responses

Avoid:

* business logic in controllers
* duplicated queries
* hardcoded values

---

# Database Rules

Technology:

* PostgreSQL

Requirements:

* UUID primary keys
* Foreign key constraints
* Proper indexes

Never:

* remove existing columns
* drop tables
* modify production schema

without migration files.

---

# API Rules

Requirements:

* REST conventions
* Proper HTTP status codes
* Consistent response format

Success Example:

```json
{
  "success": true,
  "data": {}
}
```

Error Example:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# AI Feature Rules

For future AI development:

* Use RAG before LLM
* Avoid hallucination
* Cite retrieved sources when available

Never:

* fabricate procedures
* provide legal advice
* provide immigration decisions

---

# Code Quality Rules

All code must:

* compile successfully
* pass linting
* avoid warnings
* include typing

---

# Documentation Rules

When implementation changes:

Update:

* CURRENT_TASK.md — when task status or sprint changes
* FEATURES.md — when feature requirements change
* API_SPEC.md — when endpoints, request, or response shapes change
* DATABASE.md — when schema, columns, or table structure change
* ARCHITECTURE.md — when system structure or component responsibilities change

Keep all documentation consistent with each other.

---

# Git Rules

Preferred Commit Format

feat(auth): implement login API

feat(profile): add user profile page

fix(api): handle validation errors

docs(database): update schema

---

# Task Completion Process

When a task is completed:

1. Verify implementation
2. Verify tests
3. Update CURRENT_TASK.md
4. Mark task as DONE
5. Define next task

---

# Forbidden Actions

Never:

* remove working features
* rewrite unrelated code
* add hidden functionality
* change architecture without approval
* implement future milestones early

Stay focused on the current task only.

MVP delivery has higher priority than optimization.
