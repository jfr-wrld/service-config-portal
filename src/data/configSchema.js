import { v4 as uuidv4 } from 'uuid';

/* ═══════════════════════════════════════════════════════════════
   CONFIG SCHEMA — Predefined configurations per booking type
   No more form builder. Config-driven, structured, consistent.
   ═══════════════════════════════════════════════════════════════ */

/* ─── Booking Type Definitions ─── */
export const BOOKING_TYPES = {
  'time-based': {
    value: 'time-based',
    label: 'Time-based',
    description: 'Session with duration & time slots',
    color: '#0d9488',
    icon: 'Timer',
  },
  'package-based': {
    value: 'package-based',
    label: 'Package-based',
    description: 'Fixed package pricing',
    color: '#f59e0b',
    icon: 'Package',
  },
  'on-demand': {
    value: 'on-demand',
    label: 'On-demand',
    description: 'Flexible request-based booking',
    color: '#059669',
    icon: 'Zap',
  },
};

/* ─── Availability Type Definitions ─── */
export const AVAILABILITY_TYPES = {
  recurring: {
    value: 'recurring',
    label: 'Recurring',
    description: 'Weekly slot-based schedule (Mon-Sun)',
    icon: 'Calendar',
  },
  'specific-dates': {
    value: 'specific-dates',
    label: 'Specific Dates',
    description: 'Pick individual dates from calendar',
    icon: 'CalendarRange',
  },
  'by-month': {
    value: 'by-month',
    label: 'By Month / Range',
    description: 'Select available months or date ranges',
    icon: 'CalendarDays',
  },
};

/* ─── Which availability types are allowed per booking type ─── */
export const AVAILABILITY_BY_BOOKING_TYPE = {
  'time-based': ['recurring', 'specific-dates', 'by-month'],
  'package-based': ['specific-dates', 'by-month'],
  'on-demand': [], // on-demand = request-based, no fixed availability
};

/* ─── Default Pricing Config per Booking Type ─── */
export function getDefaultPricingConfig(bookingType) {
  switch (bookingType) {
    case 'time-based':
      return {
        priceUnit: 'per-session',
        packages: [createTimePackage()],
        addonsEnabled: false,
        addons: [],
      };

    case 'package-based':
      return {
        priceUnit: 'per-trip',
        packages: [createPackageItem()],
        addonsEnabled: true,
        addons: [createAddon()],
      };

    case 'on-demand':
      return {
        priceUnit: 'per-event',
        pricingModel: 'fixed', // 'fixed' | 'quote'
        basePrice: 0,
        currency: 'MYR (RM)',
        customRequirementEnabled: true,
        customRequirementLabel: 'Special Requirements',
        packages: [createOnDemandPackage()],
        addonsEnabled: false,
        addons: [],
      };

    default:
      return { packages: [], addons: [] };
  }
}

/* ─── Default Availability Config ─── */
export function getDefaultAvailabilityConfig(bookingType) {
  const allowedTypes = AVAILABILITY_BY_BOOKING_TYPE[bookingType] || [];

  return {
    enabledTypes: allowedTypes.length > 0 ? { [allowedTypes[0]]: true } : {},
    activeType: allowedTypes[0] || null,
    timeRules: {
      bufferBefore: 0,
      bufferAfter: 0,
      maxBookingPerDay: 10,
      leadTimeHours: 2,
      allowSameDayBooking: false,
    },
    timeFormat: '12h',
    weeklySlots: createDefaultWeeklySlots(),
    availableMonths: [],
    availableDates: [],
    monthYear: new Date().getFullYear(),
  };
}

/* ─── Default Service Config ─── */
export function getDefaultServiceConfig(service) {
  return {
    id: uuidv4(),
    serviceId: service.id,
    serviceName: service.name,
    bookingType: service.bookingType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    /* Step 1: Basic Info */
    basicInfo: {
      name: service.name || '',
      description: service.description || '',
      locationType: 'online',
      targetCountries: [],
      languages: [],
      gender: 'both',
      ageRange: 'all-ages',
      tags: [],
      inclusions: '',
      exclusions: '',
      bookingMode: 'instant-booking',
      allowSameDayBooking: false,
      allowCustomTimeRequest: false,
      autoConfirmAfterPayment: true,
      maxParticipants: '',
      allowReschedule: true,
      rescheduleWindowHours: 24,
      allowCancellation: true,
      cancellationWindowHours: 48,
      cancellationPolicy: '',
    },

    /* Step 2: Pricing */
    pricing: getDefaultPricingConfig(service.bookingType),

    /* Step 3: Availability */
    availability: getDefaultAvailabilityConfig(service.bookingType),

    /* Step 4: Additional Info */
    additionalInfo: {
      fields: [],
    },
  };
}

