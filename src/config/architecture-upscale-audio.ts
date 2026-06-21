export const ARCHITECTURE_UPSCALE_INTENT_KEYS = [
  'enhance_render_realism',
  'sharpen_facade_details',
  'improve_material_texture',
  'improve_lighting_and_shadows',
  'clean_ai_artifacts',
  'upscale_for_presentation_board',
  'upscale_for_social_media',
  'upscale_for_client_marketing'
] as const;
export type ArchitectureUpscaleIntentKey = (typeof ARCHITECTURE_UPSCALE_INTENT_KEYS)[number];

export const ARCHITECTURE_UPSCALE_CONTROL_KEYS = [
  'geometry_preservation',
  'facade_detail_preservation',
  'material_fidelity',
  'edge_sharpness',
  'noise_artifact_reduction',
  'lighting_balance',
  'realistic_scale',
  'no_new_unwanted_elements'
] as const;
export type ArchitectureUpscaleControlKey = (typeof ARCHITECTURE_UPSCALE_CONTROL_KEYS)[number];

export const ARCHITECTURE_AUDIO_MOOD_KEYS = [
  'cinematic_ambient',
  'luxury_calm',
  'futuristic_minimal',
  'warm_residential',
  'urban_commercial',
  'desert_atmosphere',
  'night_architectural_reveal',
  'gallery_museum_calm'
] as const;
export type ArchitectureAudioMoodKey = (typeof ARCHITECTURE_AUDIO_MOOD_KEYS)[number];

export const ARCHITECTURE_SFX_DIRECTION_KEYS = [
  'subtle_wind',
  'soft_footsteps',
  'city_ambience',
  'water_feature',
  'distant_traffic',
  'interior_room_tone',
  'soft_mechanical_hum',
  'no_sfx'
] as const;
export type ArchitectureSfxDirectionKey = (typeof ARCHITECTURE_SFX_DIRECTION_KEYS)[number];

export const ARCHITECTURE_AUDIO_DURATIONS = [5, 8, 10, 15, 20] as const;
export type ArchitectureAudioDuration = (typeof ARCHITECTURE_AUDIO_DURATIONS)[number];

export interface ArchitectureUpscaleIntent {
  key: ArchitectureUpscaleIntentKey;
  labelEn: string;
  labelAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  objective: string;
  enhancementInstruction: string;
  outputFormatNote: string;
}

export interface ArchitectureUpscaleControl {
  key: ArchitectureUpscaleControlKey;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  preservationInstruction: string;
  checklistItem: string;
}

export interface ArchitectureAudioMood {
  key: ArchitectureAudioMoodKey;
  labelEn: string;
  labelAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  promptFragment: string;
}

export interface ArchitectureSfxDirection {
  key: ArchitectureSfxDirectionKey;
  labelEn: string;
  labelAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  promptFragment: string;
}

