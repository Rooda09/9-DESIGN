export const ARCHITECTURE_QUALITY_GROUP_KEYS = [
  'project_type',
  'building_typology',
  'design_task',
  'geometry_guard_mode',
  'reference_role',
  'architectural_style',
  'school_movement_influence',
  'architect_influence',
  'facade_system',
  'massing_type',
  'roof_type',
  'opening_window_rhythm',
  'material_palette',
  'facade_material',
  'interior_space_type',
  'landscape_element',
  'climate_context',
  'camera_view',
  'lens_framing',
  'lighting_time_of_day',
  'mood_atmosphere',
  'render_quality',
  'output_purpose',
  'negative_constraints'
] as const;

export type ArchitectureQualityGroupKey = (typeof ARCHITECTURE_QUALITY_GROUP_KEYS)[number];

export interface ArchitectureQualityDropdownGroupSeed {
  key: ArchitectureQualityGroupKey;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  isRequired: boolean;
  isAdvanced: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ArchitectureQualityDropdownOptionSeed {
  groupKey: ArchitectureQualityGroupKey;
  value: string;
  labelEn: string;
  labelAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  promptFragment: string;
}

export interface ArchitectureQualityTemplateSeed {
  key: string;
  titleEn: string;
  titleAr: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  workflowType: string;
  defaultEngineKey: string;
  defaultDropdowns: Record<ArchitectureQualityGroupKey, string>;
  isPublished: boolean;
  version: number;
}

export interface ArchitectureQualityPromptTemplateSeed {
  key: string;
  titleEn: string;
  titleAr: string;
  category: string;
  bestFor: string;
  descriptionEn: string;
  descriptionAr: string;
  promptBody: string;
  negativePrompt: string;
  engineHints: Record<string, string>;
  maxCharacters: number;
  isPublished: boolean;
  version: number;
}

export const architectureQualityDropdownGroups: ArchitectureQualityDropdownGroupSeed[] = [
  { key: 'project_type', labelEn: 'Project Type', labelAr: 'نوع المشروع', descriptionEn: 'Defines the commission context and design responsibility.', descriptionAr: 'يحدد سياق التكليف ومسؤولية التصميم.', isRequired: true, isAdvanced: false, sortOrder: 10, isActive: true },
  { key: 'building_typology', labelEn: 'Building Typology', labelAr: 'نمط المبنى', descriptionEn: 'Identifies the architectural program and expected spatial logic.', descriptionAr: 'يحدد البرنامج المعماري والمنطق الفراغي المتوقع.', isRequired: true, isAdvanced: false, sortOrder: 20, isActive: true },
  { key: 'design_task', labelEn: 'Design Task', labelAr: 'مهمة التصميم', descriptionEn: 'States whether the output is a concept, refinement, or controlled edit.', descriptionAr: 'يوضح ما إذا كان الناتج تصورًا أو تطويرًا أو تعديلًا مضبوطًا.', isRequired: true, isAdvanced: false, sortOrder: 30, isActive: true },
  { key: 'geometry_guard_mode', labelEn: 'Geometry Guard Mode', labelAr: 'وضع حماية الهندسة', descriptionEn: 'Database record of geometry preservation policies used by the dedicated Geometry Guard control.', descriptionAr: 'سجل قاعدة بيانات لسياسات حفظ الهندسة المستخدمة في عنصر التحكم المخصص.', isRequired: true, isAdvanced: true, sortOrder: 40, isActive: true },
  { key: 'reference_role', labelEn: 'Reference Role', labelAr: 'دور المرجع', descriptionEn: 'Database record of how reference images should influence the prompt.', descriptionAr: 'سجل قاعدة بيانات لكيفية تأثير الصور المرجعية على المطالبة.', isRequired: false, isAdvanced: true, sortOrder: 50, isActive: true },
  { key: 'architectural_style', labelEn: 'Architectural Style', labelAr: 'الطراز المعماري', descriptionEn: 'Sets the primary architectural language and compositional attitude.', descriptionAr: 'يحدد اللغة المعمارية الأساسية والموقف التركيبي.', isRequired: true, isAdvanced: false, sortOrder: 60, isActive: true },
  { key: 'school_movement_influence', labelEn: 'School / Movement Influence', labelAr: 'تأثير المدرسة أو الحركة', descriptionEn: 'Adds an architectural lineage without forcing direct imitation.', descriptionAr: 'يضيف مرجعية فكرية معمارية دون فرض تقليد مباشر.', isRequired: false, isAdvanced: true, sortOrder: 70, isActive: true },
  { key: 'architect_influence', labelEn: 'Architect Influence', labelAr: 'تأثير المعماري', descriptionEn: 'Guides the design through a known architectural sensibility.', descriptionAr: 'يوجه التصميم عبر حس معماري معروف.', isRequired: false, isAdvanced: true, sortOrder: 80, isActive: true },
  { key: 'facade_system', labelEn: 'Facade System', labelAr: 'نظام الواجهة', descriptionEn: 'Defines the architectural envelope and facade construction logic.', descriptionAr: 'يحدد غلاف المبنى ومنطق إنشاء الواجهة.', isRequired: false, isAdvanced: false, sortOrder: 90, isActive: true },
  { key: 'massing_type', labelEn: 'Massing Type', labelAr: 'نوع الكتلة', descriptionEn: 'Controls the overall volume strategy when geometry is not fully locked.', descriptionAr: 'يتحكم في استراتيجية الحجم العام عندما لا تكون الهندسة مقفلة بالكامل.', isRequired: false, isAdvanced: false, sortOrder: 100, isActive: true },
  { key: 'roof_type', labelEn: 'Roof Type', labelAr: 'نوع السقف', descriptionEn: 'Defines roof profile and upper termination when editable.', descriptionAr: 'يحدد شكل السقف ونهاية المبنى العلوية عند السماح بالتعديل.', isRequired: false, isAdvanced: false, sortOrder: 110, isActive: true },
  { key: 'opening_window_rhythm', labelEn: 'Opening / Window Rhythm', labelAr: 'إيقاع الفتحات والنوافذ', descriptionEn: 'Controls facade openings, fenestration cadence, and solid-to-void logic.', descriptionAr: 'يتحكم في فتحات الواجهة وإيقاع النوافذ ومنطق المصمت والفراغ.', isRequired: false, isAdvanced: false, sortOrder: 120, isActive: true },
  { key: 'material_palette', labelEn: 'Material Palette', labelAr: 'لوحة المواد', descriptionEn: 'Sets the overall material family and finish hierarchy.', descriptionAr: 'تحدد عائلة المواد العامة وتسلسل التشطيبات.', isRequired: false, isAdvanced: false, sortOrder: 130, isActive: true },
  { key: 'facade_material', labelEn: 'Facade Material', labelAr: 'مادة الواجهة', descriptionEn: 'Controls the dominant exterior surface material.', descriptionAr: 'تتحكم في مادة السطح الخارجي المهيمنة.', isRequired: false, isAdvanced: false, sortOrder: 140, isActive: true },
  { key: 'interior_space_type', labelEn: 'Interior Space Type', labelAr: 'نوع الفراغ الداخلي', descriptionEn: 'Activates interior-specific logic when the task concerns inside spaces.', descriptionAr: 'يفعل منطقًا داخليًا عندما تتعلق المهمة بالفراغات الداخلية.', isRequired: false, isAdvanced: false, sortOrder: 150, isActive: true },
  { key: 'landscape_element', labelEn: 'Landscape Element', labelAr: 'عنصر المشهد الخارجي', descriptionEn: 'Defines site and landscape additions around fixed architecture.', descriptionAr: 'يحدد إضافات الموقع والمناظر المحيطة بالعمارة الثابتة.', isRequired: false, isAdvanced: false, sortOrder: 160, isActive: true },
  { key: 'climate_context', labelEn: 'Climate / Context', labelAr: 'المناخ والسياق', descriptionEn: 'Places the design in a climate, site, and environmental condition.', descriptionAr: 'يضع التصميم ضمن مناخ وموقع وظروف بيئية محددة.', isRequired: true, isAdvanced: false, sortOrder: 170, isActive: true },
  { key: 'camera_view', labelEn: 'Camera View', labelAr: 'زاوية الكاميرا', descriptionEn: 'Defines the architectural viewpoint and perspective relationship.', descriptionAr: 'يحدد وجهة النظر المعمارية وعلاقة المنظور.', isRequired: true, isAdvanced: false, sortOrder: 180, isActive: true },
  { key: 'lens_framing', labelEn: 'Lens / Framing', labelAr: 'العدسة والتأطير', descriptionEn: 'Controls crop, lens behavior, distortion discipline, and frame priority.', descriptionAr: 'يتحكم في القص وسلوك العدسة وضبط التشوه وأولوية الإطار.', isRequired: false, isAdvanced: false, sortOrder: 190, isActive: true },
  { key: 'lighting_time_of_day', labelEn: 'Lighting / Time of Day', labelAr: 'الإضاءة ووقت اليوم', descriptionEn: 'Sets daylight, atmosphere, shadows, and exposure character.', descriptionAr: 'تحدد ضوء النهار والأجواء والظلال وطابع التعريض.', isRequired: true, isAdvanced: false, sortOrder: 200, isActive: true },
  { key: 'mood_atmosphere', labelEn: 'Mood / Atmosphere', labelAr: 'المزاج والأجواء', descriptionEn: 'Defines emotional tone without weakening architectural clarity.', descriptionAr: 'يحدد النبرة الشعورية دون إضعاف الوضوح المعماري.', isRequired: false, isAdvanced: false, sortOrder: 210, isActive: true },
  { key: 'render_quality', labelEn: 'Render Quality', labelAr: 'جودة الإظهار', descriptionEn: 'Sets the expected visualization fidelity and polish level.', descriptionAr: 'تحدد مستوى دقة الإظهار وجودة الإخراج.', isRequired: true, isAdvanced: false, sortOrder: 220, isActive: true },
  { key: 'output_purpose', labelEn: 'Output Purpose', labelAr: 'غرض الإخراج', descriptionEn: 'Clarifies whether the result is for review, presentation, comparison, or final storytelling.', descriptionAr: 'يوضح ما إذا كان الناتج للمراجعة أو العرض أو المقارنة أو السرد النهائي.', isRequired: true, isAdvanced: false, sortOrder: 230, isActive: true },
  { key: 'negative_constraints', labelEn: 'Negative Constraints', labelAr: 'قيود الاستبعاد', descriptionEn: 'Adds architecture-specific exclusions to the negative prompt.', descriptionAr: 'يضيف استبعادات معمارية محددة إلى المطالبة السلبية.', isRequired: false, isAdvanced: true, sortOrder: 240, isActive: true }
];

export const architectureQualityDropdownOptions: ArchitectureQualityDropdownOptionSeed[] = [
  { groupKey: 'project_type', value: 'residential', labelEn: 'Residential', labelAr: 'سكني', bestFor: 'Villas, houses, apartments, and private residences', descriptionEn: 'Centers the prompt on residential scale, privacy, domestic use, and livable architectural detail.', descriptionAr: 'يركز المطالبة على المقياس السكني والخصوصية والاستخدام المنزلي والتفاصيل القابلة للعيش.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Project type: residential architecture with domestic scale, privacy, livability, and believable detail' },
  { groupKey: 'project_type', value: 'hospitality', labelEn: 'Hospitality', labelAr: 'ضيافة', bestFor: 'Hotels, resorts, lounges, and destination venues', descriptionEn: 'Frames the design around guest experience, arrival sequence, atmosphere, and premium service spaces.', descriptionAr: 'يصيغ التصميم حول تجربة الضيف وتسلسل الوصول والأجواء ومساحات الخدمة الراقية.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Project type: hospitality architecture with arrival sequence, guest experience, atmosphere, and premium service spaces' },
  { groupKey: 'project_type', value: 'civic_cultural', labelEn: 'Civic / Cultural', labelAr: 'مدني أو ثقافي', bestFor: 'Museums, galleries, libraries, and civic buildings', descriptionEn: 'Prioritizes public identity, clear circulation, civic presence, and dignified architectural expression.', descriptionAr: 'يعطي الأولوية للهوية العامة ووضوح الحركة والحضور المدني والتعبير المعماري الوقور.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Project type: civic or cultural architecture with public identity, clear circulation, and dignified presence' },

  { groupKey: 'building_typology', value: 'villa', labelEn: 'Villa', labelAr: 'فيلا', bestFor: 'Private detached homes and luxury residential studies', descriptionEn: 'Uses villa scale, private outdoor relationships, controlled privacy, and refined residential proportion.', descriptionAr: 'يستخدم مقياس الفيلا وعلاقة الخارج الخاص والخصوصية المضبوطة والنسب السكنية المصقولة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Building typology: villa with refined residential proportions, privacy control, and indoor-outdoor relationship' },
  { groupKey: 'building_typology', value: 'boutique_hotel', labelEn: 'Boutique Hotel', labelAr: 'فندق بوتيك', bestFor: 'Hospitality concepts with intimate scale', descriptionEn: 'Guides the prompt toward distinctive guest arrival, lobby presence, facade identity, and atmospheric exterior.', descriptionAr: 'يوجه المطالبة نحو وصول ضيوف مميز وحضور بهو وهوية واجهة وخارجية ذات أجواء.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Building typology: boutique hotel with distinctive arrival, lobby presence, facade identity, and atmospheric exterior' },
  { groupKey: 'building_typology', value: 'mixed_use_podium', labelEn: 'Mixed-Use Podium', labelAr: 'منصة متعددة الاستخدام', bestFor: 'Urban podiums and street-facing developments', descriptionEn: 'Adds public base logic, retail frontage, tower/podium relationship, service separation, and urban edges.', descriptionAr: 'يضيف منطق قاعدة عامة وواجهة تجارية وعلاقة برج/منصة وفصل خدمات وحواف حضرية.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Building typology: mixed-use podium with active frontage, public base logic, service separation, and urban edge clarity' },

  { groupKey: 'design_task', value: 'controlled_refinement', labelEn: 'Controlled Refinement', labelAr: 'تطوير مضبوط', bestFor: 'Client revisions where the approved concept must remain recognizable', descriptionEn: 'Improves material, facade, lighting, and detail while preserving the approved architectural intent.', descriptionAr: 'يحسن المواد والواجهة والإضاءة والتفاصيل مع الحفاظ على النية المعمارية المعتمدة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Design task: controlled refinement preserving approved intent while improving material, facade, light, and detail' },
  { groupKey: 'design_task', value: 'facade_redesign', labelEn: 'Facade Redesign', labelAr: 'إعادة تصميم الواجهة', bestFor: 'Envelope studies without changing the building mass', descriptionEn: 'Focuses on facade composition, depth, shading, cladding rhythm, and envelope identity.', descriptionAr: 'يركز على تكوين الواجهة والعمق والتظليل وإيقاع الكسوة وهوية الغلاف.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Design task: facade redesign focused on composition, depth, shading, cladding rhythm, and envelope identity' },
  { groupKey: 'design_task', value: 'material_alternatives', labelEn: 'Material Alternatives', labelAr: 'بدائل المواد', bestFor: 'Comparing finish palettes while holding geometry', descriptionEn: 'Keeps the architectural form stable and changes only finish family, texture, reflectance, and color balance.', descriptionAr: 'يحافظ على الشكل المعماري ثابتًا ويغير فقط عائلة التشطيب والملمس والانعكاس وتوازن اللون.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Design task: material alternatives with stable form, controlled finish family, texture, reflectance, and color balance' },

  { groupKey: 'geometry_guard_mode', value: 'semi_fixed_geometry', labelEn: 'Semi-Fixed Geometry', labelAr: 'هندسة شبه ثابتة', bestFor: 'Most Architecture MVP prompts with controlled design development', descriptionEn: 'Preserves primary massing, plot boundary, floor count, major openings, and camera while allowing surface-level improvement.', descriptionAr: 'يحافظ على الكتلة الرئيسية وحدود الموقع وعدد الطوابق والفتحات الأساسية والكاميرا مع السماح بتطوير سطحي.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Geometry policy: semi-fixed geometry, preserve primary massing, boundary, floor count, major openings, and camera' },
  { groupKey: 'geometry_guard_mode', value: 'fixed_geometry', labelEn: 'Fixed Geometry', labelAr: 'هندسة ثابتة', bestFor: 'Reference-based edits and strict client revisions', descriptionEn: 'Locks massing, openings, roofline, floor count, plot boundary, and camera relationship.', descriptionAr: 'يقفل الكتلة والفتحات وخط السقف وعدد الطوابق وحدود الموقع وعلاقة الكاميرا.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Geometry policy: fixed geometry, lock massing, openings, roofline, floor count, plot boundary, and camera' },
  { groupKey: 'geometry_guard_mode', value: 'facade_only', labelEn: 'Facade Only', labelAr: 'الواجهة فقط', bestFor: 'Facade composition studies without moving openings', descriptionEn: 'Locks massing and openings while changing cladding, screens, shading, and surface articulation only.', descriptionAr: 'يقفل الكتلة والفتحات مع تغيير الكسوة والشاشات والتظليل وتفصيل السطح فقط.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Geometry policy: facade only, lock massing and openings, edit cladding, screens, shading, and surface articulation only' },

  { groupKey: 'reference_role', value: 'geometry_reference', labelEn: 'Geometry Reference', labelAr: 'مرجع هندسي', bestFor: 'Preserving an existing building, massing, or approved model', descriptionEn: 'Uses the reference strictly for shape, openings, roofline, proportion, and camera relationship.', descriptionAr: 'يستخدم المرجع بدقة للشكل والفتحات وخط السقف والنسب وعلاقة الكاميرا.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Reference role: geometry reference controls shape, openings, roofline, proportion, and camera relationship only' },
  { groupKey: 'reference_role', value: 'material_reference', labelEn: 'Material Reference', labelAr: 'مرجع مواد', bestFor: 'Matching finish palette and texture quality', descriptionEn: 'Uses the reference for material family, joints, texture scale, finish, and reflectance only.', descriptionAr: 'يستخدم المرجع لعائلة المواد والفواصل ومقياس الملمس والتشطيب والانعكاس فقط.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Reference role: material reference guides material family, joints, texture scale, finish, and reflectance only' },
  { groupKey: 'reference_role', value: 'lighting_reference', labelEn: 'Lighting Reference', labelAr: 'مرجع إضاءة', bestFor: 'Matching shadow behavior and exposure mood', descriptionEn: 'Uses the reference for time of day, contrast, shadow direction, color temperature, and exposure.', descriptionAr: 'يستخدم المرجع لوقت اليوم والتباين واتجاه الظلال وحرارة اللون والتعريض.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Reference role: lighting reference guides time of day, contrast, shadow direction, color temperature, and exposure only' },

  { groupKey: 'architectural_style', value: 'contemporary_luxury', labelEn: 'Contemporary Luxury', labelAr: 'فاخر معاصر', bestFor: 'Premium villas, hospitality, and polished client presentations', descriptionEn: 'Uses clean volumes, restrained detailing, layered materials, and controlled visual richness.', descriptionAr: 'يستخدم كتلًا نظيفة وتفاصيل منضبطة ومواد متدرجة وثراء بصري مضبوط.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Architectural style: contemporary luxury with clean volumes, restrained detailing, layered materials, and controlled visual richness' },
  { groupKey: 'architectural_style', value: 'warm_minimalism', labelEn: 'Warm Minimalism', labelAr: 'تبسيط دافئ', bestFor: 'Human, calm, high-end residential and hospitality spaces', descriptionEn: 'Combines minimal geometry with warm material depth, soft light, and tactile surfaces.', descriptionAr: 'يجمع الهندسة المبسطة مع عمق مواد دافئ وضوء ناعم وأسطح ملموسة.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Architectural style: warm minimalism with minimal geometry, warm material depth, soft light, and tactile surfaces' },
  { groupKey: 'architectural_style', value: 'tropical_modern', labelEn: 'Tropical Modern', labelAr: 'استوائي معاصر', bestFor: 'Climate-responsive villas, resorts, and shaded outdoor living', descriptionEn: 'Emphasizes shading, cross ventilation, deep overhangs, porous edges, and lush site integration.', descriptionAr: 'يركز على التظليل والتهوية المتقاطعة والبروزات العميقة والحواف المسامية والاندماج النباتي.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Architectural style: tropical modern with shading, cross ventilation, deep overhangs, porous edges, and lush site integration' },

  { groupKey: 'school_movement_influence', value: 'modernism', labelEn: 'Modernism', labelAr: 'الحداثة', bestFor: 'Clear structure, rational plans, and disciplined form', descriptionEn: 'Introduces rational composition, structural honesty, planar clarity, and functional expression.', descriptionAr: 'يدخل تركيبًا عقلانيًا وصدقًا إنشائيًا ووضوحًا سطحيًا وتعبيرًا وظيفيًا.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Movement influence: modernism with rational composition, structural honesty, planar clarity, and functional expression' },
  { groupKey: 'school_movement_influence', value: 'critical_regionalism', labelEn: 'Critical Regionalism', labelAr: 'الإقليمية النقدية', bestFor: 'Context-aware design without nostalgic imitation', descriptionEn: 'Balances modern architectural discipline with climate, craft, local material, and cultural context.', descriptionAr: 'يوازن بين الانضباط المعماري الحديث والمناخ والحرفة والمواد المحلية والسياق الثقافي.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Movement influence: critical regionalism balancing modern discipline with climate, craft, local material, and cultural context' },
  { groupKey: 'school_movement_influence', value: 'brutalism_refined', labelEn: 'Refined Brutalism', labelAr: 'وحشية مصقولة', bestFor: 'Strong mass, concrete expression, and sculptural public presence', descriptionEn: 'Uses mass, shadow, concrete texture, deep reveals, and sculptural gravity with refined detailing.', descriptionAr: 'يستخدم الكتلة والظل وملمس الخرسانة والغائر العميق والثقل النحتي بتفاصيل مصقولة.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Movement influence: refined brutalism with mass, shadow, concrete texture, deep reveals, and sculptural gravity' },

  { groupKey: 'architect_influence', value: 'tadao_ando', labelEn: 'Tadao Ando Influence', labelAr: 'تأثير تاداو أندو', bestFor: 'Calm concrete, controlled light, and meditative spatial order', descriptionEn: 'Guides the prompt toward precise concrete planes, silence, courtyards, water, and controlled natural light.', descriptionAr: 'يوجه المطالبة نحو أسطح خرسانية دقيقة وهدوء وساحات وماء وضوء طبيعي مضبوط.', isDefault: false, isActive: true, sortOrder: 10, promptFragment: 'Architect influence: Tadao Ando sensibility, precise concrete planes, silence, courtyards, water, and controlled natural light' },
  { groupKey: 'architect_influence', value: 'glenn_murcutt', labelEn: 'Glenn Murcutt Influence', labelAr: 'تأثير غلين مركت', bestFor: 'Lightweight climate-responsive architecture', descriptionEn: 'Adds thin roofs, climate response, screened edges, light structure, and careful relationship to landscape.', descriptionAr: 'يضيف أسقفًا خفيفة واستجابة مناخية وحواف مفلترة وإنشاء خفيفًا وعلاقة دقيقة بالمشهد.', isDefault: true, isActive: true, sortOrder: 20, promptFragment: 'Architect influence: Glenn Murcutt sensibility, lightweight roofs, climate response, screened edges, light structure, and landscape relationship' },
  { groupKey: 'architect_influence', value: 'zaha_hadid', labelEn: 'Zaha Hadid Influence', labelAr: 'تأثير زها حديد', bestFor: 'Fluid concept studies when geometry may change', descriptionEn: 'Introduces fluid continuity, dynamic surfaces, sweeping lines, and sculptural spatial flow.', descriptionAr: 'يدخل استمرارية انسيابية وأسطحًا ديناميكية وخطوطًا ممتدة وتدفقًا فراغيًا نحتيًا.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Architect influence: Zaha Hadid sensibility, fluid continuity, dynamic surfaces, sweeping lines, and sculptural spatial flow' },

  { groupKey: 'facade_system', value: 'layered_screens', labelEn: 'Layered Screens', labelAr: 'شاشات متعددة الطبقات', bestFor: 'Sun control, privacy, and facade depth', descriptionEn: 'Adds secondary screens, brise-soleil depth, privacy filtering, and controlled shadow pattern.', descriptionAr: 'يضيف شاشات ثانوية وعمق كاسرات شمس وترشيح خصوصية ونمط ظل مضبوط.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Facade system: layered screens with brise-soleil depth, privacy filtering, and controlled shadow pattern' },
  { groupKey: 'facade_system', value: 'curtain_wall', labelEn: 'Curtain Wall', labelAr: 'واجهة ستارية', bestFor: 'Commercial, hospitality, and high-transparency concepts', descriptionEn: 'Uses mullion discipline, glass modulation, reflective control, and transparent facade logic.', descriptionAr: 'يستخدم انضباط القوائم وتقسيم الزجاج وضبط الانعكاس ومنطق واجهة شفافة.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Facade system: curtain wall with disciplined mullions, glass modulation, reflective control, and transparent facade logic' },
  { groupKey: 'facade_system', value: 'solid_void_composition', labelEn: 'Solid / Void Composition', labelAr: 'تكوين المصمت والفراغ', bestFor: 'Massive facades, galleries, and climate-aware openings', descriptionEn: 'Balances solid wall mass, recessed openings, deep reveals, and readable structural rhythm.', descriptionAr: 'يوازن كتلة الجدار المصمت والفتحات الغائرة والغائر العميق والإيقاع الإنشائي المقروء.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Facade system: solid-void composition with wall mass, recessed openings, deep reveals, and readable structural rhythm' },

  { groupKey: 'massing_type', value: 'stacked_volumes', labelEn: 'Stacked Volumes', labelAr: 'كتل متراكبة', bestFor: 'Villas and mixed-use concepts with clear program layers', descriptionEn: 'Uses offset boxes, terraces, shaded recesses, and legible vertical layering.', descriptionAr: 'يستخدم صناديق مزاحة وتراسات وفراغات مظللة وطبقات رأسية واضحة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Massing type: stacked volumes with offset boxes, terraces, shaded recesses, and legible vertical layering' },
  { groupKey: 'massing_type', value: 'courtyard_mass', labelEn: 'Courtyard Mass', labelAr: 'كتلة حول فناء', bestFor: 'Private residences and climate-protected hospitality', descriptionEn: 'Organizes building mass around an internal court, protected outdoor room, and inward privacy.', descriptionAr: 'ينظم كتلة المبنى حول فناء داخلي وغرفة خارجية محمية وخصوصية داخلية.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Massing type: courtyard mass organized around an internal court, protected outdoor room, and inward privacy' },
  { groupKey: 'massing_type', value: 'linear_bar', labelEn: 'Linear Bar', labelAr: 'كتلة خطية', bestFor: 'Narrow sites, views, and climate-oriented plans', descriptionEn: 'Uses a disciplined linear volume with long facade rhythm, directional views, and clear circulation.', descriptionAr: 'يستخدم حجمًا خطيًا منضبطًا بإيقاع واجهة طويل وإطلالات موجهة وحركة واضحة.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Massing type: linear bar with disciplined long facade rhythm, directional views, and clear circulation' },

  { groupKey: 'roof_type', value: 'flat_parapet', labelEn: 'Flat Parapet', labelAr: 'سطح مسطح بحاجز', bestFor: 'Contemporary villas and clean modern silhouettes', descriptionEn: 'Keeps a low horizontal roofline, crisp parapet edge, and restrained contemporary termination.', descriptionAr: 'يحافظ على خط سقف أفقي منخفض وحافة حاجز واضحة ونهاية معاصرة منضبطة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Roof type: flat parapet with low horizontal roofline, crisp edge, and restrained contemporary termination' },
  { groupKey: 'roof_type', value: 'deep_overhang', labelEn: 'Deep Overhang', labelAr: 'بروز عميق', bestFor: 'Hot climates, tropical modernism, and shaded outdoor rooms', descriptionEn: 'Adds protective roof projection, shade depth, horizontal emphasis, and climate-responsive eaves.', descriptionAr: 'يضيف بروز سقف واقيًا وعمق ظل وتأكيدًا أفقيًا وحوافًا مستجيبة للمناخ.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Roof type: deep overhang with protective projection, shade depth, horizontal emphasis, and climate-responsive eaves' },
  { groupKey: 'roof_type', value: 'pitched_modern', labelEn: 'Modern Pitched Roof', labelAr: 'سقف مائل معاصر', bestFor: 'Residential projects needing familiar silhouette with modern detailing', descriptionEn: 'Uses a simple pitched profile, clean eaves, contemporary material junctions, and controlled roof proportion.', descriptionAr: 'يستخدم شكلًا مائلًا بسيطًا وحوافًا نظيفة ووصلات مواد معاصرة ونسبة سقف مضبوطة.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Roof type: modern pitched roof with simple profile, clean eaves, contemporary junctions, and controlled proportion' },

  { groupKey: 'opening_window_rhythm', value: 'regular_grid', labelEn: 'Regular Grid', labelAr: 'شبكة منتظمة', bestFor: 'Orderly facades and rational plans', descriptionEn: 'Uses aligned windows, consistent modules, clear bay rhythm, and disciplined structural cadence.', descriptionAr: 'يستخدم نوافذ مصطفة ووحدات متسقة وإيقاع فتحات واضح وتتابعًا إنشائيًا منضبطًا.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Opening rhythm: regular grid with aligned windows, consistent modules, clear bay rhythm, and disciplined structural cadence' },
  { groupKey: 'opening_window_rhythm', value: 'deep_reveals', labelEn: 'Deep Reveals', labelAr: 'فتحات غائرة عميقة', bestFor: 'Sun control, privacy, and heavy facade depth', descriptionEn: 'Uses recessed openings, thick walls, shadow pockets, and precise solid-to-void proportion.', descriptionAr: 'يستخدم فتحات غائرة وجدرانًا سميكة وجيوب ظل ونسبة دقيقة بين المصمت والفراغ.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Opening rhythm: deep reveals with recessed openings, thick walls, shadow pockets, and precise solid-to-void proportion' },
  { groupKey: 'opening_window_rhythm', value: 'panoramic_glazing', labelEn: 'Panoramic Glazing', labelAr: 'زجاج بانورامي', bestFor: 'View-driven villas, resorts, and premium interiors', descriptionEn: 'Uses large controlled glass spans, slim frames, view emphasis, and realistic structural support.', descriptionAr: 'يستخدم مساحات زجاجية كبيرة مضبوطة وإطارات نحيفة وتركيزًا على الإطلالة ودعمًا إنشائيًا واقعيًا.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Opening rhythm: panoramic glazing with controlled glass spans, slim frames, view emphasis, and realistic structural support' },

  { groupKey: 'material_palette', value: 'stone_wood_glass', labelEn: 'Stone / Wood / Glass', labelAr: 'حجر وخشب وزجاج', bestFor: 'Warm luxury residential and hospitality visuals', descriptionEn: 'Combines natural stone, warm timber, large glass, restrained metal, and tactile premium detailing.', descriptionAr: 'يجمع الحجر الطبيعي والخشب الدافئ والزجاج الكبير والمعدن المنضبط وتفاصيل فاخرة ملموسة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Material palette: natural stone, warm timber, large glass, restrained metal, and tactile premium detailing' },
  { groupKey: 'material_palette', value: 'concrete_glass_metal', labelEn: 'Concrete / Glass / Metal', labelAr: 'خرسانة وزجاج ومعدن', bestFor: 'Minimal, modern, and refined brutalist projects', descriptionEn: 'Uses architectural concrete, controlled glazing, dark metal trims, crisp joints, and honest structural expression.', descriptionAr: 'يستخدم خرسانة معمارية وزجاجًا مضبوطًا وحواف معدن داكنة وفواصل دقيقة وتعبيرًا إنشائيًا صادقًا.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Material palette: architectural concrete, controlled glazing, dark metal trims, crisp joints, and honest structural expression' },
  { groupKey: 'material_palette', value: 'white_mineral_soft_neutrals', labelEn: 'White Mineral / Soft Neutrals', labelAr: 'معدني أبيض وحياديات ناعمة', bestFor: 'Clean Mediterranean, gallery-like, or minimalist scenes', descriptionEn: 'Uses limewash, pale stone, soft plaster, mineral surfaces, and quiet tonal contrast.', descriptionAr: 'يستخدم الجير والحجر الفاتح واللياسة الناعمة والأسطح المعدنية وتباينًا لونيًا هادئًا.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Material palette: limewash, pale stone, soft plaster, mineral surfaces, and quiet tonal contrast' },

  { groupKey: 'facade_material', value: 'limestone', labelEn: 'Limestone', labelAr: 'حجر جيري', bestFor: 'Premium warm exteriors and calm civic facades', descriptionEn: 'Provides fine-grain stone texture, soft reflectance, weight, and refined joint discipline.', descriptionAr: 'يوفر ملمس حجر دقيقًا وانعكاسًا ناعمًا وثقلًا وانضباطًا راقيًا للفواصل.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Facade material: limestone with fine-grain texture, soft reflectance, architectural weight, and refined joints' },
  { groupKey: 'facade_material', value: 'board_form_concrete', labelEn: 'Board-Form Concrete', labelAr: 'خرسانة بقالب خشبي', bestFor: 'Tactile modernism and refined brutalist concepts', descriptionEn: 'Adds linear timber imprint, mass, craft texture, and strong shadow behavior.', descriptionAr: 'يضيف أثر الخشب الخطي والكتلة وملمس الحرفة وسلوك ظل قوي.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Facade material: board-form concrete with linear timber imprint, mass, craft texture, and strong shadow behavior' },
  { groupKey: 'facade_material', value: 'charred_timber', labelEn: 'Charred Timber', labelAr: 'خشب متفحم', bestFor: 'Dark refined facades and natural material contrast', descriptionEn: 'Uses blackened timber grain, matte depth, vertical rhythm, and weather-resistant character.', descriptionAr: 'يستخدم عروق خشب سوداء وعمقًا مطفيًا وإيقاعًا رأسيًا وطابعًا مقاومًا للعوامل الجوية.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Facade material: charred timber with blackened grain, matte depth, vertical rhythm, and weather-resistant character' },

  { groupKey: 'interior_space_type', value: 'open_living', labelEn: 'Open Living Space', labelAr: 'فراغ معيشة مفتوح', bestFor: 'Residential interiors and indoor-outdoor continuity', descriptionEn: 'Guides the prompt toward open plan living, kitchen relationship, lounge scale, and exterior connection.', descriptionAr: 'يوجه المطالبة نحو معيشة مفتوحة وعلاقة المطبخ ومقياس الجلوس والاتصال بالخارج.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Interior space type: open living space with open plan, kitchen relationship, lounge scale, and exterior connection' },
  { groupKey: 'interior_space_type', value: 'hotel_lobby', labelEn: 'Hotel Lobby', labelAr: 'بهو فندق', bestFor: 'Hospitality interiors and arrival experience', descriptionEn: 'Creates reception hierarchy, lounge pockets, feature lighting, durable finishes, and guest orientation.', descriptionAr: 'ينشئ تسلسل استقبال وجيوب جلوس وإضاءة مميزة وتشطيبات متينة وتوجيهًا للضيوف.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Interior space type: hotel lobby with reception hierarchy, lounge pockets, feature lighting, durable finishes, and guest orientation' },
  { groupKey: 'interior_space_type', value: 'gallery_space', labelEn: 'Gallery Space', labelAr: 'فراغ عرض', bestFor: 'Cultural interiors and restrained visual focus', descriptionEn: 'Uses calm surfaces, controlled daylight, track lighting, circulation clarity, and art-safe neutrality.', descriptionAr: 'يستخدم أسطحًا هادئة وضوء نهار مضبوطًا وإضاءة مسارات ووضوح حركة وحيادًا مناسبًا للأعمال.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Interior space type: gallery space with calm surfaces, controlled daylight, track lighting, circulation clarity, and art-safe neutrality' },

  { groupKey: 'landscape_element', value: 'native_planting', labelEn: 'Native Planting', labelAr: 'زراعة محلية', bestFor: 'Climate-aware landscape and low-maintenance site integration', descriptionEn: 'Uses regionally plausible planting, layered texture, seasonal restraint, and water-conscious composition.', descriptionAr: 'يستخدم نباتات ملائمة للمنطقة وملمسًا متدرجًا وضبطًا موسميًا وتكوينًا واعيًا بالماء.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Landscape element: native planting with regionally plausible species, layered texture, seasonal restraint, and water-conscious composition' },
  { groupKey: 'landscape_element', value: 'reflecting_pool', labelEn: 'Reflecting Pool', labelAr: 'حوض عاكس', bestFor: 'Luxury villas, courtyards, and calm hospitality scenes', descriptionEn: 'Adds still water, controlled reflection, cooling atmosphere, and composed foreground depth.', descriptionAr: 'يضيف ماءً ساكنًا وانعكاسًا مضبوطًا وأجواء تبريد وعمقًا أماميًا منظمًا.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Landscape element: reflecting pool with still water, controlled reflection, cooling atmosphere, and composed foreground depth' },
  { groupKey: 'landscape_element', value: 'stone_courtyard', labelEn: 'Stone Courtyard', labelAr: 'فناء حجري', bestFor: 'Courtyard houses, resorts, and semi-private outdoor rooms', descriptionEn: 'Uses stone paving, shaded seating, threshold planting, and architectural enclosure.', descriptionAr: 'يستخدم رصفًا حجريًا وجلسات مظللة وزراعة عند العتبات واحتواءً معماريًا.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Landscape element: stone courtyard with stone paving, shaded seating, threshold planting, and architectural enclosure' },

  { groupKey: 'climate_context', value: 'hot_arid', labelEn: 'Hot Arid', labelAr: 'حار جاف', bestFor: 'Desert, Gulf, and dry Mediterranean contexts', descriptionEn: 'Prioritizes shade, thermal mass, deep reveals, light-colored surfaces, and water-conscious landscape.', descriptionAr: 'يعطي الأولوية للظل والكتلة الحرارية والفتحات الغائرة والأسطح الفاتحة والمشهد الواعي بالماء.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Climate context: hot arid, prioritize shade, thermal mass, deep reveals, light-colored surfaces, and water-conscious landscape' },
  { groupKey: 'climate_context', value: 'coastal_humid', labelEn: 'Coastal Humid', labelAr: 'ساحلي رطب', bestFor: 'Coastal villas, resorts, and breezy hospitality projects', descriptionEn: 'Uses corrosion-aware materials, cross ventilation, shaded terraces, ocean light, and resilient landscape.', descriptionAr: 'يستخدم مواد مقاومة للتآكل وتهوية متقاطعة وتراسات مظللة وضوء البحر ومشهدًا مرنًا.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Climate context: coastal humid, use corrosion-aware materials, cross ventilation, shaded terraces, ocean light, and resilient landscape' },
  { groupKey: 'climate_context', value: 'temperate_urban', labelEn: 'Temperate Urban', labelAr: 'حضري معتدل', bestFor: 'City infill, podiums, cultural buildings, and urban residences', descriptionEn: 'Balances street edge, seasonal light, durable materials, pedestrian scale, and urban context.', descriptionAr: 'يوازن حافة الشارع وضوء الفصول والمواد المتينة ومقياس المشاة والسياق الحضري.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Climate context: temperate urban, balance street edge, seasonal light, durable materials, pedestrian scale, and urban context' },

  { groupKey: 'camera_view', value: 'eye_level_three_quarter', labelEn: 'Eye-Level Three-Quarter', labelAr: 'منظور عين بثلاثة أرباع', bestFor: 'Client-friendly exterior previews and facade understanding', descriptionEn: 'Shows massing, entry, facade depth, and material detail without excessive distortion.', descriptionAr: 'يعرض الكتلة والمدخل وعمق الواجهة وتفاصيل المواد دون تشوه مفرط.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Camera view: eye-level three-quarter view showing massing, entry, facade depth, and material detail without excessive distortion' },
  { groupKey: 'camera_view', value: 'street_level_arrival', labelEn: 'Street-Level Arrival', labelAr: 'وصول من مستوى الشارع', bestFor: 'Entry sequences, hospitality, and civic approach views', descriptionEn: 'Frames approach, threshold, landscape foreground, entry hierarchy, and human-scale presence.', descriptionAr: 'يؤطر الاقتراب والعتبة والمقدمة الطبيعية وتسلسل الدخول والحضور بمقياس الإنسان.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Camera view: street-level arrival with approach, threshold, landscape foreground, entry hierarchy, and human scale' },
  { groupKey: 'camera_view', value: 'aerial_oblique', labelEn: 'Aerial Oblique', labelAr: 'منظور جوي مائل', bestFor: 'Site relationship, roof logic, and landscape composition', descriptionEn: 'Reveals plot boundary, roof plan, access, landscape structure, and building-site relationship.', descriptionAr: 'يكشف حدود الموقع ومخطط السقف والوصول وبنية المشهد وعلاقة المبنى بالموقع.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Camera view: aerial oblique revealing plot boundary, roof logic, access, landscape structure, and building-site relationship' },

  { groupKey: 'lens_framing', value: '35mm_architectural', labelEn: '35mm Architectural', labelAr: 'عدسة 35 مم معمارية', bestFor: 'Balanced realism with controlled perspective', descriptionEn: 'Uses a natural architectural field of view, moderate depth, and minimal distortion.', descriptionAr: 'يستخدم مجال رؤية معماريًا طبيعيًا وعمقًا متوسطًا وتشوهًا محدودًا.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Lens and framing: 35mm architectural view with natural field of view, moderate depth, and minimal distortion' },
  { groupKey: 'lens_framing', value: '24mm_wide_controlled', labelEn: '24mm Wide Controlled', labelAr: 'عدسة 24 مم واسعة مضبوطة', bestFor: 'Interiors, courtyards, and tight exterior sites', descriptionEn: 'Allows wider framing while keeping verticals straight and avoiding exaggerated perspective.', descriptionAr: 'يسمح بتأطير أوسع مع إبقاء العموديات مستقيمة وتجنب المنظور المبالغ فيه.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Lens and framing: controlled 24mm wide view, straight verticals, wider framing, no exaggerated perspective' },
  { groupKey: 'lens_framing', value: '50mm_compressed', labelEn: '50mm Compressed', labelAr: 'عدسة 50 مم مضغوطة', bestFor: 'Facade studies and material-focused views', descriptionEn: 'Uses mild compression, flatter perspective, material readability, and disciplined facade crop.', descriptionAr: 'يستخدم ضغطًا خفيفًا ومنظورًا مسطحًا وقراءة واضحة للمواد وقصًا منضبطًا للواجهة.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Lens and framing: 50mm compressed view with flatter perspective, material readability, and disciplined facade crop' },

  { groupKey: 'lighting_time_of_day', value: 'soft_golden_hour', labelEn: 'Soft Golden Hour', labelAr: 'ساعة ذهبية ناعمة', bestFor: 'Warm premium exteriors and client presentations', descriptionEn: 'Uses low warm sunlight, long soft shadows, material glow, and calm atmospheric depth.', descriptionAr: 'يستخدم ضوء شمس دافئًا منخفضًا وظلالًا ناعمة طويلة وتوهج مواد وعمقًا جويًا هادئًا.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Lighting: soft golden hour with low warm sunlight, long soft shadows, material glow, and calm atmospheric depth' },
  { groupKey: 'lighting_time_of_day', value: 'blue_hour_interior_glow', labelEn: 'Blue Hour with Interior Glow', labelAr: 'ساعة زرقاء مع توهج داخلي', bestFor: 'Hospitality, villas, and atmospheric evening renders', descriptionEn: 'Balances cool ambient sky, warm interior light, facade depth, and controlled reflections.', descriptionAr: 'يوازن سماء محيطة باردة وضوءًا داخليًا دافئًا وعمق واجهة وانعكاسات مضبوطة.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Lighting: blue hour with cool ambient sky, warm interior glow, facade depth, and controlled reflections' },
  { groupKey: 'lighting_time_of_day', value: 'overcast_softbox', labelEn: 'Overcast Softbox', labelAr: 'غائم ناعم', bestFor: 'Material studies and facade option comparisons', descriptionEn: 'Uses diffuse sky, low contrast, honest material color, and shadow-free evaluation light.', descriptionAr: 'يستخدم سماء منتشرة وتباينًا منخفضًا ولون مواد صادقًا وضوء تقييم بلا ظلال قوية.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Lighting: overcast softbox with diffuse sky, low contrast, honest material color, and shadow-free evaluation light' },

  { groupKey: 'mood_atmosphere', value: 'calm_refined', labelEn: 'Calm Refined', labelAr: 'هادئ مصقول', bestFor: 'Premium architecture without theatrical excess', descriptionEn: 'Creates quiet confidence, restrained richness, balanced composition, and polished professional tone.', descriptionAr: 'ينشئ ثقة هادئة وثراءً منضبطًا وتكوينًا متوازنًا ونبرة احترافية مصقولة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Mood: calm refined atmosphere with quiet confidence, restrained richness, balanced composition, and polished professional tone' },
  { groupKey: 'mood_atmosphere', value: 'dramatic_shadow', labelEn: 'Dramatic Shadow', labelAr: 'ظل درامي', bestFor: 'Strong massing, museums, and expressive facade depth', descriptionEn: 'Uses contrast, deep shadow, sculptural depth, and strong architectural presence without fantasy effects.', descriptionAr: 'يستخدم التباين والظل العميق والعمق النحتي والحضور المعماري القوي دون مؤثرات خيالية.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Mood: dramatic shadow with contrast, deep shadow, sculptural depth, and strong architectural presence without fantasy effects' },
  { groupKey: 'mood_atmosphere', value: 'lived_in_elegance', labelEn: 'Lived-In Elegance', labelAr: 'أناقة قابلة للعيش', bestFor: 'Interior and residential scenes needing warmth', descriptionEn: 'Adds subtle occupancy cues, natural softness, careful styling, and believable human scale.', descriptionAr: 'يضيف مؤشرات استخدام خفيفة ونعومة طبيعية وتنسيقًا دقيقًا ومقياسًا إنسانيًا مقنعًا.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Mood: lived-in elegance with subtle occupancy cues, natural softness, careful styling, and believable human scale' },

  { groupKey: 'render_quality', value: 'client_presentation', labelEn: 'Client Presentation', labelAr: 'عرض للعميل', bestFor: 'Review meetings and persuasive design communication', descriptionEn: 'Targets polished, legible, realistic visualization with strong composition and restrained detail.', descriptionAr: 'يستهدف إظهارًا مصقولًا ومقروءًا وواقعيًا بتكوين قوي وتفاصيل منضبطة.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Render quality: client presentation level, polished, legible, realistic, strong composition, restrained detail' },
  { groupKey: 'render_quality', value: 'competition_visual', labelEn: 'Competition Visual', labelAr: 'صورة مسابقة', bestFor: 'Architectural boards and concept storytelling', descriptionEn: 'Creates a striking but plausible image with memorable atmosphere and clear design thesis.', descriptionAr: 'ينشئ صورة مؤثرة لكنها معقولة بأجواء لا تُنسى وطرح تصميمي واضح.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Render quality: competition visual with striking plausible image, memorable atmosphere, and clear design thesis' },
  { groupKey: 'render_quality', value: 'material_review', labelEn: 'Material Review', labelAr: 'مراجعة مواد', bestFor: 'Finish decisions and comparative material boards', descriptionEn: 'Prioritizes honest material color, texture scale, joints, reflectance, and neutral evaluation light.', descriptionAr: 'يعطي الأولوية للون المادة الصادق ومقياس الملمس والفواصل والانعكاس وضوء تقييم محايد.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Render quality: material review prioritizing honest material color, texture scale, joints, reflectance, and neutral evaluation light' },

  { groupKey: 'output_purpose', value: 'client_review', labelEn: 'Client Review', labelAr: 'مراجعة العميل', bestFor: 'Presenting a controlled option for decision-making', descriptionEn: 'Keeps the result clear, defensible, realistic, and easy to compare against the current design.', descriptionAr: 'يبقي الناتج واضحًا وقابلًا للدفاع وواقعيًا وسهل المقارنة مع التصميم الحالي.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'Output purpose: client review, clear, defensible, realistic, and easy to compare against the current design' },
  { groupKey: 'output_purpose', value: 'design_exploration', labelEn: 'Design Exploration', labelAr: 'استكشاف تصميمي', bestFor: 'Testing controlled alternatives before final selection', descriptionEn: 'Allows controlled variation while keeping design intent and evaluation criteria visible.', descriptionAr: 'يسمح بتنوع مضبوط مع إبقاء نية التصميم ومعايير التقييم واضحة.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'Output purpose: design exploration with controlled variation, visible design intent, and clear evaluation criteria' },
  { groupKey: 'output_purpose', value: 'portfolio_hero', labelEn: 'Portfolio Hero', labelAr: 'صورة رئيسية للملف', bestFor: 'A polished showcase image after design direction is stable', descriptionEn: 'Prioritizes memorable composition, premium atmosphere, clarity, and architecture-led storytelling.', descriptionAr: 'يعطي الأولوية لتكوين لا ينسى وأجواء فاخرة ووضوح وسرد تقوده العمارة.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'Output purpose: portfolio hero with memorable composition, premium atmosphere, clarity, and architecture-led storytelling' },

  { groupKey: 'negative_constraints', value: 'architecture_standard_cleanup', labelEn: 'Architecture Standard Cleanup', labelAr: 'تنظيف معماري قياسي', bestFor: 'Most architecture prompts', descriptionEn: 'Excludes warped geometry, impossible structure, random openings, fake text, and exaggerated lens distortion.', descriptionAr: 'يستبعد الهندسة المشوهة والإنشاء المستحيل والفتحات العشوائية والنص الزائف وتشوه العدسة المبالغ فيه.', isDefault: true, isActive: true, sortOrder: 10, promptFragment: 'warped geometry, impossible structure, random openings, fake text, exaggerated lens distortion' },
  { groupKey: 'negative_constraints', value: 'no_extra_floors_or_openings', labelEn: 'No Extra Floors or Openings', labelAr: 'منع الطوابق أو الفتحات الإضافية', bestFor: 'Fixed Geometry and client revision modes', descriptionEn: 'Prevents added levels, shifted windows, resized openings, changed rooflines, and altered plot boundaries.', descriptionAr: 'يمنع إضافة مستويات ونقل النوافذ وتغيير أحجام الفتحات وخط السقف وحدود الموقع.', isDefault: false, isActive: true, sortOrder: 20, promptFragment: 'extra floors, shifted windows, resized openings, changed rooflines, altered plot boundaries' },
  { groupKey: 'negative_constraints', value: 'no_fake_material_logic', labelEn: 'No Fake Material Logic', labelAr: 'منع منطق المواد الزائف', bestFor: 'Material and facade review outputs', descriptionEn: 'Excludes plastic-looking stone, impossible joints, inconsistent texture scale, and random cladding seams.', descriptionAr: 'يستبعد الحجر البلاستيكي والفواصل المستحيلة ومقياس الملمس غير المتسق وفواصل الكسوة العشوائية.', isDefault: false, isActive: true, sortOrder: 30, promptFragment: 'plastic-looking stone, impossible joints, inconsistent texture scale, random cladding seams' }
];

export const architectureQualityTemplates: ArchitectureQualityTemplateSeed[] = [
  {
    key: 'architecture_exterior_geometry_guard',
    titleEn: 'Architecture Exterior Geometry Guard',
    titleAr: 'حماية هندسية للواجهات المعمارية',
    bestFor: 'Controlled exterior revisions with fixed or semi-fixed massing',
    descriptionEn: 'A professional exterior prompt template for preserving approved geometry while refining facade language, materials, context, light, and presentation quality.',
    descriptionAr: 'قالب احترافي للواجهات يحافظ على الهندسة المعتمدة مع تحسين لغة الواجهة والمواد والسياق والضوء وجودة العرض.',
    workflowType: 'architecture_exterior_visualization',
    defaultEngineKey: 'midjourney',
    defaultDropdowns: {
      project_type: 'residential',
      building_typology: 'villa',
      design_task: 'controlled_refinement',
      geometry_guard_mode: 'semi_fixed_geometry',
      reference_role: 'geometry_reference',
      architectural_style: 'contemporary_luxury',
      school_movement_influence: 'modernism',
      architect_influence: 'glenn_murcutt',
      facade_system: 'layered_screens',
      massing_type: 'stacked_volumes',
      roof_type: 'flat_parapet',
      opening_window_rhythm: 'regular_grid',
      material_palette: 'stone_wood_glass',
      facade_material: 'limestone',
      interior_space_type: 'open_living',
      landscape_element: 'native_planting',
      climate_context: 'hot_arid',
      camera_view: 'eye_level_three_quarter',
      lens_framing: '35mm_architectural',
      lighting_time_of_day: 'soft_golden_hour',
      mood_atmosphere: 'calm_refined',
      render_quality: 'client_presentation',
      output_purpose: 'client_review',
      negative_constraints: 'architecture_standard_cleanup'
    },
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_material_facade_review',
    titleEn: 'Architecture Material and Facade Review',
    titleAr: 'مراجعة المواد والواجهة المعمارية',
    bestFor: 'Comparing facade and material alternatives without changing the building',
    descriptionEn: 'A concise template for material studies, facade-system changes, and client comparison views that keep geometry stable and evaluation criteria clear.',
    descriptionAr: 'قالب موجز لدراسات المواد وتغييرات نظام الواجهة وعروض المقارنة للعميل مع إبقاء الهندسة ثابتة ومعايير التقييم واضحة.',
    workflowType: 'architecture_material_facade_review',
    defaultEngineKey: 'flux',
    defaultDropdowns: {
      project_type: 'residential',
      building_typology: 'villa',
      design_task: 'material_alternatives',
      geometry_guard_mode: 'fixed_geometry',
      reference_role: 'material_reference',
      architectural_style: 'warm_minimalism',
      school_movement_influence: 'critical_regionalism',
      architect_influence: 'glenn_murcutt',
      facade_system: 'solid_void_composition',
      massing_type: 'stacked_volumes',
      roof_type: 'flat_parapet',
      opening_window_rhythm: 'deep_reveals',
      material_palette: 'concrete_glass_metal',
      facade_material: 'board_form_concrete',
      interior_space_type: 'open_living',
      landscape_element: 'stone_courtyard',
      climate_context: 'hot_arid',
      camera_view: 'eye_level_three_quarter',
      lens_framing: '50mm_compressed',
      lighting_time_of_day: 'overcast_softbox',
      mood_atmosphere: 'calm_refined',
      render_quality: 'material_review',
      output_purpose: 'client_review',
      negative_constraints: 'no_fake_material_logic'
    },
    isPublished: true,
    version: 1
  }
];

export const architectureQualityPromptTemplates: ArchitectureQualityPromptTemplateSeed[] = [
  {
    key: 'architecture_geometry_guard_prompt_package',
    titleEn: 'Architecture Geometry Guard Prompt Package',
    titleAr: 'حزمة مطالبة حماية الهندسة المعمارية',
    category: 'architecture_prompt_compiler',
    bestFor: 'Exterior and facade workflows that must preserve approved geometry',
    descriptionEn: 'Professional template language for producing controlled Architecture prompt packages with main prompt, negative prompt, geometry instructions, reference instructions, engine prompt, and checklist.',
    descriptionAr: 'لغة قالب احترافية لإنتاج حزم مطالبات معمارية مضبوطة تشمل المطالبة الرئيسية والسلبية وتعليمات الهندسة والمراجع ومحرك الصورة وقائمة التحقق.',
    promptBody: 'Create a professional architecture visualization prompt from the selected template, project brief, Geometry Guard scope, database dropdowns, and reference roles. Preserve all locked geometry, describe the design task with architectural precision, include material and climate logic, keep scale believable, and produce a client-ready visualization direction without calling an AI generation API.',
    negativePrompt: 'warped geometry, extra floors, shifted openings, changed plot boundary, impossible structure, random facade rhythm, fake text, watermark, exaggerated lens distortion, plastic materials, inconsistent shadows, low quality',
    engineHints: {
      midjourney: 'Use compact visual clauses and keep parameters at the end.',
      gpt_image: 'Use direct natural-language edit boundaries.',
      flux: 'Use concise subject, material, light, camera, and realism clauses.',
      stable_diffusion: 'Use ordered positive tags and a separate negative prompt.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  },
  {
    key: 'architecture_material_review_prompt_package',
    titleEn: 'Architecture Material Review Prompt Package',
    titleAr: 'حزمة مطالبة مراجعة المواد المعمارية',
    category: 'architecture_prompt_compiler',
    bestFor: 'Material alternatives, facade finish comparisons, and client review boards',
    descriptionEn: 'Template language for locked-geometry material studies where texture scale, joints, reflectance, weathering, and honest evaluation light matter most.',
    descriptionAr: 'لغة قالب لدراسات المواد مع هندسة مقفلة حيث يكون مقياس الملمس والفواصل والانعكاس والتقادم وضوء التقييم الصادق هي الأهم.',
    promptBody: 'Generate a controlled architecture material-review prompt. Keep massing, openings, roofline, plot boundary, camera, and landscape stable unless explicitly unlocked. Focus on facade material, palette hierarchy, joint logic, reflectance, texture scale, realistic weathering, and neutral review lighting suitable for client comparison.',
    negativePrompt: 'geometry edits, moved openings, changed roofline, fake stone, plastic concrete, impossible joints, inconsistent texture scale, random seams, oversaturated materials, bad perspective, low quality',
    engineHints: {
      midjourney: 'Prioritize material hierarchy and facade readability.',
      gpt_image: 'State exact locked elements before material changes.',
      flux: 'Use material, texture scale, joints, light, camera, realism.',
      stable_diffusion: 'Keep positive material tags ordered and negative constraints explicit.'
    },
    maxCharacters: 2000,
    isPublished: true,
    version: 1
  }
];
