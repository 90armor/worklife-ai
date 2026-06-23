# DECISION.md

Records architectural and implementation decisions made during development.

---

## DEC-001 — Tailwind CSS via PostCSS (not CDN)

Date: 2026-06-16
Task: TASK-001

Decision: Installed Tailwind CSS as a PostCSS plugin (`tailwindcss`, `postcss`, `autoprefixer` in devDependencies).

Reason: The AGENT_RULES require Tailwind CSS and forbid inline styles. PostCSS integration is the standard Next.js approach and works with the Docker build pipeline (`npm install` runs in Dockerfile).

---

## DEC-002 — ESLint via eslint-config-next

Date: 2026-06-16
Task: TASK-001

Decision: Used `eslint-config-next` (extends `next/core-web-vitals`) matched to Next.js 14.2.5.

Reason: Minimal config, covers React and Next.js-specific rules, integrates with `next lint`.

---

## DEC-003 — API base URL is /api/v1

Date: 2026-06-16
Task: TASK-002

Decision: Routes in `routes/api.php` use `Route::prefix('v1')`. Laravel's routing system automatically prepends `/api` to all routes in that file, producing `/api/v1/...`.

Reason: API_SPEC.md specifies `Base URL: /api/v1`. The previous code used `Route::prefix('api')` which would have created routes at `/api/api/` (double prefix).

---

## DEC-004 — JWT via tymon/jwt-auth

Date: 2026-06-16
Task: TASK-004

Decision: Used `tymon/jwt-auth ^2.1` for JWT authentication.

Reason: ARCHITECTURE.md explicitly requires JWT authentication. `tymon/jwt-auth` is the standard Laravel JWT library, compatible with Laravel 11, and avoids session state (stateless API requirement).

Alternatives considered: Laravel Sanctum (token-based but session-optional) — rejected because the architecture doc specifies JWT specifically.

---

## DEC-005 — password stored in password_hash column

Date: 2026-06-16
Task: TASK-004

Decision: The `User` model overrides `getAuthPassword()` to return `password_hash` instead of `password`.

Reason: DATABASE.md defines the column as `password_hash`. Laravel's Authenticatable base class defaults to `password`. Overriding the accessor keeps the schema consistent with the spec without renaming the column.

---

## DEC-006 — Profile response uses { success, data } envelope

Date: 2026-06-16
Task: TASK-005

Decision: `GET /profile` and `PUT /profile` return `{ "success": true, "data": { ... } }`.

Reason: AGENT_RULES.md defines this as the canonical success response shape. The API_SPEC.md profile example omits the envelope, but AGENT_RULES is the authoritative style guide. Consistency across all endpoints reduces frontend error-handling complexity.

---

## DEC-007 — JWT token stored in localStorage

Date: 2026-06-16
Task: TASK-005

Decision: The JWT access token is persisted in `localStorage` under the key `worklife_token`.

Reason: Simplest stateless approach for an MVP that runs inside a Docker container on a controlled network. No additional dependencies needed. AGENT_RULES prohibits "unnecessary state management" — localStorage avoids React Context or a state library.

Alternatives considered: httpOnly cookie (more secure, requires backend Set-Cookie and CSRF handling) — deferred to a future security hardening pass.

---

## DEC-008 — CORS via config/cors.php + HandleCors middleware

Date: 2026-06-16
Task: TASK-005

Decision: Added `config/cors.php` allowing requests from `FRONTEND_URL`, and prepended `HandleCors` middleware in `bootstrap/app.php`.

Reason: Without CORS the browser blocks all cross-origin API calls from the Next.js frontend (`localhost:3000`) to the Laravel backend (`localhost:8000`). The `FRONTEND_URL` env var was already set in `.env`; cors.php reads it so no hardcoded origins exist.

---

## DEC-009 — Design tokens applied via Tailwind config extend

Date: 2026-06-16
Task: TASK-005

Decision: The full color and radius token map from `docs/tokens.md` is applied in `tailwind.config.ts` under `theme.extend`. CSS variables are added to `globals.css`.

Reason: `tokens.md` provides an exact Tailwind extension block. Using it directly means component classes like `bg-primary-600`, `text-error-900`, `border-neutral-border` map precisely to the design system without duplication.

---

## DEC-010 — Flyout submenus for Language and Appearance (avatar dropdown)

Date: 2026-06-19
Task: TASK-005A

Decision: Language and Appearance are implemented as inline flyout submenus that open to the side of the avatar dropdown, replacing the previous full-screen `SettingsModal`.

Key choices:
- Submenus render as `absolute left-full top-0` children of a `relative` row-wrapper `<div>` inside the main menu. The main menu uses `overflow-visible` so absolutely-positioned submenus are not clipped.
- Hover open/close uses a 180 ms close-delay timer (`submenuCloseTimerRef`) so the cursor can travel from the row into the submenu without it closing.
- Pointer type is detected once at mount via `globalThis.matchMedia("(hover: hover) and (pointer: fine)")` and stored in `isFinePointer` ref; hover events are ignored on touch devices.
- Keyboard: Esc closes the submenu first, then the main menu on a second press. Focus is moved to the first item in the submenu when it opens.
- Language values are ISO codes (`en`, `ja`, `vi`, `id`, `ne`, `my`) matching what the backend stores in `preferred_language` — fixing a previous bug where display names were sent instead.
- Optimistic update with rollback: `handleLanguageSave` sets language state immediately, calls `PUT /profile`, and rolls back + shows an inline error string on failure.
- No new dependencies added. All icons are inline SVGs; `MoonIcon` and `MonitorIcon` were added to the existing icon block.

