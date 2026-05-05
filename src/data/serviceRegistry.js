import { v4 as uuidv4 } from 'uuid';
import { getDefaultSchema, SERVICE_TYPES, BOOKING_TYPES, createOption } from './formSchema';

/* ─── Service Registry ─── */
export const SERVICE_REGISTRY = [
  {
    id: uuidv4(),
    name: 'Consultation',
    slug: 'consultation',
    description: 'One-on-one Islamic consultation with a scholar. Time-based booking with configurable duration and slots.',
    bookingType: 'time-based',
    priceUnit: 'Per Session',
    icon: 'MessageSquare',
    color: '#0d9488',
    status: 'published',
    createdAt: '2026-04-15T08:00:00Z',
    updatedAt: '2026-05-01T14:30:00Z',
    version: 3,
    eventTypes: ['Personal Consultation', 'Family Consultation', 'Spiritual Guidance', 'Pre-Marriage Consultation'],
    durationRange: '45-240 min',
  },
  {
    id: uuidv4(),
    name: 'Ruqyah',
    slug: 'ruqyah',
    description: 'Spiritual healing sessions with certified practitioners. Time-based booking with privacy options.',
    bookingType: 'time-based',
    priceUnit: 'Per Session',
    icon: 'Heart',
    color: '#e11d48',
    status: 'published',
    createdAt: '2026-04-16T10:00:00Z',
    updatedAt: '2026-04-28T09:15:00Z',
    version: 2,
    eventTypes: ['Personal Ruqyah', 'Home Visit Ruqyah', 'Group Ruqyah', 'Follow-Up & Guidance'],
    durationRange: '30-180 min',
  },
  {
    id: uuidv4(),
    name: 'Syariah Advisory',
    slug: 'syariah-advisory',
    description: 'Legal and financial advisory based on Sharia principles. Time-based professional consultation.',
    bookingType: 'time-based',
    priceUnit: 'Per Session',
    icon: 'Scale',
    color: '#7c3aed',
    status: 'draft',
    createdAt: '2026-04-20T12:00:00Z',
    updatedAt: '2026-04-20T12:00:00Z',
    version: 1,
    eventTypes: ['Consultation', 'Business Advisory', 'Contract Review'],
    durationRange: 'Per session/event',
  },
  {
    id: uuidv4(),
    name: 'Mutawwif',
    slug: 'mutawwif',
    description: 'Pilgrimage guide services for Hajj & Umrah. Package-based with seasonal scheduling.',
    bookingType: 'package-based',
    priceUnit: 'Per Trip',
    icon: 'Map',
    color: '#f59e0b',
    status: 'published',
    createdAt: '2026-04-10T06:00:00Z',
    updatedAt: '2026-05-03T18:45:00Z',
    version: 5,
    eventTypes: [],  // No event types — direct packages
    durationRange: 'Per trip / Per day',
    hasEventTypes: false,
  },
  {
    id: uuidv4(),
    name: 'Imam',
    slug: 'imam',
    description: 'On-demand Imam services for prayers, ceremonies, and religious events.',
    bookingType: 'on-demand',
    priceUnit: 'Per Event',
    icon: 'Star',
    color: '#0284c7',
    status: 'published',
    createdAt: '2026-04-12T14:00:00Z',
    updatedAt: '2026-04-25T11:00:00Z',
    version: 2,
    eventTypes: ['Wedding Ceremony', 'Funeral Prayer', 'General Session'],
    durationRange: '60-480 min',
  },
  {
    id: uuidv4(),
    name: 'Speaker',
    slug: 'speaker',
    description: 'Book scholars and speakers for talks, seminars, and Islamic events.',
    bookingType: 'on-demand',
    priceUnit: 'Per Event',
    icon: 'Mic',
    color: '#059669',
    status: 'draft',
    createdAt: '2026-04-22T16:00:00Z',
    updatedAt: '2026-04-22T16:00:00Z',
    version: 1,
    eventTypes: ['Corporate Event', 'Education / Campus Event', 'Religious Gathering (Kajian)', 'Private Event', 'Special Event (Ramadan / Big Event)'],
    durationRange: 'Per event',
  },
];

/* ═══════════════════════════════════════════════════════════════
   SMART SCHEMA GENERATOR
   Each service gets a schema tailored to its booking type.
   ═══════════════════════════════════════════════════════════════ */

/* ─── Section visibility rules per booking type ─── */
const SECTION_VISIBILITY = {
  'time-based': {
    // Step 2: Pricing & Packages
    'sec-pricing-model': true,
    'sec-event-type-config': true,
    'sec-package-info': true,
    'sec-package-capacity': true,
    'sec-package-pricing': true,
    'sec-package-payment': true,
    'sec-package-addons': true,
    // Step 5: Availability
    'sec-default-availability': true,
    'sec-time-rules': true,
    'sec-time-format': true,
    'sec-weekly-slot-config': true,
    'sec-month-picker-config': true,
    'sec-date-picker-config': true,
    'sec-package-availability': false,
  },
  'package-based': {
    // Step 2: Pricing & Packages
    'sec-pricing-model': true,
    'sec-event-type-config': false,   // Mutawwif has no event types
    'sec-package-info': true,
    'sec-package-capacity': true,
    'sec-package-pricing': true,
    'sec-package-payment': true,
    'sec-package-addons': true,
    // Step 5: Availability
    'sec-default-availability': true,
    'sec-time-rules': false,
    'sec-time-format': false,
    'sec-weekly-slot-config': false,
    'sec-month-picker-config': true,
    'sec-date-picker-config': true,
    'sec-package-availability': true,
  },
  'on-demand': {
    // Step 2: Pricing & Packages
    'sec-pricing-model': true,
    'sec-event-type-config': true,
    'sec-package-info': true,
    'sec-package-capacity': true,
    'sec-package-pricing': true,
    'sec-package-payment': true,
    'sec-package-addons': true,
    // Step 5: Availability — mostly hidden (on-demand = request-based)
    'sec-default-availability': false,
    'sec-time-rules': false,
    'sec-time-format': false,
    'sec-weekly-slot-config': false,
    'sec-month-picker-config': false,
    'sec-date-picker-config': false,
    'sec-package-availability': false,
  },
};

