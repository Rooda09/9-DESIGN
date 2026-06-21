# Product Requirements

## 1. Platform vision

A professional AI creative control platform that helps architects, photographers, brand specialists, and marketers create optimized prompts, images, clips, audio-backed scenes, upscaled outputs, reusable scenarios, and community-shared workflows.

Current MVP scope: Architecture Studio first. The implemented user flows are the database-backed Architecture Prompt Compiler, the Architecture-only Clip Scenario Builder, Architecture Upscale prompt planning, and Architecture Clip Audio prompt planning. They support Geometry Guard, reference roles, prompt previews, clip storytelling, camera movement, continuity planning, image preservation controls, audio mood/SFX direction, engine-specific packages, and private prompt/scenario saves. Photography, Branding, Community, Competitions, Payments, Marketplace, real AI generation, provider upscale execution, audio generation, and general multi-domain clips/upscale/audio remain future placeholders unless explicitly implemented in later phases.

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

### Phase 4B Architecture clip scope

The Architecture Clip Scenario Builder is available at `/create/architecture/clips`.

Required scenario types:

- Exterior reveal
- Facade orbit
- Slow dolly-in
- Interior walkthrough
- Landscape flythrough
- Material close-up
- Day-to-night transition
- Before/after renovation
- Aerial site reveal
- Cinematic real estate teaser

Each compiled Architecture clip package contains:

- Scenario title
- Storytelling prompt
- Opening, focus, camera, atmosphere, detail, and closing shot list
- Camera movement prompt
- Architecture continuity instructions
- Negative video prompt
- Engine-specific video prompt
- Architecture quality checklist

Phase 4B compiles and stores private planning records only. It does not call a video provider, create a generation job, charge tokens, upload media, or produce a clip file.

## 10. Audio and upscale

Audio engines and upscale engines must be admin-configurable. Do not hardcode vendor dependencies in the database model.

### Phase 4C Architecture upscale scope

The Architecture Upscale workflow is available at `/create/architecture/upscale`.

Required upscale intent options:

- Enhance render realism
- Sharpen facade details
- Improve material texture
- Improve lighting and shadows
- Clean AI artifacts
- Upscale for presentation board
- Upscale for social media
- Upscale for client marketing

Required image quality controls:

- Geometry preservation
- Facade detail preservation
- Material fidelity
- Edge sharpness
- Noise/artifact reduction
- Lighting balance
- Realistic scale
- No new unwanted elements

Each compiled Architecture upscale package contains:

- Upscale objective
- Preservation instructions
- Enhancement instructions
- Negative upscale prompt
- Output format notes
- Quality checklist

Phase 4C upscale compiles and stores private planning records only. It does not upload source images, call an upscale provider, create a generation job, charge tokens, or produce an image file.

### Phase 4C Architecture clip audio scope

The Architecture Clip Audio Prompt workflow is available at `/create/architecture/audio`.

Required audio mood options:

- Cinematic ambient
- Luxury calm
- Futuristic minimal
- Warm residential
- Urban commercial
- Desert atmosphere
- Night architectural reveal
- Gallery / museum calm

Required SFX direction options:

- Subtle wind
- Soft footsteps
- City ambience
- Water feature
- Distant traffic
- Interior room tone
- Soft mechanical hum
- No SFX

Each compiled Architecture audio prompt package contains:

- Background audio prompt
- SFX direction
- Voiceover placeholder
- Timing notes
- Loop/seamless instruction
- Negative audio prompt

Phase 4C audio compiles and stores private planning records only. It does not call an audio provider, create a generation job, charge tokens, produce an audio file, or add non-Architecture clip workflows.

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
