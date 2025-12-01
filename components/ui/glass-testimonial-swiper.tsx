"use client";

import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';
import { Star, Calendar, ThumbsUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Component Interfaces ---
export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  tags: { text: string; type: 'featured' | 'default' }[];
  stats: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string; }[];
  avatarGradient: string;
  rating: number;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  /** How many cards to show behind the main card */
  visibleBehind?: number;
}

// --- The Component ---
export const TestimonialStack = ({ testimonials, visibleBehind = 2 }: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = testimonials.length;

  const navigate = useCallback((newIndex: number) => {
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add('is-dragging');
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStartRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    cardRefs.current[activeIndex]?.classList.remove('is-dragging');
    // Reduziere den Schwellenwert für einfacheres Swipen
    if (Math.abs(dragOffset) > 30) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigate(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        navigate(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex, navigate]);
  
  if (!testimonials?.length) return null;

  return (
    <section className="testimonials-stack relative pb-20 w-full h-[600px] md:h-[650px]">
      {testimonials.map((testimonial, index) => {
        const isActive = index === activeIndex;
        // Calculate the card's position in the display order
        const displayOrder = (index - activeIndex + totalCards) % totalCards;

        // --- DYNAMIC STYLE CALCULATION ---
        const style: CSSProperties = {};
        if (displayOrder === 0) { // The active card
          style.transform = `translateX(${dragOffset}px)`;
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) { // Cards stacked behind
          const scale = 1 - 0.05 * displayOrder;
          const translateY = -2 * displayOrder; // in rem
          style.transform = `scale(${scale}) translateY(${translateY}rem)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else { // Cards that are out of view
          style.transform = 'scale(0)';
          style.opacity = 0;
          style.zIndex = 0;
        }

        const tagClasses = (type: 'featured' | 'default') => type === 'featured' 
          ? 'bg-[#C3E41D]/20 text-[#C3E41D] border border-[#C3E41D]/30' 
          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300';

        return (
          <div
            ref={el => cardRefs.current[index] = el}
            key={testimonial.id}
            className={cn(
              "testimonial-card absolute top-0 left-0 w-full rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50",
              "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl",
              "transition-all duration-300 ease-out",
              "cursor-grab active:cursor-grabbing",
              "select-none touch-none", // Verhindert Text-Selektion und Touch-Scrolling beim Draggen
              displayOrder === 0 ? "pointer-events-auto" : "pointer-events-none"
            )}
            style={{
              ...style,
              height: '100%',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleDragStart(e, index);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleDragStart(e, index);
            }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-base shadow-lg" 
                    style={{ background: testimonial.avatarGradient }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300 dark:text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-lg mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                  {testimonial.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={cn(
                        'text-xs px-2 py-1 rounded-md font-medium',
                        tagClasses(tag.type)
                      )}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                  {testimonial.stats.map((stat, i) => {
                    const IconComponent = stat.icon;
                    return (
                      <span key={i} className="flex items-center gap-1.5">
                        <IconComponent className="h-3.5 w-3.5" />
                        {stat.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Navigation Buttons */}
      {totalCards > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(activeIndex - 1);
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-lg hover:bg-white dark:hover:bg-neutral-800 transition-all hover:scale-110 active:scale-95"
            aria-label="Vorherige Bewertung"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-neutral-700 dark:text-neutral-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(activeIndex + 1);
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-lg hover:bg-white dark:hover:bg-neutral-800 transition-all hover:scale-110 active:scale-95"
            aria-label="Nächste Bewertung"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-neutral-700 dark:text-neutral-300" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {totalCards > 1 && (
        <div className="pagination flex gap-2 justify-center absolute bottom-0 left-0 right-0 pt-6 pb-2">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              aria-label={`Gehe zu Bewertung ${index + 1}`} 
              onClick={() => navigate(index)} 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeIndex === index 
                  ? "bg-[#C3E41D] w-8" 
                  : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 w-2"
              )}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {totalCards > 1 && (
        <div className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-md">
          {activeIndex + 1} / {totalCards}
        </div>
      )}

      {/* Swipe Hint */}
      {totalCards > 1 && !isDragging && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 text-xs text-neutral-500 dark:text-neutral-400 text-center animate-pulse">
          <p className="hidden md:block">← Ziehen Sie die Karte oder verwenden Sie die Pfeile →</p>
          <p className="md:hidden">← Wischen Sie oder tippen Sie auf die Pfeile →</p>
        </div>
      )}
    </section>
  );
};

