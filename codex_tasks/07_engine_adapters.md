# Task 07 — Engine Adapters

Implement placeholder adapters for image, clip, audio, and upscale engines. Keep provider-specific logic isolated.

## Acceptance criteria

- Code is typed and lint-clean.
- Admin-only operations enforce role checks.
- User-owned resources enforce ownership checks.
- Token-spending operations are transactional.
- Prompt-related operations preserve the 2,000-character target unless explicitly overridden.
- Add tests or validation for critical logic.
