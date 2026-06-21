export const ARCHITECTURE_CLIP_ENGINE_KEYS = ['kling', 'veo', 'wan_2_6'] as const;
export type ArchitectureClipEngineKey = (typeof ARCHITECTURE_CLIP_ENGINE_KEYS)[number];

export const ARCHITECTURE_CAMERA_MOVEMENT_KEYS = [
  'slow_dolly_in',
  'orbit',
  'crane_up',
  'top_down_reveal',
  'parallax_slide',
  'handheld_cinematic',
  'static_hero_shot'
] as const;
export type ArchitectureCameraMovementKey = (typeof ARCHITECTURE_CAMERA_MOVEMENT_KEYS)[number];

export const ARCHITECTURE_CLIP_DURATIONS = [5, 8, 10, 15, 20] as const;
export type ArchitectureClipDuration = (typeof ARCHITECTURE_CLIP_DURATIONS)[number];

export const ARCHITECTURE_CONTINUITY_KEYS = [
  'preserveBuildingGeometry',
  'preserveFacadeOpenings',
  'preserveMaterialPalette',
  'preserveLightingMood',
  'preserveCameraDirection'
] as const;
export type ArchitectureContinuityKey = (typeof ARCHITECTURE_CONTINUITY_KEYS)[number];
export type ArchitectureContinuityState = Record<ArchitectureContinuityKey, boolean>;

export interface ArchitectureClipEngine {
  key: ArchitectureClipEngineKey;
  databaseKey: string;
  name: string;
  guidance: string;
}

export interface ArchitectureCameraMovement {
  key: ArchitectureCameraMovementKey;
  label: string;
  bestFor: string;
  prompt: string;
}

export interface ArchitectureContinuityControl {
  key: ArchitectureContinuityKey;
  label: string;
  description: string;
  instruction: string;
}

export interface ArchitectureClipScenarioSeed {
  key: string;
  titleEn: string;
  titleAr: string;
  category: string;
  style: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  scenarioPrompt: string;
  openingShot: string;
  subjectFocus: string;
  cameraMovement: ArchitectureCameraMovementKey;
  atmosphere: string;
  architecturalDetail: string;
  closingShot: string;
  durationSeconds: ArchitectureClipDuration;
  continuityDefaults: ArchitectureContinuityState;
  engineHints: Record<ArchitectureClipEngineKey, string>;
  maxCharacters: number;
  isPublished: boolean;
  version: number;
}

export const ARCHITECTURE_CLIP_ENGINES: ArchitectureClipEngine[] = [
  {
    key: 'kling',
    databaseKey: 'kling_video',
    name: 'Kling',
    guidance: 'Describe one continuous spatial move, stable building geometry, realistic parallax, and restrained environmental motion.'
  },
  {
    key: 'veo',
    databaseKey: 'veo',
    name: 'Veo',
    guidance: 'Use cinematic shot language with explicit subject continuity, physical camera behavior, atmosphere, and a controlled ending frame.'
  },
  {
    key: 'wan_2_6',
    databaseKey: 'wan_2_6',
    name: 'WAN 2.6',
    guidance: 'Use concise temporal instructions, a clear camera path, strong first and final frames, and explicit anti-morphing constraints.'
  }
];

export const ARCHITECTURE_CAMERA_MOVEMENTS: ArchitectureCameraMovement[] = [
  {
    key: 'slow_dolly_in',
    label: 'Slow dolly-in',
    bestFor: 'Entrances, hero facades, and calm spatial reveals',
    prompt: 'Move forward slowly on a stable dolly path with subtle foreground parallax and no change to lens direction.'
  },
  {
    key: 'orbit',
    label: 'Orbit',
    bestFor: 'Reading massing, facade depth, and corner conditions',
    prompt: 'Orbit smoothly around the subject at a constant radius and height while keeping the building centered and undistorted.'
  },
  {
    key: 'crane_up',
    label: 'Crane up',
    bestFor: 'Vertical facade hierarchy and roof or skyline reveals',
    prompt: 'Rise vertically with a controlled crane movement, preserving perspective and revealing upper levels without tilting the structure.'
  },
  {
    key: 'top_down_reveal',
    label: 'Top-down reveal',
    bestFor: 'Site planning, courtyards, roofs, and landscape relationships',
    prompt: 'Begin above the site and descend or tilt into a legible top-down reveal with stable site boundaries and true building proportions.'
  },
  {
    key: 'parallax_slide',
    label: 'Parallax slide',
    bestFor: 'Layered facades, colonnades, screens, and landscape foregrounds',
    prompt: 'Slide laterally at a measured pace, using foreground elements for natural parallax while keeping facade lines straight.'
  },
  {
    key: 'handheld_cinematic',
    label: 'Handheld cinematic',
    bestFor: 'Human-scale interiors and lived-in real estate moments',
    prompt: 'Use restrained stabilized handheld movement with subtle human cadence, no shake spikes, and consistent spatial orientation.'
  },
  {
    key: 'static_hero_shot',
    label: 'Static hero shot',
    bestFor: 'Material studies, day-to-night transitions, and final brand frames',
    prompt: 'Lock the camera in a static hero composition; allow only environmental, lighting, and subtle occupancy motion.'
  }
];

