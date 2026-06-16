# PROJECT_OVERVIEW.md

# WorkLife AI

AI-powered onboarding and life support platform for foreign workers in Japan.

---

# Vision

WorkLife AI helps foreign workers successfully live and work in Japan by simplifying administrative procedures, explaining official documents, and providing workplace guidance in their native language.

The platform aims to reduce information barriers, language barriers, and cultural barriers faced by foreign workers.

---

# Problem Statement

Japan is facing:

* Aging population
* Labor shortages
* Increasing dependence on foreign workers

Many foreign workers struggle with:

* Understanding government documents
* Navigating administrative procedures
* Understanding workplace rules
* Adapting to Japanese work culture

Most rely on:

* Facebook groups
* Friends
* Agencies
* Informal communities

Information is often incomplete, outdated, or inaccurate.

---

# Solution

WorkLife AI provides:

1. AI Document Explainer
2. Procedure Navigator
3. Workplace Guide
4. Multilingual Support
5. Curated Knowledge Base

The system combines AI and Retrieval-Augmented Generation (RAG) to deliver accurate and understandable guidance.

---

# Target Users

Primary Users:

* Myanmar Workers
* Vietnamese Workers
* Indonesian Workers
* Nepali Workers

Working in Japan under:

* Specified Skilled Worker (SSW)
* Technical Intern Training Program (TITP)
* Employment Visa

---

# MVP Scope

## Feature 1: User Authentication

* Register with email and password
* Login and logout
* JWT-based session management

---

## Feature 2: User Profile

* Full Name, Nationality, Preferred Language, Occupation, Prefecture
* Used for AI personalization

---

## Feature 3: AI Document Explainer

Users upload:

* Tax notices
* Insurance documents
* Employment documents
* City hall letters

AI returns:

* Document type
* Summary
* Important dates
* Required actions

---

## Feature 4: Procedure Navigator

Users ask:

* How to change address
* How to register health insurance
* How to pay resident tax

AI provides step-by-step guidance.

---

## Feature 5: Workplace Guide

Explains:

* Workplace terminology
* Japanese business culture
* Safety instructions
* Common company policies

---

## Feature 6: AI Chat

* General worker assistance
* Context retained within session
* RAG-enabled responses

---

## Feature 7: Guide Bookmarking

* Save and remove useful guides
* View saved guides list

---

## Feature 8: Feedback Collection

* 1–5 rating on AI responses
* Optional comment

---

# Business Value

Benefits for Workers:

* Faster integration
* Better understanding
* Reduced confusion

Benefits for Employers:

* Lower onboarding costs
* Fewer support requests
* Faster workforce adaptation

Benefits for Society:

* Better foreign worker retention
* Improved workforce productivity
* Reduced administrative burden

---

# Technology Stack

Frontend:

* Next.js

Backend:

* Laravel

Database:

* PostgreSQL

Vector Search:

* pgvector

Storage:

* Supabase Storage

AI:

* OpenAI API

Deployment:

* Vercel
* Railway

---

# Success Metrics

MVP Success Indicators:

* User can understand uploaded document
* User can complete administrative procedures
* User can understand workplace terminology
* Response time under 10 seconds
* High user satisfaction

---

# Future Roadmap

Phase 2:

* Employer Portal
* Company Onboarding

Phase 3:

* Voice Assistant
* Mobile Application

Phase 4:

* Community Platform

Phase 5:

* Knowledge Transfer AI

WorkLife AI evolves from a worker support platform into a workforce knowledge platform for Japan.
