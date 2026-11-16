import React, { useRef, useState } from 'react';
import {
  Check,
  Copy,
  ImagePlus,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { EVENT_TYPES } from '../data/defaultCatalog';
import { EventCategory, SubmittedEnquiry } from '../types/events';
import { ResilientImage } from './ResilientImage';

export function BuildEventPage() {
  const {
    catalog,
    quoteState,
    setQuoteState,
    resetQuote,
    breakdown,
    addEnquiry,
    setIsOwnerModalOpen,
    buildWhatsAppSummaryText,
  } = useCatalog();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const summarySectionRef = useRef<HTMLDivElement | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<SubmittedEnquiry | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const selectedStyle = catalog.balloonStyles.find(
    (s) => s.id === quoteState.balloonStyleId
  );
  const isNoneBalloon = Boolean(selectedStyle?.isNoneOption);

  const postcodeTrimmed = quoteState.postcode.trim();
  const isPostcodeValid =
    postcodeTrimmed === '' || /^\d{4}$/.test(postcodeTrimmed);

  const hasTextAddon = Object.entries(quoteState.selectedAddons).some(([id, qty]) => {
    if (!qty || qty <= 0) return false;
    const addon = catalog.addons.find((a) => a.id === id);
    return Boolean(addon?.requiresPersonalisedText);
  });

  const handleToggleAddon = (addonId: string, allowsQty: boolean) => {
    setQuoteState((prev) => {
      const currentQty = prev.selectedAddons[addonId] || 0;
      const next = { ...prev.selectedAddons };
      if (currentQty > 0) {
        delete next[addonId];
      } else {
        next[addonId] = 1;
      }
      return { ...prev, selectedAddons: next };
    });
    void allowsQty;
  };

  const handleAddonQty = (addonId: string, delta: number) => {
    setQuoteState((prev) => {
      const current = prev.selectedAddons[addonId] || 0;
      const nextQty = Math.max(0, current + delta);
      const next = { ...prev.selectedAddons };
      if (nextQty === 0) {
        delete next[addonId];
      } else {
        next[addonId] = nextQty;
      }
      return { ...prev, selectedAddons: next };
    });
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');

    const fileArr = Array.from(files).slice(0, 6);
    fileArr.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload image files only (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 6 * 1024 * 1024) {
        setUploadError('Each inspiration image should be under 6 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setQuoteState((prev) => ({
            ...prev,
            inspirationImages: [
              ...prev.inspirationImages.slice(0, 5),
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: file.name,
                sizeBytes: file.size,
                dataUrl: reader.result as string,
              },
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setQuoteState((prev) => ({
      ...prev,
      inspirationImages: prev.inspirationImages.filter((img) => img.id !== id),
    }));
  };

  const handleCopySummary = async () => {
    const text = buildWhatsAppSummaryText(customerName, customerEmail, customerPhone);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      // Clipboard fallback ignored if restricted
    }
  };

  const validateForSubmission = (): string | null => {
    if (!quoteState.eventDate) {
      return 'Please select your preferred event date in Step 6.';
    }
    if (!quoteState.venueSuburb.trim()) {
      return 'Please enter your venue or Sydney suburb in Step 6.';
    }
    if (!/^\d{4}$/.test(quoteState.postcode.trim())) {
      return 'Please enter a valid 4-digit Australian postcode (e.g. 2000).';
    }
    if (!customerName.trim()) {
      return 'Please enter your full name to submit your enquiry.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!customerPhone.trim()) {
      return 'Please enter a contact phone or WhatsApp number.';
    }
    return null;
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const err = validateForSubmission();
    if (err) {
      setFormError(err);
      return;
    }
    const record = addEnquiry(
      'Enquiry Form',
      customerName.trim(),
      customerEmail.trim(),
      customerPhone.trim()
    );
    setSubmittedRecord(record);
  };

  const whatsappUrl = `https://wa.me/${
    catalog.settings.whatsappPlaceholderNumber || '61400000000'
  }?text=${encodeURIComponent(
    buildWhatsAppSummaryText(customerName, customerEmail, customerPhone)
  )}`;

  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-10 lg:py-14 pb-24 lg:pb-16">
      {/* Studio Top Header & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DED6CE] pb-8 mb-10">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
            Smart Booking &amp; Custom Quote Studio
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
            Build Your Event &amp; Get an Estimate
          </h1>
          <p className="text-sm sm:text-base text-[#6B625C] leading-relaxed">
            Customise your styling elements below to view a live indicative USD estimate. Prices shown are editable USD placeholders—not a confirmed quote.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsOwnerModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-xs font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C4D59]" />
            <span>Owner Price Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetQuote();
              setSubmittedRecord(null);
              setFormError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-xs font-medium text-[#6B625C] bg-white border border-[#DED6CE] hover:text-[#1C1917] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Selection</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 7 Interactive Configuration Steps */}
        <div className="lg:col-span-7 space-y-12">
          {/* Step 1: Event Type */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                01. Select Event Type
              </h2>
              <span className="text-xs text-[#6B625C]">Required</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EVENT_TYPES.map((type) => {
                const active = quoteState.eventType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setQuoteState((prev) => ({
                        ...prev,
                        eventType: type as EventCategory,
                      }))
                    }
                    className={`px-4 py-3.5 min-h-[44px] text-sm font-medium rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-[#7C4D59] text-white border-[#7C4D59]'
                        : 'bg-white text-[#1C1917] border-[#DED6CE] hover:border-[#7C4D59]'
                    }`}
                  >
                    <span className="truncate">{type}</span>
                    {active && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {quoteState.eventType === 'Other' && (
              <div className="pt-1">
                <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  Describe Your Event Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bridal Shower, Eid Celebration, Product Launch"
                  value={quoteState.customEventLabel}
                  onChange={(e) =>
                    setQuoteState((prev) => ({
                      ...prev,
                      customEventLabel: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                />
              </div>
            )}
          </section>

          {/* Step 2: Balloon Styling */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                02. Choose Balloon Styling
              </h2>
              <span className="text-xs text-[#6B625C]">Indicative USD base</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catalog.balloonStyles
                .filter((s) => s.active)
                .map((style) => {
                  const active = quoteState.balloonStyleId === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() =>
                        setQuoteState((prev) => ({
                          ...prev,
                          balloonStyleId: style.id,
                        }))
                      }
                      className={`text-left rounded-xl border overflow-hidden transition-all cursor-pointer flex flex-col ${
                        active
                          ? 'border-[#7C4D59] ring-1 ring-[#7C4D59] bg-white'
                          : 'border-[#DED6CE] bg-white hover:border-[#9E8268]'
                      }`}
                    >
                      <div className="aspect-[16/10] w-full bg-[#F2EEEB] overflow-hidden">
                        <ResilientImage
                          src={style.image}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-xl text-[#1C1917] leading-snug">
                              {style.name}
                            </h3>
                            <span className="text-xs font-semibold tabular-nums text-[#7C4D59] shrink-0 pt-1">
                              {style.isNoneOption
                                ? '$0 USD'
                                : `Est. $${style.basePriceUsd} USD`}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B625C] mt-1 leading-relaxed">
                            {style.description}
                          </p>
                        </div>
                        <div className="text-xs font-medium text-[#1C1917] pt-1 flex items-center gap-1.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              active
                                ? 'border-[#7C4D59] bg-[#7C4D59] text-white'
                                : 'border-[#DED6CE]'
                            }`}
                          >
                            {active && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span>{active ? 'Selected' : 'Select Styling'}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </section>

          {/* Step 3: Size & Palette Direction */}
          <section className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                03. Size &amp; Styling Palette
              </h2>
              <span className="text-xs text-[#6B625C]">Scale &amp; colour story</span>
            </div>

            {!isNoneBalloon ? (
              <div className="space-y-3">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Installation Scale
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catalog.sizes
                    .filter((sz) => sz.active)
                    .map((sz) => {
                      const active = quoteState.sizeId === sz.id;
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() =>
                            setQuoteState((prev) => ({ ...prev, sizeId: sz.id }))
                          }
                          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                            active
                              ? 'border-[#7C4D59] bg-[#F2EEEB]/80 ring-1 ring-[#7C4D59]'
                              : 'border-[#DED6CE] bg-white hover:border-[#9E8268]'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-semibold text-[#1C1917]">
                              {sz.name}
                            </span>
                            <span className="text-xs font-medium tabular-nums text-[#7C4D59]">
                              {sz.priceDeltaUsd === 0
                                ? 'Included'
                                : `+$${sz.priceDeltaUsd} USD (est.)`}
                            </span>
                          </div>
                          <div className="text-xs text-[#6B625C] mt-0.5">
                            {sz.dimensions}
                          </div>
                          <p className="text-xs text-[#6B625C] mt-1.5 leading-relaxed">
                            {sz.description}
                          </p>
                        </button>
                      );
                    })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6B625C] p-4 bg-[#F2EEEB] rounded-lg border border-[#DED6CE]">
                You selected Signage &amp; Draping Only—balloon scale adjustment is omitted from your quote.
              </p>
            )}

            <div className="space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Colour Palette Direction
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalog.palettes.map((palette) => {
                  const active = quoteState.paletteId === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() =>
                        setQuoteState((prev) => ({
                          ...prev,
                          paletteId: palette.id,
                        }))
                      }
                      className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        active
                          ? 'border-[#7C4D59] bg-[#F2EEEB]/80 ring-1 ring-[#7C4D59]'
                          : 'border-[#DED6CE] bg-white hover:border-[#9E8268]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#1C1917] truncate">
                          {palette.name}
                        </div>
                        <div className="text-xs text-[#6B625C] truncate">
                          {palette.description}
                        </div>
                      </div>
                      <div className="flex items-center -space-x-1 shrink-0">
                        {palette.swatches.map((hex) => (
                          <span
                            key={hex}
                            style={{ backgroundColor: hex }}
                            className="w-5 h-5 rounded-full border border-white shadow-xs"
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-1">
                <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  Custom Colour or Finish Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Double-stuffed eucalyptus, pearl champagne, satin ribbon accents"
                  value={quoteState.customPaletteNotes}
                  onChange={(e) =>
                    setQuoteState((prev) => ({
                      ...prev,
                      customPaletteNotes: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                />
              </div>
            </div>
          </section>

          {/* Step 4: Add Extras (Linen Signage, Personalised Text, Draping, Florals & Products) */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                04. Add Signage, Draping &amp; Extras
              </h2>
              <span className="text-xs text-[#6B625C]">Multi-select USD estimates</span>
            </div>

            <div className="space-y-3">
              {catalog.addons
                .filter((a) => a.active)
                .map((addon) => {
                  const qty = quoteState.selectedAddons[addon.id] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div
                      key={addon.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        isSelected
                          ? 'border-[#7C4D59] bg-white ring-1 ring-[#7C4D59]'
                          : 'border-[#DED6CE] bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F2EEEB] shrink-0 border border-[#DED6CE]">
                            <ResilientImage
                              src={addon.image}
                              alt={addon.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-[#6B625C]">
                              <span>{addon.category}</span>
                              <span aria-hidden="true" className="mx-1.5">·</span>
                              <span>{addon.unitLabel}</span>
                            </div>
                            <h3 className="font-serif text-xl text-[#1C1917]">
                              {addon.name}
                            </h3>
                            <p className="text-xs text-[#6B625C] leading-relaxed max-w-md">
                              {addon.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pl-0 sm:pl-4">
                          <div className="text-sm font-semibold tabular-nums text-[#1C1917]">
                            Est. ${addon.priceUsd} USD
                          </div>

                          {addon.allowsQuantity && isSelected ? (
                            <div className="inline-flex items-center border border-[#DED6CE] rounded-md bg-[#FAF8F6]">
                              <button
                                type="button"
                                onClick={() => handleAddonQty(addon.id, -1)}
                                aria-label={`Decrease quantity for ${addon.name}`}
                                className="w-9 h-9 flex items-center justify-center text-[#1C1917] hover:bg-[#F2EEEB] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#1C1917]">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddonQty(addon.id, 1)}
                                aria-label={`Increase quantity for ${addon.name}`}
                                className="w-9 h-9 flex items-center justify-center text-[#1C1917] hover:bg-[#F2EEEB] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleAddon(addon.id, addon.allowsQuantity)
                              }
                              className={`px-4 py-2 min-h-[38px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                                isSelected
                                  ? 'bg-[#7C4D59] text-white hover:bg-[#643B46]'
                                  : 'bg-[#F2EEEB] text-[#1C1917] hover:bg-[#E8E1DB]'
                              }`}
                            >
                              {isSelected ? 'Added' : 'Add Option'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Personalised Signage / Decal Text Field */}
            <div className="p-5 rounded-xl border border-[#DED6CE] bg-[#F2EEEB]/70 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <label
                  htmlFor="personalised-text-input"
                  className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]"
                >
                  Personalised Signage / Decal Wording {hasTextAddon ? '(Recommended)' : '(Optional)'}
                </label>
                <span className="text-xs text-[#6B625C]">Live serif preview</span>
              </div>
              <input
                id="personalised-text-input"
                type="text"
                placeholder="e.g. Welcome Baby Hedi, Zara’s Four-Ever, Umrah Mubarak"
                value={quoteState.personalisedText}
                onChange={(e) =>
                  setQuoteState((prev) => ({
                    ...prev,
                    personalisedText: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
              />
              {quoteState.personalisedText.trim() && (
                <div className="p-4 bg-white border border-[#DED6CE] rounded-lg text-center">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B625C] mb-1">
                    Signage Lettering Preview
                  </div>
                  <div className="font-serif italic text-2xl sm:text-3xl text-[#1C1917]">
                    {quoteState.personalisedText}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Step 5: Upload Inspiration Images */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                05. Upload Inspiration Images
              </h2>
              <span className="text-xs text-[#6B625C]">Up to 6 images</span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFilesSelected(e.dataTransfer.files);
              }}
              className="p-6 rounded-xl border border-dashed border-[#9E8268] bg-white text-center space-y-3"
            >
              <div className="w-11 h-11 rounded-full bg-[#F2EEEB] mx-auto flex items-center justify-center text-[#7C4D59]">
                <ImagePlus className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1C1917]">
                  Drop moodboard or venue photos here, or browse files
                </p>
                <p className="text-xs text-[#6B625C]">
                  JPG, PNG, or WEBP up to 6 MB each. Attached thumbnails appear in your order summary.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 min-h-[40px] text-xs font-medium text-[#1C1917] bg-[#F2EEEB] hover:bg-[#E8E1DB] rounded-md transition-colors cursor-pointer"
              >
                Choose Images
              </button>
              {uploadError && (
                <p className="text-xs text-[#9B2C2C] font-medium" role="alert">
                  {uploadError}
                </p>
              )}
            </div>

            {quoteState.inspirationImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quoteState.inspirationImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative rounded-lg overflow-hidden border border-[#DED6CE] bg-white group"
                  >
                    <div className="aspect-square bg-[#F2EEEB]">
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs text-[#6B625C]">
                      <span className="truncate">{img.name}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        aria-label={`Remove ${img.name}`}
                        className="text-[#6B625C] hover:text-[#9B2C2C] cursor-pointer shrink-0 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Step 6: Event Date, Venue/Suburb & Australian Postcode */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                06. Event Date, Venue &amp; Postcode
              </h2>
              <span className="text-xs text-[#6B625C]">Sydney &amp; surrounds</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="event-date"
                  className="block text-xs font-medium text-[#1C1917] mb-1.5"
                >
                  Preferred Event Date *
                </label>
                <input
                  id="event-date"
                  type="date"
                  min={todayIso}
                  value={quoteState.eventDate}
                  onChange={(e) =>
                    setQuoteState((prev) => ({
                      ...prev,
                      eventDate: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                />
              </div>

              <div>
                <label
                  htmlFor="venue-suburb"
                  className="block text-xs font-medium text-[#1C1917] mb-1.5"
                >
                  Venue Name or Suburb *
                </label>
                <input
                  id="venue-suburb"
                  type="text"
                  placeholder="e.g. Double Bay / Private Residence"
                  value={quoteState.venueSuburb}
                  onChange={(e) =>
                    setQuoteState((prev) => ({
                      ...prev,
                      venueSuburb: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                />
              </div>

              <div>
                <label
                  htmlFor="au-postcode"
                  className="block text-xs font-medium text-[#1C1917] mb-1.5"
                >
                  Australian Postcode *
                </label>
                <input
                  id="au-postcode"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="e.g. 2000"
                  value={quoteState.postcode}
                  onChange={(e) =>
                    setQuoteState((prev) => ({
                      ...prev,
                      postcode: e.target.value.replace(/[^\d]/g, '').slice(0, 4),
                    }))
                  }
                  className={`w-full px-3.5 py-2.5 text-sm tabular-nums bg-white border rounded-md text-[#1C1917] ${
                    isPostcodeValid ? 'border-[#DED6CE]' : 'border-[#9B2C2C]'
                  }`}
                />
                {!isPostcodeValid && (
                  <p className="text-[11px] text-[#9B2C2C] mt-1">
                    Enter a 4-digit Australian postcode.
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-[#6B625C] leading-relaxed p-3.5 bg-[#F2EEEB]/80 border border-[#DED6CE] rounded-lg">
              {catalog.settings.deliveryFeeNote}
            </p>
          </section>

          {/* Step 7: Special Requirements */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                07. Special Requirements
              </h2>
              <span className="text-xs text-[#6B625C]">Bump-in, outdoor wind, theme</span>
            </div>

            <textarea
              rows={4}
              placeholder="Share indoor/outdoor placement, stairs or lift access, bump-in times, theme notes, or anything else we should know..."
              value={quoteState.specialRequirements}
              onChange={(e) =>
                setQuoteState((prev) => ({
                  ...prev,
                  specialRequirements: e.target.value,
                }))
              }
              className="w-full px-3.5 py-3 text-sm bg-white border border-[#DED6CE] rounded-lg text-[#1C1917]"
            />
          </section>
        </div>

        {/* Right Column: Sticky Live Quote & Order Summary + Submission */}
        <aside
          ref={summarySectionRef}
          className="lg:col-span-5 lg:sticky lg:top-24 space-y-6"
        >
          <div className="rounded-xl border border-[#DED6CE] bg-white p-6 sm:p-7 space-y-6">
            <div className="border-b border-[#DED6CE] pb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#6B625C]">
                  Order Summary
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] mt-0.5">
                  Indicative Estimate
                </h2>
              </div>
              <div className="text-right">
                <div className="font-serif text-3xl text-[#1C1917] tabular-nums">
                  ${breakdown.subtotalUsd.toLocaleString()}
                </div>
                <div className="text-[11px] font-medium text-[#7C4D59]">
                  USD · Estimate Only
                </div>
              </div>
            </div>

            {/* Event Snapshot Metadata */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs border-b border-[#DED6CE] pb-4">
              <div>
                <span className="text-[#6B625C]">Event: </span>
                <span className="font-medium text-[#1C1917]">
                  {quoteState.eventType === 'Other' && quoteState.customEventLabel
                    ? quoteState.customEventLabel
                    : quoteState.eventType}
                </span>
              </div>
              <div>
                <span className="text-[#6B625C]">Date: </span>
                <span className="font-medium text-[#1C1917] tabular-nums">
                  {quoteState.eventDate || 'Not set'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#6B625C]">Location: </span>
                <span className="font-medium text-[#1C1917]">
                  {quoteState.venueSuburb || 'Suburb pending'}
                  {quoteState.postcode ? ` (${quoteState.postcode})` : ''}
                </span>
              </div>
              {quoteState.personalisedText.trim() && (
                <div className="col-span-2">
                  <span className="text-[#6B625C]">Signage Text: </span>
                  <span className="font-serif italic text-sm text-[#1C1917]">
                    “{quoteState.personalisedText}”
                  </span>
                </div>
              )}
              {quoteState.inspirationImages.length > 0 && (
                <div className="col-span-2">
                  <span className="text-[#6B625C]">Inspiration Photos: </span>
                  <span className="font-medium text-[#1C1917] tabular-nums">
                    {quoteState.inspirationImages.length} attached
                  </span>
                </div>
              )}
            </div>

            {/* Itemised Estimate Breakdown */}
            <div className="space-y-2.5">
              {breakdown.lineItems.length === 0 ? (
                <p className="text-sm text-[#6B625C] py-2">
                  Select a balloon styling option or add-on to generate an indicative USD estimate.
                </p>
              ) : (
                breakdown.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="text-[#1C1917] font-medium">{item.label}</div>
                      {item.detail && (
                        <div className="text-xs text-[#6B625C]">{item.detail}</div>
                      )}
                    </div>
                    <div className="tabular-nums text-[#1C1917] font-medium shrink-0">
                      ${item.amountUsd} USD
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#DED6CE] space-y-1.5">
              <div className="flex items-baseline justify-between text-sm font-semibold text-[#1C1917]">
                <span>Indicative Styling Subtotal</span>
                <span className="tabular-nums text-base">
                  ${breakdown.subtotalUsd.toLocaleString()} USD
                </span>
              </div>
              <p className="text-[11px] text-[#6B625C] leading-relaxed">
                All figures above are <strong>indicative USD placeholder estimates</strong> and not a confirmed quote. Delivery, bump-in, and custom sourcing are confirmed separately.
              </p>
            </div>

            {/* Submission Form */}
            {submittedRecord ? (
              <div className="p-5 rounded-lg bg-[#F2EEEB] border border-[#7C4D59]/40 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#7C4D59]">
                  Enquiry Request Recorded · Ref {submittedRecord.referenceCode}
                </div>
                <h3 className="font-serif text-2xl text-[#1C1917]">
                  Thank you, {submittedRecord.customerName}.
                </h3>
                <p className="text-xs text-[#6B625C] leading-relaxed">
                  Your custom quote enquiry has been saved for {submittedRecord.quoteSnapshot.eventDate} ({submittedRecord.quoteSnapshot.venueSuburb} {submittedRecord.quoteSnapshot.postcode}). Your date is not yet confirmed—Cloudnine Events will review availability and reply with a formal quote.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#332E2B] rounded-md transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Also Send via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedRecord(null)}
                    className="px-3 py-2 text-xs font-medium text-[#1C1917] bg-white border border-[#DED6CE] rounded-md cursor-pointer"
                  >
                    Edit Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 pt-2 border-t border-[#DED6CE]">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Your Contact Details to Submit Enquiry
                </h3>

                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-[#9B2C2C] font-medium" role="alert">
                    {formError}
                  </p>
                )}

                <div className="space-y-2.5 pt-1">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 min-h-[44px] inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Booking Enquiry Form</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (customerName.trim() && customerEmail.trim()) {
                          addEnquiry(
                            'WhatsApp',
                            customerName.trim(),
                            customerEmail.trim(),
                            customerPhone.trim()
                          );
                        }
                      }}
                      className="py-2.5 px-3 min-h-[42px] inline-flex items-center justify-center gap-2 text-xs font-medium text-[#1C1917] bg-[#F2EEEB] hover:bg-[#E8E1DB] border border-[#DED6CE] rounded-md transition-colors text-center"
                    >
                      <MessageCircle className="w-4 h-4 text-[#7C4D59]" />
                      <span>Submit via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="py-2.5 px-3 min-h-[42px] inline-flex items-center justify-center gap-2 text-xs font-medium text-[#1C1917] bg-white hover:bg-[#F2EEEB] border border-[#DED6CE] rounded-md transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#6B625C]" />
                      <span>{copiedSummary ? 'Copied Summary' : 'Copy Quote Summary'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Booking Request & Deposit Information Section */}
          <div className="rounded-xl border border-[#DED6CE] bg-[#F2EEEB]/80 p-5 sm:p-6 space-y-3">
            <h3 className="font-serif text-xl text-[#1C1917]">
              Booking Request &amp; Deposit Information
            </h3>
            <p className="text-xs text-[#6B625C] leading-relaxed">
              {catalog.settings.bookingRequestNote}
            </p>
            <p className="text-xs text-[#6B625C] leading-relaxed pt-2 border-t border-[#DED6CE]">
              {catalog.settings.depositInformationNote}
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile Compact Sticky Summary Bar (strictly <= 15% viewport height) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#DED6CE] px-4 py-2.5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-[#6B625C]">Indicative Estimate</div>
          <div className="font-serif text-xl text-[#1C1917] tabular-nums leading-tight">
            ${breakdown.subtotalUsd.toLocaleString()} USD
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            summarySectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
          className="px-4 py-2.5 min-h-[40px] text-xs font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer whitespace-nowrap"
        >
          Review &amp; Submit
        </button>
      </div>
    </div>
  );
}
