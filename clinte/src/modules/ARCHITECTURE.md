# Frontend Module Contract

This project follows domain-based modules. The `src/modules` directory is the
single source of truth for product screens.

## Folder Rules

1. Every business domain owns its route screens inside:
   - `src/modules/<domain>/pages`
2. Router imports only from module pages.
3. Legacy `src/pages/*` and `src/features/*` files are compatibility wrappers.
   - Do not add business logic there.
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

## Import Rules

- Prefer `@/modules/<domain>/...` for page-level imports.
- Use `@/services/*` for all backend communication.
- Avoid cross-module deep imports unless required.

