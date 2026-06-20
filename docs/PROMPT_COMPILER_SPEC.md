# Prompt Compiler Specification

## Purpose

Convert user choices, templates, reference roles, and admin-configured options into a compact, optimized prompt package.

## Input

- Domain
- Template
- Engine
- Dropdown selections
- User free-text brief
- Reference images and roles
- Storytelling choices
- Audio requirement
- Upscale requirement
- Negative constraints

## Output

- `mainPrompt`
- `negativePrompt`
- `enginePrompt`
- `referenceInstructions`
- `lockInstructions`
- `storyPrompt`
- `audioPrompt`
- `upscalePrompt`
- `qualityChecklist`
- `estimatedPromptChars`
- `warnings`

## Character rule

Most final prompts should not exceed 2,000 characters. If exceeded:

1. Remove repeated adjectives.
2. Compress material/camera phrasing.
3. Replace long explanations with technical tags.
4. Keep lock/negative instructions.
5. Warn user if still over limit.

## Architecture lock phrases

Examples:

- Preserve original building massing, floor count, plot boundary, roofline, facade openings, main volume proportions, and camera angle.
- Do not add extra floors, windows, balconies, towers, roof forms, or change the site boundary.
- Apply style only to facade treatment, materials, lighting, and atmosphere.

## Photography lock phrases

- Preserve exact product shape, proportions, label area, material finish, and front-facing identity.
- Do not deform packaging, change logos, invent text, or alter product silhouette.

## Branding lock phrases

- Preserve brand palette, tone, logo clear space, premium hierarchy, and campaign consistency.
- Avoid generic AI visuals, random typography, wrong colors, distorted marks, or off-brand composition.
