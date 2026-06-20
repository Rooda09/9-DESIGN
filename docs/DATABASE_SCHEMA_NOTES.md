# Database Schema Notes

Use Prisma schema as the source of truth during implementation.

Key database principles:

1. Admin controls domain data.
2. Users copy/save prompts and scenarios into personal libraries.
3. Prompt templates and scenarios are versioned.
4. Generation jobs store full compiled prompt package for reproducibility.
5. Token transactions are immutable ledger rows.
6. Community publication is separate from private assets.
7. Competition submissions point to generated assets.
8. Audio and upscale are first-class generation job types.
