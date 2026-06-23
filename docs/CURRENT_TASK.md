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

## TASK-006
Task: Claude-style Settings modal + server-side auth with soft-delete & restore-on-resignup — frontend + Laravel backend
Read first, report before coding. Summarize the current structure before changing anything: frontend/src/components/Sidebar.tsx (avatar menu — the Settings <Link href="/profile"> and client-side handleSignOut), frontend/src/app/profile/page.tsx, frontend/src/app/register/page.tsx (or wherever sign-up lives), frontend/src/lib/api.ts, frontend/src/lib/auth.ts, frontend/src/components/ThemeProvider.tsx; backend routes/api.php, AuthController.php, ProfileController.php, the User model, the users migration, and every migration with a FK to users (documents, chat_sessions, chat_messages, feedbacks, saved_guides, ai_processing_logs, knowledge_chunks). Also API_SPEC.md, DATABASE.md, UI_UX_GUIDELINES.md, AGENT_RULES.md, DECISION.md. Report the FK/cascade situation and whether config/jwt.php has blacklist_enabled before implementing.

Part A — Backend: logout, soft-delete account, and restore-aware sign-up (tymon/jwt-auth is installed).
A1. Enable soft deletes on users. The users table currently has no deleted_at column and the User model does not use SoftDeletes. Add a migration introducing deleted_at ($table->softDeletes()), and add the Illuminate\Database\Eloquent\SoftDeletes trait to the User model. Confirm the auth:api guard / route-model resolution then excludes soft-deleted users by default (they must not be able to log in or be returned by GET /profile).
A2. Logout endpoint. Add POST /auth/logout inside the auth:api group. Add logout() to AuthController invalidating the current JWT via jwt-auth's blacklist (JWTAuth::invalidate(JWTAuth::getToken()) or auth()->logout()), handling an already-expired/invalid token gracefully. Return { "success": true }. If blacklist_enabled is not true in config/jwt.php, flag that invalidation won't truly revoke.
A3. Soft-delete account endpoint. Add DELETE /account inside the auth:api group. Add destroy() to ProfileController (or a new AccountController) that soft-deletes the authenticated user (sets deleted_at, keeps the row and all related data intact) and invalidates their JWT so it can't be reused. Return { "success": true }. Do not delete dependent rows here — soft delete preserves everything for possible restore.
A4. Restore-aware sign-up — the key part. The email column has a database-level unique constraint, and the register validation uses unique:users,email. Because soft delete leaves the row in place, that email still occupies the unique index, so a normal re-signup would fail validation. Change the registration flow to handle this explicitly:

- On POST /auth/register, before the normal create, look up any user with that email including soft-deleted (User::withTrashed()->where('email', …)->first()).
- If a non-deleted user exists → behave as today: reject with the existing "email already in use" error.
- If a soft-deleted user exists → do not auto-create. Return a distinct, machine-readable response the frontend can branch on, e.g. HTTP 409 with { "success": false, "code": "ACCOUNT_SOFT_DELETED", "message": "An account with this email was deleted. Restore it or start fresh." }. Do not leak any profile data in this response beyond the fact that a deleted account exists.
- Add a follow-up endpoint to resolve the choice. Two actions, both keyed by email + password:

* Restore existing → POST /auth/restore with { email, password }. Verify the password against the soft-deleted user's password_hash; only on match, restore ($user->restore()) and return a fresh login token (same shape as /auth/login). On mismatch, return 401 and do not reveal whether the email maps to a deleted account beyond the generic invalid-credentials message. (Password is required to restore — signup-form trust is not sufficient.)
* Start fresh (hard delete + recreate) → when the user explicitly chooses a new account, hard-delete the old soft-deleted user and all their data, then create the new account. This is where dependents matter: report the FK cascade situation first; if FKs cascade on delete, forceDelete() on the user suffices — otherwise delete dependents (documents, chat_sessions → chat_messages → feedbacks, saved_guides, ai_processing_logs, etc.) inside a DB transaction before force-deleting the user, so nothing is orphaned. Then proceed with the normal registration create. Gate this behind the same email+password? No — for "start fresh" the user is creating a brand-new credential, so require confirmation on the frontend (explicit choice) but the old data is purged regardless of the old password. State this clearly in the response/docs so it's not a silent data-loss path.


