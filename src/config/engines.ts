export const initialEngines = [
  { key: 'midjourney', name: 'Midjourney', type: 'IMAGE', supportsTextToImage: true, supportsReferenceLock: true, defaultTokenCost: 8 },
  { key: 'gpt_image', name: 'DALL·E / GPT Image', type: 'IMAGE', supportsTextToImage: true, supportsImageToImage: true, defaultTokenCost: 8 },
  { key: 'flux', name: 'Flux', type: 'IMAGE', supportsTextToImage: true, supportsImageToImage: true, defaultTokenCost: 6 },
  { key: 'stable_diffusion', name: 'Stable Diffusion', type: 'IMAGE', supportsTextToImage: true, supportsImageToImage: true, supportsReferenceLock: true, defaultTokenCost: 4 },
  { key: 'leonardo', name: 'Leonardo', type: 'IMAGE', supportsTextToImage: true, supportsImageToImage: true, defaultTokenCost: 6 },
  { key: 'runway_image', name: 'Runway Image', type: 'IMAGE', supportsTextToImage: true, supportsImageToImage: true, defaultTokenCost: 7 },
  { key: 'kling_image', name: 'Kling Image', type: 'IMAGE', supportsTextToImage: true, supportsImageToImage: true, defaultTokenCost: 7 },
  { key: 'pika_image', name: 'Pika Image', type: 'IMAGE', supportsTextToImage: true, defaultTokenCost: 6 },
  { key: 'luma_image', name: 'Luma Image', type: 'IMAGE', supportsTextToImage: true, defaultTokenCost: 7 },
  { key: 'kling_clip', name: 'KLING', type: 'CLIP', supportsTextToVideo: true, supportsImageToVideo: true, defaultTokenCost: 20 },
  { key: 'veo_clip', name: 'VEO', type: 'CLIP', supportsTextToVideo: true, supportsImageToVideo: true, defaultTokenCost: 30 },
  { key: 'wan_2_6_clip', name: 'WAN 2.6', type: 'CLIP', supportsTextToVideo: true, supportsImageToVideo: true, defaultTokenCost: 18 }
] as const;
