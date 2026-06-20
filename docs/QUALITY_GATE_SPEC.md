# Quality Gate Specification

## Purpose

Score whether the generated prompt/output follows the user's professional intent.

## Architecture checks

- Geometry preservation
- Plot/boundary preservation
- Floor count consistency
- Window/opening consistency
- Facade logic
- Structural plausibility
- Material realism
- Camera/view consistency
- Scale realism
- Client-readiness

## Photography checks

- Product lock
- Label/text distortion risk
- Material realism
- Lighting realism
- Shadow/reflection quality
- Background suitability
- Crop/platform suitability
- Commercial trustworthiness

## Branding checks

- Brand consistency
- Palette adherence
- Typography logic
- Campaign hierarchy
- Logo treatment
- Generic-AI risk
- Platform format fit
- Message clarity

## Clip checks

- Story clarity
- Camera continuity
- Subject consistency
- Scene consistency
- Duration suitability
- Motion realism
- Audio fit
- SFX fit

## Output

Return:

- score 0–100
- blocking issues
- warnings
- suggested revision actions
