# AI-Powered Application

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
