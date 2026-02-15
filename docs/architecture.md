# Architecture Guide

This document explains how the Coaching Center App is structured across frontend and backend.

## 1) High-Level System

- Frontend (`clinte`): React + Vite SPA
- Backend (`server`): Express REST API
- Database: MongoDB via Mongoose
- Auth: JWT with role-based authorization

```text
Browser (React) -> Axios -> Express API -> Controllers/Services -> MongoDB
```

## 2) Monorepo Layout

```text
coaching-center-app/
  clinte/
    src/
      app/            # app bootstrap + route configuration
      guards/         # RequireAuth and RoleGuard
      layouts/        # Public/Auth/Main/Admin layouts
      pages/          # route-level pages
      providers/      # AuthProvider (session state)
      services/       # API clients
      shared/         # navbar, profile menu, footer
  server/
    src/
      config/         # DB setup
      routes/         # route modules
      controllers/    # HTTP handlers
      services/       # business logic
      middlewares/    # auth/authorize/error
      models/         # MongoDB schemas
```

## 3) Backend Layering

```text
Route -> Middleware -> Controller -> Service -> Model -> MongoDB
```

- Route: endpoint path and middleware chain
- Middleware:
  - `auth.middleware.js`: verifies JWT and loads `req.user`
  - `authorize.middleware.js`: checks required roles
  - `error.middleware.js`: centralized error response
- Controller: request parsing and response shaping
- Service: domain logic and persistence orchestration
- Model: schema, hooks, relations

## 4) Frontend Layering

```text
Router -> Guard -> Layout -> Page -> Service -> Axios -> API
```

- Router (`src/app/router.jsx`): URL-to-page mapping
- Guards:
  - `RequireAuth`: blocks unauthenticated users
  - `RoleGuard`: blocks role mismatch
- Provider:
  - `AuthProvider`: stores user state and exposes `login/logout/refreshUser`
- Services:
  - route-specific API wrappers (`auth`, `admin`, `teacherRequest`)

## 5) Authentication + Authorization Design

### Authentication

1. Register (`/api/auth/register`)
2. Login (`/api/auth/login`) returns `token + user`
3. Token stored in `localStorage`
4. Axios interceptor adds `Authorization: Bearer <token>`
5. Backend validates JWT and resolves current user

### Authorization

- Backend checks role for protected APIs using `authorize(...)`
- Frontend checks role for protected views using `RoleGuard`
- Backend remains source of truth

## 6) Domain Modules

### Auth

- Register, login, current user profile
- Users are created as `student` by default

### Admin

- User management (list, update role, block/unblock, delete)
- Dashboard stats and revenue analytics

### Teacher Request

- Student submits teacher-role request
- Admin reviews (approve/reject)
- Approved request upgrades user role to `teacher`

### Courses + Enrollments

- Courses CRUD (admin-controlled in current routing)
- Students enroll in courses
- Enrollment status updates by admin/teacher per backend rules

## 7) Current Frontend Route Design

- Public: `/`, `/auth/login`, `/auth/register`
- Authenticated: `/dashboard`, `/profile`
- Student-only: `/teacher-request`
- Teacher/Admin: `/teacher`
- Admin-only: `/admin`, `/admin/teacher-requests`

## 8) Data Flow Examples

### Login flow

`Login page -> auth.service.loginUser -> /api/auth/login -> token/user -> AuthProvider.login`

### Teacher request flow

`Student page -> /api/teacher-requests -> admin review page -> /api/teacher-requests/:id/review -> role update`

### Admin dashboard flow

`Admin page -> admin.service (dashboard + revenue + users) -> metrics cards/tables`

## 9) Security Notes

- JWT auth is enforced server-side on protected routes
- Role checks are enforced server-side and mirrored in UI guards
- Blocked users are denied by auth middleware
- Debug logging of sensitive env values should be removed in production

## 10) Recommended Next Architecture Improvements

1. Add request validation middleware (Zod/Joi/express-validator)
2. Add structured logging and remove sensitive console logs
3. Add API versioning strategy if public integrations are planned
4. Add automated integration tests for auth and role lifecycle
5. Introduce domain-level DTO/mapper layer for stable API responses
