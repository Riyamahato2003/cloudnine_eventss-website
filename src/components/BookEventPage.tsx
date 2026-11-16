import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { EVENT_TYPES } from '../data/defaultCatalog';
import { EventCategory, SubmittedEnquiry } from '../types/events';

export function BookEventPage() {
  const {
    catalog,
    quoteState,
    setQuoteState,
    breakdown,
    addEnquiry,
    enquiries,
    navigateTo,
    buildWhatsAppSummaryText,
  } = useCatalog();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [includeCurrentQuote, setIncludeCurrentQuote] = useState(true);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<SubmittedEnquiry | null>(null);

  const todayIso = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a contact phone or WhatsApp number.');
      return;
    }
    if (!quoteState.eventDate) {
      setError('Please choose your preferred event date.');
      return;
    }
    if (!quoteState.venueSuburb.trim()) {
      setError('Please enter your venue name or Sydney suburb.');
      return;
    }
    if (!/^\d{4}$/.test(quoteState.postcode.trim())) {
      setError('Please enter a valid 4-digit Australian postcode.');
      return;
    }

    const record = addEnquiry(
      'Enquiry Form',
      name.trim(),
      email.trim(),
      phone.trim()
    );
    setConfirmation(record);
  };

  const whatsappUrl = `https://wa.me/${
    catalog.settings.whatsappPlaceholderNumber || '61400000000'
  }?text=${encodeURIComponent(buildWhatsAppSummaryText(name, email, phone))}`;

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DED6CE] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6B625C]">
            Book Your Event
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
            Submit a booking request
          </h1>
          <p className="text-sm sm:text-base text-[#6B625C] leading-relaxed">
            Share your celebration date, Sydney suburb, and styling preferences below. Submitting an enquiry does not automatically confirm availability or reserve a date.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('build')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4D59] hover:text-[#643B46] transition-colors cursor-pointer whitespace-nowrap self-start lg:self-auto"
        >
          <span>Open Full Custom Quote Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Enquiry Form */}
        <div className="lg:col-span-7">
          {confirmation ? (
            <div className="rounded-xl border border-[#7C4D59]/40 bg-white p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C4D59]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Booking Request Received · Ref {confirmation.referenceCode}</span>
              </div>
              <h2 className="font-serif text-3xl text-[#1C1917]">
                Thank you, {confirmation.customerName}.
              </h2>
              <p className="text-sm text-[#6B625C] leading-relaxed">
                We have recorded your booking request for{' '}
                <strong>{confirmation.quoteSnapshot.eventType}</strong> on{' '}
                <strong className="tabular-nums">
                  {confirmation.quoteSnapshot.eventDate}
                </strong>{' '}
                in{' '}
                <strong>
                  {confirmation.quoteSnapshot.venueSuburb} (
                  {confirmation.quoteSnapshot.postcode})
                </strong>
                . Cloudnine Events will review availability and respond with a confirmed quote and booking details.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] text-xs font-medium text-white bg-[#1C1917] hover:bg-[#332E2B] rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Copy via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setConfirmation(null)}
                  className="px-4 py-2.5 min-h-[42px] text-xs font-medium text-[#1C1917] bg-[#F2EEEB] hover:bg-[#E8E1DB] rounded-md transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-[#DED6CE] bg-white p-6 sm:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    Phone or WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+61 4XX XXX XXX"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    Event Type *
                  </label>
                  <select
                    value={quoteState.eventType}
                    onChange={(e) =>
                      setQuoteState((prev) => ({
                        ...prev,
                        eventType: e.target.value as EventCategory,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={quoteState.eventDate}
                    onChange={(e) =>
                      setQuoteState((prev) => ({
                        ...prev,
                        eventDate: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    Venue / Suburb *
                  </label>
                  <input
                    type="text"
                    value={quoteState.venueSuburb}
                    onChange={(e) =>
                      setQuoteState((prev) => ({
                        ...prev,
                        venueSuburb: e.target.value,
                      }))
                    }
                    placeholder="e.g. Mosman"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                    AU Postcode *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={quoteState.postcode}
                    onChange={(e) =>
                      setQuoteState((prev) => ({
                        ...prev,
                        postcode: e.target.value.replace(/[^\d]/g, '').slice(0, 4),
                      }))
                    }
                    placeholder="e.g. 2088"
                    className="w-full px-3.5 py-2.5 text-sm tabular-nums bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                  Styling Vision &amp; Special Requirements
                </label>
                <textarea
                  rows={4}
                  value={quoteState.specialRequirements}
                  onChange={(e) =>
                    setQuoteState((prev) => ({
                      ...prev,
                      specialRequirements: e.target.value,
                    }))
                  }
                  placeholder="Tell us about your colours, linen signage text, draping needs, or venue bump-in access..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#6B625C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCurrentQuote}
                  onChange={(e) => setIncludeCurrentQuote(e.target.checked)}
                  className="accent-[#7C4D59] mt-0.5 w-4 h-4"
                />
                <span>
                  Attach my current Quote Builder selection (Indicative estimate:{' '}
                  <strong className="tabular-nums text-[#1C1917]">
                    ${breakdown.subtotalUsd.toLocaleString()} USD
                  </strong>
                  )
                </span>
              </label>

              {error && (
                <p className="text-xs text-[#9B2C2C] font-medium" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 min-h-[44px] inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Enquiry Form</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 min-h-[44px] inline-flex items-center justify-center gap-2 text-sm font-medium text-[#1C1917] bg-[#F2EEEB] hover:bg-[#E8E1DB] border border-[#DED6CE] rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#7C4D59]" />
                  <span>Enquire via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>

        {/* Right: Booking Request & Deposit Info + Recent Session Enquiries */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-[#DED6CE] bg-[#F2EEEB]/80 p-6 space-y-4">
            <h2 className="font-serif text-2xl text-[#1C1917]">
              Booking Request &amp; Deposit Information
            </h2>
            <p className="text-sm text-[#6B625C] leading-relaxed">
              {catalog.settings.bookingRequestNote}
            </p>
            <div className="pt-3 border-t border-[#DED6CE] space-y-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Deposit &amp; Policy Notice
              </h3>
              <p className="text-xs text-[#6B625C] leading-relaxed">
                {catalog.settings.depositInformationNote}
              </p>
            </div>
            <div className="pt-3 border-t border-[#DED6CE] space-y-1 text-xs text-[#6B625C]">
              <div>
                <span className="font-medium text-[#1C1917]">Enquiry Email Placeholder: </span>
                <span>{catalog.settings.emailPlaceholder}</span>
              </div>
              <div>
                <span className="font-medium text-[#1C1917]">Instagram: </span>
                <a
                  href={catalog.settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C4D59] hover:underline"
                >
                  {catalog.settings.instagramHandle}
                </a>
              </div>
            </div>
          </div>

          {includeCurrentQuote && breakdown.lineItems.length > 0 && (
            <div className="rounded-xl border border-[#DED6CE] bg-white p-6 space-y-3">
              <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2.5">
                <h3 className="font-serif text-xl text-[#1C1917]">
                  Attached Quote Snapshot
                </h3>
                <span className="text-sm font-semibold tabular-nums text-[#7C4D59]">
                  Est. ${breakdown.subtotalUsd.toLocaleString()} USD
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#6B625C]">
                {breakdown.lineItems.map((li) => (
                  <li key={li.id} className="flex justify-between gap-2">
                    <span>{li.label}</span>
                    <span className="tabular-nums text-[#1C1917]">
                      ${li.amountUsd} USD
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {enquiries.length > 0 && (
            <div className="rounded-xl border border-[#DED6CE] bg-white p-6 space-y-3">
              <h3 className="font-serif text-xl text-[#1C1917]">
                Recent Submitted Enquiries
              </h3>
              <div className="space-y-2.5">
                {enquiries.slice(0, 3).map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3 rounded-lg bg-[#FAF8F6] border border-[#DED6CE] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-medium text-[#1C1917]">
                      <span>
                        {enq.referenceCode} · {enq.customerName}
                      </span>
                      <span className="tabular-nums text-[#7C4D59]">
                        Est. ${enq.breakdownSnapshot.subtotalUsd} USD
                      </span>
                    </div>
                    <div className="text-[#6B625C]">
                      {enq.quoteSnapshot.eventType} · {enq.quoteSnapshot.eventDate} ·{' '}
                      {enq.quoteSnapshot.venueSuburb} ({enq.quoteSnapshot.postcode})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
