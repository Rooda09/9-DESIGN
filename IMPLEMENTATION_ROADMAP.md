# Implementation Roadmap

## Phase 1 — Foundation

- Next.js project setup
- PostgreSQL + Prisma
- Auth: sign up, login, forgot password
- User profile
- Role system: USER, ADMIN, MODERATOR
- Token wallet schema
- File storage integration

## Phase 2 — Admin CMS

- Domains CRUD
- Dropdown groups CRUD
- Dropdown options CRUD
- Prompt templates CRUD
- Clip scenarios CRUD
- Engine CRUD
- Token cost CRUD
- Template publish/archive workflow

## Phase 3 — Creation workflow

- Domain selection
- Template selection
- Dynamic dropdown rendering
- Reference upload
- Prompt compiler
- Prompt preview
- Save to personal library

## Phase 4 — Generation abstraction

- Generation job table
- Engine adapter interface
- Token pre-check
- Job queue
- Status polling
- Output storage
- Error handling

## Phase 5 — Architecture controls

- Geometry Guard mode
- Reference role system
- Site/boundary/opening/floor-count controls
- Architecture quality gate

## Phase 6 — Clip storytelling + audio

- Clip scenario builder
- Story arc dropdowns
- Shot sequence builder
- Camera movement library
- Audio background prompt builder
- SFX direction
- Voiceover option

## Phase 7 — Upscale workflow

- Image upscale
- Clip upscale
- Denoise/sharpen/detail modes
- Export sizes
- Token cost calculation

## Phase 8 — Libraries

- Personal prompt library
- Scenario library
- Project folders
- Favorites
- Generated assets
- Version history

## Phase 9 — Community

- Public profiles
- Public gallery
- Likes/saves
- Remix permissions
- Featured content

## Phase 10 — Competition zone

- Challenge creation
- Submissions
- Voting
- Judge scores
- Winners
- Badges

## Phase 11 — Import workbook

- Read `data/ai_creative_control_platform_database_v2_expanded.xlsx`
- Import dropdown groups/options
- Import templates
- Import prompt templates
- Import clip scenarios
- Validate prompt length under 2,000 chars
- Report rows requiring admin review

## Phase 12 — Hardening

- Rate limits
- Abuse controls
- API-key protection
- Audit logs
- Billing webhooks
- Admin moderation tools
- Backups
