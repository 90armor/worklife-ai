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
DONE — F001 verified 2026-06-26. Two defects found and fixed: race condition in register() (QueryException on simultaneous identical-email requests now returns 422 instead of 500) and GoogleAuthController soft-delete blind spot (soft-deleted email + Google OAuth now redirects to /register?error=account_deleted instead of 500). JWT blacklist_enabled confirmed true. UX gap closed 2026-06-26: register/page.tsx error useState now handles "account_deleted" param with a clear message prompting restore-or-fresh-start, alongside the existing "google_auth_failed" branch. See commit history.

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
DONE — F002 verified 2026-06-26. All 5 fields (fullName, nationality, preferredLanguage, occupation, prefecture) accepted, mapped, and returned. Patch semantics confirmed. Email not editable. formatUser() complete.

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
* Start fresh (hard delete + recreate) → when the user explicitly chooses a new account, hard-delete the old soft-deleted user and all their data, then create the new account. This is where dependents matter: report the FK cascade situation first; if FKs cascade on delete, forceDelete() on the user suffices — otherwise delete dependents (documents, chat_sessions → chat_messages → feedbacks, saved_guides, ai_processing_logs, etc.) inside a DB transaction before force-deleting the user, so nothing is orphaned. Then proceed with the normal registration create. Gate this behind the same email+password? Yes — require the old password and verify it against the soft-deleted account's password_hash (see DEC-014). Without this check any caller who learns the 409 code can permanently destroy another user's data without credentials. Users who have forgotten their old password cannot start fresh without it (a password-reset flow is out of MVP scope). Require the old password on the backend AND explicit frontend confirmation so it is not a silent data-loss path.


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

## TASK-007

Laravel backend endpoints:
Add the following endpoints. Place the password/Google routes inside the existing Route::middleware('auth:api')->group(...) block in routes/api.php (under the v1 prefix), since they act on the authenticated user. Note the current routes/api.php in the project only shows register, login, profile GET/PUT — but the frontend api.ts already calls /auth/logout, /auth/restore, and DELETE /account. Reconcile this: locate where those existing routes are actually defined and add the new ones consistently; do not duplicate routes.
1. Set password (for Google-only users) — POST /v1/account/password

Add a method setPassword to a controller (extend AuthController or a new AccountController, matching wherever account-delete already lives).

* Authenticated route.
* Validate: password required, string, min 8, confirmed (so a password_confirmation field is required).
* Behavior: if $user->password_hash is already set, reject with 409 / a clear "Password already set" message (this endpoint is only for adding a password where none exists; a separate change-password flow can come later). Otherwise $user->update(['password_hash' => Hash::make($validated['password'])]).
* Return { success: true }.

2. Connect Google — handled by the existing GoogleAuthController OAuth redirect/callback flow, which already links a Google account to an existing email/password user on first sign-in (the firstOrCreate + "link Google" logic). For the "Connect your Google account" button in Sign-in methods, the frontend should just initiate that existing OAuth redirect (e.g. navigate to the Google auth redirect route). Confirm the route name for GoogleAuthController@redirect and expose it; do not build a parallel connect endpoint.
3. Disconnect Google (optional but recommended for parity) — DELETE /v1/account/google

