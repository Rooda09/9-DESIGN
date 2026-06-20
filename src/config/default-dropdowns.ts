export const defaultDropdownGroups = [
  // Architecture
  { domain: 'ARCHITECTURE', key: 'architecture_workflow', labelEn: 'Architecture Workflow', labelAr: 'نوع سير العمل المعماري', required: true },
  { domain: 'ARCHITECTURE', key: 'geometry_guard', labelEn: 'Geometry Guard', labelAr: 'حماية الهندسة', required: true },
  { domain: 'ARCHITECTURE', key: 'building_type', labelEn: 'Building Type', labelAr: 'نوع المبنى', required: true },
  { domain: 'ARCHITECTURE', key: 'architectural_style', labelEn: 'Architectural Style', labelAr: 'الطراز المعماري', required: true },
  { domain: 'ARCHITECTURE', key: 'facade_system', labelEn: 'Facade System', labelAr: 'نظام الواجهة', required: false },
  { domain: 'ARCHITECTURE', key: 'material_palette', labelEn: 'Material Palette', labelAr: 'لوحة المواد', required: false },
  { domain: 'ARCHITECTURE', key: 'camera_view', labelEn: 'Camera View', labelAr: 'زاوية الكاميرا', required: true },
  { domain: 'ARCHITECTURE', key: 'lighting_time', labelEn: 'Lighting / Time', labelAr: 'الإضاءة / الوقت', required: true },
  { domain: 'ARCHITECTURE', key: 'story_arc', labelEn: 'Story Arc', labelAr: 'القصة البصرية', required: false },

  // Photography
  { domain: 'PHOTOGRAPHY', key: 'photography_workflow', labelEn: 'Photography Workflow', labelAr: 'نوع سير عمل التصوير', required: true },
  { domain: 'PHOTOGRAPHY', key: 'product_lock', labelEn: 'Product Lock', labelAr: 'حماية المنتج', required: false },
  { domain: 'PHOTOGRAPHY', key: 'photo_category', labelEn: 'Photo Category', labelAr: 'فئة التصوير', required: true },
  { domain: 'PHOTOGRAPHY', key: 'lighting_setup', labelEn: 'Lighting Setup', labelAr: 'إعداد الإضاءة', required: true },
  { domain: 'PHOTOGRAPHY', key: 'camera_lens', labelEn: 'Camera / Lens', labelAr: 'الكاميرا / العدسة', required: false },
  { domain: 'PHOTOGRAPHY', key: 'background_set', labelEn: 'Background / Set', labelAr: 'الخلفية / المشهد', required: false },
  { domain: 'PHOTOGRAPHY', key: 'commercial_use', labelEn: 'Commercial Use', labelAr: 'الاستخدام التجاري', required: true },
  { domain: 'PHOTOGRAPHY', key: 'story_arc', labelEn: 'Story Arc', labelAr: 'القصة البصرية', required: false },

  // Branding
  { domain: 'BRANDING', key: 'branding_workflow', labelEn: 'Branding Workflow', labelAr: 'نوع سير عمل الهوية', required: true },
  { domain: 'BRANDING', key: 'brand_memory', labelEn: 'Brand Memory', labelAr: 'ذاكرة الهوية', required: false },
  { domain: 'BRANDING', key: 'brand_archetype', labelEn: 'Brand Archetype', labelAr: 'شخصية العلامة', required: false },
  { domain: 'BRANDING', key: 'visual_identity_type', labelEn: 'Visual Identity Type', labelAr: 'نوع الهوية البصرية', required: true },
  { domain: 'BRANDING', key: 'campaign_type', labelEn: 'Campaign Type', labelAr: 'نوع الحملة', required: false },
  { domain: 'BRANDING', key: 'color_system', labelEn: 'Color System', labelAr: 'نظام الألوان', required: false },
  { domain: 'BRANDING', key: 'platform_format', labelEn: 'Platform Format', labelAr: 'صيغة المنصة', required: false },
  { domain: 'BRANDING', key: 'story_arc', labelEn: 'Story Arc', labelAr: 'القصة البصرية', required: false },

  // Cross-domain
  { domain: null, key: 'audio_background', labelEn: 'Audio Background', labelAr: 'الخلفية الصوتية', required: false },
  { domain: null, key: 'upscale_mode', labelEn: 'Upscale Mode', labelAr: 'نمط تحسين الجودة', required: false },
  { domain: null, key: 'output_quality', labelEn: 'Output Quality', labelAr: 'جودة المخرج', required: true },
  { domain: null, key: 'aspect_ratio', labelEn: 'Aspect Ratio', labelAr: 'نسبة الصورة', required: true }
] as const;

