# Foreign Worker Integration Platform AI-Powered Application

A full-stack application with semantic search and AI capabilities.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend API | Laravel 11 |
| Database | PostgreSQL 16 |
| Vector Search | pgvector |
| AI | OpenAI API |
| Storage | Supabase Storage |

## Project Structure

```
project/
├── frontend/          # Next.js application
├── backend/           # Laravel API
├── docker/            # Docker configs
└── docker-compose.yml
```

## Data Flow

```
Next.js  ──HTTP──►  Laravel API  ──►  PostgreSQL + pgvector
                         │
                         ├──►  OpenAI API (embeddings + chat)
                         └──►  Supabase Storage (files)
```

# Design System

A design and color system built for trust, clarity, calm, and accessibility. The platform serves people navigating an unfamiliar country, language, and bureaucracy — often on mobile, sometimes under stress, sometimes with limited digital literacy. Every design decision prioritizes legibility and dependability over trend.

## Documents

| File | Contents |
|------|----------|
| `README.md` | This overview and design principles |
| `colors.md` | Full color palette — brand, semantic, neutrals with hex values |
| `typography.md` | Typeface, scale, and multilingual guidance |
| `components.md` | Component patterns, spacing, and touch targets |
| `accessibility.md` | Contrast, color-blindness, and inclusive design rules |
| `tokens.md` | CSS variables and Tailwind config to drop into the frontend |

## Design principles

1. **Trust first.** Users decide whether to hand over sensitive immigration and employment data. The interface reads as institutional and dependable, never playful or experimental.

2. **Clarity over density.** Generous whitespace, large touch targets, and one clear action per screen. Avoid desktop-style dense layouts.

3. **Status carries weight.** A warning about an expiring visa can have serious consequences. Status colors are load-bearing, never decorative, and always paired with an icon and text label.

4. **Accessible by default.** WCAG AA minimum (4.5:1 body text, 3:1 large text and UI components). Never rely on color alone to convey meaning.

5. **Multilingual-ready.** Typography and spacing accommodate Latin, Vietnamese diacritics, Cyrillic, and CJK scripts without breaking layouts.

6. **Mobile-first.** Many users are on phones with imprecise input. Minimum 44×44px touch targets and a layout that works at small widths.

## Color philosophy at a glance

The system pairs a **Trust Blue** primary with a **Growth Teal** secondary, kept distinct in meaning:

- **Blue** = navigate and act (navigation, primary buttons, links). Universally associated with government, banking, and official documents.
- **Teal** = progress and welcome (completed steps, progress bars, supportive accents). Signals forward motion and a warm reception.

Semantic colors (success, warning, error, info) handle status communication, and a warm gray neutral ramp carries text and surfaces. See `colors.md` for the full specification.


## Getting Started

1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

2. Fill in your OpenAI, Supabase, and database credentials.

3. Start services:
   ```bash
   docker compose up -d
   ```

4. Run Laravel setup:
   ```bash
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan migrate
   ```

5. Frontend runs on `http://localhost:3000`, API on `http://localhost:8000`.
