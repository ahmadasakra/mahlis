'use client';

import { usePathname } from 'next/navigation';
import { BeamsBackground } from '@/components/ui/beams-background';

export default function BeamsBackgroundWrapper() {
  const pathname = usePathname();
  
  // Zeige Hintergrund nicht auf Admin-Seiten
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <BeamsBackground intensity="subtle" />;
}