export const ARCHITECTURE_CONTINUITY_CONTROLS: ArchitectureContinuityControl[] = [
  {
    key: 'preserveBuildingGeometry',
    label: 'Preserve building geometry',
    description: 'Locks massing, floor count, roofline, proportions, structure, and site boundary throughout the clip.',
    instruction: 'Preserve exact building massing, floor count, roofline, structural rhythm, proportions, and plot boundary in every frame.'
  },
  {
    key: 'preserveFacadeOpenings',
    label: 'Preserve facade openings',
    description: 'Prevents windows, doors, balconies, and voids from shifting, multiplying, resizing, or disappearing.',
    instruction: 'Keep every facade opening, window, door, balcony, and void fixed in location, size, count, and proportion.'
  },
  {
    key: 'preserveMaterialPalette',
    label: 'Preserve material palette',
    description: 'Keeps material identity, color, texture scale, joints, and reflectance consistent between frames.',
    instruction: 'Maintain the approved material palette, texture scale, joint layout, color, weathering, and reflectance without flicker.'
  },
  {
    key: 'preserveLightingMood',
    label: 'Preserve lighting mood',
    description: 'Maintains exposure, color temperature, shadow direction, weather, and atmosphere unless the scenario is a time transition.',
    instruction: 'Maintain coherent exposure, color temperature, shadow direction, weather, and atmospheric density across the sequence.'
  },
  {
    key: 'preserveCameraDirection',
    label: 'Preserve camera direction',
    description: 'Keeps screen direction, horizon, lens character, and spatial orientation stable during movement.',
    instruction: 'Preserve screen direction, horizon level, lens character, camera path, and spatial orientation with no sudden reversals.'
  }
];

const FULL_CONTINUITY: ArchitectureContinuityState = {
  preserveBuildingGeometry: true,
  preserveFacadeOpenings: true,
  preserveMaterialPalette: true,
  preserveLightingMood: true,
  preserveCameraDirection: true
};

