# AI Creative Control Platform — Codex Package

This package is designed to be uploaded or pasted into Codex as the implementation blueprint for a professional AI image, clip, prompt, scenario, audio, upscale, community, and admin-management platform.

## Product summary

The platform has three primary domains:

1. **Architecture** — image and clip generation with geometry preservation, boundary control, facade/interior/landscape control, material logic, view control, storytelling, upscale, and quality gates.
2. **Photography** — commercial photography, product lock, lighting control, set/background generation, campaign variants, clip scenarios, upscale, and audio-backed product/video storytelling.
3. **Branding** — brand identity, campaigns, visual systems, logo/monogram exploration, social/ad content, storytelling, brand memory, audio identity, upscale, and clip scenarios.

The platform should not behave like a simple prompt generator. It should behave like a **professional creative control system**:

**User choices + defaults + references + project memory → optimized engine-specific prompt package → generation job → quality gate → revision actions → saved library/community/competition.**

## Included files

- `CODEX_MASTER_PROMPT.md` — paste into Codex first.
- `PRODUCT_REQUIREMENTS.md` — full product requirements.
- `IMPLEMENTATION_ROADMAP.md` — phased build plan.
- `docs/` — architecture, UI, API, engine, admin, token, audio, upscale, storytelling, and quality-gate specs.
- `prisma/schema.prisma` — recommended relational schema.
- `sql/schema.sql` — equivalent SQL-first schema draft.
- `src/` — TypeScript starter modules for prompt compilation, engine routing, token costing, quality gates, audio, upscale, types, and API routes.
- `scripts/import-workbook.ts` — importer plan for the Excel database.
- `data/ai_creative_control_platform_database_v2_expanded.xlsx` — admin/database seed workbook.
- `codex_tasks/` — ordered tasks for Codex implementation.

## Recommended stack

- Frontend: Next.js 15, React, TypeScript, Tailwind, shadcn/ui.
- Backend: Next.js route handlers or NestJS if separated later.
- Database: PostgreSQL + Prisma.
- Auth: NextAuth/Auth.js or Supabase Auth.
- Storage: S3-compatible storage for references, generated images, clips, audio, and thumbnails.
- Queue: BullMQ + Redis or managed queue.
- Payments/tokens: Stripe or equivalent.
- AI integrations: adapter pattern for Midjourney, DALL·E/GPT Image, Flux, Stable Diffusion, Leonardo, Runway, Kling, Pika, Luma, VEO, WAN 2.6, plus admin-configurable audio and upscale providers.

## How to use with Codex

1. Open `CODEX_MASTER_PROMPT.md` and provide it to Codex with the whole package.
2. Ask Codex to implement tasks in order from `codex_tasks/`.
3. Start with database/auth/admin foundations before AI engine integration.
4. Import the Excel workbook after the admin CMS and schema are ready.
5. Do not hardcode all dropdowns in UI; store them in the database and let admin update them.

## Critical product principles

- Keep user-facing creation simple.
- Keep admin/database structure deep.
- Every dropdown option must support default value, best-for, English description, and Arabic description.
- Prompts should usually stay under 2,000 characters.
- Scenario and prompt libraries must be admin-updateable.
- Users must have personal prompt libraries and clip scenario libraries.
- Storytelling is mandatory across all domains.
- Clips need optional audio-background generation and SFX direction.
- Upscale must be a first-class step after image/clip generation.
- Geometry Guard is the key architecture differentiator.

## Phase 0 foundation status

This repository is currently a validated foundation shell, not the full application. Phase 0 confirms:

- Next.js App Router + TypeScript source layout under `src/app`, `src/lib`, and `src/config`.
- Prisma PostgreSQL schema under `prisma/schema.prisma` with Prisma 7 configuration in `prisma.config.ts`.
- Local service defaults in `docker-compose.yml` for PostgreSQL and Redis.
- Environment examples in `.env.example`.
- Excel workbook inspection scripts under `scripts/` for the uploaded seed workbook.
- Placeholder routes for `/`, `/create`, `/admin`, and `/library`, plus API scaffolds for prompt compilation, admin dropdown options, and generation jobs.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment defaults and update secrets before production use:

   ```bash
   cp .env.example .env
   ```

3. Start local services:

   ```bash
   docker compose up -d postgres redis
   ```

4. Validate the Prisma schema:

   ```bash
   npx prisma validate
   ```

5. Create and apply the initial migration:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

7. Preview seed data structure:

   ```bash
   npm run seed
   ```

8. Inspect the uploaded Excel workbook structure:

   ```bash
   npm run import:workbook
   npm run validate:prompts
   ```

9. Start the development server:

   ```bash
   npm run dev
   ```

## Migration notes

- Prisma 7 reads the database URL from `prisma.config.ts`; keep `DATABASE_URL` in `.env` and do not re-add `url = env("DATABASE_URL")` to `prisma/schema.prisma`.
- The first real database migration should be created with `npx prisma migrate dev --name init` after PostgreSQL is running.
- Workbook import is still a Phase 11 full importer task. Phase 0 only validates that the workbook package is readable and that the import script has the expected mapping plan.

## Phase 0 assumptions and missing items

- Authentication, token debiting, queue workers, provider adapters, storage, and admin authorization are intentionally placeholders for later phases.
- The Excel importer does not write to the database yet; it reports sheet structure and keeps the row mapping TODOs explicit.
- Provider API keys, storage credentials, Stripe/payment credentials, and production secrets are intentionally absent from `.env.example` or blank placeholders.
