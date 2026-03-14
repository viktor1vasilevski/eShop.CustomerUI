# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server (ng serve)
ng build           # Production build
ng test            # Run unit tests (Karma + Jasmine)
```

No lint command is configured.

## Architecture

Angular 19 SPA for an eShop customer-facing UI. Uses **standalone components** throughout — no NgModules.

**Backend API base URL:** `https://localhost:44344/api`

### Structure

- `src/app/core/` — Shared infrastructure: services, guards, interceptors, shared components (navbar, pagination), enums
- `src/app/features/` — Feature pages: home, products, basket, checkout, orders, login, register, unauthorized

### Service Architecture

Two layers of services for stateful domains:

- **`*StorageService`** — Manages reactive state via `BehaviorSubject` + persists to `localStorage`. e.g. `AuthStorageService` (key: `user`), `BasketStorageService` (key: `basket`)
- **`*Service`** — Makes HTTP calls via `DataService`

**`DataService`** is a generic HTTP wrapper used by all domain services (`ProductService`, `BasketService`, `OrderService`, etc.) instead of calling `HttpClient` directly.

**`AuthInterceptor`** (`core/interseptors/auth-interseptor.ts`) — automatically attaches `Authorization: Bearer {token}` to all outgoing HTTP requests.

### API Response Shape

All API responses follow this envelope:

```typescript
{
  data: T,
  message: string,
  status: NotificationType,   // 0=Success, 1=Error, 2=Info
  errors: { [field: string]: string[] }
}
```

`ErrorHandlerService` processes API errors and `NotificationService` (wraps ngx-toastr) displays them.

### Routing & Auth

Routes are in `app.routes.ts`. The `authGuard` (`core/guards/auth.guard.ts`) protects the `/orders` route — redirects to `/unauthorized` if no token in localStorage.

### Basket Sync

On login, local basket items from `localStorage` are merged with the server basket via `POST /api/basket/merge`.
