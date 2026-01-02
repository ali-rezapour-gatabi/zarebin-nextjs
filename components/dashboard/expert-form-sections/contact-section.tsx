import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAX_CONTACT_LINKS, MAX_CONTACT_NUMBERS } from '@/constant/expert.constant';
import type { ExpertFormValues } from '@/type/expert';

type ContactSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  watchedContactLinks?: string[];
  watchedContactNumbers?: string[];
  contactNumberInput: string;
  setContactNumberInput: (value: string) => void;
  addContactNumber: () => void;
  removeContactNumber: (phone: string) => void;
  contactLinkInput: string;
  setContactLinkInput: (value: string) => void;
  addContactLink: () => void;
  removeContactLink: (link: string) => void;
  isExpertSaving: boolean;
};

export const ContactSection = memo(
  ({
    control,
    errors,
    watchedContactLinks,
    watchedContactNumbers,
    contactNumberInput,
    setContactNumberInput,
    addContactNumber,
    removeContactNumber,
    contactLinkInput,
    setContactLinkInput,
    addContactLink,
    removeContactLink,
    isExpertSaving,
  }: ContactSectionProps) => {
    return (
      <div className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">راه‌های ارتباطی</p>
          <span className="text-xs text-muted-foreground">وب‌سایت شخصی، شبکه اجتماعی یا شماره ثابت/دفتر</span>
        </div>
        <Controller
          name="contactNumbers"
          control={control}
          rules={{
            validate: (value) => {
              const count = value?.length ?? 0;
              return count <= MAX_CONTACT_NUMBERS || `حداکثر ${MAX_CONTACT_NUMBERS} شماره مجاز است`;
            },
          }}
          render={() => <></>}
        />
        <div className="flex items-center gap-2">
          <Input
            placeholder="شماره ثابت/دفتر یا همراه دوم (مثلاً 02188887777 یا 0989121234567)"
            value={contactNumberInput}
            className="h-14"
            onChange={(e) => setContactNumberInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addContactNumber();
              }
            }}
            disabled={isExpertSaving}
            aria-invalid={Boolean(errors.contactNumbers)}
          />
          <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addContactNumber} disabled={isExpertSaving}>
            <Plus className="size-6" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(watchedContactNumbers || []).map((phone: string) => (
            <button
              key={phone}
              type="button"
              onClick={() => removeContactNumber(phone)}
              className="bg-secondary text-secondary-foreground hover:text-secondary-foreground/80 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
              disabled={isExpertSaving}
            >
              {phone}
              <X className="size-3" />
            </button>
          ))}
        </div>
        {errors.contactNumbers && <p className="text-xs text-destructive">{errors.contactNumbers.message}</p>}

        <Controller
          name="contactLinks"
          control={control}
          rules={{
            validate: (value) => {
              const count = value?.length ?? 0;
              return count <= MAX_CONTACT_LINKS || `حداکثر ${MAX_CONTACT_LINKS} لینک مجاز است`;
            },
          }}
          render={() => <></>}
        />
        <div className="flex items-center gap-2">
          <Input
            placeholder="https://linkedin.com/in/username یا https://yourdomain.com"
            value={contactLinkInput}
            className="h-14"
            onChange={(e) => setContactLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addContactLink();
              }
            }}
            disabled={isExpertSaving}
            aria-invalid={Boolean(errors.contactLinks)}
          />
          <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addContactLink} disabled={isExpertSaving}>
            <Plus className="size-6" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(watchedContactLinks || []).map((link: string) => (
            <button
              key={link}
              type="button"
              onClick={() => removeContactLink(link)}
              className="bg-accent text-accent-foreground/90 hover:text-accent-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
              disabled={isExpertSaving}
            >
              {link}
              <X className="size-3" />
            </button>
          ))}
          {!watchedContactLinks?.length && !watchedContactNumbers?.length && (
            <span className="text-xs text-muted-foreground">مثلاً لینک وب‌سایت، لینکدین، اینستاگرام، گیت‌هاب یا شماره تماس دفتر</span>
          )}
        </div>
        {errors.contactLinks && <p className="text-xs text-destructive">{errors.contactLinks.message}</p>}
      </div>
    );
  },
);

ContactSection.displayName = 'ContactSection';
