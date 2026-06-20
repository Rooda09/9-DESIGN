# API Specification

## Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/me`

## Admin

- `GET /api/admin/domains`
- `POST /api/admin/domains`
- `GET /api/admin/dropdown-groups`
- `POST /api/admin/dropdown-groups`
- `GET /api/admin/dropdown-options`
- `POST /api/admin/dropdown-options`
- `PATCH /api/admin/dropdown-options/:id`
- `GET /api/admin/prompt-templates`
- `POST /api/admin/prompt-templates`
- `GET /api/admin/clip-scenarios`
- `POST /api/admin/clip-scenarios`
- `GET /api/admin/engines`
- `POST /api/admin/engines`

## User libraries

- `GET /api/library/prompts`
- `POST /api/library/prompts`
- `GET /api/library/scenarios`
- `POST /api/library/scenarios`
- `GET /api/library/projects`
- `POST /api/library/projects`
- `GET /api/library/assets`

## Creation

- `GET /api/create/domains`
- `GET /api/create/templates?domain=architecture`
- `GET /api/create/dropdowns?domain=architecture&templateId=...`
- `POST /api/prompts/compile`
- `POST /api/generation/jobs`
- `GET /api/generation/jobs/:id`
- `POST /api/generation/jobs/:id/retry`

## Tokens

- `GET /api/tokens/wallet`
- `POST /api/tokens/refill`
- `GET /api/tokens/transactions`
- `POST /api/webhooks/payment`

## Upscale

- `POST /api/upscale/jobs`
- `GET /api/upscale/jobs/:id`

## Audio

- `POST /api/audio/prompts/compile`
- `POST /api/audio/jobs`
- `GET /api/audio/jobs/:id`

## Community

- `GET /api/community/feed`
- `POST /api/community/publish`
- `POST /api/community/like`
- `POST /api/community/save`
- `POST /api/community/remix`

## Competitions

- `GET /api/competitions`
- `GET /api/competitions/:id`
- `POST /api/competitions/:id/submit`
- `POST /api/competitions/:id/vote`
