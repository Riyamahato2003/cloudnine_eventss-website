import React, { useState } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { ResilientImage } from './ResilientImage';

export function CollectionsPage() {
  const {
    catalog,
    startCustomisingFromStyle,
    setIsOwnerModalOpen,
    navigateTo,
  } = useCatalog();
  const [filter, setFilter] = useState<'All' | 'Balloon Styling' | 'Signage' | 'Draping & Extras'>('All');

  const activeBalloons = catalog.balloonStyles.filter((b) => b.active && !b.isNoneOption);
  const signageAddons = catalog.addons.filter((a) => a.active && a.category === 'Signage');
  const drapingAndExtras = catalog.addons.filter((a) => a.active && a.category !== 'Signage');

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DED6CE] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
            Services &amp; Collections
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
            Bespoke balloon styling, linen signage &amp; event draping
          </h1>
          <p className="text-sm sm:text-base text-[#6B625C] leading-relaxed">
            Every displayed price below is an editable <strong>indicative USD placeholder estimate</strong> (excluding venue delivery and custom fabrication). Select any style to pre-load it into the quote builder.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsOwnerModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-xs font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C4D59]" />
            <span>Edit USD Placeholder Prices</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('build')}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[40px] text-xs font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Open Quote Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F2EEEB] border border-[#DED6CE] rounded-lg w-fit">
        {(['All', 'Balloon Styling', 'Signage', 'Draping & Extras'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 min-h-[40px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filter === tab
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#6B625C] hover:text-[#1C1917]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section 1: Balloon Styling & Arrangements */}
      {(filter === 'All' || filter === 'Balloon Styling') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-serif text-3xl text-[#1C1917]">
              01. Balloon Styling &amp; Installations
            </h2>
            <span className="text-xs text-[#6B625C]">
              Base pricing shown for Petite scale · Indicative USD estimates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBalloons.map((style) => (
              <div
                key={style.id}
                className="rounded-xl border border-[#DED6CE] bg-white overflow-hidden flex flex-col sm:flex-row group"
              >
                <div className="sm:w-48 aspect-[4/3] sm:aspect-auto bg-[#F2EEEB] overflow-hidden shrink-0">
                  <ResilientImage
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-xs text-[#6B625C]">{style.subtitle}</span>
                      <span className="text-sm font-semibold tabular-nums text-[#1C1917] shrink-0">
                        From ${style.basePriceUsd} USD
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1C1917]">{style.name}</h3>
                    <p className="text-sm text-[#6B625C] leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#DED6CE]">
                    <span className="text-xs text-[#6B625C]">Indicative estimate</span>
                    <button
                      type="button"
                      onClick={() => startCustomisingFromStyle(style.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Customise Style</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Linen Signage & Personalised Text */}
      {(filter === 'All' || filter === 'Signage') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-serif text-3xl text-[#1C1917]">
              02. Linen Signage &amp; Personalised Lettering
            </h2>
            <span className="text-xs text-[#6B625C]">
              Pair with balloons or book as a standalone focal piece
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signageAddons.map((addon) => (
              <div
                key={addon.id}
                className="rounded-xl border border-[#DED6CE] bg-white overflow-hidden flex flex-col group"
              >
                <div className="aspect-[4/3] bg-[#F2EEEB] overflow-hidden">
                  <ResilientImage
                    src={addon.image}
                    alt={addon.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2 text-xs text-[#6B625C]">
                      <span>{addon.unitLabel}</span>
                      <span className="text-sm font-semibold tabular-nums text-[#1C1917]">
                        Est. ${addon.priceUsd} USD
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1C1917]">{addon.name}</h3>
                    <p className="text-sm text-[#6B625C] leading-relaxed">
                      {addon.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startCustomisingFromStyle('balloon-backdrop', [addon.id])
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer self-start pt-2"
                  >
                    <span>Add to Event Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Event Draping, Florals & Bespoke Extras */}
      {(filter === 'All' || filter === 'Draping & Extras') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-serif text-3xl text-[#1C1917]">
              03. Event Draping, Florals &amp; Styling Extras
            </h2>
            <span className="text-xs text-[#6B625C]">
              Indicative USD estimates · Availability confirmed upon enquiry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {drapingAndExtras.map((addon) => (
              <div
                key={addon.id}
                className="rounded-xl border border-[#DED6CE] bg-white overflow-hidden flex flex-col group"
              >
                <div className="aspect-[4/3] bg-[#F2EEEB] overflow-hidden">
                  <ResilientImage
                    src={addon.image}
                    alt={addon.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2 text-xs text-[#6B625C]">
                      <span>{addon.category}</span>
                      <span className="font-semibold tabular-nums text-[#1C1917]">
                        Est. ${addon.priceUsd} USD
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-[#1C1917] leading-snug">
                      {addon.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B625C] leading-relaxed">
                      {addon.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startCustomisingFromStyle('balloon-backdrop', [addon.id])
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer self-start"
                  >
                    <span>Select in Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
