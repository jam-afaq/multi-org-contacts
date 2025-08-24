# AI_NOTES.md

## Overview
This document records the use of AI tools (GPT-5 and Cursor) during the development of the Multi-Organization Contacts and Notes Application. It details prompts, key outputs, and decisions about what was accepted or rejected.

---

## AI Tools Used
- **GPT-5**: For planning, scaffolding, and code generation suggestions.
- **Cursor**: Assisted with React + Inertia.js component wiring, Form Requests, and Tailwind/shadcn UI integration.

---

## Planning Prompts

**Prompt 1 (GPT-5):**  
*"Design a multi-organization contact management system in Laravel + Inertia.js + React TypeScript with strict org scoping and duplicate email handling. Include models, relationships, and UI outline in a concise plan."*

**Key Output Accepted:**
- Data model structure
- Scoping pattern: `CurrentOrganization` service, middleware, `BelongsToOrganization` trait
- Duplicate email flow with HTTP 422 payload
- Role-based permissions (Admin/Member)

**Rejected:**
- Generic UI mockups with colors (not black-and-white)
- Complex or non-minimalist component layouts

---

**Prompt 2 (Cursor):**  
*"Provide a React TS Inertia form template using Tailwind CSS and shadcn/ui components for creating/editing contacts with avatar upload and custom fields."*

**Key Output Accepted:**
- Form structure using shadcn/ui `<Input />`, `<Button />`, `<Form />` components
- File upload handling for avatar
- Dynamic handling for 5 custom fields
- Validation error display

**Rejected:**
- Pre-built color themes
- UI logic for multi-org selection (handled server-side)

---

## Implementation Prompts

**Prompt 3 (GPT-5):**  
*"Generate Laravel FormRequest for Contact creation with validation: first_name, last_name required, email unique per organization (case-insensitive), phone optional, avatar optional."*

**Key Output Accepted:**
- FormRequest class with rules and messages
- Duplicate email detection via custom validation returning 422

**Rejected:**
- Validation using global DB unique without org scoping
- Email uniqueness logic without case-insensitive check

---

**Prompt 4 (GPT-5):**  
*"Provide Laravel service and policy methods for Contact CRUD operations, strictly scoped by current organization using BelongsToOrganization trait."*

**Key Output Accepted:**
- Scoped queries via global scope
- Policies enforcing Admin/Member roles
- Methods for duplicate detection, avatar upload, and notes/meta handling

**Rejected:**
- Methods violating cross-org isolation
- Overly complex architecture beyond small controllers and services

---

## Tradeoffs & Decisions
- Backend-first approach: scoping and duplicate prevention implemented before wiring frontend
- Minimalist UI strictly black-and-white; rejected colorful components
- Used AI-generated scaffolds but manually adjusted to meet exact requirements (scoping, 422 payload, Tailwind + shadcn only)

---

## Summary
AI tools were primarily used for:
- Planning (data models, relationships, routes)
- Generating Form Requests and service classes
- Scaffolding React TS + Inertia components
- Tailwind/shadcn component wiring

All outputs were reviewed and adjusted to strictly follow instructions and black-and-white design requirements.