export const architectureUpscaleIntents: ArchitectureUpscaleIntent[] = [
  {
    key: 'enhance_render_realism',
    labelEn: 'Enhance render realism',
    labelAr: 'تعزيز واقعية الرندر',
    bestFor: 'General architectural render polish before client review',
    descriptionEn: 'Improves believable material response, shadow depth, exposure, and natural detail without redesigning the building.',
    descriptionAr: 'يحسن استجابة المواد والظلال والتعريض والتفاصيل الطبيعية دون إعادة تصميم المبنى.',
    objective: 'Enhance the architectural render realism while preserving the approved design, viewpoint, geometry, and spatial intent.',
    enhancementInstruction: 'Improve material response, ambient occlusion, shadow softness, reflected light, glazing realism, and natural detail balance.',
    outputFormatNote: 'Prepare a clean high-resolution render suitable for client review and neutral comparison.'
  },
  {
    key: 'sharpen_facade_details',
    labelEn: 'Sharpen facade details',
    labelAr: 'زيادة حدة تفاصيل الواجهة',
    bestFor: 'Facade review, elevation clarity, and close client comments',
    descriptionEn: 'Clarifies openings, joints, screens, fins, balcony edges, mullions, and facade rhythm.',
    descriptionAr: 'يوضح الفتحات والفواصل والشاشات والزعانف وحواف الشرفات والقواطع وإيقاع الواجهة.',
    objective: 'Sharpen facade details so the architectural envelope reads clearly without changing its composition.',
    enhancementInstruction: 'Clarify window edges, shadow gaps, panel joints, mullions, screens, soffits, balcony lines, and facade depth.',
    outputFormatNote: 'Prioritize crisp facade readability at presentation scale without harsh artificial sharpening.'
  },
  {
    key: 'improve_material_texture',
    labelEn: 'Improve material texture',
    labelAr: 'تحسين ملمس المواد',
    bestFor: 'Stone, concrete, timber, metal, glazing, and finish studies',
    descriptionEn: 'Improves texture scale, joint logic, reflectance, weathering, and tactile material character.',
    descriptionAr: 'يحسن مقياس الملمس ومنطق الفواصل والانعكاس والتقادم والحس المادي.',
    objective: 'Improve material texture fidelity while keeping the approved palette, scale, and construction logic intact.',
    enhancementInstruction: 'Refine texture grain, stone veining, concrete pores, timber direction, metal reflectance, glazing depth, and believable weathering.',
    outputFormatNote: 'Keep material texture honest and reviewable, avoiding decorative noise or fake surface patterns.'
  },
  {
    key: 'improve_lighting_and_shadows',
    labelEn: 'Improve lighting and shadows',
    labelAr: 'تحسين الإضاءة والظلال',
    bestFor: 'Images with flat exposure, weak depth, or unclear architectural massing',
    descriptionEn: 'Balances exposure, contact shadows, facade depth, interior glow, sky response, and realistic shadow direction.',
    descriptionAr: 'يوازن التعريض وظلال التلامس وعمق الواجهة والتوهج الداخلي واستجابة السماء واتجاه الظلال الواقعي.',
    objective: 'Improve architectural lighting and shadows while preserving the original time-of-day logic and camera composition.',
    enhancementInstruction: 'Balance highlights, midtones, contact shadows, facade depth, interior glow, sky exposure, and physically plausible shadow direction.',
    outputFormatNote: 'Output should feel more spatial and realistic without creating a different lighting concept.'
  },
  {
    key: 'clean_ai_artifacts',
    labelEn: 'Clean AI artifacts',
    labelAr: 'تنظيف عيوب الذكاء الاصطناعي',
    bestFor: 'AI renders with warped edges, fake text, texture crawl, or inconsistent small details',
    descriptionEn: 'Removes visual errors while protecting the valid architecture and composition.',
    descriptionAr: 'يزيل الأخطاء البصرية مع حماية العمارة الصحيحة والتكوين.',
    objective: 'Clean AI artifacts from the architectural image without inventing new design elements.',
    enhancementInstruction: 'Correct warped details, smeared edges, broken mullions, noisy reflections, fake text, duplicated objects, and inconsistent texture patches.',
    outputFormatNote: 'Deliver a cleaner presentation image that still matches the original approved render.'
  },
  {
    key: 'upscale_for_presentation_board',
    labelEn: 'Upscale for presentation board',
    labelAr: 'تكبير للوحة عرض',
    bestFor: 'A1/A2 boards, studio reviews, competition sheets, and client decks',
    descriptionEn: 'Optimizes clarity, edge control, and print-readiness for board layouts.',
    descriptionAr: 'يحسن الوضوح وضبط الحواف وجاهزية الطباعة للوحات العرض.',
    objective: 'Upscale the architectural image for a presentation board with controlled clarity and print-safe detail.',
    enhancementInstruction: 'Improve line clarity, facade readability, material definition, soft contrast, and legibility at large board scale.',
    outputFormatNote: 'Prepare for high-resolution board placement with clean margins, natural contrast, and no over-processed halos.'
  },
  {
    key: 'upscale_for_social_media',
    labelEn: 'Upscale for social media',
    labelAr: 'تكبير لمنصات التواصل',
    bestFor: 'Instagram, Behance previews, reels covers, and portfolio snippets',
    descriptionEn: 'Optimizes immediate visual impact while preserving architectural honesty.',
    descriptionAr: 'يحسن التأثير البصري السريع مع الحفاظ على صدق العمارة.',
    objective: 'Upscale the architectural image for social media while keeping the design credible and not over-stylized.',
    enhancementInstruction: 'Improve crispness, contrast balance, thumbnail readability, focal hierarchy, and clean atmospheric polish.',
    outputFormatNote: 'Prepare a social-ready image with strong readability at small sizes and no fake dramatic effects.'
  },
  {
    key: 'upscale_for_client_marketing',
    labelEn: 'Upscale for client marketing',
    labelAr: 'تكبير للتسويق للعميل',
    bestFor: 'Real estate decks, launch visuals, website hero images, and brochure renders',
    descriptionEn: 'Creates a polished marketing-ready render while avoiding misleading construction certainty.',
    descriptionAr: 'ينشئ صورة تسويقية مصقولة مع تجنب الإيحاء بيقين إنشائي مضلل.',
    objective: 'Upscale the architectural render for client marketing with premium clarity and realistic polish.',
    enhancementInstruction: 'Improve hero-frame clarity, material richness, glazing quality, landscape freshness, atmosphere, and composed commercial polish.',
    outputFormatNote: 'Output should be marketing-ready but still clearly a visualization, not a construction or legal representation.'
  }
];

