import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { PageView } from '../types/events';

const NAV_ITEMS: { id: PageView; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'build', label: 'Build Event' },
  { id: 'collections', label: 'Collections' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
];

export function Navbar() {
  const { currentView, navigateTo, catalog } = useCatalog();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (view: PageView) => {
    navigateTo(view);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F6]/92 backdrop-blur-md border-b border-[#DED6CE]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-serif text-2xl sm:text-[26px] font-medium tracking-tight text-[#1C1917] hover:text-[#7C4D59] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {catalog.settings.businessName}
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B625C]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  isActive
                    ? 'text-[#1C1917]'
                    : 'text-[#6B625C] hover:text-[#1C1917]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0.5 h-[1.5px] bg-[#7C4D59] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('book')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] text-xs font-medium tracking-wide text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book Event
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#DED6CE] text-[#1C1917] hover:bg-[#F2EEEB] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#DED6CE] bg-[#FAF8F6] px-5 py-5 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 min-h-[44px] text-left text-base rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F2EEEB] text-[#1C1917] font-medium'
                    : 'text-[#6B625C] hover:bg-[#F2EEEB]/60 hover:text-[#1C1917]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#DED6CE]">
            <button
              type="button"
              onClick={() => handleNav('book')}
              className="w-full py-3 px-4 min-h-[44px] text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer"
            >
              Book Event
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
