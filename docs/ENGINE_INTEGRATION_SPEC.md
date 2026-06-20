# Engine Integration Specification

## Principle

All AI providers must be wrapped by engine adapters. Business logic calls only the adapter interface, not provider SDKs directly.

## Image engines

- Midjourney
- DALL·E / GPT Image
- Flux
- Stable Diffusion
- Leonardo
- Runway
- Kling
- Pika
- Luma

## Clip engines

- KLING
- VEO
- WAN 2.6

## Audio engines

Admin-configurable.

## Upscale engines

Admin-configurable.

## Engine adapter contract

Each adapter must support:

- capabilities declaration
- cost estimation
- prompt validation
- job submission
- job status polling
- output normalization
- error normalization

## Capabilities model

Capabilities may include:

- text-to-image
- image-to-image
- inpaint
- reference lock
- style transfer
- product lock
- video generation
- image-to-video
- start/end frame
- audio generation
- upscale image
- upscale video

## Router logic

Engine recommendation should consider:

- domain
- workflow
- reference control need
- quality target
- cost target
- speed target
- clip duration
- audio requirement
- upscale requirement
