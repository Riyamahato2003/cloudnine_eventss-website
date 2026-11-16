import React, { useState } from 'react';
import { Download, Plus, RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCatalog } from '../context/CatalogContext';
import { AddonProduct } from '../types/events';

export function OwnerManagerModal() {
  const {
    isOwnerModalOpen,
    setIsOwnerModalOpen,
    catalog,
    updateBalloonPrice,
    updateBalloonActive,
    updateSizePrice,
    updateAddonPrice,
    updateAddonActive,
    addCustomAddon,
    updateOwnerSettings,
    resetCatalogToDefaults,
  } = useCatalog();

  const [activeTab, setActiveTab] = useState<'pricing' | 'placeholders'>('pricing');
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonCategory, setNewAddonCategory] = useState<AddonProduct['category']>('Props');
  const [newAddonPrice, setNewAddonPrice] = useState('75');
  const [newAddonDesc, setNewAddonDesc] = useState('');

  const handleAddAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddonName.trim()) return;
    addCustomAddon({
      name: newAddonName.trim(),
      category: newAddonCategory,
      description:
        newAddonDesc.trim() ||
        'Custom event styling addition configured in Owner Studio.',
      priceUsd: Math.max(0, Number(newAddonPrice) || 0),
      unitLabel: 'per item',
      allowsQuantity: true,
      image: '/assets/aistudio/image_af146372.png',
      active: true,
    });
    setNewAddonName('');
    setNewAddonPrice('75');
    setNewAddonDesc('');
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloudnine-events-catalog-usd.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOwnerModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-xs flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Owner Price and Catalog Manager"
          onClick={() => setIsOwnerModalOpen(false)}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#FAF8F6] h-full border-l border-[#DED6CE] flex flex-col overflow-hidden"
          >
            <div className="px-6 py-5 bg-white border-b border-[#DED6CE] flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#1C1917]">
                  Owner Price &amp; Studio Manager
                </h2>
                <p className="text-xs text-[#6B625C] mt-0.5">
                  Update indicative USD placeholder prices, toggle options, or edit studio placeholders. Saved locally in your browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOwnerModalOpen(false)}
                aria-label="Close owner manager"
                className="w-10 h-10 rounded-md border border-[#DED6CE] flex items-center justify-center text-[#1C1917] hover:bg-[#F2EEEB] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-3 bg-[#F2EEEB]/70 border-b border-[#DED6CE] flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex p-1 bg-white rounded-md border border-[#DED6CE]">
                <button
                  type="button"
                  onClick={() => setActiveTab('pricing')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'pricing'
                      ? 'bg-[#7C4D59] text-white'
                      : 'text-[#6B625C] hover:text-[#1C1917]'
                  }`}
                >
                  USD Product &amp; Size Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('placeholders')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'placeholders'
                      ? 'bg-[#7C4D59] text-white'
                      : 'text-[#6B625C] hover:text-[#1C1917]'
                  }`}
                >
                  Business &amp; Policy Placeholders
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportConfig}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-white border border-[#DED6CE] hover:border-[#7C4D59] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  type="button"
                  onClick={resetCatalogToDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B625C] bg-white border border-[#DED6CE] hover:text-[#1C1917] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {activeTab === 'pricing' ? (
                <>
                  {/* Balloon Styles */}
                  <section className="space-y-3">
                    <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2">
                      <h3 className="font-serif text-xl text-[#1C1917]">
                        Balloon Styling Base Prices (USD Placeholder)
                      </h3>
                      <span className="text-xs text-[#6B625C]">Indicative USD</span>
                    </div>
                    <div className="space-y-2.5">
                      {catalog.balloonStyles.map((style) => (
                        <div
                          key={style.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-[#DED6CE] rounded-lg"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={style.active}
                                onChange={(e) =>
                                  updateBalloonActive(style.id, e.target.checked)
                                }
                                aria-label={`Enable ${style.name}`}
                                className="accent-[#7C4D59] w-4 h-4 cursor-pointer"
                              />
                              <span className="text-sm font-medium text-[#1C1917] truncate">
                                {style.name}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B625C] pl-6 mt-0.5">
                              {style.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                            <span className="text-xs text-[#6B625C]">$</span>
                            <input
                              type="number"
                              min={0}
                              step={5}
                              disabled={style.isNoneOption}
                              value={style.basePriceUsd}
                              onChange={(e) =>
                                updateBalloonPrice(style.id, Number(e.target.value))
                              }
                              aria-label={`${style.name} USD price`}
                              className="w-24 px-2.5 py-1.5 text-sm tabular-nums bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917] disabled:opacity-50"
                            />
                            <span className="text-xs text-[#6B625C]">USD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Size Multipliers / Surcharges */}
                  <section className="space-y-3">
                    <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2">
                      <h3 className="font-serif text-xl text-[#1C1917]">
                        Installation Scale Adjustments (USD Placeholder)
                      </h3>
                      <span className="text-xs text-[#6B625C]">Added to base</span>
                    </div>
                    <div className="space-y-2.5">
                      {catalog.sizes.map((size) => (
                        <div
                          key={size.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-[#DED6CE] rounded-lg"
                        >
                          <div>
                            <div className="text-sm font-medium text-[#1C1917]">
                              {size.name}{' '}
                              <span className="text-xs font-normal text-[#6B625C]">
                                · {size.dimensions}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-[#6B625C]">+$</span>
                            <input
                              type="number"
                              min={0}
                              step={5}
                              value={size.priceDeltaUsd}
                              onChange={(e) =>
                                updateSizePrice(size.id, Number(e.target.value))
                              }
                              aria-label={`${size.name} USD adjustment`}
                              className="w-24 px-2.5 py-1.5 text-sm tabular-nums bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                            />
                            <span className="text-xs text-[#6B625C]">USD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Add-on Extras */}
                  <section className="space-y-3">
                    <div className="flex items-baseline justify-between border-b border-[#DED6CE] pb-2">
                      <h3 className="font-serif text-xl text-[#1C1917]">
                        Signage, Draping &amp; Add-Ons (USD Placeholder)
                      </h3>
                      <span className="text-xs text-[#6B625C]">Indicative USD</span>
                    </div>
                    <div className="space-y-2.5">
                      {catalog.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-[#DED6CE] rounded-lg"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={addon.active}
                                onChange={(e) =>
                                  updateAddonActive(addon.id, e.target.checked)
                                }
                                aria-label={`Enable ${addon.name}`}
                                className="accent-[#7C4D59] w-4 h-4 cursor-pointer"
                              />
                              <span className="text-sm font-medium text-[#1C1917] truncate">
                                {addon.name}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B625C] pl-6 mt-0.5">
                              {addon.category} · {addon.unitLabel}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                            <span className="text-xs text-[#6B625C]">$</span>
                            <input
                              type="number"
                              min={0}
                              step={5}
                              value={addon.priceUsd}
                              onChange={(e) =>
                                updateAddonPrice(addon.id, Number(e.target.value))
                              }
                              aria-label={`${addon.name} USD price`}
                              className="w-24 px-2.5 py-1.5 text-sm tabular-nums bg-[#FAF8F6] border border-[#DED6CE] rounded-md text-[#1C1917]"
                            />
                            <span className="text-xs text-[#6B625C]">USD</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Product Option */}
                    <form
                      onSubmit={handleAddAddon}
                      className="p-4 bg-[#F2EEEB]/80 border border-[#DED6CE] rounded-lg space-y-3 mt-4"
                    >
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                        Add New Product / Extra Option
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Option name (e.g. Sequin Wall)"
                          value={newAddonName}
                          onChange={(e) => setNewAddonName(e.target.value)}
                          className="sm:col-span-2 px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                          required
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            step={5}
                            value={newAddonPrice}
                            onChange={(e) => setNewAddonPrice(e.target.value)}
                            className="w-full px-3 py-2 text-sm tabular-nums bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                            required
                          />
                          <span className="text-xs text-[#6B625C] shrink-0">USD</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select
                          value={newAddonCategory}
                          onChange={(e) =>
                            setNewAddonCategory(
                              e.target.value as AddonProduct['category']
                            )
                          }
                          className="px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                        >
                          <option value="Signage">Signage</option>
                          <option value="Draping">Draping</option>
                          <option value="Florals">Florals</option>
                          <option value="Arrangements">Arrangements</option>
                          <option value="Props">Props</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Short description..."
                          value={newAddonDesc}
                          onChange={(e) => setNewAddonDesc(e.target.value)}
                          className="sm:col-span-2 px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#7C4D59] hover:bg-[#643B46] rounded-md transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Option to Quote Builder</span>
                      </button>
                    </form>
                  </section>
                </>
              ) : (
                <section className="space-y-4">
                  <p className="text-xs text-[#6B625C] leading-relaxed">
                    Edit your WhatsApp destination number, email placeholder, Sydney service area note, and deposit policy text. No details are auto-confirmed or assumed.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        WhatsApp Number (digits only with country code, e.g. 614XXXXXXXX)
                      </label>
                      <input
                        type="text"
                        value={catalog.settings.whatsappPlaceholderNumber}
                        onChange={(e) =>
                          updateOwnerSettings({
                            whatsappPlaceholderNumber: e.target.value.replace(/[^\d]/g, ''),
                          })
                        }
                        className="w-full px-3 py-2 text-sm tabular-nums bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        Studio Enquiry Email Placeholder
                      </label>
                      <input
                        type="email"
                        value={catalog.settings.emailPlaceholder}
                        onChange={(e) =>
                          updateOwnerSettings({ emailPlaceholder: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        Sydney Service Area Note
                      </label>
                      <textarea
                        rows={2}
                        value={catalog.settings.serviceAreaNote}
                        onChange={(e) =>
                          updateOwnerSettings({ serviceAreaNote: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        Delivery &amp; Logistics Estimate Note
                      </label>
                      <textarea
                        rows={3}
                        value={catalog.settings.deliveryFeeNote}
                        onChange={(e) =>
                          updateOwnerSettings({ deliveryFeeNote: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        Booking Request Status Notice
                      </label>
                      <textarea
                        rows={3}
                        value={catalog.settings.bookingRequestNote}
                        onChange={(e) =>
                          updateOwnerSettings({ bookingRequestNote: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        Deposit Information Placeholder
                      </label>
                      <textarea
                        rows={3}
                        value={catalog.settings.depositInformationNote}
                        onChange={(e) =>
                          updateOwnerSettings({
                            depositInformationNote: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DED6CE] rounded-md text-[#1C1917]"
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
