import { v4 as uuidv4 } from 'uuid';

/* ─── Field Type Definitions ─── */
export const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: 'Type' },
  { value: 'textarea', label: 'Textarea', icon: 'AlignLeft' },
  { value: 'number', label: 'Number', icon: 'Hash' },
  { value: 'dropdown', label: 'Dropdown', icon: 'ChevronDown' },
  { value: 'multiselect', label: 'Multi-select', icon: 'ListChecks' },
  { value: 'radio', label: 'Radio', icon: 'Circle' },
  { value: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' },
  { value: 'date', label: 'Date', icon: 'Calendar' },
  { value: 'time', label: 'Time', icon: 'Clock' },
  { value: 'toggle', label: 'Toggle', icon: 'ToggleLeft' },
];

/* ─── Service Types → Booking Type Mapping ─── */
export const SERVICE_TYPES = [
  // Time-based services
  { value: 'consultation', label: 'Consultation', bookingType: 'time-based', icon: 'MessageSquare' },
  { value: 'ruqyah', label: 'Ruqyah', bookingType: 'time-based', icon: 'Heart' },
  { value: 'syariah-advisory', label: 'Syariah Advisory', bookingType: 'time-based', icon: 'Scale' },

  // Package-based services
  { value: 'mutawwif', label: 'Mutawwif', bookingType: 'package-based', icon: 'Map' },

  // On-demand services
  { value: 'imam', label: 'Imam', bookingType: 'on-demand', icon: 'Star' },
  { value: 'speaker', label: 'Speaker', bookingType: 'on-demand', icon: 'Mic' },
];

/* ─── Booking Type Definitions ─── */
export const BOOKING_TYPES = [
  { value: 'time-based', label: 'Time-based', description: 'Session with duration & time slots', services: ['consultation', 'ruqyah', 'syariah-advisory'] },
  { value: 'package-based', label: 'Package-based', description: 'Fixed package pricing', services: ['mutawwif'] },
  { value: 'on-demand', label: 'On-demand', description: 'Flexible request-based booking', services: ['imam', 'speaker'] },
];

/* ─── Condition Types ─── */
export const CONDITION_TYPES = {
  SERVICE_TYPE: {
    key: 'serviceType',
    label: 'Service Type',
    options: [
      { value: 'consultation', label: 'Consultation' },
      { value: 'ruqyah', label: 'Ruqyah' },
      { value: 'syariah-advisory', label: 'Syariah Advisory' },
      { value: 'mutawwif', label: 'Mutawwif' },
      { value: 'imam', label: 'Imam' },
      { value: 'speaker', label: 'Speaker' },
    ],
  },
  BOOKING_TYPE: {
    key: 'bookingType',
    label: 'Booking Type',
    options: [
      { value: 'time-based', label: 'Time-based' },
      { value: 'package-based', label: 'Package-based' },
      { value: 'on-demand', label: 'On-demand' },
    ],
  },
  AVAILABILITY_TYPE: {
    key: 'availabilityType',
    label: 'Availability Type',
    options: [
      { value: 'recurring', label: 'Recurring' },
      { value: 'by-month', label: 'By Month' },
      { value: 'specific-dates', label: 'Specific Dates' },
    ],
  },
  LOCATION_TYPE: {
    key: 'locationType',
    label: 'Location Type',
    options: [
      { value: 'online', label: 'Online' },
      { value: 'offline', label: 'Offline' },
    ],
  },
  BOOKING_MODE: {
    key: 'bookingMode',
    label: 'Booking Mode',
    options: [
      { value: 'instant', label: 'Instant' },
      { value: 'request', label: 'Request' },
      { value: 'both', label: 'Both' },
    ],
  },
};