export const defaultDropdownOptions = [
  { groupKey: 'geometry_guard', value: 'semi_fixed', labelEn: 'Semi-Fixed Geometry', labelAr: 'هندسة شبه ثابتة', bestFor: 'Facade and material exploration', descriptionEn: 'Preserves main massing and boundaries while allowing facade/material changes.', descriptionAr: 'يحافظ على الكتلة والحدود الرئيسية مع السماح بتغيير الواجهة والمواد.', isDefault: true },
  { groupKey: 'geometry_guard', value: 'fixed', labelEn: 'Fixed Geometry', labelAr: 'هندسة ثابتة', bestFor: 'Client revisions and reference-based renders', descriptionEn: 'Strictly preserves massing, borders, floor count, openings, and camera angle.', descriptionAr: 'يحافظ بدقة على الكتلة والحدود وعدد الطوابق والفتحات وزاوية الكاميرا.', isDefault: false },
  { groupKey: 'geometry_guard', value: 'free_concept', labelEn: 'Free Concept', labelAr: 'تصور حر', bestFor: 'Early ideation', descriptionEn: 'Uses reference as inspiration only and allows major design transformation.', descriptionAr: 'يستخدم المرجع كمصدر إلهام فقط ويسمح بتغيير التصميم بشكل واسع.', isDefault: false },
  { groupKey: 'product_lock', value: 'strict_product_lock', labelEn: 'Strict Product Lock', labelAr: 'حماية صارمة للمنتج', bestFor: 'E-commerce and product ads', descriptionEn: 'Preserves exact product shape, proportions, label area, and material identity.', descriptionAr: 'يحافظ على شكل المنتج ونسبه ومنطقة الملصق وهوية المادة بدقة.', isDefault: true },
  { groupKey: 'brand_memory', value: 'enabled', labelEn: 'Brand Memory Enabled', labelAr: 'تفعيل ذاكرة الهوية', bestFor: 'Campaign consistency', descriptionEn: 'Uses saved brand rules to protect palette, tone, hierarchy, and visual identity.', descriptionAr: 'يستخدم قواعد الهوية المحفوظة للحفاظ على الألوان والنبرة والتسلسل والهوية البصرية.', isDefault: true },
  { groupKey: 'audio_background', value: 'cinematic_subtle', labelEn: 'Cinematic Subtle', labelAr: 'سينمائي هادئ', bestFor: 'Architecture, luxury brands, premium products', descriptionEn: 'A refined audio mood for elegant, non-distracting clip backgrounds.', descriptionAr: 'مزاج صوتي راقٍ ومناسب للخلفيات الفاخرة غير المشتتة.', isDefault: true },
  { groupKey: 'upscale_mode', value: 'clean_professional', labelEn: 'Clean Professional Upscale', labelAr: 'تحسين احترافي نظيف', bestFor: 'Final exports', descriptionEn: 'Improves resolution, sharpness, and clarity while avoiding over-processed artifacts.', descriptionAr: 'يحسن الدقة والحدة والوضوح مع تجنب مظهر المعالجة الزائدة.', isDefault: true }
] as const;
