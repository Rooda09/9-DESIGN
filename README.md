# Architecture Studio MVP - Codex Package

This repository currently focuses on an Architecture-first MVP: a professional prompt compiler, Geometry Guard, reference roles, an Architecture Clip Scenario Builder, Architecture Upscale and Clip Audio prompt workflows, engine-specific prompt packages, and private prompt/scenario library saves.

## Architecture-first MVP summary

The active MVP domain is Architecture.

1. Architecture Studio - active MVP route for database-backed templates, dropdown defaults, Geometry Guard, reference roles, prompt package preview, and private save-to-library.
2. Architecture Clip Scenario Builder - active planning route for short Architecture clips, camera movement, continuity controls, engine-specific video prompts, and private scenario saves.
3. Architecture Upscale - active planning route for render enhancement prompts, preservation controls, negative upscale prompts, and private prompt saves.
4. Architecture Clip Audio - active planning route for background audio prompts, SFX direction, timing notes, loop guidance, and private scenario saves.
5. Photography - Coming Soon placeholder only; no user creation flow is implemented.
6. Branding - Coming Soon placeholder only; no user creation flow is implemented.

The MVP should behave like a professional Architecture prompt control system:

Architecture template + admin dropdown defaults + Geometry Guard + reference roles + project brief + optional Architecture upscale/audio planning controls -> optimized prompt package -> quality checklist -> private user library.

Real AI image/video/audio generation, provider upscale execution, Photography, Branding, Community, Competitions, Payments, Marketplace, and general multi-domain clip/upscale/audio workflows are intentionally out of scope for this MVP pass.

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

## Phase 4A Architecture database quality status

Phase 4A improves Architecture Studio content quality without adding new product domains or provider execution.

- Adds a curated Architecture-only seed dataset for project type, building typology, design task, geometry guard mode, reference role, architectural style, school/movement influence, architect influence, facade system, massing type, roof type, opening/window rhythm, material palette, facade material, interior space type, landscape element, climate/context, camera view, lens/framing, lighting/time of day, mood/atmosphere, render quality, output purpose, and negative constraints.
- Every seeded dropdown option includes label, default flag, best-for guidance, English description, Arabic description, active status, sort order, and a prompt fragment.
- Adds professional Architecture templates and prompt-template records aimed at Geometry Guard exterior work and material/facade review, with prompt bodies kept under 2,000 characters.
- Updates `npm run seed` to upsert Architecture domain records, image engine records, dropdown groups/options, templates, and prompt-template records.
- Adds `npm run seed -- --preview` for offline count inspection and `npm run validate:architecture` for offline Architecture data validation.
- Strengthens Architecture negative-prompt logic with database-selected negative constraints and adds an Architecture-specific quality checklist.

Phase 4A itself did not call real AI generation providers, create generation jobs, debit tokens, or implement non-Architecture domains. Architecture clip planning is introduced separately in Phase 4B below.

## Phase 4B Architecture Clip Scenario Builder status

Phase 4B adds an Architecture-only short-clip planning workflow without provider execution.

- Adds `/create/architecture/clips` as the Architecture Clip Scenario Builder route.
- Adds ten curated scenario types: exterior reveal, facade orbit, slow dolly-in, interior walkthrough, landscape flythrough, material close-up, day-to-night transition, before/after renovation, aerial site reveal, and cinematic real estate teaser.
- Adds editable storytelling fields for opening shot, subject focus, camera movement, atmosphere, architectural detail, and closing shot.
- Adds slow dolly-in, orbit, crane up, top-down reveal, parallax slide, handheld cinematic, and static hero camera controls.
- Adds Kling, Veo, and WAN 2.6 prompt-format placeholders plus 5, 8, 10, 15, and 20 second durations.
- Adds continuity controls for building geometry, facade openings, material palette, lighting mood, and camera direction.
- Compiles scenario title, storytelling prompt, six-part shot list, camera prompt, continuity instructions, negative video prompt, engine-specific prompt, and Architecture quality checklist.
- Keeps engine-specific video prompts at or below 2,000 characters.
- Saves authenticated results privately to the existing `UserScenario` model through `/api/library/scenarios`.
- Seeds ten `ClipScenario` records and three CLIP engine records. Kling uses the database key `kling_video` to avoid conflicting with the existing image-engine record.
- Uses curated fallback scenario data when PostgreSQL is unavailable, while clearly marking the source in the UI.

