import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_CATALOG,
  DEFAULT_QUOTE_STATE,
  PORTFOLIO_ITEMS,
} from '../data/defaultCatalog';
import {
  AddonProduct,
  CatalogConfig,
  CustomQuoteState,
  OwnerSettings,
  PageView,
  PortfolioItem,
  QuoteBreakdown,
  QuoteLineItem,
  SubmittedEnquiry,
} from '../types/events';

const CATALOG_STORAGE_KEY = 'cloudnine_events_catalog_v1';
const ENQUIRIES_STORAGE_KEY = 'cloudnine_events_enquiries_v1';

interface CatalogContextValue {
  currentView: PageView;
  navigateTo: (view: PageView) => void;
  catalog: CatalogConfig;
  quoteState: CustomQuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<CustomQuoteState>>;
  resetQuote: () => void;
  breakdown: QuoteBreakdown;
  enquiries: SubmittedEnquiry[];
  addEnquiry: (
    channel: 'Enquiry Form' | 'WhatsApp',
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ) => SubmittedEnquiry;
  isOwnerModalOpen: boolean;
  setIsOwnerModalOpen: (open: boolean) => void;
  updateBalloonPrice: (id: string, priceUsd: number) => void;
  updateBalloonActive: (id: string, active: boolean) => void;
  updateSizePrice: (id: string, priceDeltaUsd: number) => void;
  updateAddonPrice: (id: string, priceUsd: number) => void;
  updateAddonActive: (id: string, active: boolean) => void;
  addCustomAddon: (addon: Omit<AddonProduct, 'id'>) => void;
  updateOwnerSettings: (partial: Partial<OwnerSettings>) => void;
  resetCatalogToDefaults: () => void;
  startCustomisingFromStyle: (styleId: string, addonIds?: string[]) => void;
  portfolioItems: PortfolioItem[];
  lightboxItem: PortfolioItem | null;
  setLightboxItem: (item: PortfolioItem | null) => void;
  buildWhatsAppSummaryText: (customerName?: string, customerEmail?: string, customerPhone?: string) => string;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const [catalog, setCatalog] = useState<CatalogConfig>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CatalogConfig;
        if (parsed.balloonStyles && parsed.sizes && parsed.addons && parsed.settings) {
          return parsed;
        }
      }
    } catch {
      // Fallback cleanly to defaults
    }
    return DEFAULT_CATALOG;
  });

  const [quoteState, setQuoteState] = useState<CustomQuoteState>(DEFAULT_QUOTE_STATE);

  const [enquiries, setEnquiries] = useState<SubmittedEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as SubmittedEnquiry[];
      }
    } catch {
      // Ignore parse failures
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
    } catch {
      // Ignore storage quota issues
    }
  }, [catalog]);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
    } catch {
      // Ignore storage quota issues
    }
  }, [enquiries]);

  const navigateTo = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetQuote = () => {
    setQuoteState(DEFAULT_QUOTE_STATE);
  };

  const breakdown = useMemo<QuoteBreakdown>(() => {
    const lineItems: QuoteLineItem[] = [];
    const selectedStyle = catalog.balloonStyles.find((s) => s.id === quoteState.balloonStyleId);
    const selectedSize = catalog.sizes.find((sz) => sz.id === quoteState.sizeId);

    if (selectedStyle && !selectedStyle.isNoneOption && selectedStyle.active) {
      lineItems.push({
        id: `style-${selectedStyle.id}`,
        label: selectedStyle.name,
        detail: selectedStyle.subtitle,
        amountUsd: selectedStyle.basePriceUsd,
      });

      if (selectedSize && selectedSize.priceDeltaUsd > 0) {
        lineItems.push({
          id: `size-${selectedSize.id}`,
          label: `${selectedSize.name} Scale Upgrade`,
          detail: selectedSize.dimensions,
          amountUsd: selectedSize.priceDeltaUsd,
        });
      }
    }

    Object.entries(quoteState.selectedAddons).forEach(([addonId, qty]) => {
      if (!qty || qty <= 0) return;
      const addon = catalog.addons.find((a) => a.id === addonId && a.active);
      if (!addon) return;
      lineItems.push({
        id: `addon-${addon.id}`,
        label: qty > 1 ? `${addon.name} × ${qty}` : addon.name,
        detail: addon.category,
        amountUsd: addon.priceUsd * qty,
      });
    });

    const subtotalUsd = lineItems.reduce((sum, item) => sum + item.amountUsd, 0);
    return { lineItems, subtotalUsd };
  }, [catalog, quoteState]);

  const addEnquiry = (
    channel: 'Enquiry Form' | 'WhatsApp',
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ): SubmittedEnquiry => {
    const refCode = `CN-${Math.floor(100000 + Math.random() * 900000)}`;
    const record: SubmittedEnquiry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceCode: refCode,
      submittedAt: new Date().toISOString(),
      channel,
      customerName,
      customerEmail,
      customerPhone,
      quoteSnapshot: {
        ...quoteState,
        // Avoid bloating localStorage with massive raw data URLs in history list
        inspirationImages: quoteState.inspirationImages.map((img) => ({
          ...img,
          dataUrl: img.dataUrl.slice(0, 120) === img.dataUrl ? img.dataUrl : '',
        })),
      },
      breakdownSnapshot: breakdown,
    };
    setEnquiries((prev) => [record, ...prev].slice(0, 20));
    return record;
  };

  const updateBalloonPrice = (id: string, priceUsd: number) => {
    setCatalog((prev) => ({
      ...prev,
      balloonStyles: prev.balloonStyles.map((item) =>
        item.id === id ? { ...item, basePriceUsd: Math.max(0, priceUsd) } : item
      ),
    }));
  };

  const updateBalloonActive = (id: string, active: boolean) => {
    setCatalog((prev) => ({
      ...prev,
      balloonStyles: prev.balloonStyles.map((item) =>
        item.id === id ? { ...item, active } : item
      ),
    }));
  };

  const updateSizePrice = (id: string, priceDeltaUsd: number) => {
    setCatalog((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item) =>
        item.id === id ? { ...item, priceDeltaUsd: Math.max(0, priceDeltaUsd) } : item
      ),
    }));
  };

  const updateAddonPrice = (id: string, priceUsd: number) => {
    setCatalog((prev) => ({
      ...prev,
      addons: prev.addons.map((item) =>
        item.id === id ? { ...item, priceUsd: Math.max(0, priceUsd) } : item
      ),
    }));
  };

  const updateAddonActive = (id: string, active: boolean) => {
    setCatalog((prev) => ({
      ...prev,
      addons: prev.addons.map((item) => (item.id === id ? { ...item, active } : item)),
    }));
  };

  const addCustomAddon = (addon: Omit<AddonProduct, 'id'>) => {
    const newId = `custom-${Date.now()}`;
    setCatalog((prev) => ({
      ...prev,
      addons: [...prev.addons, { ...addon, id: newId }],
    }));
  };

  const updateOwnerSettings = (partial: Partial<OwnerSettings>) => {
    setCatalog((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  };

  const resetCatalogToDefaults = () => {
    setCatalog(DEFAULT_CATALOG);
    localStorage.removeItem(CATALOG_STORAGE_KEY);
  };

  const startCustomisingFromStyle = (styleId: string, addonIds: string[] = []) => {
    const nextAddons: Record<string, number> = {};
    addonIds.forEach((id) => {
      const exists = catalog.addons.find((a) => a.id === id && a.active);
      if (exists) nextAddons[id] = 1;
    });
    setQuoteState((prev) => ({
      ...prev,
      balloonStyleId: styleId,
      selectedAddons: Object.keys(nextAddons).length > 0 ? nextAddons : prev.selectedAddons,
    }));
    navigateTo('build');
  };

  const buildWhatsAppSummaryText = (
    customerName?: string,
    customerEmail?: string,
    customerPhone?: string
  ) => {
    const eventLabel =
      quoteState.eventType === 'Other' && quoteState.customEventLabel.trim()
        ? `Other (${quoteState.customEventLabel.trim()})`
        : quoteState.eventType;
    const style = catalog.balloonStyles.find((s) => s.id === quoteState.balloonStyleId);
    const size = catalog.sizes.find((sz) => sz.id === quoteState.sizeId);
    const palette = catalog.palettes.find((p) => p.id === quoteState.paletteId);

    const lines: string[] = [
      `Hello Cloudnine Events! I would like to submit an event styling enquiry:`,
      ``,
      `*Event Type:* ${eventLabel}`,
      `*Preferred Date:* ${quoteState.eventDate || 'To be advised'}`,
      `*Venue / Suburb:* ${quoteState.venueSuburb || 'To be advised'}`,
      `*Australian Postcode:* ${quoteState.postcode || 'To be advised'}`,
      ``,
      `*Styling Selection:*`,
      `• Base Styling: ${style ? style.name : 'Not selected'}`,
      ...(style && !style.isNoneOption && size ? [`• Scale: ${size.name} (${size.dimensions})`] : []),
      `• Palette: ${palette ? palette.name : 'Custom'}${
        quoteState.customPaletteNotes.trim() ? ` — ${quoteState.customPaletteNotes.trim()}` : ''
      }`,
    ];

    if (breakdown.lineItems.length > 0) {
      lines.push(``, `*Selected Breakdown (Indicative USD):*`);
      breakdown.lineItems.forEach((li) => {
        lines.push(`• ${li.label}: $${li.amountUsd} USD`);
      });
    }

    if (quoteState.personalisedText.trim()) {
      lines.push(``, `*Personalised Signage / Decal Text:* "${quoteState.personalisedText.trim()}"`);
    }

    if (quoteState.inspirationImages.length > 0) {
      lines.push(
        ``,
        `*Inspiration Images Attached:* ${quoteState.inspirationImages.length} file(s) (${quoteState.inspirationImages
          .map((i) => i.name)
          .join(', ')}) — happy to send photos directly in this chat.`
      );
    }

    if (quoteState.specialRequirements.trim()) {
      lines.push(``, `*Special Requirements:* ${quoteState.specialRequirements.trim()}`);
    }

    lines.push(
      ``,
      `*Indicative Estimate Total:* $${breakdown.subtotalUsd.toLocaleString()} USD`,
      `_(Indicative estimate only, excluding venue delivery/bump-in — subject to availability & formal quote)_`
    );

    if (customerName || customerEmail || customerPhone) {
      lines.push(
        ``,
        `*Contact Details:*`,
        ...(customerName ? [`Name: ${customerName}`] : []),
        ...(customerEmail ? [`Email: ${customerEmail}`] : []),
        ...(customerPhone ? [`Phone: ${customerPhone}`] : [])
      );
    }

    return lines.join('\n');
  };

  return (
    <CatalogContext.Provider
      value={{
        currentView,
        navigateTo,
        catalog,
        quoteState,
        setQuoteState,
        resetQuote,
        breakdown,
        enquiries,
        addEnquiry,
        isOwnerModalOpen,
        setIsOwnerModalOpen,
        updateBalloonPrice,
        updateBalloonActive,
        updateSizePrice,
        updateAddonPrice,
        updateAddonActive,
        addCustomAddon,
        updateOwnerSettings,
        resetCatalogToDefaults,
        startCustomisingFromStyle,
        portfolioItems: PORTFOLIO_ITEMS,
        lightboxItem,
        setLightboxItem,
        buildWhatsAppSummaryText,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return ctx;
}
