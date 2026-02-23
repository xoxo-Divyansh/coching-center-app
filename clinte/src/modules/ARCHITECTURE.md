# Frontend Module Contract

This project follows domain-based modules. The `src/modules` directory is the
single source of truth for product screens.

## Folder Rules

1. Every business domain owns its route screens inside:
   - `src/modules/<domain>/pages`
2. Router imports only from module pages.
3. Legacy `src/pages/*` and `src/features/*` have been removed in Phase 3.
   - Do not recreate these folders.
4. Shared API calls live only in `src/services/*`.
   - Components should never call `fetch`/`axios` directly.
5. Shared cross-module UI lives in:
   - `src/shared/*`
   - `src/ui/*` (atomic reusable components)

## Module List

- `auth`
- `admin`
- `batch`
- `teacher`
- `student`
- `course`
- `attendance`
- `public`

## Phase 3 Purity State

- `src/pages/**` is removed.
- `src/features/**` is removed.
- Route screens are imported only from `src/modules/**/pages/**`.

## Import Rules

- Prefer `@/modules/<domain>/...` for page-level imports.
- Use `@/services/*` for all backend communication.
- Avoid cross-module deep imports unless required.

## Enforced Boundaries (ESLint)

1. `src/modules/**` cannot import from legacy `src/pages/**` or `src/features/**`.
2. Module code cannot import route pages from other modules.
3. `src/modules/**/components/**` cannot import `src/services/**` directly.
4. `src/ui/**` cannot import modules or services.
5. `src/app/router.jsx` can import route pages only from `src/modules/**/pages/**`.
