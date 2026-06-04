# AGENTS.md

Guidance for cloud agents working in the R&L Inventory App repository.

## Product overview

Single Next.js 14 monolith (T3 stack): inventory management for R&L Packaging with Clerk auth, Turso/libSQL + Drizzle ORM, tRPC API, and Tailwind/shadcn UI. Protected routes live under `/dashboard`.

## Cursor Cloud specific instructions

### Services

| Service | Required | How to run |
|---------|----------|------------|
| Next.js dev server | Yes | `pnpm dev` → http://localhost:3000 |
| libSQL database | Yes | Local file via `DATABASE_URL=file:./db.sqlite` (no separate DB process) |
| Clerk | Yes (external) | Dev keys from [Clerk Dashboard](https://dashboard.clerk.com) |
| Resend | Yes for env validation | API key required by `src/env.js`; only needed for email send E2E |
| Drizzle Studio | Optional | `pnpm db:studio` → https://local.drizzle.studio |
| Pusher / Algolia | Optional | Incomplete or disabled features |

There is no Docker Compose or separate API server.

### Environment variables

Create `.env` in the repo root (see `src/env.js` for the authoritative schema; `.env.example` is partially stale):

```bash
DATABASE_URL="file:./db.sqlite"
DATABASE_TOKEN="local-dev-token"
NODE_ENV="development"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."
```

Placeholder Clerk keys will cause middleware to return **500** (`Publishable key not valid`). Real Clerk development keys are required before the app is usable over HTTP.

For production builds without full env, use `SKIP_ENV_VALIDATION=1 pnpm build`.

### Standard commands

See `package.json` scripts and `README.md`:

- Install: `pnpm install`
- DB schema: `pnpm db:push` (or `pnpm db:migrate`)
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Production: `pnpm start` (after build)

Package manager is **pnpm 8.15.6** (`packageManager` field).

### Auth and E2E testing notes

- Dashboard requires Clerk sign-in. After auth, email must end with `@rlpackaging.ca` (or be on the allowlist in `src/app/dashboard/layout.tsx`).
- Most write tRPC procedures use `protectedProcedure`; reads often use `publicProcedure`.
- Run DB migrations before CRUD flows: `pnpm db:push`.

### Gotchas

- Middleware runs on almost all routes including `/api/trpc`; invalid Clerk keys block the entire app, not just `/dashboard`.
- Local SQLite needs no Turso cloud account; `DATABASE_TOKEN` can be any non-empty string for file mode.
- PWA service worker files may appear in `public/` after `pnpm build`; they are gitignored-generated artifacts.
