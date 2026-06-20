# Codex Master Prompt — AI Creative Control Platform

You are building a production-grade SaaS platform called **AI Creative Control Platform**.

## Core goal

Build a multi-domain AI creative platform for:

1. Architecture
2. Photography
3. Branding

The platform helps users generate optimized prompts, images, clips, audio background prompts, upscale tasks, reusable templates, saved prompt libraries, saved clip scenario libraries, and community/competition content.

## Non-negotiable product rules

1. All users must sign up, log in, use forgot-password, manage profile, refill tokens, and view token history.
2. Every user must have:
   - personal prompt library
   - personal scenario library for clips
   - project folders
   - favorites
   - generated image library
   - generated clip library
   - optional public profile
3. Admin must be able to update:
   - dropdown groups
   - dropdown options
   - default values
   - templates
   - prompt library
   - scenario library
   - engine list
   - token costs
   - competition rules
   - community moderation status
4. Most user controls should be dropdowns.
5. Every dropdown option must include:
   - value/key
   - label_en
   - label_ar
   - best_for
   - description_en
   - description_ar
   - is_default
   - sort_order
   - admin status
6. Templates must accelerate workflow for all domains.
7. Storytelling must exist across Architecture, Photography, and Branding.
8. Add audio generation for clip backgrounds.
9. Add upscale as a dedicated workflow after image/clip generation.
10. Image engines: Midjourney, DALL·E / GPT Image, Flux, Stable Diffusion, Leonardo, Runway, Kling, Pika, Luma.
11. Clip engines: KLING, VEO, WAN 2.6.
12. Audio and upscale engines should be admin-configurable.
13. Most final prompts should not exceed 2,000 characters. Validate this.
14. The architecture domain must include Geometry Guard to prevent AI from losing geometry, shape, building boundary, plot limit, facade openings, floor count, and massing logic.

## Build strategy

Implement the platform as a Next.js + TypeScript + PostgreSQL + Prisma SaaS application.

Use an adapter pattern for AI engines. Do not directly bind business logic to one provider. All generation jobs should flow through:

`create job → validate token balance → compile prompt package → choose engine adapter → submit job → store outputs → run quality gate → save to library → allow revisions/upscale/audio/clip conversion`

## Important UX strategy

The app should have:

- Simple Mode: Domain → Template → Reference Upload → Key Choices → Generate
- Advanced Mode: all dropdown controls, engine selection, negative prompt, style, camera, lighting, storytelling, audio, upscale
- Expert Mode: build custom templates/scenarios and save to library

## Initial implementation priority

1. Database schema and auth.
2. Admin CMS for dropdowns, templates, prompts, scenarios, engines.
3. User libraries and project folders.
4. Prompt compiler.
5. Token system.
6. Generation job abstraction.
7. Engine adapter interfaces.
8. Architecture Geometry Guard fields.
9. Clip scenarios with storytelling and audio background.
10. Upscale workflow.
11. Community and competition zone.

## Quality expectations

Write clean, scalable, typed code. Keep domain logic separated from UI. Keep engine integrations behind adapters. Include validation, error handling, and authorization checks. Never expose provider API keys to the client.
