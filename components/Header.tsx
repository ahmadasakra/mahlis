'use client';

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Header() {
  // Initialisiere mit dem tatsächlichen Dark-Mode-Status
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Header nicht auf Admin-Seiten anzeigen
  // WICHTIG: Dieser Check muss NACH allen Hooks kommen!
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const menuItems = [
    { label: "HOME", href: "/", highlight: pathname === "/" },
    { label: "KURSE", href: "/courses", highlight: pathname?.startsWith("/courses") },
    { label: "ARTIKEL", href: "/articles", highlight: pathname?.startsWith("/articles") },
    { label: "BEWERTUNGEN", href: "/reviews", highlight: pathname === "/reviews" },
    { label: "KONTAKT", href: "/contact", highlight: pathname === "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50">
      <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Menu Button */}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            className="p-2 transition-colors duration-300 z-50 text-neutral-500 hover:text-black dark:hover:text-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
            ) : (
              <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
            )}
          </button>
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full left-0 w-[200px] md:w-[240px] border-none shadow-2xl mt-2 ml-4 p-4 rounded-lg z-[100]"
              style={{
                backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
              }}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-lg md:text-xl font-bold tracking-tight py-1.5 px-2 cursor-pointer transition-colors duration-300"
                  style={{
                    color: item.highlight ? "#C3E41D" : isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#C3E41D";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = item.highlight ? "#C3E41D" : (isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)");
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Signature */}
        <Link href="/">
          <div 
            className="text-4xl cursor-pointer transition-opacity hover:opacity-80" 
            style={{ 
              color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)", 
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" 
            }}
          >
            R
          </div>
        </Link>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="relative w-16 h-8 rounded-full hover:opacity-80 transition-opacity"
          style={{ backgroundColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)" }}
          aria-label="Toggle theme"
        >
          <div
            className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300"
            style={{
              backgroundColor: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
              transform: isDark ? "translateX(2rem)" : "translateX(0)",
            }}
          />
        </button>
      </nav>
    </header>
  );
}

