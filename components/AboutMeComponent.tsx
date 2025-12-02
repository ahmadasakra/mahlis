'use client';

import { useEffect, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';
import { ContainerScroll, CardSticky } from '@/components/ui/container-scroll';
import { useLocale } from '@/lib/locale';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Image from 'next/image';

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

interface AnimatedImageProps {
  src: string;
  alt: string;
}

function AnimatedProfileImage({ src, alt }: AnimatedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const springOpacity = useSpring(opacity, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springY = useSpring(y, springConfig);
  const springRotate = useSpring(rotate, springConfig);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex justify-end mb-16 mt-4">
      <motion.div
        className="relative"
        style={{
          opacity: springOpacity,
          scale: springScale,
          y: springY,
          rotate: springRotate,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
        <div className="absolute inset-[-20px] rounded-full border-2 border-primary/10" />
        
        {/* Image container with gradient border effect */}
        <div className="relative rounded-full overflow-hidden shadow-2xl ring-4 ring-primary/30 ring-offset-4 ring-offset-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-full" />
          <Image
            src={src}
            alt={alt}
            width={300}
            height={300}
            className="relative rounded-full object-cover w-[250px] h-[250px] md:w-[300px] md:h-[300px]"
            priority
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function AboutMeComponent() {
  const { t, dir } = useLocale();
  
  // Profile image URL
  const profileImageSrc = 'https://i.ibb.co/s9k6KGLJ/5292233448183499712.jpg';

  return (
    <div className="min-h-screen bg-background pt-32" dir={dir}>
      <div className="container mx-auto px-6 pb-12 xl:px-12">
        <div className="mb-12 pt-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Text Content - Left */}
            <div className="flex-1 text-center md:text-left">
              <Text variant="heading-48" className="mb-4 text-foreground">
                {t('about.name')}
              </Text>
              <Text variant="heading-24" className="mb-6 text-muted-foreground">
                {t('about.subtitle')}
              </Text>
              <Text variant="copy-18" className="max-w-3xl mx-auto md:mx-0 text-foreground/80">
                {t('about.intro')}
              </Text>
            </div>
            
            {/* Animated Profile Image - Right */}
            <div className="flex-shrink-0">
              <AnimatedProfileImage 
                src={profileImageSrc} 
                alt={t('about.name')}
              />
            </div>
          </div>
        </div>

        <ContainerScroll className="min-h-[150vh] space-y-8 py-8">
          {ABOUT_SECTIONS.map((section, index) => (
            <CardSticky
              key={section.id}
              incrementY={15}
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

        <div className="mt-8 text-center">
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

