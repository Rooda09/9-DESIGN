# Product Requirements

## 1. Platform vision

A professional AI creative control platform that helps architects, photographers, brand specialists, and marketers create optimized prompts, images, clips, audio-backed scenes, upscaled outputs, reusable scenarios, and community-shared workflows.

## 2. Main domains

### Architecture

Primary value: preserve geometry and professional architectural control.

Must support:

- Exterior design
- Interior design
- Landscape/garden
- Urban/site/masterplan visuals
- Facade redesign
- Material alternatives
- Moodboards
- Real estate marketing visuals
- Architectural clips
- Storytelling sequences
- Geometry Guard
- Upscale
- Audio background for clips

### Photography

Primary value: product/photo realism, lighting, commercial output packs.

Must support:

- Product photography
- Fashion/editorial photography
- Food/beverage photography
- Jewelry/cosmetics/perfume
- Real estate photography
- Portrait/avatar photography
- E-commerce image packs
- Lifestyle scenes
- Photography clips
- Product motion scenarios
- Audio background for ads
- Upscale

### Branding

Primary value: brand consistency and campaign production.

Must support:

- Brand DNA
- Logo/monogram concept exploration
- Brand moodboards
- Campaign visuals
- Social media packs
- Real estate launch campaigns
- Product launch campaigns
- Brand films/clips
- Storytelling framework
- Sonic/audio mood prompts
- Upscale

## 3. User system

Required:

- Sign up
- Login
- Forgot password
- Email verification
- Profile
- Token wallet
- Refill tokens
- Token transaction history
- Subscription plan optional
- Personal library
- Public profile optional

## 4. Libraries

Each user owns:

- Prompt library
- Scenario library
- Image output library
- Clip output library
- Audio prompt library
- Upscale history
- Favorites
- Project folders
- Templates copied from admin library

## 5. Admin system

Admin can create/update/archive:

- Domains
- Dropdown groups
- Dropdown options
- Prompt templates
- Clip scenarios
- UI templates
- Engines
- Token costs
- Competition categories
- Community moderation
- Featured content

## 6. Dropdown rule

Most controls should be dropdown-based. Every dropdown option must contain:

- `domain`
- `group_key`
- `value`
- `label_en`
- `label_ar`
- `best_for`
- `description_en`
- `description_ar`
- `is_default`
- `sort_order`
- `is_active`

## 7. Prompt package

Each generation should create:

- Main prompt
- Negative prompt
- Engine-specific prompt
- Reference-role instructions
- Geometry/product/brand lock instructions
- Camera/lens instructions
- Lighting instructions
- Material/color instructions
- Storytelling instructions for clips
- Audio prompt if clip audio enabled
- Upscale prompt if upscale requested
- Quality checklist

## 8. Image engines

- Midjourney
- DALL·E / GPT Image
- Flux
- Stable Diffusion
- Leonardo
- Runway
- Kling
- Pika
- Luma

## 9. Clip engines

- KLING
- VEO
- WAN 2.6

## 10. Audio and upscale

Audio engines and upscale engines must be admin-configurable. Do not hardcode vendor dependencies in the database model.

## 11. Community

Community features:

- Public profiles
- Gallery
- Likes
- Saves
- Follows
- Comments optional
- Remixable prompts/scenarios
- Visibility control: private, public output only, public prompt preview, full remix, paid template

## 12. Competition zone

Competition features:

- Admin-created challenges
- Domain-specific categories
- Deadline
- Rules
- Submission requirements
- Voting
- Expert score
- Winner badges
- Featured winners

## 13. Token logic

Users pay tokens for:

- Image generation
- Clip generation
- Audio generation
- Upscale
- High-resolution export
- Advanced quality gate
- Batch generation

## 14. Safety and trust

The platform must not claim AI outputs are final architectural construction documents, code-compliant, structurally valid, or legal brand assets without professional verification.
