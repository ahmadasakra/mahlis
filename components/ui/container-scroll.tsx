'use client';

import React from 'react';
import { HTMLMotionProps, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ perspective: '1000px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
});
ContainerScroll.displayName = 'ContainerScroll';

interface CardStickyProps extends HTMLMotionProps<'div'> {
  index: number;
  incrementY?: number;
  incrementZ?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 10,
      incrementZ = 10,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const y = index * incrementY;
    const z = index * incrementZ;

    return (
      <motion.div
        ref={ref}
        layout="position"
        style={{
          top: y,
          zIndex: z,
          backfaceVisibility: 'hidden',
          ...style,
        }}
        className={cn('sticky', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardSticky.displayName = 'CardSticky';

export { ContainerScroll, CardSticky };



