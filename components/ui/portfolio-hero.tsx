'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/locale";

// BlurText animation component
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export default function PortfolioHero() {
  const { t, locale, dir } = useLocale();
  
  // Get name based on locale
  const fullName = t('author.name');
  
  // For Arabic, show the full name as one unit (not split)
  // For German, split into first and last name
  const isArabic = locale === 'ar';
  const nameParts = isArabic 
    ? [fullName] // Arabic: keep as one unit "ريتا محليس"
    : fullName.split(' '); // German: ["Rita", "Mahlis"]
  
  const firstName = isArabic ? fullName : (nameParts[0] || '');
  const lastName = isArabic ? '' : (nameParts.slice(1).join(' ') || '');

  // Font family based on language - using Tajawal for better Arabic letter connection
  const fontFamily = isArabic 
    ? "'Tajawal', sans-serif" 
    : "'Fira Code', monospace";

  return (
    <div className="min-h-screen text-foreground transition-colors" dir={dir}>
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col">
        {/* Centered Main Name */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
          <div className="relative text-center">
            <div className={isArabic ? 'rtl arabic-text' : ''}>
              <BlurText
                text={isArabic ? fullName : firstName.toUpperCase()}
                delay={isArabic ? 50 : 100}
                animateBy={isArabic ? "words" : "letters"}
                direction="top"
                className={`font-bold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[210px] leading-[0.9] justify-center whitespace-nowrap ${isArabic ? 'rtl arabic-text' : 'uppercase tracking-tighter'}`}
                style={{ 
                  color: "#C3E41D", 
                  fontFamily: fontFamily,
                  fontWeight: isArabic ? 900 : 'bold',
                  letterSpacing: isArabic ? '0' : 'tighter',
                  wordSpacing: isArabic ? '0.15em' : 'normal',
                  textAlign: 'center',
                  direction: isArabic ? 'rtl' : 'ltr',
                  fontFeatureSettings: isArabic ? '"liga" 1, "kern" 1' : 'normal',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              />
            </div>
            {!isArabic && lastName && (
              <div>
                <BlurText
                  text={lastName.toUpperCase()}
                  delay={100}
                  animateBy="letters"
                  direction="top"
                  className="font-bold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[210px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                  style={{ color: "#C3E41D", fontFamily: fontFamily }}
                />
              </div>
            )}
            {/* Profile Picture */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-[65px] h-[110px] sm:w-[90px] sm:h-[152px] md:w-[110px] md:h-[185px] lg:w-[129px] lg:h-[218px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer">
                <img
                  src="https://i.ibb.co/pjR5D77Q/d680ab3e-e6aa-43fa-97c3-e111f002ae05.jpg"
                  alt={t('author.name')}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-32 xl:bottom-36 left-1/2 -translate-x-1/2 w-full px-6">
          <div className="flex justify-center">
            <BlurText
              text={t('home.tagline')}
              delay={150}
              animateBy="words"
              direction="top"
              className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center transition-colors duration-300 text-neutral-500 hover:text-black dark:hover:text-white"
              style={{ 
                fontFamily: isArabic ? "'Cairo', sans-serif" : "'Antic', sans-serif",
                direction: dir
              }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          type="button"
          onClick={() => {
            const articlesSection = document.getElementById('articles');
            if (articlesSection) {
              articlesSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300 cursor-pointer"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 md:w-8 md:h-8 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300" />
        </button>
      </main>
    </div>
  );
}

