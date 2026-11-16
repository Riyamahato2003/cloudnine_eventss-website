import React from 'react';
import { ArrowRight, Instagram } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { ResilientImage } from './ResilientImage';

export function AboutPage() {
  const { catalog, navigateTo } = useCatalog();

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-16">
      {/* Intro Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
              About Cloudnine Events
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917] leading-[1.08]">
              Transforming moments into lasting memories.
            </h1>
            <p className="text-base text-[#6B625C] leading-relaxed">
              Based in Sydney, Cloudnine Events is a bespoke event styling studio dedicated to sculptural balloon compositions, custom linen signage, and architectural draping. Every backdrop is designed with deliberate proportion, soft tactile finishes, and personalised details that anchor your celebration without visual clutter.
            </p>
            <p className="text-base text-[#6B625C] leading-relaxed">
              Whether styling an intimate baby shower, a milestone birthday, an engagement toast, or a formal reception, we balance colour harmony, typography, and natural textures so your space feels effortlessly composed.
            </p>
          </div>

          <div className="pt-6 border-t border-[#DED6CE] flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('build')}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer"
            >
              <span>Build Your Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={catalog.settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] text-sm font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#7C4D59]" />
              <span>Follow {catalog.settings.instagramHandle}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[400px] rounded-xl overflow-hidden border border-[#DED6CE] bg-[#F2EEEB]">
            <ResilientImage
              src="/assets/aistudio/image_af146372.png"
              alt="Cloudnine Events signature linen signage, sheer draping, and organic balloon styling"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4-Stage Studio Process */}
      <section className="border-t border-[#DED6CE] pt-14 space-y-8">
        <div className="max-w-xl space-y-2">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
            How It Works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917]">
            From custom quote to venue installation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-[#DED6CE] bg-white space-y-2">
            <div className="text-xs font-medium text-[#7C4D59] tabular-nums">01</div>
            <h3 className="font-serif text-2xl text-[#1C1917]">Enquire &amp; Customise</h3>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Use our interactive builder to select your styling, size, signage wording, inspiration photos, and Sydney postcode for an indicative USD estimate.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#DED6CE] bg-white space-y-2">
            <div className="text-xs font-medium text-[#7C4D59] tabular-nums">02</div>
            <h3 className="font-serif text-2xl text-[#1C1917]">Availability Review</h3>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              We personally check your event date, venue bump-in logistics, and material sourcing before issuing a confirmed formal quote.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#DED6CE] bg-white space-y-2">
            <div className="text-xs font-medium text-[#7C4D59] tabular-nums">03</div>
            <h3 className="font-serif text-2xl text-[#1C1917]">Design Confirmation</h3>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Once your formal quote and booking terms are accepted, your colour palette, personalised signage proof, and schedule are locked in.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#DED6CE] bg-white space-y-2">
            <div className="text-xs font-medium text-[#7C4D59] tabular-nums">04</div>
            <h3 className="font-serif text-2xl text-[#1C1917]">On-Site Styling</h3>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              Our team delivers, constructs, and hand-finishes every balloon cluster, linen drape, and plinth ready for your guests’ arrival.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Studio Placeholders Notice */}
      <section className="rounded-xl border border-[#DED6CE] bg-[#F2EEEB]/80 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-[#1C1917]">
            Sydney Service Area &amp; Logistics
          </h3>
          <p className="text-sm text-[#6B625C] leading-relaxed">
            {catalog.settings.serviceAreaNote}
          </p>
          <p className="text-xs text-[#6B625C] leading-relaxed pt-1">
            {catalog.settings.deliveryFeeNote}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-[#1C1917]">
            Booking &amp; Deposit Policy Notice
          </h3>
          <p className="text-sm text-[#6B625C] leading-relaxed">
            {catalog.settings.bookingRequestNote}
          </p>
          <p className="text-xs text-[#6B625C] leading-relaxed pt-1">
            {catalog.settings.depositInformationNote}
          </p>
        </div>
      </section>
    </div>
  );
}
