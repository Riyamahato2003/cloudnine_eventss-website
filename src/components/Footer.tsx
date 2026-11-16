import React from 'react';
import { Instagram, SlidersHorizontal } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export function Footer() {
  const { catalog, navigateTo, setIsOwnerModalOpen } = useCatalog();

  return (
    <footer className="border-t border-[#DED6CE] bg-[#F2EEEB]/70 mt-20">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#DED6CE]">
          <div className="md:col-span-5 space-y-3">
            <div className="font-serif text-3xl text-[#1C1917]">
              {catalog.settings.businessName}
            </div>
            <p className="font-serif italic text-lg text-[#6B625C]">
              {catalog.settings.tagline}
            </p>
            <p className="text-sm text-[#6B625C] leading-relaxed max-w-md pt-1">
              {catalog.settings.serviceAreaNote}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="font-sans text-xs font-semibold tracking-wider text-[#1C1917] uppercase">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-[#6B625C]">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('build')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  Build Your Event &amp; Quote
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('collections')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  Services &amp; Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('gallery')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  About Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('book')}
                  className="hover:text-[#1C1917] transition-colors cursor-pointer"
                >
                  Book Your Event
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-sans text-xs font-semibold tracking-wider text-[#1C1917] uppercase">
              Studio &amp; Pricing Tools
            </h3>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Follow recent Sydney installations on Instagram or manage indicative USD pricing placeholders.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={catalog.settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-xs font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <Instagram className="w-4 h-4 text-[#7C4D59]" />
                <span>{catalog.settings.instagramHandle}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsOwnerModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-xs font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C4D59]" />
                <span>Owner Price Manager</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B625C]">
          <div>
            <span>{catalog.settings.businessName}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>{catalog.settings.locationLabel}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>All displayed USD figures are indicative estimates only</span>
          </div>
          <div>
            <span>Balloon Styling · Linen Signage · Event Draping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
