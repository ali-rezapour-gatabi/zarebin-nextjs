export const DOMAINS = {
  // Medical & Healthcare
  GENERAL_MEDICINE: 'پزشکی عمومی',
  INTERNAL_MEDICINE: 'داخلی',
  SURGERY_GENERAL: 'جراحی عمومی',
  NEUROSURGERY: 'جراحی مغز و اعصاب',
  CARDIOLOGY: 'قلب و عروق',
  ORTHOPEDICS: 'ارتوپدی',
  DENTISTRY: 'دندان‌پزشکی',
  PHARMACY: 'داروسازی',
  NURSING_MIDWIFERY: 'پرستاری / مامایی',
  PSYCHOLOGY_PSYCHIATRY: 'روانشناسی / روان‌پزشکی',
  RADIOLOGY_IMAGING: 'رادیولوژی / تصویربرداری',
  LABORATORY_PATHOLOGY: 'آزمایشگاه / پاتولوژی',
  EMERGENCY_MEDICINE: 'اورژانس',
  PHYSIOTHERAPY_REHABILITATION: 'فیزیوتراپی / توانبخشی',
  NUTRITION_DIETETICS: 'تغذیه / رژیم درمانی',

  // Software & IT
  SOFTWARE_ENGINEERING: 'مهندسی نرم‌افزار',
  FRONTEND_UI_DEVELOPMENT: 'فرانت‌اند / UI',
  BACKEND_API_DEVELOPMENT: 'بک‌اند / API',
  FULLSTACK_DEVELOPMENT: 'فول‌استک',
  MOBILE_APP_DEVELOPMENT: 'توسعه موبایل',
  DEVOPS_CLOUD: 'DevOps / Cloud',
  DATA_SCIENCE_ANALYTICS: 'علم داده / تحلیل داده',
  AI_MACHINE_LEARNING: 'هوش مصنوعی / یادگیری ماشین',
  CYBER_SECURITY_NETWORK: 'امنیت سایبری / شبکه',
  GAME_AR_VR_DEVELOPMENT: 'توسعه بازی / AR / VR',
  EMBEDDED_IOT: 'سیستم‌های نهفته / IoT',

  // Engineering
  CIVIL_CONSTRUCTION: 'عمران / ساختمان',
  MECHANICAL_MANUFACTURING: 'مکانیک / ساخت و تولید',
  ELECTRICAL_POWER: 'برق / قدرت',
  ELECTRONICS_TELECOMMUNICATION: 'الکترونیک / مخابرات',
  INDUSTRIAL_SYSTEMS: 'صنایع / سیستم‌ها',
  CHEMICAL_PROCESS: 'شیمی / فرایند',
  PETROLEUM_ENERGY: 'نفت / گاز / انرژی',
  MATERIALS_METALLURGY: 'مواد / متالورژی',

  // Business & Management
  BUSINESS_MANAGEMENT: 'مدیریت کسب‌وکار',
  ENTREPRENEURSHIP_STARTUPS: 'کارآفرینی / استارتاپ',
  PRODUCT_PROJECT_MANAGEMENT: 'مدیریت محصول / پروژه',
  MARKETING_BRANDING: 'بازاریابی / برندینگ',
  DIGITAL_MARKETING_GROWTH: 'دیجیتال مارکتینگ / رشد',
  SALES_NEGOTIATION: 'فروش / مذاکره',
  HUMAN_RESOURCES_TALENT: 'منابع انسانی / جذب استعداد',
  OPERATIONS_SUPPLY_CHAIN: 'عملیات / زنجیره تأمین',

  // Finance & Economics
  ACCOUNTING_AUDITING: 'حسابداری / حسابرسی',
  FINANCE_INVESTMENT: 'مالی / سرمایه‌گذاری',
  BANKING_CREDIT: 'بانکداری / اعتبار',
  INSURANCE_RISK: 'بیمه / مدیریت ریسک',
  FINTECH_BLOCKCHAIN: 'فین‌تک / بلاکچین',
  TAXATION_COMPLIANCE: 'مالیات / قوانین مالی',

  // Legal & Public Services
  LAW_LEGAL_ADVICE: 'حقوق / مشاوره حقوقی',
  JUDICIARY_ARBITRATION: 'قضاوت / داوری',
  CORPORATE_COMMERCIAL_LAW: 'حقوق تجاری / شرکت‌ها',
  INTERNATIONAL_LAW_RELATIONS: 'حقوق بین‌الملل / روابط',
  PUBLIC_POLICY_GOVERNANCE: 'سیاست‌گذاری / حکمرانی',

  // Arts, Design & Media
  GRAPHIC_VISUAL_DESIGN: 'طراحی گرافیک / بصری',
  UI_UX_PRODUCT_DESIGN: 'طراحی UI/UX / محصول',
  INDUSTRIAL_PRODUCT_DESIGN: 'طراحی صنعتی / محصول',
  FASHION_TEXTILE_DESIGN: 'طراحی لباس / نساجی',
  PHOTOGRAPHY_VIDEOGRAPHY: 'عکاسی / فیلم‌برداری',
  FILM_CINEMA_PRODUCTION: 'سینما / تولید فیلم',
  MUSIC_SOUND_PRODUCTION: 'موسیقی / صدا',
  ANIMATION_MOTION_GRAPHICS: 'انیمیشن / موشن گرافیک',

  // Content & Communication
  CONTENT_CREATION_COPYWRITING: 'تولید محتوا / کپی‌رایتینگ',
  JOURNALISM_MEDIA: 'روزنامه‌نگاری / رسانه',
  TRANSLATION_LOCALIZATION: 'ترجمه / بومی‌سازی',
  PUBLIC_RELATIONS_COMMUNICATION: 'روابط عمومی / ارتباطات',

  // Education & Research
  TEACHING_TRAINING: 'آموزش / تدریس',
  ACADEMIC_RESEARCH: 'پژوهش دانشگاهی',
  E_LEARNING_INSTRUCTIONAL: 'آموزش آنلاین / طراحی آموزشی',

  // Crafts & Skilled Trades
  JEWELRY_GOLDSMITH: 'طلاسازی / جواهرسازی',
  CARPENTRY_WOODWORK: 'نجاری / صنایع چوب',
  MECHANIC_AUTOMOTIVE: 'مکانیکی / خودرو',
  ELECTRICIAN_TECHNICIAN: 'برق‌کاری / تکنسین',
  PLUMBING_INSTALLATION: 'لوله‌کشی / تأسیسات',
  WELDING_METALWORK: 'جوشکاری / فلزکاری',

  // Manufacturing & Industry
  MANUFACTURING_PRODUCTION: 'تولید / کارخانه',
  QUALITY_CONTROL_ASSURANCE: 'کنترل کیفیت / تضمین کیفیت',
  INDUSTRIAL_MAINTENANCE: 'نگهداری و تعمیرات',
  LOGISTICS_WAREHOUSING: 'لجستیک / انبارداری',

  // Agriculture & Environment
  AGRICULTURE_FARMING: 'کشاورزی / دامداری',
  FOOD_PROCESSING: 'صنایع غذایی',
  ENVIRONMENTAL_SUSTAINABILITY: 'محیط زیست / پایداری',

  // Services & Lifestyle
  TOURISM_HOSPITALITY: 'گردشگری / هتلداری',
  CUSTOMER_SUPPORT_SUCCESS: 'پشتیبانی / موفقیت مشتری',
  SECURITY_SAFETY_SERVICES: 'امنیت / ایمنی',
  BEAUTY_WELLNESS: 'زیبایی / سلامت',

  // Other & Modern Work
  FREELANCING_REMOTE_WORK: 'فریلنسری / دورکاری',
  CONSULTING_ADVISORY: 'مشاوره / راهبری',
  NON_PROFIT_SOCIAL_IMPACT: 'سازمان‌های اجتماعی / خیریه',
} as const;
