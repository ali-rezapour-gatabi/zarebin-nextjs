'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpertForm } from '@/components/dashboard/expert-form-hooks';
import { ContactSection } from '@/components/dashboard/expert-form-sections/contact-section';
import { DescriptionSection } from '@/components/dashboard/expert-form-sections/description-section';
import { DocumentsSection } from '@/components/dashboard/expert-form-sections/documents-section';
import { DomainSection } from '@/components/dashboard/expert-form-sections/domain-section';
import { ExperienceSection } from '@/components/dashboard/expert-form-sections/experience-section';
import { LocationSection } from '@/components/dashboard/expert-form-sections/location-section';
import { SampleSection } from '@/components/dashboard/expert-form-sections/sample-section';
import { SkillsSection } from '@/components/dashboard/expert-form-sections/skills-section';
import { SubdomainSection } from '@/components/dashboard/expert-form-sections/subdomain-section';
import { SubmitFooter } from '@/components/dashboard/expert-form-sections/submit-footer';

export const ExpertForm = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isExpertSaving,
    loading,
    canSubmit,
    domainInput,
    setDomainInput,
    subdomainInput,
    setSubdomainInput,
    skillInput,
    setSkillInput,
    sampleInput,
    setSampleInput,
    contactLinkInput,
    setContactLinkInput,
    contactNumberInput,
    setContactNumberInput,
    mergedDomainOptions,
    mergedSubdomainOptions,
    watchedDomain,
    watchedSubdomains,
    watchedSkills,
    watchedDescription,
    watchedSample,
    watchedContactLinks,
    watchedContactNumbers,
    watchedDocuments,
    domainHint,
    locationHint,
    addDomainOption,
    addSubdomainOption,
    toggleOption,
    addSkill,
    removeSkill,
    addSampleJob,
    removeSampleJob,
    addContactLink,
    removeContactLink,
    addContactNumber,
    removeContactNumber,
    setValue,
    documentPreviews,
    handleAddDocuments,
    removeDocument,
    fileInputRef,
  } = useExpertForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
      <Card className="shadow-xs">
        <CardHeader className="gap-2">
          <CardTitle>اطلاعات تخصصی</CardTitle>
          <CardDescription>حوزه‌های کاری، مهارت‌ها و ... خود را مدیریت کنید.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DomainSection
              control={control}
              errors={errors}
              mergedDomainOptions={mergedDomainOptions}
              watchedDomain={watchedDomain}
              domainInput={domainInput}
              setDomainInput={setDomainInput}
              addDomainOption={addDomainOption}
              isExpertSaving={isExpertSaving}
              setValue={setValue}
              domainHint={domainHint}
            />
            <SubdomainSection
              control={control}
              errors={errors}
              mergedSubdomainOptions={mergedSubdomainOptions}
              watchedSubdomains={watchedSubdomains}
              subdomainInput={subdomainInput}
              setSubdomainInput={setSubdomainInput}
              addSubdomainOption={addSubdomainOption}
              toggleOption={toggleOption}
              isExpertSaving={isExpertSaving}
            />
          </div>

          <LocationSection control={control} errors={errors} isExpertSaving={isExpertSaving} locationHint={locationHint} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1.05fr]">
            <SkillsSection
              control={control}
              errors={errors}
              watchedSkills={watchedSkills}
              skillInput={skillInput}
              setSkillInput={setSkillInput}
              addSkill={addSkill}
              removeSkill={removeSkill}
              isExpertSaving={isExpertSaving}
            />
            <div className="space-y-4">
              <SampleSection
                control={control}
                errors={errors}
                watchedSample={watchedSample}
                sampleInput={sampleInput}
                setSampleInput={setSampleInput}
                addSampleJob={addSampleJob}
                removeSampleJob={removeSampleJob}
                isExpertSaving={isExpertSaving}
              />
              <ContactSection
                control={control}
                errors={errors}
                watchedContactLinks={watchedContactLinks}
                watchedContactNumbers={watchedContactNumbers}
                contactNumberInput={contactNumberInput}
                setContactNumberInput={setContactNumberInput}
                addContactNumber={addContactNumber}
                removeContactNumber={removeContactNumber}
                contactLinkInput={contactLinkInput}
                setContactLinkInput={setContactLinkInput}
                addContactLink={addContactLink}
                removeContactLink={removeContactLink}
                isExpertSaving={isExpertSaving}
              />
            </div>
          </div>

          <ExperienceSection control={control} errors={errors} isExpertSaving={isExpertSaving} />

          <DocumentsSection
            documentPreviews={documentPreviews}
            watchedDocuments={watchedDocuments}
            fileInputRef={fileInputRef}
            handleAddDocuments={handleAddDocuments}
            removeDocument={removeDocument}
            isExpertSaving={isExpertSaving}
          />

          <DescriptionSection control={control} errors={errors} watchedDescription={watchedDescription} isExpertSaving={isExpertSaving} />
        </CardContent>
        <CardFooter>
          <SubmitFooter canSubmit={canSubmit} isExpertSaving={isExpertSaving} loading={loading} />
        </CardFooter>
      </Card>
    </form>
  );
};