/* ═══════════════════════════════════════════════════════════════
   Factory Functions
   ═══════════════════════════════════════════════════════════════ */

/* ─── Time-based Package (Session) ─── */
export function createTimePackage() {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    durationType: 'minute',
    durationValue: 60,
    totalSessions: 1,
    participantType: 'personal',
    maxQuota: 1,
    currency: 'MYR (RM)',
    price: 0,
    oneTime: true,
    taxEnabled: false,
    taxRate: 6,
    status: 'active',
  };
}

/* ─── Package-based Item ─── */
export function createPackageItem() {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    packageTier: 'standard',
    durationType: 'day',
    durationValue: 1,
    participantType: 'personal',
    maxQuota: 1,
    currency: 'MYR (RM)',
    price: 0,
    oneTime: true,
    taxEnabled: false,
    taxRate: 6,
    status: 'active',
  };
}

/* ─── On-demand Package ─── */
export function createOnDemandPackage() {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    eventType: '',
    durationType: 'hour',
    durationValue: 1,
    participantType: 'personal',
    maxQuota: 1,
    currency: 'MYR (RM)',
    price: 0,
    pricingModel: 'fixed', // 'fixed' | 'quote'
    oneTime: true,
    taxEnabled: false,
    taxRate: 6,
    status: 'active',
  };
}

/* ─── Add-on ─── */
export function createAddon() {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    pricingModel: 'flat-fee',
    price: 0,
    maxQuantity: 0,
    deliveryFormat: 'online',
    mandatory: false,
    status: 'active',
  };
}

/* ─── Custom Field (Additional Info) ─── */
export function createCustomField() {
  return {
    id: uuidv4(),
    label: '',
    type: 'text', // 'text' | 'textarea'
    placeholder: '',
    required: false,
  };
}

/* ─── Default Weekly Slots ─── */
function createDefaultWeeklySlots() {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const w = {};
  DAYS.forEach(d => {
    const isWeekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(d);
    w[d.toLowerCase()] = {
      enabled: isWeekday,
      slots: isWeekday ? [{ id: crypto.randomUUID ? crypto.randomUUID() : `slot-${d.toLowerCase()}`, start: '09:00', end: '17:00' }] : [],
    };
  });
  return w;
}


/* ─── Option Lists ─── */
export const CURRENCY_OPTIONS = [
  'MYR (RM)', 'USD ($)', 'SAR (﷼)', 'IDR (Rp)', 'SGD (S$)', 'GBP (£)',
];

export const DURATION_TYPES = [
  { value: 'minute', label: 'Minute' },
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
];

export const PACKAGE_TIERS = [
  'Basic', 'Standard', 'Most Popular', 'Best Value',
  'Recommended', 'Peak Time', 'Premium', 'VIP',
];

export const PRICING_MODELS = [
  { value: 'per-session', label: 'Per Session' },
  { value: 'per-event', label: 'Per Event' },
  { value: 'per-trip', label: 'Per Trip' },
  { value: 'per-day', label: 'Per Day' },
  { value: 'per-pax', label: 'Per Pax' },
  { value: 'flat-fee', label: 'Flat Fee' },
];

export const COUNTRY_OPTIONS = [
  'Indonesia', 'Malaysia', 'Saudi Arabia', 'United Arab Emirates',
  'Singapore', 'Brunei', 'Turkey', 'United Kingdom', 'United States', 'Australia',
];

export const LANGUAGE_OPTIONS = [
  'English', 'Arabic', 'Bahasa Indonesia', 'Bahasa Melayu',
  'Turkish', 'Urdu', 'French',
];

export const ADDON_PRICING_MODELS = [
  { value: 'per-session', label: 'Per Session' },
  { value: 'per-event', label: 'Per Event' },
  { value: 'per-trip', label: 'Per Trip' },
  { value: 'per-pax', label: 'Per Pax' },
  { value: 'flat-fee', label: 'Flat Fee' },
];
