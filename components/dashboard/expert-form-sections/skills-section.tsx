import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ExpertFormValues } from '@/type/expert';

type SkillsSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  watchedSkills?: string[];
  skillInput: string;
  setSkillInput: (value: string) => void;
  addSkill: () => void;
  removeSkill: (skill: string) => void;
  isExpertSaving: boolean;
};

export const SkillsSection = memo(({
  control,
  errors,
  watchedSkills,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  isExpertSaving,
}: SkillsSectionProps) => {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">مهارت‌ها</p>
        <span className="text-xs text-muted-foreground">افزودن با Enter</span>
      </div>
      <Controller name="skills" control={control} rules={{ validate: (value) => (value && value.length > 0) || 'حداقل یک مهارت لازم است' }} render={() => <></>} />
      <div className="flex items-center gap-2">
        <Input
          placeholder="مثلاً: React, API Design"
          value={skillInput}
          className="h-14"
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addSkill();
            }
          }}
          disabled={isExpertSaving}
          aria-invalid={Boolean(errors.skills)}
        />
        <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addSkill} disabled={isExpertSaving}>
          <Plus className="size-6" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(watchedSkills || []).map((skill: string) => (
          <button
            key={skill}
            type="button"
            onClick={() => removeSkill(skill)}
            className="bg-accent text-accent-foreground/90 hover:text-accent-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            disabled={isExpertSaving}
          >
            {skill}
            <X className="size-3" />
          </button>
        ))}
        {errors.skills && <p className="text-xs text-destructive">{errors.skills.message}</p>}
      </div>
    </div>
  );
});

SkillsSection.displayName = 'SkillsSection';
