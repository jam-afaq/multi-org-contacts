# Multi-Organization Contacts and Notes Application

## Overview
This is a Laravel + Inertia.js + React TypeScript application for managing contacts and notes across multiple organizations. Users can create and switch between organizations, manage contacts (CRUD + duplicate), upload avatars, and attach free-text notes. All data is strictly scoped to the current organization. The UI is minimal, black-and-white only, using Tailwind CSS and shadcn/ui components.

## Login Credentials
- After seeding the database, you can log in with the following test accounts:
- Admin Account:
- Email: admin@gmail.com
- Password: 12345678
- Permissions: Full access to all features including organization management

- Member Account:
- Email: member@gmail.com
- Password: 12345678
- Permissions: Limited to viewing contacts only

- Access: Open your browser and navigate to http://localhost:8000 to access the application.

---

## Features
- Authentication via Laravel Breeze (Inertia + TS)
- Multi-organization support with roles (Admin/Member) using spatie/laravel-permission
- Contacts CRUD with duplicate prevention and avatar upload
- Notes CRUD per contact
- Custom fields (up to 5 key/value pairs) per contact
- Organization switcher persisting selection in session
- Strict organization scoping for all queries
- GET `/healthz` returns `{ "ok": true }`

---

## Setup

### Requirements
- PHP 8.2
- Composer 2.x
- Node.js 20.x
- SQLite (default) or MySQL (optional)
- npm

### Installation
```bash
git clone https://github.com/jam-afaq/multi-org-contacts.git
cd multi-org-contacts

composer install
npm install
php artisan migrate --seed
php artisan storage:link
php artisan serve
npm run dev
