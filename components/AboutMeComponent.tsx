'use client';

import { Text } from '@/components/ui/text';
import { ContainerScroll, CardSticky } from '@/components/ui/container-scroll';
import { useLocale } from '@/lib/locale';

const ABOUT_SECTIONS = [
  {
    id: 'education',
    titleKey: 'about.education.title',
    descriptionKey: 'about.education.description',
    bg: 'rgb(58,148,118)',
  },
  {
    id: 'experience',
    titleKey: 'about.experience.title',
    descriptionKey: 'about.experience.description',
    bg: 'rgb(195,97,158)',
  },
  {
    id: 'training',
    titleKey: 'about.training.title',
    descriptionKey: 'about.training.description',
    bg: 'rgb(202,128,53)',
  },
  {
    id: 'focus',
    titleKey: 'about.focus.title',
    descriptionKey: 'about.focus.description',
    bg: 'rgb(135,95,195)',
  },
];

export default function AboutMeComponent() {
  const { t, dir } = useLocale();

  return (
    <div className="min-h-screen bg-background pt-24" dir={dir}>
      <div className="container mx-auto px-6 pb-12 xl:px-12">
        <div className="mb-12 text-center">
          <Text variant="heading-48" className="mb-4 text-foreground">
            {t('about.name')}
          </Text>
          <Text variant="heading-24" className="mb-6 text-muted-foreground">
            {t('about.subtitle')}
          </Text>
          <Text variant="copy-18" className="mx-auto max-w-3xl text-foreground/80">
            {t('about.intro')}
          </Text>
        </div>

        <ContainerScroll className="min-h-[400vh] space-y-8 py-12">
          {ABOUT_SECTIONS.map((section, index) => (
            <CardSticky
              key={section.id}
              incrementY={20}
              index={index + 2}
              className="mx-auto flex h-80 w-full max-w-2xl flex-col justify-between rounded-2xl border border-border p-8 shadow-lg backdrop-blur-md"
              style={{
                transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index + 1)}deg)`,
                background: section.bg,
              }}
            >
              <div>
                <Text variant="heading-32" className="mb-6 text-white">
                  {t(section.titleKey)}
                </Text>
              </div>
              <div>
                <Text variant="copy-18" className="text-white/90">
                  {t(section.descriptionKey)}
                </Text>
              </div>
            </CardSticky>
          ))}
        </ContainerScroll>

        <div className="mt-12 text-center">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-md">
            <Text variant="heading-24" className="mb-6 text-foreground">
              {t('about.fullTitle')}
            </Text>
            <Text variant="copy-16" className="mb-4 text-foreground/80">
              {t('about.fullDescription1')}
            </Text>
            <Text variant="copy-16" className="mb-4 text-foreground/80">
              {t('about.fullDescription2')}
            </Text>
            <Text variant="copy-16" className="text-foreground/80">
              {t('about.fullDescription3')}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

