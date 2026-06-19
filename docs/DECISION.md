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

## DEC-009 — Design tokens applied via Tailwind config extend

Date: 2026-06-16
Task: TASK-005

Decision: The full color and radius token map from `docs/tokens.md` is applied in `tailwind.config.ts` under `theme.extend`. CSS variables are added to `globals.css`.

Reason: `tokens.md` provides an exact Tailwind extension block. Using it directly means component classes like `bg-primary-600`, `text-error-900`, `border-neutral-border` map precisely to the design system without duplication.
