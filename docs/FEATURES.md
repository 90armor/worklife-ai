# FEATURES.md

# Feature Requirements

## MVP Scope

### F001 - User Authentication

#### Description

Allow users to register and log in.

#### Acceptance Criteria

* User can register with email and password
* User can log in
* User can log out
* JWT authentication supported

---

### F002 - User Profile

#### Description

Store worker profile information.

#### Fields

* Full Name
* Nationality
* Preferred Language
* Occupation
* Prefecture

#### Acceptance Criteria

* User can update profile
* Profile used for AI personalization

---

### F003 - AI Document Explainer

#### Description

Explain uploaded Japanese documents.

#### Supported Formats

* PDF
* JPG
* PNG

#### Workflow

Upload File
→ OCR
→ Classification
→ AI Summary
→ User-Friendly Explanation

#### Acceptance Criteria

System returns:

* Document Type
* Summary
* Important Dates
* Required Actions

---

### F004 - Procedure Navigator

#### Description

Provide step-by-step administrative guidance.

#### Examples

* Address Change
* Resident Tax
* Health Insurance
* Pension

#### Acceptance Criteria

* Response generated using RAG
* Steps clearly structured
* Source information available

---

### F005 - Workplace Guide

#### Description

Explain Japanese workplace terminology and culture.

#### Examples

* 報連相
* Overtime Rules
* Safety Instructions

#### Acceptance Criteria

* Cultural context included
* User language supported

---

### F006 - AI Chat

#### Description

General worker assistance chat.

#### Acceptance Criteria

* Chat history maintained
* Context retained within session
* RAG-enabled responses

---

### F007 - Guide Bookmarking

#### Description

Save useful guides.

#### Acceptance Criteria

* Save guide
* Remove guide
* View saved guides

---

### F008 - Feedback Collection

#### Description

Collect user ratings.

#### Acceptance Criteria

* 1-5 rating
* Optional comment

---

# Future Features

## Employer Portal

* Company Dashboard
* Worker Management
* Training Assignment

## Voice Assistant

* Speech-to-Text
* Text-to-Speech

## Community Support

* Q&A
* Community Guides

## Knowledge Transfer AI

* Expert Interview Capture
* SOP Generation
* Multilingual Training