export const architectureUpscaleControls: ArchitectureUpscaleControl[] = [
  {
    key: 'geometry_preservation',
    labelEn: 'Geometry preservation',
    labelAr: 'حفظ الهندسة',
    descriptionEn: 'Protects massing, floor count, roofline, structure, plot boundary, and perspective.',
    descriptionAr: 'يحمي الكتلة وعدد الطوابق وخط السقف والهيكل وحدود الموقع والمنظور.',
    preservationInstruction: 'Preserve exact building massing, floor count, roofline, structural rhythm, site boundary, and camera perspective.',
    checklistItem: 'Massing, floor count, roofline, and perspective remain unchanged'
  },
  {
    key: 'facade_detail_preservation',
    labelEn: 'Facade detail preservation',
    labelAr: 'حفظ تفاصيل الواجهة',
    descriptionEn: 'Keeps windows, doors, balconies, screens, mullions, and facade rhythm fixed.',
    descriptionAr: 'يحافظ على النوافذ والأبواب والشرفات والشاشات والقواطع وإيقاع الواجهة.',
    preservationInstruction: 'Preserve every facade opening, balcony, screen, mullion, reveal, and solid-to-void rhythm.',
    checklistItem: 'Facade openings, screens, mullions, and details do not shift or multiply'
  },
  {
    key: 'material_fidelity',
    labelEn: 'Material fidelity',
    labelAr: 'دقة المواد',
    descriptionEn: 'Keeps palette, texture scale, joints, reflectance, and weathering believable.',
    descriptionAr: 'يحافظ على اللوحة ومقياس الملمس والفواصل والانعكاس والتقادم بشكل واقعي.',
    preservationInstruction: 'Preserve approved material palette, texture scale, joint spacing, reflectance, and weathering logic.',
    checklistItem: 'Material identity, texture scale, and joint logic remain faithful'
  },
  {
    key: 'edge_sharpness',
    labelEn: 'Edge sharpness',
    labelAr: 'حدة الحواف',
    descriptionEn: 'Improves architectural edges without halos, jagged lines, or artificial outlines.',
    descriptionAr: 'يحسن حواف العمارة دون هالات أو خطوط متكسرة أو تحديد صناعي.',
    preservationInstruction: 'Sharpen edges naturally while avoiding halos, jagged silhouettes, double lines, and artificial outlines.',
    checklistItem: 'Edges are crisp but not haloed or over-sharpened'
  },
  {
    key: 'noise_artifact_reduction',
    labelEn: 'Noise / artifact reduction',
    labelAr: 'تقليل الضجيج والعيوب',
    descriptionEn: 'Reduces grain, smears, fake text, broken small objects, and AI residue.',
    descriptionAr: 'يقلل الحبوب والطمس والنصوص الزائفة والعناصر الصغيرة المكسورة وبقايا الذكاء الاصطناعي.',
    preservationInstruction: 'Remove noise, smearing, fake text, broken details, duplicated objects, and AI residue without redesigning the scene.',
    checklistItem: 'Noise, fake text, smears, and AI artifacts are cleaned'
  },
  {
    key: 'lighting_balance',
    labelEn: 'Lighting balance',
    labelAr: 'توازن الإضاءة',
    descriptionEn: 'Balances exposure, contrast, shadow direction, interior glow, and sky response.',
    descriptionAr: 'يوازن التعريض والتباين واتجاه الظلال والتوهج الداخلي واستجابة السماء.',
    preservationInstruction: 'Balance exposure, contrast, shadow direction, interior glow, and sky response without changing the original lighting concept.',
    checklistItem: 'Lighting is balanced and physically coherent'
  },
  {
    key: 'realistic_scale',
    labelEn: 'Realistic scale',
    labelAr: 'مقياس واقعي',
    descriptionEn: 'Protects human scale, furniture scale, landscape scale, and structural proportions.',
    descriptionAr: 'يحمي مقياس الإنسان والأثاث والمناظر الطبيعية والنسب الإنشائية.',
    preservationInstruction: 'Preserve realistic human, furniture, landscape, opening, and structural scale relationships.',
    checklistItem: 'Human, landscape, furniture, and structural scale remain believable'
  },
  {
    key: 'no_new_unwanted_elements',
    labelEn: 'No new unwanted elements',
    labelAr: 'منع العناصر غير المطلوبة',
    descriptionEn: 'Prevents new windows, floors, signs, furniture, plants, people, vehicles, or objects unless requested.',
    descriptionAr: 'يمنع إضافة نوافذ أو طوابق أو لافتات أو أثاث أو نباتات أو أشخاص أو مركبات أو عناصر غير مطلوبة.',
    preservationInstruction: 'Do not add new floors, openings, signage, furniture, planting, people, vehicles, objects, logos, or decorative elements unless explicitly requested.',
    checklistItem: 'No unrequested floors, openings, signs, people, vehicles, or objects appear'
  }
];