export const architectureClipScenarios: ArchitectureClipScenarioSeed[] = [
  {
    key: 'architecture_exterior_reveal',
    titleEn: 'Exterior Reveal',
    titleAr: 'كشف خارجي',
    category: 'exterior_reveal',
    style: 'controlled_cinematic',
    bestFor: 'Introducing a completed building from context to hero facade',
    descriptionEn: 'A measured reveal that moves from foreground or landscape context into a clear exterior hero frame.',
    descriptionAr: 'كشف متزن ينتقل من المقدمة أو سياق الموقع إلى لقطة رئيسية واضحة للواجهة الخارجية.',
    scenarioPrompt: 'Reveal the architecture gradually from its immediate context, establish scale, then settle on the principal facade.',
    openingShot: 'Begin partially screened by landscape or a site edge, with the building silhouette legible but not fully exposed.',
    subjectFocus: 'The principal exterior massing and entrance sequence.',
    cameraMovement: 'slow_dolly_in',
    atmosphere: 'Calm premium daylight with subtle wind in planting and physically plausible reflections.',
    architecturalDetail: 'Reveal facade depth, entrance hierarchy, shading devices, material joints, and human scale.',
    closingShot: 'Settle into a balanced three-quarter hero frame with the full facade readable.',
    durationSeconds: 8,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Favor stable geometry and a single slow continuous reveal.',
      veo: 'Emphasize cinematic foreground reveal and a composed final frame.',
      wan_2_6: 'Keep motion concise with explicit start and end compositions.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_facade_orbit',
    titleEn: 'Facade Orbit',
    titleAr: 'دوران حول الواجهة',
    category: 'facade_orbit',
    style: 'spatial_analysis',
    bestFor: 'Showing facade depth, corner conditions, screens, and layered envelopes',
    descriptionEn: 'A controlled orbit that explains facade articulation without changing the approved architecture.',
    descriptionAr: 'حركة دوران مضبوطة تشرح تفصيل الواجهة دون تغيير العمارة المعتمدة.',
    scenarioPrompt: 'Orbit around the building corner to explain facade layering, depth, openings, and material transitions.',
    openingShot: 'Start on an oblique facade view with the primary corner near frame center.',
    subjectFocus: 'Facade depth, corner articulation, screens, balconies, and opening rhythm.',
    cameraMovement: 'orbit',
    atmosphere: 'Clear soft daylight with restrained occupancy and stable shadow direction.',
    architecturalDetail: 'Track reveals, fins, screens, soffits, joints, glazing depth, and solid-to-void rhythm.',
    closingShot: 'Finish on the secondary elevation while preserving the original building scale and horizon.',
    durationSeconds: 10,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Use constant-radius orbital motion and strict opening continuity.',
      veo: 'Describe the corner transition and architectural reading of both elevations.',
      wan_2_6: 'State stable orbit radius, horizon, and facade details.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_slow_dolly_in',
    titleEn: 'Slow Dolly-In',
    titleAr: 'اقتراب بطيء',
    category: 'slow_dolly_in',
    style: 'quiet_luxury',
    bestFor: 'Entrances, hospitality approaches, and high-end residential hero shots',
    descriptionEn: 'A calm forward move that increases architectural presence while protecting perspective and geometry.',
    descriptionAr: 'حركة أمامية هادئة تعزز حضور العمارة مع حماية المنظور والهندسة.',
    scenarioPrompt: 'Approach the building slowly along its intended arrival axis and build attention toward the entrance.',
    openingShot: 'Begin from a human-scale arrival point with foreground paving or planting.',
    subjectFocus: 'The entrance, threshold, canopy, and primary facade composition.',
    cameraMovement: 'slow_dolly_in',
    atmosphere: 'Refined warm light, quiet occupancy, and subtle environmental movement.',
    architecturalDetail: 'Prioritize threshold depth, door scale, canopy structure, paving joints, and material tactility.',
    closingShot: 'Stop before the threshold in a stable symmetrical or near-symmetrical composition.',
    durationSeconds: 8,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Use a slow stabilized push with restrained parallax.',
      veo: 'Frame the approach as a clear beginning, progression, and threshold ending.',
      wan_2_6: 'Keep a single forward path and stable final composition.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_interior_walkthrough',
    titleEn: 'Interior Walkthrough',
    titleAr: 'جولة داخلية',
    category: 'interior_walkthrough',
    style: 'human_scale',
    bestFor: 'Explaining circulation, room sequence, and interior spatial character',
    descriptionEn: 'A human-height walkthrough with coherent room geometry, openings, finishes, and circulation.',
    descriptionAr: 'جولة بارتفاع الإنسان مع اتساق هندسة الغرف والفتحات والتشطيبات والحركة.',
    scenarioPrompt: 'Move through the interior as a restrained architectural walkthrough that explains circulation and spatial sequence.',
    openingShot: 'Begin at the room threshold with the main destination visible ahead.',
    subjectFocus: 'Spatial sequence, circulation axis, daylight, furnishings, and relationship between rooms.',
    cameraMovement: 'handheld_cinematic',
    atmosphere: 'Natural interior daylight, realistic exposure adaptation, and subtle lived-in movement.',
    architecturalDetail: 'Maintain wall, column, ceiling, opening, joinery, floor, and furniture continuity.',
    closingShot: 'Arrive at the primary room or framed view and pause in a stable human-height composition.',
    durationSeconds: 15,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Prioritize stable interior geometry and restrained stabilized motion.',
      veo: 'Describe room-to-room continuity and exposure behavior.',
      wan_2_6: 'Use a simple path with fixed walls, openings, and furnishings.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_landscape_flythrough',
    titleEn: 'Landscape Flythrough',
    titleAr: 'تحليق عبر الموقع',
    category: 'landscape_flythrough',
    style: 'site_narrative',
    bestFor: 'Landscape strategies, resort grounds, courtyards, and public realm sequences',
    descriptionEn: 'A smooth site-scale move that connects planting, hardscape, water, circulation, and fixed architecture.',
    descriptionAr: 'حركة سلسة على مستوى الموقع تربط الزراعة والتبليط والماء والحركة والعمارة الثابتة.',
    scenarioPrompt: 'Travel through the landscape sequence while keeping the architecture and site organization stable.',
    openingShot: 'Start above or beside a landscape threshold with the primary path clearly visible.',
    subjectFocus: 'Planting structure, hardscape, water, terrain, circulation, and relationship to the building.',
    cameraMovement: 'parallax_slide',
    atmosphere: 'Natural wind, restrained water movement, believable planting motion, and consistent sunlight.',
    architecturalDetail: 'Show edge conditions, level changes, paving modules, planting density, and landscape lighting.',
    closingShot: 'End where the landscape frames the building or a key outdoor room.',
    durationSeconds: 15,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Use stable site geometry with subtle vegetation motion.',
      veo: 'Emphasize the landscape sequence and final architectural frame.',
      wan_2_6: 'Keep site boundaries and path alignment explicit.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_material_close_up',
    titleEn: 'Material Close-Up',
    titleAr: 'لقطة مقربة للمواد',
    category: 'material_close_up',
    style: 'tactile_detail',
    bestFor: 'Facade materials, joints, craftsmanship, and specification storytelling',
    descriptionEn: 'A close architectural detail shot focused on honest texture, joint logic, weathering, and light response.',
    descriptionAr: 'لقطة معمارية تفصيلية تركز على الملمس الصادق ومنطق الفواصل والتقادم واستجابة الضوء.',
    scenarioPrompt: 'Study one facade or interior material junction at close range without changing its construction logic.',
    openingShot: 'Begin on a wider detail that establishes where the material sits within the architecture.',
    subjectFocus: 'Material texture, joint layout, edge detail, reflectance, weathering, and craftsmanship.',
    cameraMovement: 'parallax_slide',
    atmosphere: 'Soft raking light with restrained highlights and no artificial texture animation.',
    architecturalDetail: 'Keep texture scale, bond, seams, fixings, shadow gaps, and adjacent materials physically correct.',
    closingShot: 'Finish on the key junction or crafted edge in sharp, stable focus.',
    durationSeconds: 5,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Keep detail motion slow and material texture locked.',
      veo: 'Describe tactile light behavior and construction logic.',
      wan_2_6: 'Use a short lateral move with explicit no-flicker material constraints.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_day_to_night',
    titleEn: 'Day-to-Night Transition',
    titleAr: 'انتقال من النهار إلى الليل',
    category: 'day_to_night_transition',
    style: 'time_transition',
    bestFor: 'Showing facade lighting, hospitality atmosphere, and evening identity',
    descriptionEn: 'A locked-camera time transition that preserves architecture while daylight fades and artificial lighting activates.',
    descriptionAr: 'انتقال زمني بكاميرا ثابتة يحافظ على العمارة مع تلاشي ضوء النهار وتشغيل الإضاءة الصناعية.',
    scenarioPrompt: 'Transition from late daylight to blue hour and night while preserving the exact building and composition.',
    openingShot: 'Begin in late-afternoon daylight with facade materials and landscape clearly readable.',
    subjectFocus: 'The building envelope, interior glow, facade lighting, landscape lighting, and changing sky.',
    cameraMovement: 'static_hero_shot',
    atmosphere: 'A physically plausible shift from warm daylight to blue hour and controlled night illumination.',
    architecturalDetail: 'Keep windows, luminaires, material response, reflections, and shadow logic consistent.',
    closingShot: 'End on a refined night hero frame with balanced interior and exterior exposure.',
    durationSeconds: 10,
    continuityDefaults: { ...FULL_CONTINUITY, preserveLightingMood: false },
    engineHints: {
      kling: 'Lock camera and geometry; animate only believable light and environment changes.',
      veo: 'Describe a continuous exposure and color-temperature transition.',
      wan_2_6: 'Use explicit fixed first/last composition and no geometry morphing.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_before_after_renovation',
    titleEn: 'Before / After Renovation',
    titleAr: 'قبل وبعد التجديد',
    category: 'before_after_renovation',
    style: 'comparative_transition',
    bestFor: 'Renovation concepts, facade upgrades, and client comparison stories',
    descriptionEn: 'A controlled transformation between existing and proposed states with a fixed viewpoint and legible scope.',
    descriptionAr: 'تحول مضبوط بين الحالة القائمة والمقترحة مع منظور ثابت ونطاق واضح.',
    scenarioPrompt: 'Present a clear before-to-after renovation transition while preserving all elements outside the approved intervention.',
    openingShot: 'Hold the existing condition in a stable documentary-style frame.',
    subjectFocus: 'The approved renovation scope and the architectural difference between existing and proposed states.',
    cameraMovement: 'static_hero_shot',
    atmosphere: 'Neutral comparison lighting with a smooth, non-destructive transition.',
    architecturalDetail: 'Transform only approved facade, material, landscape, or finish elements; keep geometry and openings locked unless specified.',
    closingShot: 'Hold the completed proposal in the exact same framing for direct comparison.',
    durationSeconds: 8,
    continuityDefaults: { ...FULL_CONTINUITY, preserveMaterialPalette: false },
    engineHints: {
      kling: 'Use a fixed comparison frame and controlled surface transformation.',
      veo: 'State the approved intervention and unchanged elements explicitly.',
      wan_2_6: 'Lock viewpoint and prevent intermediate geometry melting.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_aerial_site_reveal',
    titleEn: 'Aerial Site Reveal',
    titleAr: 'كشف جوي للموقع',
    category: 'aerial_site_reveal',
    style: 'site_context',
    bestFor: 'Masterplans, villas in context, resorts, campuses, and site relationships',
    descriptionEn: 'An aerial reveal that explains access, landscape, orientation, neighboring context, and building placement.',
    descriptionAr: 'كشف جوي يوضح الوصول والمناظر الطبيعية والاتجاه والسياق المجاور وموقع المبنى.',
    scenarioPrompt: 'Reveal the full site from above with accurate building placement, boundaries, access, landscape, and context.',
    openingShot: 'Begin on a close elevated view of the primary building or courtyard.',
    subjectFocus: 'Building placement, plot boundary, access, landscape structure, orientation, and surrounding context.',
    cameraMovement: 'crane_up',
    atmosphere: 'Clear atmospheric depth, realistic wind, stable shadows, and restrained site activity.',
    architecturalDetail: 'Maintain roof geometry, site levels, roads, paths, planting zones, and neighboring scale.',
    closingShot: 'Finish on a wide aerial composition where the full site organization is legible.',
    durationSeconds: 15,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Use a smooth vertical pullback with locked site geometry.',
      veo: 'Explain the progression from building detail to complete site context.',
      wan_2_6: 'Keep plot boundary, access, roof, and landscape alignment fixed.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_cinematic_real_estate_teaser',
    titleEn: 'Cinematic Real Estate Teaser',
    titleAr: 'إعلان عقاري سينمائي',
    category: 'cinematic_real_estate_teaser',
    style: 'premium_marketing',
    bestFor: 'Short premium property teasers without overpromising unbuilt design certainty',
    descriptionEn: 'A concise architectural teaser combining arrival, detail, atmosphere, and a memorable final property frame.',
    descriptionAr: 'إعلان معماري موجز يجمع الوصول والتفاصيل والأجواء ولقطة نهائية مميزة للعقار.',
    scenarioPrompt: 'Create a short premium architecture teaser that remains design-led, spatially coherent, and honest about the proposed visualization.',
    openingShot: 'Open with a restrained establishing glimpse of the property and its setting.',
    subjectFocus: 'Arrival, exterior identity, one tactile detail, atmosphere, and a clear property hero moment.',
    cameraMovement: 'slow_dolly_in',
    atmosphere: 'Premium but believable light, subtle occupancy, controlled reflections, and quiet environmental motion.',
    architecturalDetail: 'Feature entrance hierarchy, facade craftsmanship, landscape relationship, and interior glow without changing the design.',
    closingShot: 'Conclude on a memorable wide hero frame with visual space for optional editorial titling outside the generated video.',
    durationSeconds: 20,
    continuityDefaults: { ...FULL_CONTINUITY },
    engineHints: {
      kling: 'Use stable architectural motion and avoid rapid montage behavior.',
      veo: 'Structure the sequence as a concise premium property narrative.',
      wan_2_6: 'Keep one coherent visual path and a strong final frame.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  }
];

export function getArchitectureClipScenario(key: string) {
  return architectureClipScenarios.find(scenario => scenario.key === key);
}

export function getArchitectureCameraMovement(key: ArchitectureCameraMovementKey) {
  return ARCHITECTURE_CAMERA_MOVEMENTS.find(movement => movement.key === key);
}

export function getArchitectureClipEngine(key: ArchitectureClipEngineKey) {
  return ARCHITECTURE_CLIP_ENGINES.find(engine => engine.key === key);
}