---

## DEC-011 — Soft delete on users table (TASK-006)

Date: 2026-06-22
Task: TASK-006

Decision: Added `deleted_at` column to `users` via a new migration and the `SoftDeletes` trait to the `User` model.

Reason: Preserves user data on account deletion so the account can be restored. The `auth:api` guard and all Eloquent queries automatically exclude soft-deleted rows, so a soft-deleted user cannot log in or appear in GET /profile.

---

## DEC-012 — JWT blacklist uses file cache; storage volume mounted for persistence (TASK-006)

Date: 2026-06-22
Task: TASK-006

Cache driver: **`file`** (`CACHE_STORE=file` in `backend/.env`). tymon/jwt-auth's blacklist storage provider (`Tymon\JWTAuth\Providers\Storage\Illuminate::class`) delegates to Laravel's cache, so the blacklist lives in `storage/framework/cache/data/` inside the container.

**Concrete failure mode without the fix:** `./backend/storage` was not mounted in `docker-compose.yml`. On container restart the file cache was wiped, and any previously-invalidated JWT (from logout or soft-delete) became valid again for the remainder of its TTL.

**Fix applied:** `./backend/storage:/var/www/html/storage` added to the backend volumes in `docker-compose.yml`. The file cache now survives restarts.

**Residual risk (acceptable for MVP):** The file store is still single-instance. A horizontal scale-out (multiple backend containers sharing no filesystem) would require switching to a shared persistent store (Redis, database). Note this before adding a second backend replica.

**Deleted accounts specifically:** Even without a working blacklist, a soft-deleted user cannot authenticate because `SoftDeletes` makes `User::find($id)` return `null`, which the `auth:api` guard treats as unauthenticated. The blacklist is a defence-in-depth measure; soft-delete is the durable gate.

---

## DEC-013 — Password required to restore a soft-deleted account (TASK-006)

Date: 2026-06-22
Task: TASK-006

Decision: POST /auth/restore requires the user's old password and verifies it against `password_hash` before restoring. A mismatch returns a generic 401 that does not reveal whether the email maps to a deleted account.

Reason: The register form is an unauthenticated surface. Without password verification, anyone who knows a deleted email address could hijack the restored account.

---

## DEC-014 — "Start fresh" requires old password; hard-delete is transactional (TASK-006)

Date: 2026-06-22
Task: TASK-006

Decision: `forceFresh: true` also requires `oldPassword` (verified against the soft-deleted account's `password_hash`). The hard-delete and new-account creation are wrapped in `DB::transaction()`.

**Why old password is required:** Without it, any caller who discovers a soft-deleted email and receives the 409 `ACCOUNT_SOFT_DELETED` code can send `forceFresh: true` with any new credentials and permanently destroy all that user's data. Requiring the old password gates destruction to the account owner. Users who forgot their old password cannot start fresh without it (a password-reset flow would be needed — out of scope for MVP).

**Why the transaction:** Prevents partial state where the old account is purged but the new account fails to create (e.g. DB error mid-write).

FK cascade audit (no manual cleanup needed):
- `documents`, `chat_sessions`, `saved_guides` → `CASCADE ON DELETE` (rows deleted)
- `chat_messages` → cascades through `chat_sessions`
- `feedbacks`, `ai_processing_logs` → `NULL ON DELETE` (user_id nulled, rows kept — see DEC-016)

TODO: enforce restore retention window (e.g. purge soft-deleted accounts older than N days via a scheduled job). See AuthController.php for the marked TODOs.

---

## DEC-015 — Settings modal replaces /profile navigation (TASK-006)

Date: 2026-06-22
Task: TASK-006

Decision: The Settings item in the avatar dropdown now opens a `SettingsModal` (Claude-style: left sidebar nav + right detail panel) instead of navigating to `/profile`. The `/profile` route is kept as a secondary entry point and still renders the General panel.

Key choices:
- Focus trap implemented inline (no library) via a `useFocusTrap` hook that intercepts Tab/Shift+Tab inside the dialog element.
- Backdrop click and Esc close the modal, except when a destructive confirmation step is active (`preventClose` flag set by AccountPanel).
- General panel pre-fills from `api.profile.get()` on each modal open. Optimistic save, inline error, success indicator.
- Account panel: logout calls `POST /auth/logout` then `auth.removeToken()` (token removed even if server call fails). Delete account is two-step (warning → confirm), never dismissable mid-flow.
- No new dependencies added (Rule 3).

---

## DEC-016 — Orphaned feedback and log rows after hard delete (TASK-006)

Date: 2026-06-22
Task: TASK-006

Decision: On `forceDelete()` ("start fresh"), `feedbacks` and `ai_processing_logs` rows have their `user_id` set to `NULL` (FK defined as `nullOnDelete()`). The rows are retained, not purged.

**Rationale:** These are analytics/audit rows. With `user_id` nulled they contain no directly identifying data — they are effectively anonymised. Retaining them is standard practice for aggregate metrics.

**GDPR / erasure caveat:** `feedbacks.comment` is a free-text field that *could* contain personal information typed by the user. If the product makes an explicit "all personal data permanently deleted" promise, feedback comment text should also be cleared on hard delete. This is not implemented in the MVP; add a `$user->feedbacks()->update(['comment' => null])` step before `forceDelete()` if erasure compliance is required.
