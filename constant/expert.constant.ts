import { ExperienceLevel } from '@/store/user';

export const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_FILES = 3;
export const MAX_FILE_SIZE_MB = 2;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_SAMPLE_ITEMS = 10;
export const MAX_CONTACT_LINKS = 5;
export const MAX_CONTACT_NUMBERS = 3;

export const defaultDomainOptions = ['برنامه‌نویسی', 'پزشکی', 'مکانیک', 'حقوقی', 'مالی', 'طراحی'];
export const defaultSubdomainOptions = ['فرانت‌اند', 'بک‌اند', 'هوش مصنوعی', 'قراردادهای فناوری', 'سخت‌افزار', 'تحلیل داده'];

export const IRAN_PROVINCES = [
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'اردبیل',
  'اصفهان',
  'البرز',
  'ایلام',
  'بوشهر',
  'تهران',
  'چهارمحال و بختیاری',
  'خراسان جنوبی',
  'خراسان رضوی',
  'خراسان شمالی',
  'خوزستان',
  'زنجان',
  'سمنان',
  'سیستان و بلوچستان',
  'فارس',
  'قزوین',
  'قم',
  'کردستان',
  'کرمان',
  'کرمانشاه',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'گیلان',
  'لرستان',
  'مازندران',
  'مرکزی',
  'هرمزگان',
  'همدان',
  'یزد',
] as const;

export const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: 'LESS_THAN_1_YEAR', label: 'کمتر از ۱ سال سابقه' },
  { value: 'ONE_TO_THREE_YEARS', label: '۱ تا ۳ سال سابقه' },
  { value: 'THREE_TO_FIVE_YEARS', label: '۳ تا ۵ سال سابقه' },
  { value: 'FIVE_TO_TEN_YEARS', label: '۵ تا ۱۰ سال سابقه' },
  { value: 'MORE_THAN_TEN_YEARS', label: 'بیش از ۱۰ سال سابقه' },
];
