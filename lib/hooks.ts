'use client';

import { useEffect, useState } from 'react';

const BREAKPOINTS = {
  SM: 0,
  MD: 600,
  LG: 960,
  XL: 1200,
};

export const useResponsive = <T,>(styles: T | ResponsiveProp<T>): T | undefined => {
  const [responsiveStyles, setResponsiveStyles] = useState<T | undefined>();

  useEffect(() => {
    const getResponsive = (styles: T | ResponsiveProp<T>): T | undefined => {
      let currentDirection: T | undefined;

      if (typeof styles === 'object' && styles !== null && !Array.isArray(styles)) {
        const responsiveStyles = styles as ResponsiveProp<T>;
        if (responsiveStyles.xl && window.innerWidth >= BREAKPOINTS.XL) {
          currentDirection = responsiveStyles.xl;
        } else if (responsiveStyles.lg && window.innerWidth >= BREAKPOINTS.LG) {
          currentDirection = responsiveStyles.lg;
        } else if (responsiveStyles.md && window.innerWidth >= BREAKPOINTS.MD) {
          currentDirection = responsiveStyles.md;
        } else if (responsiveStyles.sm && window.innerWidth >= BREAKPOINTS.SM) {
          currentDirection = responsiveStyles.sm;
        }
      } else {
        currentDirection = styles as T;
      }

      return currentDirection;
    };

    const listener = () => {
      setResponsiveStyles(getResponsive(styles));
    };

    listener();

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [JSON.stringify(styles)]);

  return responsiveStyles;
};

export interface ResponsiveProp<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