export const architectureAudioMoods: ArchitectureAudioMood[] = [
  {
    key: 'cinematic_ambient',
    labelEn: 'Cinematic ambient',
    labelAr: 'أجواء سينمائية',
    bestFor: 'Exterior reveals, aerial site reveals, and premium establishing shots',
    descriptionEn: 'A broad atmospheric bed with restrained cinematic depth and slow emotional movement.',
    descriptionAr: 'طبقة صوتية واسعة بأجواء سينمائية منضبطة وحركة عاطفية بطيئة.',
    promptFragment: 'cinematic ambient architectural bed, wide spatial atmosphere, slow evolving pads, restrained low-end warmth, no dominant melody'
  },
  {
    key: 'luxury_calm',
    labelEn: 'Luxury calm',
    labelAr: 'فخامة هادئة',
    bestFor: 'High-end villas, hospitality, and real estate marketing clips',
    descriptionEn: 'Elegant, quiet, premium audio with soft texture and refined pacing.',
    descriptionAr: 'صوت أنيق وهادئ وفاخر بملمس ناعم وإيقاع راق.',
    promptFragment: 'luxury calm background score, soft premium textures, gentle spacious pads, slow confident pacing, polished architectural mood'
  },
  {
    key: 'futuristic_minimal',
    labelEn: 'Futuristic minimal',
    labelAr: 'مستقبلي بسيط',
    bestFor: 'Modern galleries, tech offices, clean towers, and minimal interiors',
    descriptionEn: 'Minimal synthetic tone with precise, clean, future-facing restraint.',
    descriptionAr: 'نغمة تركيبية بسيطة بدقة ونقاء واتجاه مستقبلي منضبط.',
    promptFragment: 'futuristic minimal architecture audio, clean synthetic pulses, soft sub texture, precise spacious rhythm, restrained and gallery-like'
  },
  {
    key: 'warm_residential',
    labelEn: 'Warm residential',
    labelAr: 'سكني دافئ',
    bestFor: 'Homes, villas, interiors, terraces, and human-scale walkthroughs',
    descriptionEn: 'Warm, intimate ambience that supports comfort, daylight, and residential calm.',
    descriptionAr: 'أجواء دافئة وحميمة تدعم الراحة وضوء النهار والهدوء السكني.',
    promptFragment: 'warm residential ambience, soft acoustic warmth, gentle room tone, calm daylight mood, human-scale comfort'
  },
  {
    key: 'urban_commercial',
    labelEn: 'Urban commercial',
    labelAr: 'حضري تجاري',
    bestFor: 'Retail, office, mixed-use, street frontage, and launch visuals',
    descriptionEn: 'Clean contemporary urban pulse with controlled energy and commercial polish.',
    descriptionAr: 'نبض حضري معاصر ونظيف بطاقة منضبطة ولمسة تجارية مصقولة.',
    promptFragment: 'urban commercial background bed, clean modern pulse, subtle city energy, polished retail-office atmosphere, no aggressive beat'
  },
  {
    key: 'desert_atmosphere',
    labelEn: 'Desert atmosphere',
    labelAr: 'أجواء صحراوية',
    bestFor: 'Hot-arid villas, desert resorts, courtyards, and regional architecture',
    descriptionEn: 'Dry spacious atmosphere with subtle wind, warmth, and regional restraint.',
    descriptionAr: 'أجواء جافة وواسعة مع ريح خفيفة ودفء وانضباط محلي.',
    promptFragment: 'desert architectural atmosphere, spacious warm air, subtle wind texture, soft distant resonance, calm regional restraint'
  },
  {
    key: 'night_architectural_reveal',
    labelEn: 'Night architectural reveal',
    labelAr: 'كشف معماري ليلي',
    bestFor: 'Blue hour, night hero frames, facade lighting, and hospitality clips',
    descriptionEn: 'Quiet nocturnal mood that supports facade lighting and interior glow.',
    descriptionAr: 'مزاج ليلي هادئ يدعم إضاءة الواجهة والتوهج الداخلي.',
    promptFragment: 'night architectural reveal audio, deep quiet ambience, soft luminous tone, subtle suspense, elegant blue-hour atmosphere'
  },
  {
    key: 'gallery_museum_calm',
    labelEn: 'Gallery / museum calm',
    labelAr: 'هدوء معرض أو متحف',
    bestFor: 'Cultural interiors, exhibition spaces, museums, and material close-ups',
    descriptionEn: 'Silent, precise, refined audio space with minimal movement and contemplative tone.',
    descriptionAr: 'فراغ صوتي هادئ ودقيق وراق بحركة قليلة ونبرة تأملية.',
    promptFragment: 'gallery museum calm audio, quiet refined room tone, minimal evolving texture, contemplative spatial ambience, no rhythmic distraction'
  }
];

