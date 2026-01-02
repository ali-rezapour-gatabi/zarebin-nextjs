export const DOMAINS = [
  // Medical & Healthcare
  { key: 'GENERAL_MEDICINE', value: 'پزشکی عمومی' },
  { key: 'INTERNAL_MEDICINE', value: 'داخلی' },
  { key: 'SURGERY_GENERAL', value: 'جراحی عمومی' },
  { key: 'NEUROSURGERY', value: 'جراحی مغز و اعصاب' },
  { key: 'CARDIOLOGY', value: 'قلب و عروق' },
  { key: 'ORTHOPEDICS', value: 'ارتوپدی' },
  { key: 'DENTISTRY', value: 'دندان‌پزشکی' },
  { key: 'PHARMACY', value: 'داروسازی' },
  { key: 'NURSING_MIDWIFERY', value: 'پرستاری / مامایی' },
  { key: 'PSYCHOLOGY_PSYCHIATRY', value: 'روانشناسی / روان‌پزشکی' },
  { key: 'RADIOLOGY_IMAGING', value: 'رادیولوژی / تصویربرداری' },
  { key: 'LABORATORY_PATHOLOGY', value: 'آزمایشگاه / پاتولوژی' },
  { key: 'EMERGENCY_MEDICINE', value: 'اورژانس' },
  { key: 'PHYSIOTHERAPY_REHABILITATION', value: 'فیزیوتراپی / توانبخشی' },
  { key: 'NUTRITION_DIETETICS', value: 'تغذیه / رژیم درمانی' },

  // Software & IT
  { key: 'SOFTWARE_ENGINEERING', value: 'مهندسی نرم‌افزار' },
  { key: 'FRONTEND_UI_DEVELOPMENT', value: 'فرانت‌اند / UI' },
  { key: 'BACKEND_API_DEVELOPMENT', value: 'بک‌اند / API' },
  { key: 'FULLSTACK_DEVELOPMENT', value: 'فول‌استک' },
  { key: 'MOBILE_APP_DEVELOPMENT', value: 'توسعه موبایل' },
  { key: 'DEVOPS_CLOUD', value: 'DevOps / Cloud' },
  { key: 'DATA_SCIENCE_ANALYTICS', value: 'علم داده / تحلیل داده' },
  { key: 'AI_MACHINE_LEARNING', value: 'هوش مصنوعی / یادگیری ماشین' },
  { key: 'CYBER_SECURITY_NETWORK', value: 'امنیت سایبری / شبکه' },
  { key: 'GAME_AR_VR_DEVELOPMENT', value: 'توسعه بازی / AR / VR' },
  { key: 'EMBEDDED_IOT', value: 'سیستم‌های نهفته / IoT' },

  // Engineering
  { key: 'CIVIL_CONSTRUCTION', value: 'عمران / ساختمان' },
  { key: 'MECHANICAL_MANUFACTURING', value: 'مکانیک / ساخت و تولید' },
  { key: 'ELECTRICAL_POWER', value: 'برق / قدرت' },
  { key: 'ELECTRONICS_TELECOMMUNICATION', value: 'الکترونیک / مخابرات' },
  { key: 'INDUSTRIAL_SYSTEMS', value: 'صنایع / سیستم‌ها' },
  { key: 'CHEMICAL_PROCESS', value: 'شیمی / فرایند' },
  { key: 'PETROLEUM_ENERGY', value: 'نفت / گاز / انرژی' },
  { key: 'MATERIALS_METALLURGY', value: 'مواد / متالورژی' },

  // Business & Management
  { key: 'BUSINESS_MANAGEMENT', value: 'مدیریت کسب‌وکار' },
  { key: 'ENTREPRENEURSHIP_STARTUPS', value: 'کارآفرینی / استارتاپ' },
  { key: 'PRODUCT_PROJECT_MANAGEMENT', value: 'مدیریت محصول / پروژه' },
  { key: 'MARKETING_BRANDING', value: 'بازاریابی / برندینگ' },
  { key: 'DIGITAL_MARKETING_GROWTH', value: 'دیجیتال مارکتینگ / رشد' },
  { key: 'SALES_NEGOTIATION', value: 'فروش / مذاکره' },
  { key: 'HUMAN_RESOURCES_TALENT', value: 'منابع انسانی / جذب استعداد' },
  { key: 'OPERATIONS_SUPPLY_CHAIN', value: 'عملیات / زنجیره تأمین' },

  // Finance & Economics
  { key: 'ACCOUNTING_AUDITING', value: 'حسابداری / حسابرسی' },
  { key: 'FINANCE_INVESTMENT', value: 'مالی / سرمایه‌گذاری' },
  { key: 'BANKING_CREDIT', value: 'بانکداری / اعتبار' },
  { key: 'INSURANCE_RISK', value: 'بیمه / مدیریت ریسک' },
  { key: 'FINTECH_BLOCKCHAIN', value: 'فین‌تک / بلاکچین' },
  { key: 'TAXATION_COMPLIANCE', value: 'مالیات / قوانین مالی' },

  // Legal & Public Services
  { key: 'LAW_LEGAL_ADVICE', value: 'حقوق / مشاوره حقوقی' },
  { key: 'JUDICIARY_ARBITRATION', value: 'قضاوت / داوری' },
  { key: 'CORPORATE_COMMERCIAL_LAW', value: 'حقوق تجاری / شرکت‌ها' },
  { key: 'INTERNATIONAL_LAW_RELATIONS', value: 'حقوق بین‌الملل / روابط' },
  { key: 'PUBLIC_POLICY_GOVERNANCE', value: 'سیاست‌گذاری / حکمرانی' },

  // Arts, Design & Media
  { key: 'GRAPHIC_VISUAL_DESIGN', value: 'طراحی گرافیک / بصری' },
  { key: 'UI_UX_PRODUCT_DESIGN', value: 'طراحی UI/UX / محصول' },
  { key: 'INDUSTRIAL_PRODUCT_DESIGN', value: 'طراحی صنعتی / محصول' },
  { key: 'FASHION_TEXTILE_DESIGN', value: 'طراحی لباس / نساجی' },
  { key: 'PHOTOGRAPHY_VIDEOGRAPHY', value: 'عکاسی / فیلم‌برداری' },
  { key: 'FILM_CINEMA_PRODUCTION', value: 'سینما / تولید فیلم' },
  { key: 'MUSIC_SOUND_PRODUCTION', value: 'موسیقی / صدا' },
  { key: 'ANIMATION_MOTION_GRAPHICS', value: 'انیمیشن / موشن گرافیک' },

  // Content & Communication
  { key: 'CONTENT_CREATION_COPYWRITING', value: 'تولید محتوا / کپی‌رایتینگ' },
  { key: 'JOURNALISM_MEDIA', value: 'روزنامه‌نگاری / رسانه' },
  { key: 'TRANSLATION_LOCALIZATION', value: 'ترجمه / بومی‌سازی' },
  { key: 'PUBLIC_RELATIONS_COMMUNICATION', value: 'روابط عمومی / ارتباطات' },

  // Education & Research
  { key: 'TEACHING_TRAINING', value: 'آموزش / تدریس' },
  { key: 'ACADEMIC_RESEARCH', value: 'پژوهش دانشگاهی' },
  { key: 'E_LEARNING_INSTRUCTIONAL', value: 'آموزش آنلاین / طراحی آموزشی' },

  // Crafts & Skilled Trades
  { key: 'JEWELRY_GOLDSMITH', value: 'طلاسازی / جواهرسازی' },
  { key: 'CARPENTRY_WOODWORK', value: 'نجاری / صنایع چوب' },
  { key: 'MECHANIC_AUTOMOTIVE', value: 'مکانیکی / خودرو' },
  { key: 'ELECTRICIAN_TECHNICIAN', value: 'برق‌کاری / تکنسین' },
  { key: 'PLUMBING_INSTALLATION', value: 'لوله‌کشی / تأسیسات' },
  { key: 'WELDING_METALWORK', value: 'جوشکاری / فلزکاری' },

  // Manufacturing & Industry
  { key: 'MANUFACTURING_PRODUCTION', value: 'تولید / کارخانه' },
  { key: 'QUALITY_CONTROL_ASSURANCE', value: 'کنترل کیفیت / تضمین کیفیت' },
  { key: 'INDUSTRIAL_MAINTENANCE', value: 'نگهداری و تعمیرات' },
  { key: 'LOGISTICS_WAREHOUSING', value: 'لجستیک / انبارداری' },

  // Agriculture & Environment
  { key: 'AGRICULTURE_FARMING', value: 'کشاورزی / دامداری' },
  { key: 'FOOD_PROCESSING', value: 'صنایع غذایی' },
  { key: 'ENVIRONMENTAL_SUSTAINABILITY', value: 'محیط زیست / پایداری' },

  // Services & Lifestyle
  { key: 'TOURISM_HOSPITALITY', value: 'گردشگری / هتلداری' },
  { key: 'CUSTOMER_SUPPORT_SUCCESS', value: 'پشتیبانی / موفقیت مشتری' },
  { key: 'SECURITY_SAFETY_SERVICES', value: 'امنیت / ایمنی' },
  { key: 'BEAUTY_WELLNESS', value: 'زیبایی / سلامت' },

  // Other & Modern Work
  { key: 'FREELANCING_REMOTE_WORK', value: 'فریلنسری / دورکاری' },
  { key: 'CONSULTING_ADVISORY', value: 'مشاوره / راهبری' },
  { key: 'NON_PROFIT_SOCIAL_IMPACT', value: 'سازمان‌های اجتماعی / خیریه' },
] as const;
