# System Architecture

## High-level flow

```text
User/Auth
  ↓
Dashboard / Create Studio
  ↓
Domain + Template + Dropdown Controls + References
  ↓
Prompt Compiler
  ↓
Engine Router
  ↓
Token Service
  ↓
Generation Job Queue
  ↓
AI Engine Adapter
  ↓
Output Storage
  ↓
Quality Gate
  ↓
User Library / Community / Competition / Upscale / Clip / Audio
```

## Core bounded contexts

1. **Identity** — auth, roles, profile.
2. **Billing/Tokens** — token wallet, refill, transactions.
3. **Admin CMS** — dropdowns, templates, prompts, scenarios, engines.
4. **Creation Studio** — user-facing generation workflow.
5. **Prompt Compiler** — converts choices into prompt packages.
6. **Generation Jobs** — engine abstraction, queue, output storage.
7. **Libraries** — user prompts, scenarios, projects, outputs.
8. **Quality Gate** — output and prompt validation.
9. **Community** — public content, likes, remixes.
10. **Competition** — challenges, submissions, scoring.

## Design principle

The UI must not hardcode professional category details. Domain controls should be loaded from database dropdown groups and options, filtered by domain, workflow, and template.
