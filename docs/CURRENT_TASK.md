# CURRENT_TASK.md

# Current Sprint

Sprint: MVP Foundation

Status: IN PROGRESS

---

# Current Objective

Build the foundational platform for WorkLife AI.

Current focus:

* Project setup
* Authentication
* Database
* Basic UI

Do NOT work on advanced AI features yet.

---

# Current Milestone

M1 - Foundation Setup

Target Outcome:

User can:

* Register
* Login
* Access Dashboard

System provides:

* Database schema
* Authentication
* User profile management

---

# Tasks

## TASK-001

Title:
Initialize Frontend

Status:
TODO

Requirements:

* Next.js latest version
* TypeScript
* App Router
* Tailwind CSS
* ESLint
* Prettier

Deliverables:

* Frontend project created
* Runs locally

---

## TASK-002

Title:
Initialize Backend

Status:
TODO

Requirements:

* Laravel latest version
* PostgreSQL connection
* API structure

Deliverables:

* Backend project created
* Database connection configured

---

## TASK-003

Title:
Database Setup

Status:
TODO

Requirements:

Implement tables from:

DATABASE.md

Deliverables:

* Migrations
* Seeders
* Initial schema

---

## TASK-004

Title:
Authentication

Status:
TODO

Requirements:

* Register API
* Login API
* JWT authentication

Deliverables:

* Authentication working

---

## TASK-005

Title:
User Profile

Status:
TODO

Requirements:

Profile fields:

* Full Name
* Nationality
* Preferred Language
* Occupation
* Prefecture

Deliverables:

* CRUD APIs
* Profile UI

---

## TASK-005A

Title:
Language & Appearance Settings (Profile Avatar Menu)

Status:
TODO

Parent:
TASK-005 (User Profile)

Requirements:

When the logged-in user clicks the profile avatar in the Sidebar
(`frontend/src/components/Sidebar.tsx`), the existing dropdown
(Settings / Sign out) must also expose Language and Appearance.
Both open in a modal, not a new page.

Entry point:

* Add "Language" and "Appearance" items to the avatar dropdown
* Keep existing Settings and Sign out items
* Dropdown button retains `aria-haspopup` / `aria-expanded`

Appearance section:

* Theme toggle: Light, Dark, System (all three)
* Reuse existing `useTheme()` hook and `localStorage` key `theme`
  (see UI_UX_GUIDELINES.md → Theme Modes; DEC-009)
* Segmented control or radio group
* Each option labelled with text, not icons only (multilingual)
* Do NOT add a new persistence mechanism

Language section:

* Selector for Preferred Language
* Persist via `PUT /profile` using `{ success, data }` envelope (DEC-006)
* Read JWT from `localStorage` key `worklife_token` (DEC-007) for the
  Authorization header
* Do NOT add a new endpoint

Styling:

* Tailwind only, no inline styles
* Semantic tokens (`bg-surface-raised`, `border-neutral-border`,
  `text-body`, etc.) so dark mode works automatically
* Modal radius `lg` (12px), 44×44px min touch targets
* Visible focus rings (`ring-2 ring-primary-400`)
* Sentence-case labels

Accessibility:

* Modal: `role="dialog"`, `aria-modal="true"`, labelled heading,
  focus trap, Esc-to-close
* Backdrop `aria-hidden="true"`
* Fully keyboard operable

Scope discipline:

* Reuse existing components and `useTheme`
* No new dependencies / state-management libraries (Rule 3)
* Implement only this; do not touch unrelated code

Deliverables:

* Avatar menu opens a modal with Language and Appearance sections
* Language change round-trips through `PUT /profile`
* Theme change persists and applies before first paint

Docs:

* Update API_SPEC.md only if an endpoint shape changes (should not)
* If a reusable modal component is added, record it in DECISION.md

---

# Out Of Scope

Do NOT implement:

* OCR
* OpenAI
* RAG
* Document Upload
* Chat
* Employer Portal

These belong to future milestones.

---

# Next Milestone

M2 - Document Explainer

Features:

* File Upload
* OCR
* Document Classification
* AI Summary

Begin only after M1 completion.

---

# Completion Criteria

M1 is complete when:

✓ User can register

✓ User can login

✓ User profile works

✓ Database migrations complete

✓ Frontend connected to backend

After completion:

Update this file before starting M2.