/* ─── Default Price Unit per booking type ─── */
const PRICE_UNIT_DEFAULTS = {
  'time-based': 'per-session',
  'package-based': 'per-trip',
  'on-demand': 'per-event',
};

/* ─── Availability types available per booking type ─── */
const AVAILABILITY_TYPE_OPTIONS = {
  'time-based': ['Recurring', 'By Month', 'Specific Dates'],
  'package-based': ['By Month', 'Specific Dates'],
  'on-demand': [], // no availability needed
};

/* ─── Generate schema tailored to a specific service ─── */
export function getSchemaForService(service) {
  const schema = getDefaultSchema();
  const bt = service.bookingType;
  const visibility = SECTION_VISIBILITY[bt] || {};

  // 1. Schema metadata
  schema.name = `${service.name} Service Form`;
  schema.description = `Form template for ${service.name} service (${bt})`;

  // 2. Walk all steps → all sections → apply smart logic
  schema.steps = schema.steps.map(step => ({
    ...step,
    sections: step.sections.map(section => {
      const sec = { ...section };

      // ─── Apply section visibility based on booking type ───
      if (visibility[sec.id] !== undefined) {
        sec.visible = visibility[sec.id];
      }

      // ─── Step 1: Service Setup — Pre-fill locked values ───
      if (sec.id === 'sec-basic-info') {
        sec.fields = sec.fields.map(field => {
          const f = { ...field };

          // Lock Service Type to a single value
          if (f.label === 'Service Type') {
            f.options = [{ ...createOption(service.name), isDefault: true }];
            f.defaultValue = service.slug;
            f.helpText = `Locked to ${service.name} — this template is service-specific`;
          }

          // Auto-fill Booking Type
          if (f.label === 'Booking Type') {
            const btDef = BOOKING_TYPES.find(b => b.value === bt);
            f.defaultValue = bt;
            f.placeholder = btDef?.label || bt;
            f.helpText = `Auto-determined: ${service.name} → ${btDef?.label}`;
          }

          return f;
        });
      }

      // ─── Step 2: Pricing Model — Lock pricing defaults ───
      if (sec.id === 'sec-pricing-model') {
        sec.fields = sec.fields.map(field => {
          const f = { ...field };

          if (f.label === 'Detected Booking Type') {
            f.defaultValue = bt;
            f.placeholder = BOOKING_TYPES.find(b => b.value === bt)?.label || bt;
            f.helpText = `${service.name} uses ${bt} booking model`;
          }

          if (f.label === 'Price Unit') {
            const unit = service.priceUnit || 'Per Session';
            f.defaultValue = unit.toLowerCase().replace(/\s+/g, '-');
            f.placeholder = unit;
            f.helpText = `Default unit for ${service.name}: ${unit}`;
          }

          return f;
        });
      }

      // ─── Step 2: Event Type Config — Inject service-specific event types ───
      if (sec.id === 'sec-event-type-config') {
        const hasEvents = service.hasEventTypes !== false && service.eventTypes?.length > 0;

        sec.fields = sec.fields.map(field => {
          const f = { ...field };

          if (f.label === 'Has Event Types') {
            f.defaultValue = hasEvents;
          }

          if (f.label === 'Event Types') {
            if (hasEvents) {
              f.options = service.eventTypes.map((et, i) => ({
                ...createOption(et),
                isDefault: i === 0,
              }));
              f.helpText = `${service.eventTypes.length} event types configured for ${service.name}`;
            } else {
              f.visible = false;
              f.helpText = `${service.name} does not use event types`;
            }
          }

          if (f.label === 'Duration Range') {
            f.defaultValue = service.durationRange || '';
            f.placeholder = service.durationRange || 'e.g. 60-480 min';
          }

          return f;
        });
      }

      // ─── Step 5: Availability — Adjust available types ───
      if (sec.id === 'sec-default-availability') {
        const availTypes = AVAILABILITY_TYPE_OPTIONS[bt] || [];
        sec.fields = sec.fields.map(field => {
          const f = { ...field };

          if (f.label === 'Availability Type') {
            f.options = availTypes.map((t, i) => ({
              ...createOption(t),
              isDefault: i === 0,
            }));
            if (availTypes.length === 0) {
              f.visible = false;
            }
          }

          if (f.label === 'Default Availability Type') {
            f.options = availTypes.map((t, i) => ({
              ...createOption(t),
              isDefault: i === 0,
            }));
            if (availTypes.length === 0) {
              f.visible = false;
            }
          }

          return f;
        });
      }

      return sec;
    }),
  }));

  return schema;
}

/* ─── Stats helpers ─── */
export function getServiceStats(services) {
  return {
    total: services.length,
    published: services.filter(s => s.status === 'published').length,
    draft: services.filter(s => s.status === 'draft').length,
    timeBased: services.filter(s => s.bookingType === 'time-based').length,
    packageBased: services.filter(s => s.bookingType === 'package-based').length,
    onDemand: services.filter(s => s.bookingType === 'on-demand').length,
  };
}