Phase 4B does not call video APIs, upload source media, create generation jobs, charge tokens, generate audio, or expand clips into Photography or Branding.

## Phase 4C Architecture Upscale and Clip Audio status

Phase 4C adds Architecture-only upscale and audio-background prompt workflows without provider execution.

- Adds `/create/architecture/upscale` for enhancing architectural images and renders through prompt planning only.
- Adds upscale intent options for render realism, facade detail sharpening, material texture, lighting and shadows, AI artifact cleanup, presentation boards, social media, and client marketing.
- Adds image quality controls for geometry preservation, facade detail preservation, material fidelity, edge sharpness, noise/artifact reduction, lighting balance, realistic scale, and no new unwanted elements.
- Compiles upscale objective, preservation instructions, enhancement instructions, negative upscale prompt, output format notes, and a quality checklist.
- Saves authenticated upscale packages privately to the existing `UserPrompt` model through `/api/library/upscale-prompts`.
- Adds `/create/architecture/audio` for Architecture clip background audio prompt planning.
- Adds audio mood options for cinematic ambient, luxury calm, futuristic minimal, warm residential, urban commercial, desert atmosphere, night architectural reveal, and gallery / museum calm.
- Adds SFX direction options for subtle wind, soft footsteps, city ambience, water feature, distant traffic, interior room tone, soft mechanical hum, and no SFX.
- Compiles background audio prompt, SFX direction, voiceover placeholder, timing notes, loop/seamless instruction, and negative audio prompt.
- Saves authenticated audio prompt packages privately to the existing `UserScenario` model through `/api/library/audio-prompts`.
- Seeds Architecture-only upscale settings plus audio mood/SFX setting records through the existing Phase 2 admin data models.

Phase 4C does not upload source images, generate audio files, call image/video/audio/upscale providers, create generation jobs, charge tokens, or implement Photography, Branding, Community, Payments, or Marketplace features.

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

   The Architecture-first MVP cleanup and Phases 4B/4C do not require a new migration because they reuse the Phase 1 `UserPrompt`/`UserScenario` models and Phase 2 admin data models.

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
   npm run validate:architecture
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
- The Architecture-first MVP cleanup, Phase 4A database quality pass, Phase 4B Clip Scenario Builder, and Phase 4C Architecture Upscale/Audio Prompt workflows have no schema change.
- Phase 4B uses the existing `ClipScenario`, `UserScenario`, and `AIEngine` models. Run `npm run seed` to upsert the ten Architecture clip scenarios and three placeholder clip-engine records.
- Phase 4C uses the existing `UpscaleSetting`, `AudioBackgroundSetting`, `UserPrompt`, and `UserScenario` models. Run `npm run seed` to upsert Architecture-only upscale intents, audio moods, and SFX directions.
- Template defaults may be stored in `Template.defaultDropdowns` as a JSON object keyed by dropdown group key.
- Optional dropdown prompt fragments may be stored in `DropdownOption.metadata.promptFragment`.
- Phase 4A seed data stores curated Architecture prompt fragments in `DropdownOption.metadata.promptFragment` and prompt-template engine hints in `PromptTemplate.engineHints`.

## Remaining assumptions

- Email delivery, password reset completion, MFA, OAuth, and production session rotation are not implemented yet.
- Token refill is a payment placeholder only; pending refill transactions do not increase spendable balance.
- AI engine execution, Photography flows, Branding flows, community, competitions, payment integration, marketplace features, and advanced user libraries remain out of scope.
- Phase 2 CRUD pages are intentionally simple server-rendered tables and forms; bulk import, audit logs, rich previews, moderation workflows, and version publishing workflows remain later work.
- Architecture Studio accepts reference image URLs and role assignments but does not upload, inspect, or store reference files yet.
- Saved prompt packages do not debit tokens and do not create generation jobs.
- Saved clip scenario packages do not call video providers, debit tokens, upload media, or create generation jobs.
- Saved upscale packages do not call upscale providers, debit tokens, upload source images, or create generation jobs.
- Saved audio prompt packages do not call audio providers, debit tokens, generate audio files, or create generation jobs.
- Architecture clip planning and Architecture audio prompt planning are available, but generated clip/audio outputs, timeline editing, source-image upload, and provider job polling remain future work.
- Photography, Branding, general multi-domain clips/upscale/audio, Community, Competitions, Payments, and Marketplace remain intentionally unavailable.
- Provider keys, payment credentials, storage credentials, and production secrets must be configured outside the repository.