export const architectureSfxDirections: ArchitectureSfxDirection[] = [
  {
    key: 'subtle_wind',
    labelEn: 'Subtle wind',
    labelAr: 'ريح خفيفة',
    bestFor: 'Exterior, landscape, desert, and aerial reveals',
    descriptionEn: 'Adds very light environmental air movement without distracting from the architecture.',
    descriptionAr: 'يضيف حركة هواء بيئية خفيفة جداً دون تشتيت عن العمارة.',
    promptFragment: 'very subtle wind texture, low in mix, natural and continuous'
  },
  {
    key: 'soft_footsteps',
    labelEn: 'Soft footsteps',
    labelAr: 'خطوات ناعمة',
    bestFor: 'Interior walkthroughs, corridors, galleries, and residential scenes',
    descriptionEn: 'Adds occasional soft footsteps for human scale and circulation.',
    descriptionAr: 'يضيف خطوات ناعمة متقطعة لإظهار المقياس الإنساني والحركة.',
    promptFragment: 'occasional soft footsteps, natural interior scale, quiet and sparse'
  },
  {
    key: 'city_ambience',
    labelEn: 'City ambience',
    labelAr: 'أجواء مدينة',
    bestFor: 'Urban commercial, mixed-use, office, and street frontage clips',
    descriptionEn: 'Adds distant city presence without turning the clip into a street soundscape.',
    descriptionAr: 'يضيف حضوراً حضرياً بعيداً دون تحويل المقطع إلى مشهد صوتي صاخب.',
    promptFragment: 'distant city ambience, soft urban bed, low traffic and human presence far in background'
  },
  {
    key: 'water_feature',
    labelEn: 'Water feature',
    labelAr: 'عنصر مائي',
    bestFor: 'Courtyards, pools, resorts, gardens, and calm hospitality moments',
    descriptionEn: 'Adds gentle water movement when a pool, fountain, or landscape water element is present.',
    descriptionAr: 'يضيف حركة ماء لطيفة عند وجود مسبح أو نافورة أو عنصر مائي في المشهد.',
    promptFragment: 'gentle water feature sound, soft ripples, clean natural movement, low in mix'
  },
  {
    key: 'distant_traffic',
    labelEn: 'Distant traffic',
    labelAr: 'مرور بعيد',
    bestFor: 'City sites, commercial frontage, office towers, and masterplan context',
    descriptionEn: 'Adds remote traffic only as contextual scale, never as dominant noise.',
    descriptionAr: 'يضيف مروراً بعيداً كسياق للمقياس فقط وليس كضجيج مسيطر.',
    promptFragment: 'very distant traffic wash, contextual only, no horns, no harsh peaks'
  },
  {
    key: 'interior_room_tone',
    labelEn: 'Interior room tone',
    labelAr: 'نبرة غرفة داخلية',
    bestFor: 'Interior scenes, museums, galleries, and residential walkthroughs',
    descriptionEn: 'Adds subtle enclosed-space presence and quiet air.',
    descriptionAr: 'يضيف حضوراً خفيفاً للفراغ الداخلي وهواءً هادئاً.',
    promptFragment: 'soft interior room tone, quiet air, natural enclosed space resonance'
  },
  {
    key: 'soft_mechanical_hum',
    labelEn: 'Soft mechanical hum',
    labelAr: 'طنين ميكانيكي ناعم',
    bestFor: 'Modern offices, galleries, retail, elevators, and technical interiors',
    descriptionEn: 'Adds a faint controlled mechanical bed without industrial harshness.',
    descriptionAr: 'يضيف طبقة ميكانيكية خافتة ومنضبطة دون قسوة صناعية.',
    promptFragment: 'soft mechanical hum, clean HVAC-like presence, subtle and stable'
  },
  {
    key: 'no_sfx',
    labelEn: 'No SFX',
    labelAr: 'بدون مؤثرات',
    bestFor: 'Pure music beds, abstract reels, and early concept previews',
    descriptionEn: 'Uses only background audio with no added environmental sound effects.',
    descriptionAr: 'يستخدم خلفية صوتية فقط دون مؤثرات بيئية إضافية.',
    promptFragment: 'no added SFX, background audio only'
  }
];

export function getArchitectureUpscaleIntent(key: ArchitectureUpscaleIntentKey) {
  return architectureUpscaleIntents.find(intent => intent.key === key);
}

export function getArchitectureUpscaleControl(key: ArchitectureUpscaleControlKey) {
  return architectureUpscaleControls.find(control => control.key === key);
}

export function getArchitectureAudioMood(key: ArchitectureAudioMoodKey) {
  return architectureAudioMoods.find(mood => mood.key === key);
}

export function getArchitectureSfxDirection(key: ArchitectureSfxDirectionKey) {
  return architectureSfxDirections.find(direction => direction.key === key);
}