* Authenticated route.
* Guard: refuse to unlink Google if the user has no password_hash (otherwise they'd lock themselves out). Return 409 with a message telling them to set a password first.
* Otherwise $user->update(['google_id' => null, 'avatar_url' => null]), return { success: true }.

Frontend api.ts additions to match:
tsaccount: {
  delete: () => authedRequest(...),                    // existing
  setPassword: (password: string, passwordConfirmation: string) =>
    authedRequest<{ success: boolean }>("/account/password", {
      method: "POST",
      body: JSON.stringify({ password, password_confirmation: passwordConfirmation }),
    }),
  disconnectGoogle: () =>
    authedRequest<{ success: boolean }>("/account/google", { method: "DELETE" }),
},
And expose the Google OAuth redirect URL (full backend URL, not the /api/v1 prefix if the OAuth routes live on the web/non-API router — verify which router GoogleAuthController is registered on before wiring the connect button).
Validation & consistency requirements:

* Match the existing controllers' style: $request->validate([...]), JSON responses shaped like { success: bool, ... }, UUID handling, Hash::make / Hash::check.
* Use the camelCase ⇄ snake_case mapping convention already in ProfileController (request keys camelCase, DB columns snake_case).
* After adding password support, ensure formatUser() exposes hasPassword so the UI reflects the new state immediately after the call returns.

Verify with php artisan route:list (or by reading the route files) that all new routes resolve under the auth:api middleware before finishing.

When done.

Diff of every changed file (frontend + backend).
Confirm: types check, lint passes, no console warnings.

----

## TASK-007A

The backend endpoints and api.ts changes are done and correct, but you did not make any of the UI changes. The original task was the Account section redesign in SettingsModal.tsx — that's still required and is the main deliverable. Build it now, using the endpoints and types you already added (Profile.hasPassword, api.account.setPassword, api.account.disconnectGoogle, googleOAuthRedirectUrl). Do not touch the backend again.
Restructure the AccountPanel component in SettingsModal.tsx into three sub-sections, each with its own sub-title heading styled like the existing <h2 className="text-base font-semibold text-heading mb-5"> (use a slightly smaller treatment for sub-titles within the panel so the three read as sections under one panel — match existing tokens, don't introduce new ones):
Section 1 — Account

- Full name: read-only label/value row from api.profile.get(). Not an input.
- Email: read-only label/value row. Add a disabled "Update email" affordance marked as a coming-soon/next feature — render it but don't wire a flow.
- Logout: keep the existing logout button and useLogout() behavior exactly as-is.
- Delete account: keep the existing delete flow and onPreventClose confirmation pattern. Show this description text as sub-tile row: "Delete your account and associated data from the WorkLife AI platform. You can restore your account using the same email and password."

Section 2 — Security and login

- A "Login with password" action, shown only when profile.hasPassword === false (Google-only users). Button reveals a form with password + confirm-password fields, calls api.account.setPassword(password, passwordConfirmation). On success, refresh the profile so hasPassword flips to true and this section updates. Handle the 409 "password already set" case with a clear error message.

Section 3 — Sign-in methods

- Email and password row with sub-title "Enable login with email". Show connected/enabled state driven by profile.hasPassword.
- Google row:

* If not connected: show "Connect your Google account" with a button that navigates to googleOAuthRedirectUrl via window.location.href.
* If connected (signed in with Google): show the Gmail address as the sub-title. (Confirm formatUser() returns the Google email / connection state — if it doesn't yet, that's the one backend gap you may close; check before assuming.)


Preserve all existing behavior: focus trap, the onPreventClose pattern during destructive confirmations, mobile tab layout, loading skeletons, and error/success styling. Only restructure AccountPanel and add the new section UI — the rest of the modal stays unchanged.
When done, report the actual diff of SettingsModal.tsx so the UI changes are verifiable.

----

## TASK-008

Status: DONE

CONTEXT
You are working on WorkLife AI — a platform for foreign workers in Japan.
Stack: Next.js + TypeScript + Tailwind (frontend); Laravel + PostgreSQL (backend).
The `@/` import alias maps to the frontend source root (confirm from tsconfig.json).
Users have profile fields: fullName, email (read-only), nationality, preferredLanguage,
occupation, prefecture. These are stored as nullable strings on the `users` table
(columns: nationality, preferred_language, occupation, prefecture).

Before coding, read: PROJECT_OVERVIEW.md, ARCHITECTURE.md, DATABASE.md, FEATURES.md,
CURRENT_TASK.md, AGENT_RULES.md. Obey AGENT_RULES strictly: prioritize MVP over
perfection, keep solutions simple and readable, NO unnecessary dependencies, NO
business logic in controllers, request validation required, no hardcoded values in
controllers, follow existing architecture, update relevant docs when shapes change.

GOAL
Centralize hardcoded values into constant modules, convert selected profile fields
into dropdowns, and add matching backend validation. i18n is IN SCOPE for this task
(see Part 6). Do NOT add build tooling, code generators, or new packages.

────────────────────────────────────────
DUPLICATION STRATEGY (read first — applies to Parts 1, 4, 6)
────────────────────────────────────────
Because frontend is TypeScript and backend is PHP, the list of allowed `value` keys
must exist in BOTH. We use MANUAL DUPLICATION with these rules:

  1. BACKEND IS THE SOURCE OF TRUTH for the set of allowed `value` keys.
     The frontend must only ever submit `value` keys that the backend accepts.
  2. Only the `value` keys are duplicated across frontend/backend. Display LABELS
     and all translation text live ONLY in the frontend (Part 6) and are NOT
     duplicated to the backend.
  3. At the top of EACH duplicated file (frontend options file AND backend options
     file), add a sync-warning comment that names the other file's path, e.g.:
       // ⚠️ The `value` keys here are duplicated in <other/file/path>.
       // Backend is the source of truth. Keep both lists of keys in sync.
  4. Keys are stable, lowercase identifiers (e.g. "vietnamese", "tokyo",
     "caregiver"). Never change a key once data is stored against it; change labels
     instead.

────────────────────────────────────────
PART 1 — FRONTEND CONSTANTS (value/label)
────────────────────────────────────────
Create `lib/constants/` under the frontend source root.

1a. `lib/constants/profileOptions.ts`
   - Add the sync-warning comment (see strategy rule 3) pointing to the backend file
     from Part 4a.
   - Define: export interface SelectOption { value: string; label: string; }
   - Define readonly arrays (label = default English display text; value = stable key):
       NATIONALITY_OPTIONS — common nationalities of foreign workers in Japan:
         Vietnamese, Chinese, Filipino, Nepali, Indonesian, Myanmar, Korean, Thai,
         Cambodian, Brazilian, Indian, Bangladeshi, Sri Lankan, Mongolian, American,
         British, then { value: "other", label: "Other" }.
       LANGUAGE_OPTIONS — preferred languages: English, Japanese, Vietnamese, Chinese,
         Tagalog, Nepali, Indonesian, Burmese, Korean, Thai, Khmer, Portuguese, Hindi,
         Bengali, Other.
       OCCUPATION_OPTIONS — relevant to this audience: Caregiver / Nursing Care,
         Manufacturing, Construction, Agriculture, Food Service, Hospitality,
         IT / Engineering, Logistics, Retail, Cleaning, Education / Language Teaching,
         Healthcare, Office / Administration, Student, Other.
       PREFECTURE_OPTIONS — all 47 Japanese prefectures. value = romaji lowercase
         (e.g. "tokyo","osaka","hokkaido"); label = English name.
   - Use `as const` where helpful; export arrays + the SelectOption type.

1b. `lib/constants/messages.ts`
   - Relocate user-facing UI strings currently hardcoded in components, especially
     SettingsModal.tsx ("Could not load profile. Please try again.", "Failed to save
     profile. Please try again.", "Profile saved.", and the Account panel literals)
     and other repeated literals found in the sweep (Part 5).
   - Group as a typed nested const object (MESSAGES.profile.loadError, etc.).
   - Do NOT change wording — only relocate. (These become i18n keys in Part 6;
     structure them so that's a clean follow-up, but DO NOT translate them now beyond
     what Part 6 specifies.)

LEGACY DATA FALLBACK: existing profiles store free-text. When loading a profile whose
stored string doesn't match any option `value`, fall back gracefully (render the
stored string as the selected value / show it without crashing) so no data is lost.
Keep this simple.

────────────────────────────────────────
PART 2 — SETTINGSMODAL DROPDOWNS
────────────────────────────────────────
In SettingsModal.tsx General panel, render Nationality, Preferred Language, Occupation,
and Prefecture as <select> dropdowns sourced from Part 1 constants. Full name stays a
text input; Email stays read-only.
   - Extend GENERAL_FIELDS so each field declares type: "text" | "select" and, for
     selects, options: SelectOption[].
   - In the render loop, branch on type. For selects: reuse the existing `inputClass`
     styling (h-11, rounded-md, border, focus ring) so they match the inputs; add
     `appearance-none` + a chevron icon on the right (custom-dropdown look like
     Claude's "What best describes your work?"); include a disabled placeholder
     <option value="">…</option> shown when value is empty (placeholder text via i18n,
     Part 6).
   - Preserve all behavior: value↔form[key], onChange→set(key,value), loading
     skeletons, error/success messages (now from messages.ts via i18n), Save button,
     label htmlFor associations, accessibility. Do not touch Account panel logic, the
     focus trap, or the modal shell beyond swapping in message constants.

────────────────────────────────────────
PART 3 — "OTHER" FREE-TEXT FALLBACK
────────────────────────────────────────
For Nationality and Occupation only: when "other" is selected, reveal an adjacent text
input so the user can type a value not in the list; store the trimmed typed value as
the field value on submit. Match existing field styling. Preferred Language and
Prefecture need no free-text.

────────────────────────────────────────
PART 4 — BACKEND VALIDATION (Laravel)
────────────────────────────────────────
4a. Create a backend single-source-of-truth for allowed `value` keys, e.g.
    `config/profile_options.php` (preferred) or `app/Constants/ProfileOptions.php`.
    - Add the sync-warning comment pointing to lib/constants/profileOptions.ts.
    - List allowed keys for nationality, preferredLanguage, occupation, prefecture —
      matching the frontend `value`s EXACTLY. Do NOT inline these in the controller
      (AGENT_RULES forbids hardcoded values in controllers).

4b. Update ProfileController@update validation (currently plain string|max). Add
    Rule::in(...) referencing the keys from 4a for nationality, preferredLanguage, and
    prefecture. For occupation (free-text "other" allowed): accept either an allowed
    key OR a free string within max length — implement pragmatically and document with
    a comment. Preserve existing nullable/sometimes behavior and the snake_case column
    mapping. If a profile service layer already exists, route through it; otherwise
    keep the change to validation only (note this tradeoff in your summary rather than
    introducing a new layer for this small task).

────────────────────────────────────────
PART 5 — REPO-WIDE SWEEP
────────────────────────────────────────
Scan for other clearly-beneficial hardcoded literals to centralize (repeated API
success/error messages, the localStorage token key "worklife_token" in auth.ts,
repeated status strings, etc.) and relocate the safe ones into appropriate constant
modules. Do NOT over-engineer: leave genuinely local one-off strings and JSX copy
where centralization only adds indirection. List what you changed and what you left.

────────────────────────────────────────
PART 6 — i18n (using next-intl)
────────────────────────────────────────
Add internationalization using the `next-intl` library. First check package.json: if
next-intl (or another i18n library) is already installed, use that instead of adding a
new one. If none is present, add `next-intl` — this is a justified dependency for a
Next.js app needing i18n, consistent with AGENT_RULES (justify before adding). Install
it and follow its official App Router setup.

   6a. Supported locales: "en" (default/fallback) and "ja". Structure so adding more
       (e.g. "vi","my") later is a matter of adding a message file. Confirm whether the
       app uses the App Router or Pages Router from next_config.js / the project layout,
       and wire next-intl accordingly (App Router: i18n routing or the
       NextIntlClientProvider + request config per next-intl docs).

   6b. Create per-locale message files (e.g. `messages/en.json`, `messages/ja.json`, or
       the structure next-intl expects). Cover:
         - The MESSAGES strings relocated in Part 1b (profile load/save errors, save
           success, Account panel literals).
         - The General panel field labels and the dropdown placeholder text.
         - The option LABELS for NATIONALITY_OPTIONS, LANGUAGE_OPTIONS,
           OCCUPATION_OPTIONS, and PREFECTURE_OPTIONS.
       Use a clear key namespace (e.g. settings.fields.*, settings.messages.*,
       options.nationality.*, options.prefecture.*). Provide Japanese translations for
       the field labels, messages, and prefecture/occupation labels; for any string you
       cannot translate confidently, fall back to the English value and add a
       // TODO: translate marker rather than guessing.

   6c. KEYS vs LABELS: option `value` keys remain in lib/constants/profileOptions.ts and
       stay constant and untranslated. The translated text lives ONLY in the next-intl
       message files, keyed by the option's `value` (e.g. options.prefecture.tokyo).
       In SettingsModal, resolve each option's display label at render time via the
       next-intl translator using its `value` key. This means profileOptions.ts can
       hold the `value` keys (and optionally an English label as a safety fallback),
       while the canonical display text comes from next-intl.

   6d. Use next-intl's hooks (e.g. useTranslations) in SettingsModal to render all
       labels, messages, placeholder, and option labels. Do NOT hardcode display
       strings in the component anymore.

   6e. Locale selection: default to "en". Set up the provider/config so a locale is
       available app-wide, but DO NOT build a language-switcher UI in this task — note
       it as a follow-up. If next-intl's chosen setup requires a locale source (cookie,
       route segment, or header), pick the simplest one that fits the existing routing
       and document the choice.

   IMPORTANT: i18n affects DISPLAY ONLY. The backend continues to receive and validate
   the stable `value` keys from Part 4. Never send translated labels to the API.

   DOC NOTE: since this adds a dependency and a provider to the app structure, update
   ARCHITECTURE.md (frontend responsibilities / i18n) and note the next-intl setup in
   README.md if a setup section exists.

────────────────────────────────────────
DELIVERABLES
────────────────────────────────────────
- New files: lib/constants/profileOptions.ts, lib/constants/messages.ts,
  lib/i18n/* (or use existing i18n lib), backend config/profile_options.php (or
  app/Constants/ProfileOptions.php).
- Updated: SettingsModal.tsx, api.ts (if Profile/ProfileInput typing needs touching),
  ProfileController.php, auth.ts and any swept files.
- Sync-warning comments present in both duplicated option files.
- Update API_SPEC.md and DATABASE.md if accepted values / field semantics change;
  update CURRENT_TASK.md per AGENT_RULES.
- Must type-check and lint with no warnings.
- End with a SUMMARY: files created/changed; the value/label decisions; how duplication
  is kept in sync (backend = source of truth); the legacy-data fallback approach; i18n
  approach and locales covered; and anything intentionally left as follow-up (e.g.
  language-switcher UI, additional locales).

## TASK-008B

Title: Profile settings — auto-save, backend nationality fix, i18n keys

Status: DONE

Parts:
A. Fixed nationality validation in ProfileController: changed Rule::in() to
   'sometimes|nullable|string|max:100' so custom free-text (from the "other" flow)
   is accepted. Updated profile_options.php comment to reflect this.

B. Verified i18n wiring:
   - Root layout wraps children with NextIntlClientProvider + getMessages() ✓
   - messages path in src/i18n/request.ts (../../messages/${locale}.json) resolves
     correctly to frontend/messages/ ✓

C. Redesigned GeneralPanel (SettingsModal.tsx):
   - Removed manual Save button and global success/error banners
   - Auto-save: selects save immediately on change; text inputs debounce 700ms
     and save on blur
   - Per-field FieldStatus: "idle"|"saving"|"saved"|"error"
   - "saved" badge auto-clears to idle after 2.5 s
   - savedValues ref tracks last persisted value — skips unchanged fields
   - Premium layout: subtitle under heading, email read-only card row,
     label+status badge row above each input, aria-live="polite" on badges
   - CheckIcon for "saved" state

D. i18n — added to both en.json and ja.json:
   - settings.generalSubtitle
   - settings.messages.fieldSaved
   - settings.messages.fieldError

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