/* ─── Helper to create a field ─── */
export function createField(overrides = {}) {
  return {
    id: uuidv4(),
    label: 'New Field',
    type: 'text',
    required: false,
    visible: true,
    locked: false,
    placeholder: '',
    helpText: '',
    options: [],        // for dropdown/radio/multiselect
    defaultValue: '',
    conditions: [],     // visibility rules
    ...overrides,
  };
}

/* ─── Helper to create an option ─── */
export function createOption(label = 'Option') {
  return {
    id: uuidv4(),
    label,
    value: label.toLowerCase().replace(/\s+/g, '-'),
    isDefault: false,
  };
}

/* ─── Default Form Schema ─── */
export function getDefaultSchema() {
  return {
    id: uuidv4(),
    name: 'Default Service Form',
    description: 'Standard form configuration for service creation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      /* ── Step 1: Service Setup ── */
      {
        id: 'step-service-setup',
        order: 1,
        name: 'Service Setup',
        icon: 'Settings',
        locked: true,
        sections: [
          {
            id: 'sec-basic-info',
            name: 'Basic Information',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({ label: 'Service Name', type: 'text', required: true, locked: true }),
              createField({
                label: 'Service Type', type: 'dropdown', required: true, locked: true,
                helpText: 'Service type determines the booking model automatically',
                options: [
                  createOption('Consultation'),
                  createOption('Ruqyah'),
                  createOption('Syariah Advisory'),
                  createOption('Mutawwif'),
                  createOption('Imam'),
                  createOption('Speaker'),
                ],
              }),
              createField({
                label: 'Booking Type', type: 'text', required: true, locked: true,
                helpText: 'Auto-determined by Service Type (Time-based / Package-based / On-demand)',
                placeholder: 'Automatically set based on Service Type',
              }),
              createField({ label: 'Description', type: 'textarea', required: true, locked: true }),
              createField({
                label: 'Location Type', type: 'radio', required: true, locked: true,
                helpText: 'Where the service takes place',
                options: [
                  createOption('Online'),
                  createOption('Offline'),
                  createOption('Both'),
                ],
              }),
              createField({
                label: 'Target Countries', type: 'multiselect', required: true, locked: true,
                helpText: 'Select which countries this service is available in',
                placeholder: 'Select countries',
                options: [
                  createOption('Indonesia'),
                  createOption('Malaysia'),
                  createOption('Saudi Arabia'),
                  createOption('United Arab Emirates'),
                  createOption('Singapore'),
                  createOption('Brunei'),
                  createOption('Turkey'),
                  createOption('United Kingdom'),
                  createOption('United States'),
                  createOption('Australia'),
                ],
              }),
              createField({
                label: 'Languages', type: 'multiselect', required: true, locked: true,
                helpText: 'Languages the scholar offers this service in',
                placeholder: 'Select languages',
                options: [
                  createOption('English'),
                  createOption('Arabic'),
                  createOption('Bahasa Indonesia'),
                  createOption('Bahasa Melayu'),
                  createOption('Turkish'),
                  createOption('Urdu'),
                  createOption('French'),
                ],
              }),
              createField({
                label: 'Gender', type: 'radio', required: true, locked: true,
                helpText: 'Gender preference for the service (who can book)',
                options: [
                  createOption('Male'),
                  createOption('Female'),
                  { ...createOption('Both'), isDefault: true },
                ],
              }),
              createField({
                label: 'Age Range', type: 'dropdown', required: false, locked: false,
                helpText: 'Target age group for this service',
                placeholder: 'Select age range',
                options: [
                  { ...createOption('All Ages'), isDefault: true },
                  createOption('Children (5-12)'),
                  createOption('Teenagers (13-17)'),
                  createOption('Adults (18-45)'),
                  createOption('Seniors (45+)'),
                ],
              }),
              createField({ label: 'Tags', type: 'multiselect', required: false, locked: false }),
            ],
          },
          {
            id: 'sec-whats-included',
            name: "What's Included",
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Inclusions', type: 'textarea', required: false, locked: false, placeholder: 'List what is included in this service...' }),
              createField({ label: 'Exclusions', type: 'textarea', required: false, locked: false, placeholder: 'List what is not included...' }),
            ],
          },

          /* ─── Booking Mode ─── */
          {
            id: 'sec-booking-mode',
            name: 'Booking Mode',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Booking Mode', type: 'radio', required: true, locked: true,
                helpText: 'How users book this service',
                options: [
                  { ...createOption('Instant Booking'), isDefault: true, description: 'Confirmations are automatic.' },
                  { ...createOption('Request to Book'), description: 'Review every guest request.' },
                  { ...createOption('Both'), description: 'Offer both options to guests.' },
                ],
              }),
            ],
          },

          /* ─── Request Settings (only for Request / Both) ─── */
          {
            id: 'sec-request-settings',
            name: 'Request Settings',
            locked: true,
            mandatory: false,
            visible: true,
            conditions: [{ type: 'bookingMode', operator: 'in', value: ['request-to-book', 'both'] }],
            fields: [
              createField({
                label: 'Approval Type', type: 'dropdown', required: true, locked: true,
                helpText: 'How booking requests are reviewed',
                options: [
                  { ...createOption('Manual'), isDefault: true },
                  createOption('Semi-automatic'),
                  createOption('Auto with Criteria'),
                ],
              }),
              createField({
                label: 'Response SLA (Hour)', type: 'number', required: true, locked: true,
                helpText: 'Maximum time to respond to a booking request',
                defaultValue: '6',
                placeholder: '6',
              }),
              createField({
                label: 'Request Expiry (Hour)', type: 'number', required: true, locked: true,
                helpText: 'Request auto-expires if not responded within this time',
                defaultValue: '24',
                placeholder: '24',
              }),
              createField({
                label: 'Auto Approval (Criteria-based)', type: 'toggle', required: false, locked: false,
                helpText: 'Automatically approve requests that meet predefined criteria',
                defaultValue: false,
              }),
            ],
          },

          /* ─── Booking Rules ─── */
          {
            id: 'sec-booking-rules',
            name: 'Booking Rules',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Allow Same-Day Booking', type: 'toggle', required: false, locked: false,
                helpText: 'Accept bookings within 24h.',
                defaultValue: false,
              }),
              createField({
                label: 'Allow Custom Time Request', type: 'toggle', required: false, locked: false,
                helpText: 'Clients can suggest hours.',
                defaultValue: false,
              }),
              createField({
                label: 'Auto-confirm After Payment', type: 'toggle', required: false, locked: false,
                helpText: 'Skip manual review for paid dates.',
                defaultValue: true,
              }),
              createField({
                label: 'Max Participants', type: 'number', required: false, locked: false,
                helpText: 'Maximum number of participants per session (leave empty for unlimited)',
              }),
            ],
          },

          /* ─── Flexibility ─── */
          {
            id: 'sec-flexibility',
            name: 'Flexibility',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Allow Reschedule', type: 'toggle', required: false, locked: false,
                helpText: 'Allow clients to reschedule their booking',
                defaultValue: true,
              }),
              createField({
                label: 'Reschedule Window (Hours Before)', type: 'number', required: false, locked: false,
                helpText: 'Minimum hours before the session to allow rescheduling',
                defaultValue: '24',
                placeholder: '24',
              }),
              createField({
                label: 'Allow Cancellation', type: 'toggle', required: false, locked: false,
                helpText: 'Allow clients to cancel their booking',
                defaultValue: true,
              }),
              createField({
                label: 'Cancellation Window (Hours Before)', type: 'number', required: false, locked: false,
                helpText: 'Minimum hours before the session to allow cancellation',
                defaultValue: '48',
                placeholder: '48',
              }),
              createField({
                label: 'Cancellation Policy', type: 'textarea', required: false, locked: false,
                helpText: 'Custom cancellation policy text shown to clients',
                placeholder: 'Describe your cancellation policy...',
              }),
            ],
          },
        ],
      },

      /* ── Step 2: Pricing & Packages ── */
      {
        id: 'step-pricing',
        order: 2,
        name: 'Pricing',
        icon: 'DollarSign',
        locked: true,
        sections: [
          /* ─── Pricing Model (Global) ─── */
          {
            id: 'sec-pricing-model',
            name: 'Pricing Model',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Detected Booking Type', type: 'text', required: true, locked: true,
                helpText: 'Auto-set by Service Type selection',
                placeholder: 'Determined by Service Type',
              }),
            ],
          },

          /* ─── Event Type Configuration ─── */
          {
            id: 'sec-event-type-config',
            name: 'Event Type Configuration',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Has Event Types', type: 'toggle', required: false, locked: true,
                helpText: 'Enable if this service has multiple event categories',
                defaultValue: true,
              }),
              createField({
                label: 'Event Types', type: 'multiselect', required: true, locked: true,
                helpText: 'List of event categories — each can have its own packages',
                placeholder: 'Configured per service type',
                options: [],
              }),
              createField({
                label: 'Duration Range', type: 'text', required: false, locked: false,
                helpText: 'Duration range displayed (e.g. "60-480 min", "Per trip")',
                placeholder: 'e.g. 60-480 min',
              }),
            ],
          },

          /* ─── Package Info ─── */
          {
            id: 'sec-package-info',
            name: 'Package Info',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Package Name', type: 'text', required: true, locked: true,
                helpText: 'Name of the package',
                placeholder: 'e.g. Pre-Trip Consultation',
              }),
              createField({
                label: 'Package Type', type: 'dropdown', required: false, locked: false,
                helpText: 'Optional badge/tier label for the package',
                options: [
                  createOption('Basic'),
                  createOption('Standard'),
                  createOption('Most Popular'),
                  createOption('Best Value'),
                  createOption('Recommended'),
                  createOption('Peak Time'),
                  createOption('Premium'),
                  createOption('VIP'),
                ],
              }),
              createField({
                label: 'Package Description', type: 'textarea', required: true, locked: true,
                helpText: 'Short description of what the package includes',
                placeholder: 'Describe what this package offers...',
              }),
            ],
          },

          /* ─── Package Capacity ─── */
          {
            id: 'sec-package-capacity',
            name: 'Package Capacity',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Participant Type', type: 'radio', required: true, locked: true,
                helpText: 'Is this package for an individual or a group?',
                options: [
                  { ...createOption('Personal'), isDefault: true },
                  createOption('Group'),
                ],
              }),
              createField({
                label: 'Max Quota', type: 'number', required: true, locked: true,
                helpText: 'Maximum participants (shows as "Max Quota/Group" for group type)',
                defaultValue: '1',
                placeholder: '1',
              }),
            ],
          },

          /* ─── Package Pricing Config ─── */
          {
            id: 'sec-package-pricing',
            name: 'Package Pricing',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Pricing Model', type: 'dropdown', required: true, locked: true,
                helpText: 'How pricing is calculated for this package',
                options: [
                  { ...createOption('Per Session'), isDefault: true },
                  createOption('Per Event'),
                  createOption('Per Trip'),
                  createOption('Per Day'),
                  createOption('Per Pax'),
                ],
              }),
              createField({
                label: 'Duration Type', type: 'dropdown', required: true, locked: true,
                helpText: 'Unit for measuring duration of this package',
                options: [
                  { ...createOption('Minute'), isDefault: true },
                  createOption('Hour'),
                  createOption('Day'),
                  createOption('Month'),
                ],
              }),
            ],
          },

          /* ─── Package Payment ─── */
          {
            id: 'sec-package-payment',
            name: 'Pricing & Payment',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Currency', type: 'multiselect', required: true, locked: true,
                helpText: 'Supported currencies for this package (multi-currency support)',
                options: [
                  { ...createOption('MYR (RM)'), isDefault: true },
                  createOption('USD ($)'),
                  createOption('SAR (﷼)'),
                  createOption('IDR (Rp)'),
                  createOption('SGD (S$)'),
                  createOption('GBP (£)'),
                ],
              }),
              createField({
                label: 'Apply Tax Rate', type: 'toggle', required: false, locked: false,
                helpText: 'Enable tax calculation on pricing',
                defaultValue: true,
              }),
              createField({
                label: 'Tax Rate (%)', type: 'number', required: false, locked: false,
                helpText: 'Tax percentage applied (e.g. SST 6%)',
                defaultValue: '6',
                placeholder: '6',
                conditions: [{ type: 'fieldValue', field: 'apply-tax-rate', operator: 'equals', value: true }],
              }),
              createField({
                label: 'Duration Value', type: 'number', required: true, locked: true,
                helpText: 'Duration for this tier (in the selected duration type unit)',
                placeholder: '60',
              }),
              createField({
                label: 'Total Sessions', type: 'number', required: false, locked: false,
                helpText: 'Number of sessions included in this duration tier',
                placeholder: '1',
                conditions: [{ type: 'bookingType', operator: 'equals', value: 'time-based' }],
              }),
              createField({
                label: 'Price', type: 'number', required: true, locked: true,
                helpText: 'Price for this duration tier',
                placeholder: '0',
              }),
              createField({
                label: 'One-Time', type: 'toggle', required: false, locked: false,
                helpText: 'Is this a one-time payment or recurring?',
                defaultValue: true,
              }),
            ],
          },

          /* ─── Package Add-ons ─── */
          {
            id: 'sec-package-addons',
            name: 'Add-ons (Optional)',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Add-on Name', type: 'text', required: true, locked: true,
                helpText: 'Name of the add-on service',
                placeholder: 'e.g. Extra Consultation Hour',
              }),
              createField({
                label: 'Add-on Pricing Model', type: 'dropdown', required: true, locked: true,
                helpText: 'How this add-on is priced',
                options: [
                  { ...createOption('Per Session'), isDefault: true },
                  createOption('Per Event'),
                  createOption('Per Trip'),
                  createOption('Per Pax'),
                  createOption('Flat Fee'),
                ],
              }),
              createField({
                label: 'Add-on Price', type: 'number', required: true, locked: true,
                helpText: 'Price of the add-on',
                placeholder: '0',
              }),
              createField({
                label: 'Max Quantity', type: 'number', required: false, locked: false,
                helpText: 'Maximum quantity available per booking (0 = unlimited)',
                defaultValue: '0',
                placeholder: '0',
              }),
              createField({
                label: 'Delivery Format', type: 'radio', required: true, locked: false,
                helpText: 'How the add-on is delivered',
                options: [
                  { ...createOption('Online'), isDefault: true },
                  createOption('Physical'),
                  createOption('Both'),
                ],
              }),
              createField({
                label: 'Add-on Status', type: 'dropdown', required: true, locked: false,
                helpText: 'Current status of this add-on',
                options: [
                  { ...createOption('Active'), isDefault: true },
                  createOption('Inactive'),
                  createOption('Draft'),
                ],
              }),
              createField({
                label: 'Mandatory', type: 'toggle', required: false, locked: false,
                helpText: 'Auto-added to every booking (cannot be removed by client)',
                defaultValue: false,
              }),
            ],
          },
        ],
      },

      /* ── Step 3: Promo & Discount ── */
      {
        id: 'step-promo',
        order: 3,
        name: 'Promo & Discount',
        icon: 'Percent',
        locked: true,
        sections: [
          {
            id: 'sec-promo-basic',
            name: 'Basic Info',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Promo Name', type: 'text', required: false, locked: false }),
              createField({ label: 'Promo Code', type: 'text', required: false, locked: false }),
            ],
          },
          {
            id: 'sec-promo-discount',
            name: 'Discount',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Discount Type', type: 'radio', required: false, locked: false,
                options: [createOption('Percentage'), createOption('Fixed Amount')],
              }),
              createField({ label: 'Discount Value', type: 'number', required: false, locked: false }),
            ],
          },
          {
            id: 'sec-promo-usage',
            name: 'Usage',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Max Usage', type: 'number', required: false, locked: false }),
              createField({ label: 'Per User Limit', type: 'number', required: false, locked: false }),
            ],
          },
          {
            id: 'sec-promo-validity',
            name: 'Validity',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Start Date', type: 'date', required: false, locked: false }),
              createField({ label: 'End Date', type: 'date', required: false, locked: false }),
            ],
          },
          {
            id: 'sec-promo-advanced',
            name: 'Advanced',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Minimum Order', type: 'number', required: false, locked: false }),
              createField({ label: 'Stackable', type: 'toggle', required: false, locked: false }),
            ],
          },
        ],
      },

      /* ── Step 4: Coverage Area ── */
      {
        id: 'step-coverage',
        order: 4,
        name: 'Coverage Area',
        icon: 'MapPin',
        locked: true,
        sections: [
          {
            id: 'sec-coverage',
            name: 'Coverage Area',
            locked: true,
            mandatory: false,
            visible: true,
            conditions: [{ type: 'locationType', operator: 'equals', value: 'offline' }],
            fields: [
              createField({
                label: 'Country', type: 'dropdown', required: true, locked: true,
                options: [createOption('Indonesia'), createOption('Malaysia'), createOption('Saudi Arabia')],
              }),
              createField({ label: 'State / Province', type: 'dropdown', required: true, locked: true, options: [] }),
              createField({ label: 'District / City', type: 'dropdown', required: false, locked: true, options: [] }),
              createField({ label: 'Travel Fee', type: 'toggle', required: false, locked: false }),
              createField({
                label: 'Travel Fee Amount', type: 'number', required: false, locked: false,
                conditions: [{ type: 'locationType', operator: 'equals', value: 'offline' }],
              }),
            ],
          },
        ],
      },

      /* ── Step 5: Availability & Schedule (Admin Field Configurator) ── */
      {
        id: 'step-availability',
        order: 5,
        name: 'Availability & Schedule',
        icon: 'CalendarDays',
        locked: true,
        sections: [
          /* ─── 5A. Default Availability (Core Control) ─── */
          {
            id: 'sec-default-availability',
            name: 'Default Availability',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Enable Default Availability', type: 'toggle', required: true, locked: true,
                helpText: 'Master toggle — if OFF, scholar cannot set default availability',
              }),
              createField({
                label: 'Availability Type', type: 'radio', required: true, locked: true,
                helpText: 'Which availability modes are offered to scholars',
                options: [
                  { ...createOption('Recurring'), isDefault: true },
                  createOption('By Month'),
                  createOption('Specific Dates'),
                ],
              }),
              createField({
                label: 'Default Availability Type', type: 'dropdown', required: true, locked: true,
                helpText: 'Pre-selected availability type when scholar opens the form',
                options: [
                  { ...createOption('Recurring'), isDefault: true },
                  createOption('By Month'),
                  createOption('Specific Dates'),
                ],
              }),
            ],
          },

          /* ─── 5B. Time Rules Fields ─── */
          {
            id: 'sec-time-rules',
            name: 'Time Rules',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Buffer Before', type: 'dropdown', required: false, locked: false,
                helpText: 'Minimum time before a session starts',
                options: [
                  createOption('None'), createOption('15 minutes'), createOption('30 minutes'),
                  createOption('60 minutes'), createOption('2 hours'), createOption('3 hours'),
                ],
              }),
              createField({
                label: 'Buffer After', type: 'dropdown', required: false, locked: false,
                helpText: 'Minimum cooldown time after a session ends',
                options: [
                  createOption('None'), createOption('15 minutes'), createOption('30 minutes'),
                  createOption('60 minutes'), createOption('2 hours'), createOption('3 hours'),
                ],
              }),
              createField({
                label: 'Max Booking per Day', type: 'number', required: false, locked: false,
                helpText: 'Limit how many bookings a scholar can accept per day',
              }),
              createField({
                label: 'Lead Time (Hour)', type: 'number', required: false, locked: false,
                helpText: 'Minimum advance notice required before booking',
              }),
              createField({
                label: 'Allow Same-day Booking', type: 'toggle', required: false, locked: false,
                helpText: 'Enable/disable same-day booking for scholars',
              }),
            ],
          },

          /* ─── 5C. Time Format ─── */
          {
            id: 'sec-time-format',
            name: 'Time Format',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({
                label: 'Time Format', type: 'radio', required: false, locked: false,
                helpText: 'Display format for time inputs in scholar view',
                options: [
                  { ...createOption('12 Hour'), isDefault: true },
                  createOption('24 Hour'),
                ],
              }),
            ],
          },

          /* ─── 5D. Weekly Slot Config (Recurring Only) ─── */
          {
            id: 'sec-weekly-slot-config',
            name: 'Weekly Slot Config',
            locked: true,
            mandatory: true,
            visible: true,
            conditions: [{ type: 'availabilityType', operator: 'equals', value: 'recurring' }],
            fields: [
              createField({
                label: 'Day Selector (Mon–Sun)', type: 'checkbox', required: true, locked: true,
                helpText: 'Scholar selects which days are available — always visible for Recurring',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'recurring' }],
              }),
              createField({
                label: 'Start Time', type: 'text', required: true, locked: true,
                helpText: 'Time slot start — core field for recurring slots',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'recurring' }],
              }),
              createField({
                label: 'End Time', type: 'text', required: true, locked: true,
                helpText: 'Time slot end — core field for recurring slots',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'recurring' }],
              }),
              createField({
                label: 'Multi-slot per Day', type: 'toggle', required: false, locked: false,
                helpText: 'Allow scholars to add multiple time slots per day',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'recurring' }],
              }),
              createField({
                label: 'Default Day Enabled', type: 'toggle', required: false, locked: false,
                helpText: 'Pre-check all weekdays by default in scholar view',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'recurring' }],
              }),
            ],
          },

          /* ─── 5E. Month Picker Config (By Month Only) ─── */
          {
            id: 'sec-month-picker-config',
            name: 'Month Picker Config',
            locked: true,
            mandatory: true,
            visible: true,
            conditions: [{ type: 'availabilityType', operator: 'equals', value: 'by-month' }],
            fields: [
              createField({
                label: 'Month Selector', type: 'multiselect', required: true, locked: true,
                helpText: 'Scholar picks available months — core field for By Month',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'by-month' }],
              }),
              createField({
                label: 'Year Selector', type: 'dropdown', required: false, locked: false,
                helpText: 'Toggle visibility of year navigation',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'by-month' }],
              }),
              createField({
                label: 'Multi-select Months', type: 'toggle', required: false, locked: false,
                helpText: 'Allow selecting multiple months at once',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'by-month' }],
              }),
              createField({
                label: 'Select All Option', type: 'toggle', required: false, locked: false,
                helpText: 'Show "Select All Available Months" checkbox',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'by-month' }],
              }),
            ],
          },

          /* ─── 5F. Date Picker Config (Specific Dates Only) ─── */
          {
            id: 'sec-date-picker-config',
            name: 'Date Picker Config',
            locked: true,
            mandatory: true,
            visible: true,
            conditions: [{ type: 'availabilityType', operator: 'equals', value: 'specific-dates' }],
            fields: [
              createField({
                label: 'Calendar Picker', type: 'date', required: true, locked: true,
                helpText: 'Scholar selects specific available dates — core field',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'specific-dates' }],
              }),
              createField({
                label: 'Multi-date Selection', type: 'toggle', required: false, locked: false,
                helpText: 'Allow selecting multiple dates at once',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'specific-dates' }],
              }),
              createField({
                label: 'Select All Dates', type: 'toggle', required: false, locked: false,
                helpText: 'Show "Select All Dates" option in calendar',
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'specific-dates' }],
              }),
              createField({
                label: 'Season / Period', type: 'dropdown', required: false, locked: false,
                helpText: 'Platform-defined season selector (e.g. Hajj 1447H, Ramadan)',
                options: [
                  createOption('Hajj Season'), createOption('Umrah Season'),
                  createOption('Ramadan'), createOption('Custom Period'),
                ],
                conditions: [{ type: 'availabilityType', operator: 'equals', value: 'specific-dates' }],
              }),
            ],
          },

          /* ─── 5G. Package Availability (Override Control) ─── */
          {
            id: 'sec-package-availability',
            name: 'Package Availability',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({
                label: 'Enable Package Override', type: 'toggle', required: true, locked: true,
                helpText: 'Allow per-package availability override (if OFF, all packages use default)',
              }),
              createField({
                label: 'Use Default Availability', type: 'toggle', required: false, locked: true,
                helpText: 'Default behavior for new packages — use global availability',
              }),
              createField({
                label: 'Allow Recurring Override', type: 'toggle', required: false, locked: false,
                helpText: 'Enable Recurring as an override option for packages',
              }),
              createField({
                label: 'Allow By Month Override', type: 'toggle', required: false, locked: false,
                helpText: 'Enable By Month as an override option for packages',
              }),
              createField({
                label: 'Allow Specific Dates Override', type: 'toggle', required: false, locked: false,
                helpText: 'Enable Specific Dates as an override option for packages',
              }),
            ],
          },
        ],
      },

      /* ── Step 6: Media ── */
      {
        id: 'step-media',
        order: 6,
        name: 'Media',
        icon: 'Image',
        locked: true,
        sections: [
          {
            id: 'sec-thumbnail',
            name: 'Thumbnail',
            locked: true,
            mandatory: true,
            visible: true,
            fields: [
              createField({ label: 'Service Thumbnail', type: 'text', required: true, locked: true, placeholder: 'Upload thumbnail image' }),
            ],
          },
          {
            id: 'sec-gallery',
            name: 'Gallery',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Gallery Images', type: 'text', required: false, locked: false, placeholder: 'Upload gallery images' }),
            ],
          },
          {
            id: 'sec-video',
            name: 'Video',
            locked: true,
            mandatory: false,
            visible: true,
            fields: [
              createField({ label: 'Video URL', type: 'text', required: false, locked: false, placeholder: 'Enter video URL' }),
            ],
          },
        ],
      },
    ],
  };
}

/* ─── Preset Templates ─── */
export const PRESET_TEMPLATES = [
  {
    id: 'template-consultation',
    name: 'Consultation',
    description: 'Time-based booking for Consultation, Ruqyah, Syariah Advisory',
    icon: 'MessageSquare',
    color: '#0d9488',
    bookingType: 'time-based',
    serviceTypes: ['consultation', 'ruqyah', 'syariah-advisory'],
  },
  {
    id: 'template-mutawwif',
    name: 'Mutawwif',
    description: 'Package-based booking for Mutawwif pilgrimage guide services',
    icon: 'Map',
    color: '#f59e0b',
    bookingType: 'package-based',
    serviceTypes: ['mutawwif'],
  },
  {
    id: 'template-ondemand',
    name: 'On-demand',
    description: 'Flexible request-based booking for Imam & Speaker',
    icon: 'Zap',
    color: '#10b981',
    bookingType: 'on-demand',
    serviceTypes: ['imam', 'speaker'],
  },
];
