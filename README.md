# AI Creative Control Platform - Codex Package

This repository is the implementation blueprint and foundation shell for a professional AI image, clip, prompt, scenario, audio, upscale, community, and admin-management platform.

## Product summary

The platform has three primary domains:

1. Architecture - image and clip generation with geometry preservation, boundary control, facade/interior/landscape control, material logic, view control, storytelling, upscale, and quality gates.
2. Photography - commercial photography, product lock, lighting control, set/background generation, campaign variants, clip scenarios, upscale, and audio-backed product/video storytelling.
3. Branding - brand identity, campaigns, visual systems, logo/monogram exploration, social/ad content, storytelling, brand memory, audio identity, upscale, and clip scenarios.

The platform should behave like a professional creative control system:

User choices + defaults + references + project memory -> optimized engine-specific prompt package -> generation job -> quality gate -> revision actions -> saved library/community/competition.

## Phase 0 foundation status

Phase 0 validated the foundation shell:

- Next.js App Router + TypeScript source layout under `src/app`, `src/lib`, and `src/config`.
- Prisma PostgreSQL schema under `prisma/schema.prisma` with Prisma 7 configuration in `prisma.config.ts`.
- Local PostgreSQL and Redis defaults in `docker-compose.yml`.
- Environment examples in `.env.example`.
- Excel workbook inspection scripts under `scripts/`.
- Placeholder routes for `/`, `/create`, `/admin`, and `/library`.

## Phase 1 authentication and wallet status

Phase 1 adds only authentication, user roles, profile, and token wallet foundations:

- Credential signup and login with bcrypt password hashing.
- Signed HttpOnly session cookie structure for login/logout.
- Forgot-password request structure with hashed reset-token storage.
- `USER` and `ADMIN` roles only.
- One profile record per user.
- Token wallet and token transaction history models.
- Placeholder token refill flow that records pending refill transactions without payment integration.
- Protected `/admin` page and admin API scaffold access.
- Basic pages for login, register, forgot password, profile, token wallet, and admin dashboard.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment defaults and update secrets:

   ```bash
   cp .env.example .env
   ```

3. Generate a strong auth secret and place it in `NEXTAUTH_SECRET`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

4. Start local services:

   ```bash
   docker compose up -d postgres redis
   ```

5. Validate Prisma:

   ```bash
   npx prisma validate
   ```

6. Create or update the local migration:

   ```bash
   npx prisma migrate dev --name phase_1_auth_wallet
   ```

7. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

8. Run validation:

   ```bash
   npm run test -- --run
   npx tsc --noEmit
   npm run import:workbook
   npm run validate:prompts
   ```

9. Start the development server:

   ```bash
   npm run dev
   ```

## Admin access

New registrations always create `USER` accounts. Promote an operator account manually after migration:

```sql
update "User" set role = 'ADMIN' where email = 'admin@example.com';
```

Admin-only routes redirect non-authenticated users to `/login` and non-admin users to `/profile`. Admin API scaffolds return `401` for unauthenticated requests and `403` for non-admin users.

## Migration notes

- Prisma 7 reads `DATABASE_URL` from `prisma.config.ts`; keep the value in `.env`.
- If the database is empty, run `npx prisma migrate dev --name phase_1_auth_wallet`.
- If a Phase 0 migration already exists locally, create a new Phase 1 migration from the updated schema instead of editing the old migration.
- The Phase 1 schema narrows roles to `USER` and `ADMIN`, adds `UserProfile`, strengthens password-reset storage, and adds transaction status/history fields.

## Remaining assumptions

- Email delivery, password reset completion, MFA, OAuth, and production session rotation are not implemented yet.
- Token refill is a payment placeholder only; pending refill transactions do not increase spendable balance.
- AI engine integrations, community, competitions, and full admin database management remain out of scope.
- Provider keys, payment credentials, storage credentials, and production secrets must be configured outside the repository.
