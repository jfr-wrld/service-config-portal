/* ═══════════════════════════════════════════════════════════════
   CONFIG SCHEMA — Rule-based service configuration
   Admin defines RULES (structure), Scholar fills DATA.
   ═══════════════════════════════════════════════════════════════ */

/* ─── Booking Type Definitions ─── */
export const BOOKING_TYPES = {
  'time-based': {
    value: 'time-based',
    label: 'Time-Based',
    description: 'Session with duration & time slots',
    color: '#0d9488',
    icon: 'Timer',
    pricingFields: ['Session name', 'Duration', 'Price per session', 'Currency'],
    pricingHint: 'Scholar sets session duration & rate',
  },
  'package-based': {
    value: 'package-based',
    label: 'Package-Based',
    description: 'Fixed package with multi-day itinerary',
    color: '#f59e0b',
    icon: 'Package',
    pricingFields: ['Package name', 'Duration (days)', 'Price per package', 'Tier', 'Add-ons'],
    pricingHint: 'Scholar defines packages & pricing tiers',
  },
  'on-demand': {
    value: 'on-demand',
    label: 'On-Demand',
    description: 'Flexible request-based booking',
    color: '#059669',
    icon: 'Zap',
    pricingFields: ['Event type', 'Base price or quote', 'Custom requirements'],
    pricingHint: 'Scholar sets event pricing or quote-based',
  },
};

/* ─── Availability Type Definitions ─── */
export const AVAILABILITY_TYPES = {
  recurring: {
    value: 'recurring',
    label: 'Recurring',
    description: 'Weekly slot-based schedule (Mon–Sun)',
    icon: 'CalendarClock',
    scholarFields: ['Day selection', 'Time slots per day', 'Buffer time'],
  },
  'specific-dates': {
    value: 'specific-dates',
    label: 'Specific Dates',
    description: 'Pick individual dates from calendar',
    icon: 'CalendarCheck',
    scholarFields: ['Date picker', 'Time slots per date'],
  },
  'by-month': {
    value: 'by-month',
    label: 'By Month / Range',
    description: 'Select available months or seasons',
    icon: 'CalendarRange',
    scholarFields: ['Month selector', 'Date range', 'Season tag'],
  },
};

/* ─── Which availability types are allowed per booking type ─── */
export const AVAILABILITY_BY_BOOKING_TYPE = {
  'time-based': ['recurring', 'specific-dates', 'by-month'],
  'package-based': ['specific-dates', 'by-month'],
  'on-demand': [],
};

/* ─── Default Admin Rules ─── */
export function getDefaultRules(service) {
  const allowedAvail = AVAILABILITY_BY_BOOKING_TYPE[service.bookingType] || [];

  return {
    serviceId: service.id,
    serviceName: service.name,
    serviceDescription: service.description || '',
    serviceIcon: service.icon || 'MessageSquare',
    serviceColor: service.color || '#0d9488',
    serviceStatus: service.status || 'draft',
    bookingType: service.bookingType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    /* Availability toggles — admin controls which types are allowed */
    availabilityTypes: Object.fromEntries(
      allowedAvail.map((t, i) => [t, i === 0]) // first one enabled by default
    ),

    /* Booking rules — admin controls operational policies */
    rules: {
      bookingMode: 'instant-booking',   // 'instant-booking' | 'request-to-book' | 'both'
      locationType: 'both',             // 'online' | 'offline' | 'both'
      gender: 'both',                   // 'male' | 'female' | 'both'
      allowSameDayBooking: false,
      allowCustomTimeRequest: false,
      autoConfirmAfterPayment: true,
      allowReschedule: true,
      allowCancellation: true,
      maxParticipants: '',
    },
  };
}
