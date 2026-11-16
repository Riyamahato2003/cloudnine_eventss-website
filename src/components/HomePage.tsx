import React, { useState } from 'react';
import { ArrowRight, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { useCatalog } from '../context/CatalogContext';
import { ResilientImage } from './ResilientImage';

const HERO_FRAMES = [
  {
    src: '/assets/aistudio/image_af146372.png',
    caption: '“Our Little Hunny” · Sheer Draping, Linen Signage & Slate Organic Arch',
  },
  {
    src: '/assets/aistudio/image_229a6608.png',
    caption: '“Umrah Mubarak” · Monochrome Sculptural Arch & Lantern Installation',
  },
  {
    src: '/assets/aistudio/image_03f00875.png',
    caption: '“Zara’s Four-Ever” · Custom Blush Linen Banner & Pearl Stack',
  },
];

export function HomePage() {
  const {
    catalog,
    navigateTo,
    portfolioItems,
    setLightboxItem,
    startCustomisingFromStyle,
  } = useCatalog();
  const [heroIndex, setHeroIndex] = useState(0);

  const featuredPortfolio = portfolioItems.slice(0, 4);
  const balloonMinUsd = Math.min(
    ...catalog.balloonStyles
      .filter((s) => !s.isNoneOption && s.active)
      .map((s) => s.basePriceUsd)
  );
  const linenPriceUsd =
    catalog.addons.find((a) => a.id === 'linen-banner')?.priceUsd ?? 165;
  const drapingPriceUsd =
    catalog.addons.find((a) => a.id === 'event-draping')?.priceUsd ?? 185;

  return (
    <div>
      {/* Hero Section: 2-Column Asymmetric Split */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div className="space-y-6">
              <div className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
                <span>Sydney, Australia</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Bespoke Event Styling</span>
              </div>

              <h1 className="font-serif text-[clamp(2.5rem,4.4vw,3.9rem)] leading-[1.06] tracking-tight text-[#1C1917] max-w-xl">
                Transforming moments into lasting memories.
              </h1>

              <p className="text-base sm:text-[17px] text-[#6B625C] leading-relaxed max-w-lg">
                Cloudnine Events composes architectural balloon styling, tailored linen signage, and sheer event draping for intimate milestones, engagements, weddings, and modern celebrations across Sydney.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('build')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[44px] text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Build Your Event Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('gallery')}
                  className="inline-flex items-center gap-1.5 py-2.5 min-h-[44px] text-sm font-medium text-[#1C1917] hover:text-[#7C4D59] border-b border-[#DED6CE] hover:border-[#7C4D59] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Portfolio</span>
                </button>
              </div>
            </div>

            <div className="pt-10 mt-10 border-t border-[#DED6CE] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B625C]">
              <span>Instant indicative USD quote estimates · No automatic confirmation</span>
              <a
                href={catalog.settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1C1917] hover:text-[#7C4D59] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#7C4D59]" />
                <span>{catalog.settings.instagramHandle}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column Showcase Image Frame */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <div className="relative flex-1 min-h-[420px] lg:min-h-[540px] rounded-xl overflow-hidden border border-[#DED6CE] bg-[#F2EEEB]">
              <ResilientImage
                src={HERO_FRAMES[heroIndex].src}
                alt={HERO_FRAMES[heroIndex].caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/35 to-transparent p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <p className="text-xs sm:text-sm text-white/95 font-normal max-w-sm">
                  {HERO_FRAMES[heroIndex].caption}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  {HERO_FRAMES.map((frame, idx) => (
                    <button
                      key={frame.src}
                      type="button"
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Preview showcase ${idx + 1}`}
                      className={`w-11 h-11 rounded-md overflow-hidden border transition-all cursor-pointer ${
                        heroIndex === idx
                          ? 'border-white scale-105'
                          : 'border-white/40 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <ResilientImage
                        src={frame.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Editorial Strip Below Hero Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 mt-12 border-t border-[#DED6CE]">
          <div className="space-y-1.5">
            <div className="text-xs text-[#7C4D59] font-medium tabular-nums">01</div>
            <h2 className="font-serif text-xl text-[#1C1917]">Organic Balloon Styling</h2>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Multi-scale garlands, structural arches, and pearl-beaded milestone features.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs text-[#7C4D59] font-medium tabular-nums">02</div>
            <h2 className="font-serif text-xl text-[#1C1917]">Custom Linen Signage</h2>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Draped linen banners with satin ties, painted panels, and bespoke calligraphy.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs text-[#7C4D59] font-medium tabular-nums">03</div>
            <h2 className="font-serif text-xl text-[#1C1917]">Architectural Draping</h2>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Sheer champagne and ivory textiles styled across frames and display plinths.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs text-[#7C4D59] font-medium tabular-nums">04</div>
            <h2 className="font-serif text-xl text-[#1C1917]">Smart Quote Estimates</h2>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Customise sizes, palettes, and extras with live indicative USD pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Services Asymmetric Grid */}
      <section className="border-t border-[#DED6CE] bg-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
                Signature Disciplines
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
                Curated styling crafted for spatial balance
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('collections')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <span>View All Services &amp; Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Marquee Card: Balloon Styling */}
            <div className="lg:col-span-6 rounded-xl border border-[#DED6CE] bg-[#FAF8F6] overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden bg-[#F2EEEB]">
                <ResilientImage
                  src="/assets/aistudio/image_229a6608.png"
                  alt="Monochrome arched balloon installation with hanging lanterns"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-4 text-xs text-[#6B625C]">
                    <span>01 · Balloon Styling &amp; Installations</span>
                    <span className="tabular-nums font-medium text-[#1C1917]">
                      From ${balloonMinUsd} USD (est.)
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                    Organic Garlands &amp; Architectural Backdrops
                  </h3>
                  <p className="text-sm text-[#6B625C] leading-relaxed">
                    From understated matte neutrals to pearl-trimmed milestone stacks and sculpted wave panels, every installation is composed on site to suit your venue’s light and architecture.
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => startCustomisingFromStyle('balloon-installation', ['arch-panel-signage'])}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer"
                  >
                    <span>Customise Balloon Styling</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Stack: Linen Signage + Event Draping */}
            <div className="lg:col-span-6 grid grid-cols-1 gap-6">
              <div className="rounded-xl border border-[#DED6CE] bg-[#FAF8F6] overflow-hidden grid grid-cols-1 sm:grid-cols-12 group">
                <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#F2EEEB]">
                  <ResilientImage
                    src="/assets/aistudio/image_03f00875.png"
                    alt="Blush linen banner signage tied with satin ribbons"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#6B625C]">
                      <span>02 · Linen Signage</span>
                      <span className="tabular-nums font-medium text-[#1C1917]">
                        Est. ${linenPriceUsd} USD
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1C1917]">
                      Tailored Linen Banners &amp; Calligraphy
                    </h3>
                    <p className="text-sm text-[#6B625C] leading-relaxed">
                      Flowing linen fabric banners with hand-tied satin ribbons, paired with bespoke names or milestone typography.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startCustomisingFromStyle('none-styling-only', [
                        'linen-banner',
                        'personalised-text',
                      ])
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer self-start"
                  >
                    <span>Add Linen Signage to Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#DED6CE] bg-[#FAF8F6] overflow-hidden grid grid-cols-1 sm:grid-cols-12 group">
                <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#F2EEEB]">
                  <ResilientImage
                    src="/assets/aistudio/image_af146372.png"
                    alt="Sheer champagne event draping with neutral linen backdrop and plinth"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#6B625C]">
                      <span>03 · Event Draping</span>
                      <span className="tabular-nums font-medium text-[#1C1917]">
                        Est. ${drapingPriceUsd} USD
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1C1917]">
                      Sheer Textile Draping &amp; Plinths
                    </h3>
                    <p className="text-sm text-[#6B625C] leading-relaxed">
                      Soft-falling champagne and ivory sheer layers paired with draped display plinths and delicate botanical accents.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startCustomisingFromStyle('balloon-backdrop', [
                        'event-draping',
                        'plinth-rug-hire',
                      ])
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer self-start"
                  >
                    <span>Style with Event Draping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Styling Portfolio */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
              Selected Works
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
              Recent Sydney installations
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('gallery')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <span>Open Full Gallery (8 Works)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPortfolio.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 rounded-xl"
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#DED6CE] bg-[#F2EEEB] mb-3.5">
                <ResilientImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
              </div>
              <div className="text-xs text-[#6B625C] mb-1">
                <span>{item.category}</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>{item.eventType}</span>
              </div>
              <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#7C4D59] transition-colors leading-snug">
                {item.title}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* Conversion Band */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 pb-8">
        <div className="rounded-xl border border-[#DED6CE] bg-[#F2EEEB] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
              Smart Booking &amp; Custom Quote Studio
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
              Design your celebration and see an instant indicative USD estimate.
            </h2>
            <p className="text-sm sm:text-base text-[#6B625C] max-w-2xl leading-relaxed">
              Choose your event type, balloon styling scale, linen signage, draping, and inspiration photos—then submit directly via WhatsApp or our enquiry form for availability review.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <button
              type="button"
              onClick={() => navigateTo('build')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Start Building Your Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('book')}
              className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-sm font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Direct Booking Enquiry</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
