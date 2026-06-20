# Architecture Studio MVP - Codex Package

This repository currently focuses on an Architecture-first MVP: a professional prompt compiler for Architecture Studio, Geometry Guard, reference roles, engine-specific prompt packages, and private prompt-library saves.

## Architecture-first MVP summary

The active MVP domain is Architecture.

1. Architecture Studio - active MVP route for database-backed templates, dropdown defaults, Geometry Guard, reference roles, prompt package preview, and private save-to-library.
2. Photography - Coming Soon placeholder only; no user creation flow is implemented.
3. Branding - Coming Soon placeholder only; no user creation flow is implemented.

The MVP should behave like a professional Architecture prompt control system:

Architecture template + admin dropdown defaults + Geometry Guard + reference roles + project brief -> optimized engine-specific prompt package -> quality checklist -> private user library.

Real AI image generation, Photography, Branding, Community, Competitions, Payments, Marketplace, Clips, Upscale, and Audio workflows are intentionally out of scope for this MVP pass.

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

## Phase 2 admin database management status

Phase 2 adds admin-only CRUD surfaces for database-managed creative controls:

- Domains.
- Dropdown groups.
- Dropdown options.
- Templates.
- Prompt library records.
- Clip scenario records.
- AI engines.
- Upscale categories and settings.
- Audio background categories and settings.

All Phase 2 admin pages live under `/admin/*` and require an authenticated `ADMIN` user. Shared admin CRUD endpoints live under `/api/admin-crud/*` and also require `ADMIN`.

Dropdown options explicitly support:

- Default value flag.
- Best-for guidance.
- English description.
- Arabic description.
- Active/inactive status.
- Sort order.

Phase 2 also adds Prisma models for `UpscaleCategory`, `UpscaleSetting`, `AudioBackgroundCategory`, and `AudioBackgroundSetting`.

## Architecture Studio MVP status

The current MVP activates only the Architecture creation workflow:

- Main navigation prioritizes `/create/architecture` as `Architecture Studio`.
- `/create` provides domain selection with Architecture enabled and Photography/Branding marked Coming Soon.
- `/create/architecture` loads published Architecture templates and active dropdown groups/options from PostgreSQL.
- Dropdown selections expose labels, default source, best-for guidance, English descriptions, and Arabic descriptions.
- Dropdown defaults are selected in this order: template default, admin default option, first option for required fields.
- Geometry Guard supports Fixed Geometry, Semi-Fixed Geometry, Free Concept, Facade Only, Material Only, Interior Finish Only, and Landscape Only with clear change-boundary explanations.
- Reference roles support geometry, style, material, lighting, camera, and mood references with safe role-specific guidance.
- The compiler produces a main prompt, negative prompt, geometry instructions, reference instructions, engine-specific prompt, and quality checklist.
- Image prompt formatting is supported for Midjourney, DALL-E / GPT Image, Flux, Stable Diffusion, Leonardo, Runway, Kling, Pika, and Luma.
- Engine prompts are compressed to a maximum of 2,000 characters.
- Authenticated users can save compiled packages privately to their existing `UserPrompt` library records.
- `/library` provides a basic list of the current user's saved prompts.

The MVP does not call any real AI generation provider and does not debit tokens when saving a prompt.

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
   npx prisma migrate dev --name phase_2_admin_database_management
   ```

   The Architecture-first MVP cleanup does not require a new migration because it reuses the Phase 1 `UserPrompt` model and Phase 2 admin data models.

7. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

8. Run validation:

   ```bash
   npm run test -- --run
   npx tsc --noEmit
   npx prisma validate
   npm run build
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
- If the database is empty, run all migrations in order or create a fresh local migration from the current schema.
- If Phase 0 and Phase 1 migrations already exist locally, create a new Phase 2 migration from the updated schema instead of editing old migrations.
- The Phase 1 schema narrows roles to `USER` and `ADMIN`, adds `UserProfile`, strengthens password-reset storage, and adds transaction status/history fields.
- The Phase 2 schema adds upscale and audio background category/setting tables for admin-managed provider settings.
- The Architecture-first MVP cleanup has no schema change. It requires at least one active Architecture domain, one published Architecture template, and active Architecture dropdown groups/options.
- Template defaults may be stored in `Template.defaultDropdowns` as a JSON object keyed by dropdown group key.
- Optional dropdown prompt fragments may be stored in `DropdownOption.metadata.promptFragment`.

## Remaining assumptions

- Email delivery, password reset completion, MFA, OAuth, and production session rotation are not implemented yet.
- Token refill is a payment placeholder only; pending refill transactions do not increase spendable balance.
- AI engine execution, Photography flows, Branding flows, community, competitions, payment integration, marketplace features, and advanced user libraries remain out of scope.
- Phase 2 CRUD pages are intentionally simple server-rendered tables and forms; bulk import, audit logs, rich previews, moderation workflows, and version publishing workflows remain later work.
- Architecture Studio accepts reference image URLs and role assignments but does not upload, inspect, or store reference files yet.
- Saved prompt packages do not debit tokens and do not create generation jobs.
- Photography, Branding, Clips, Upscale, Audio, Community, Competitions, Payments, and Marketplace remain intentionally unavailable in the Architecture-first MVP creation UI.
- Provider keys, payment credentials, storage credentials, and production secrets must be configured outside the repository.
