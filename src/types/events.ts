export type PageView = 'home' | 'build' | 'collections' | 'gallery' | 'about' | 'book';

export type EventCategory =
  | 'Birthday'
  | 'Baby Shower'
  | 'Engagement'
  | 'Wedding'
  | 'Corporate Event'
  | 'Other';

export interface BalloonStyleProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  basePriceUsd: number;
  image: string;
  active: boolean;
  isNoneOption?: boolean;
}

export interface SizeOption {
  id: string;
  name: string;
  dimensions: string;
  description: string;
  priceDeltaUsd: number;
  active: boolean;
}

export interface PalettePreset {
  id: string;
  name: string;
  description: string;
  swatches: string[];
}

export interface AddonProduct {
  id: string;
  category: 'Signage' | 'Draping' | 'Florals' | 'Arrangements' | 'Props';
  name: string;
  description: string;
  priceUsd: number;
  unitLabel: string;
  allowsQuantity: boolean;
  requiresPersonalisedText?: boolean;
  image: string;
  active: boolean;
}

export interface OwnerSettings {
  businessName: string;
  tagline: string;
  locationLabel: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappPlaceholderNumber: string;
  emailPlaceholder: string;
  serviceAreaNote: string;
  deliveryFeeNote: string;
  bookingRequestNote: string;
  depositInformationNote: string;
}

export interface CatalogConfig {
  balloonStyles: BalloonStyleProduct[];
  sizes: SizeOption[];
  palettes: PalettePreset[];
  addons: AddonProduct[];
  settings: OwnerSettings;
}

export interface UploadedInspirationImage {
  id: string;
  name: string;
  sizeBytes: number;
  dataUrl: string;
}

export interface CustomQuoteState {
  eventType: EventCategory;
  customEventLabel: string;
  balloonStyleId: string;
  sizeId: string;
  paletteId: string;
  customPaletteNotes: string;
  selectedAddons: Record<string, number>;
  personalisedText: string;
  inspirationImages: UploadedInspirationImage[];
  eventDate: string;
  venueSuburb: string;
  postcode: string;
  specialRequirements: string;
}

export interface QuoteLineItem {
  id: string;
  label: string;
  detail?: string;
  amountUsd: number;
}

export interface QuoteBreakdown {
  lineItems: QuoteLineItem[];
  subtotalUsd: number;
}

export interface SubmittedEnquiry {
  id: string;
  referenceCode: string;
  submittedAt: string;
  channel: 'Enquiry Form' | 'WhatsApp';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quoteSnapshot: CustomQuoteState;
  breakdownSnapshot: QuoteBreakdown;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Balloon Installations' | 'Linen Signage' | 'Event Draping' | 'Bespoke Numbers';
  eventType: string;
  location: string;
  image: string;
  description: string;
  stylingElements: string[];
  linkedStyleId: string;
  linkedAddonIds: string[];
  featuredOrder?: number;
}
