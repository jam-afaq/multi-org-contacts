# TESTS.md

## Overview
This document explains how to run the minimum required tests for the Multi-Organization Contacts and Notes Application.

Two main test classes are included:
1. `ContactServiceTest` – validates contact creation, duplicate prevention, avatar uploads, and notes/custom fields handling.
2. `OrganizationServiceTest` – validates organization creation, switching, and role enforcement.

---

## Running Tests

### Using PHPUnit
```bash
php artisan test
