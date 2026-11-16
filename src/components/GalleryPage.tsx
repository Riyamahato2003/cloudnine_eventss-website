import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { ResilientImage } from './ResilientImage';

const GALLERY_CATEGORIES = [
  'All Works',
  'Balloon Installations',
  'Linen Signage',
  'Event Draping',
  'Bespoke Numbers',
] as const;

export function GalleryPage() {
  const { portfolioItems, setLightboxItem, navigateTo } = useCatalog();
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof GALLERY_CATEGORIES)[number]>('All Works');

  const filtered =
    selectedCategory === 'All Works'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DED6CE] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
            Portfolio Archive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
            Curated event styling across Sydney
          </h1>
          <p className="text-sm sm:text-base text-[#6B625C] leading-relaxed">
            Explore our bespoke balloon installations, hand-tied linen signage, sheer draping compositions, and pearl-trimmed milestone pieces. Click any photograph to inspect full styling notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('build')}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[40px] text-xs font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer whitespace-nowrap self-start lg:self-auto"
        >
          <span>Customise Your Event</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Category Filter */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F2EEEB] border border-[#DED6CE] rounded-lg w-fit">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#6B625C] hover:text-[#1C1917]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asymmetric Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((item, idx) => {
          const isWideFeature = selectedCategory === 'All Works' && idx === 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className={`text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 rounded-xl flex flex-col ${
                isWideFeature ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div
                className={`w-full rounded-xl overflow-hidden border border-[#DED6CE] bg-[#F2EEEB] mb-3.5 ${
                  isWideFeature ? 'aspect-[16/10]' : 'aspect-[4/5]'
                }`}
              >
                <ResilientImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6B625C] mb-1">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>{item.eventType}</span>
                <span aria-hidden="true">·</span>
                <span>{item.location}</span>
              </div>

              <h2 className="font-serif text-2xl text-[#1C1917] group-hover:text-[#7C4D59] transition-colors leading-snug">
                {item.title}
              </h2>

              <p className="text-sm text-[#6B625C] mt-1.5 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