- Retention TODO: leave a clearly-marked // TODO: enforce restore retention window (e.g. purge accounts soft-deleted > N days) where the restore lookup happens, plus a note in DECISION.md. Do not implement a scheduled purge yet.

A5. Docs. Update API_SPEC.md for POST /auth/logout, DELETE /account, the new 409 ACCOUNT_SOFT_DELETED register response, POST /auth/restore, and the "start fresh" behavior. Record in DECISION.md: soft-delete choice, the unique-email/re-signup handling, password-required restore, hard-delete-on-fresh-start (and its data-loss implication), and the retention-window TODO.

Part B — Frontend: Settings modal + re-signup branch.
B1. Settings modal. Clicking Settings in the avatar menu opens a centered modal (no navigation) laid out like Claude's settings: left sidebar with General and Account, right detail panel that swaps on selection.

General — edit fullName, nationality, preferredLanguage, occupation, prefecture via existing api.profile.update(...) (PUT /profile, { success, data }). Email shown read-only. Pre-fill from api.profile.get(). Optimistic save, inline error, success indicator, Save disabled in-flight. Reuse existing input components.
Account — Log out: new api.auth.logout() → POST /auth/logout, then auth.removeToken() + redirect /login; extract the existing handleSignOut into a shared useLogout hook / lib/auth.ts helper used by both the avatar menu and here; client token removal must happen even if the server call fails. Delete account: destructive, behind explicit confirmation (type email or two-step), calls api.account.delete() → DELETE /account (soft delete), then clears token + redirects. error-* styling, distinct from Save; never dismiss the modal mid-confirmation.

B2. Re-signup flow. Update the sign-up page to handle the 409 ACCOUNT_SOFT_DELETED response: instead of a generic error, show a choice — "Restore your existing account" vs "Start fresh with a new account".

* Restore → prompt for the password, call POST /auth/restore; on success store the returned token and proceed as a normal login. Show the generic invalid-credentials error on 401.
* Start fresh → show a clear destructive confirmation that all previous data will be permanently deleted, then on confirm re-call register with the chosen flag/flow so the backend hard-deletes the old account and creates the new one. Use error-* styling for this warning.

Modal/a11y requirements. role="dialog", aria-modal="true", labelled heading, focus trap, Esc-to-close, backdrop click-to-close (except mid-confirmation). Tailwind only, no inline styles, reuse tokens (bg-card, bg-surface, border-neutral-border, text-body, text-heading, text-muted, primary-*, error-*). Radius lg, 44px min targets, focus rings ring-2 ring-primary-400. Responsive: collapse the modal sidebar to a top tab row on narrow viewports.
Sidebar change. Change the Settings item from <Link href="/profile"> to a button opening the modal, preserving role/label/styling. Do not touch the Language/Appearance flyout submenus. Keep or repoint /profile to render the same General panel; note its fate.
Constraints. No new dependencies (no modal/state libraries — AGENT_RULES Rule 3). Don't change unrelated code. Preserve all existing a11y roles and token conventions.

When done.

Diff of every changed file (frontend + backend).
Confirm: types check, lint passes, no console warnings.
Demonstrate the flows: Settings opens modal; General saves via PUT /profile; logout calls POST /auth/logout + clears token; delete soft-deletes and blocks further login; re-signup with the same email returns 409, restore-with-password works, "start fresh" purges old data and creates a new account.
State explicitly: was blacklist_enabled already true; the FK cascade strategy used for hard delete; and confirm soft-deleted users cannot log in or appear in GET /profile.

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