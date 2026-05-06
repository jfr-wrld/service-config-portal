import {
  BOOKING_TYPES, AVAILABILITY_TYPES,
} from '../data/configSchema';
import {
  Timer, Package, Zap, FileText, CalendarClock, CalendarCheck,
  CalendarRange, Plus, Clock, Info, User, MapPin, Globe,
} from 'lucide-react';

const AVAIL_ICONS = {
  CalendarClock, CalendarCheck, CalendarRange,
  Calendar: CalendarClock, // fallback
};

/**
 * Read-only preview of the one-page form a scholar would see.
 * Dynamically rendered based on admin rules.
 */
export default function ScholarFormPreview({ rules }) {
  const bt = BOOKING_TYPES[rules.bookingType];
  const enabledAvail = Object.entries(rules.availabilityTypes)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="scholar-preview">
      <div className="scholar-preview__header">
        <div className="scholar-preview__header-icon">
          <FileText size={18} />
        </div>
        <div>
          <h3 className="scholar-preview__header-title">Scholar Form Preview</h3>
          <p className="scholar-preview__header-desc">
            This is what the scholar will see as a one-page form
          </p>
        </div>
      </div>

      <div className="scholar-preview__form">
        {/* ─── 1. Basic Info ─── */}
        <PreviewSection number={1} title="Basic Info" subtitle="Service identity filled by scholar">
          <PreviewField label="Service Name" required placeholder="e.g. Family Consultation" />
          <PreviewField label="Description" required placeholder="Describe your service..." type="textarea" />
          {rules.rules.locationType !== 'online' && (
            <PreviewField label="Location / Address" placeholder="e.g. Masjid Al-Haram, Makkah" />
          )}
        </PreviewSection>

        {/* ─── 2. Pricing ─── */}
        <PreviewSection number={2} title="Pricing" subtitle={`${bt.label} pricing structure`}>
          {rules.bookingType === 'time-based' && <TimePricingPreview />}
          {rules.bookingType === 'package-based' && <PackagePricingPreview />}
          {rules.bookingType === 'on-demand' && <OnDemandPricingPreview />}
        </PreviewSection>

        {/* ─── 3. Availability ─── */}
        <PreviewSection
          number={3}
          title="Availability"
          subtitle={
            enabledAvail.length === 0
              ? 'Request-based (no fixed schedule)'
              : `${enabledAvail.length} schedule type${enabledAvail.length > 1 ? 's' : ''} enabled`
          }
        >
          {enabledAvail.length === 0 ? (
            <div className="scholar-preview__notice">
              <Zap size={16} />
              <span>On-demand — scholars will receive booking requests directly</span>
            </div>
          ) : (
            <div className="scholar-preview__avail-sections">
              {enabledAvail.map(typeKey => {
                const at = AVAILABILITY_TYPES[typeKey];
                const AvIcon = AVAIL_ICONS[at.icon] || CalendarClock;
                return (
                  <div key={typeKey} className="scholar-preview__avail-block">
                    <div className="scholar-preview__avail-title">
                      <AvIcon size={14} /> {at.label}
                    </div>
                    {typeKey === 'recurring' && <RecurringPreview />}
                    {typeKey === 'specific-dates' && <SpecificDatesPreview />}
                    {typeKey === 'by-month' && <ByMonthPreview />}
                  </div>
                );
              })}
            </div>
          )}
        </PreviewSection>

        {/* ─── 4. Additional ─── */}
        <PreviewSection number={4} title="Additional" subtitle="Optional notes & custom info">
          <PreviewField label="Notes" placeholder="Any additional information..." type="textarea" />
        </PreviewSection>
      </div>
    </div>
  );
}

/* ─── Preview Section Wrapper ─── */
function PreviewSection({ number, title, subtitle, children }) {
  return (
    <div className="scholar-section">
      <div className="scholar-section__header">
        <span className="scholar-section__number">{number}</span>
        <div>
          <h4 className="scholar-section__title">{title}</h4>
          <p className="scholar-section__subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="scholar-section__body">{children}</div>
    </div>
  );
}

/* ─── Preview Field (Disabled) ─── */
function PreviewField({ label, placeholder, required, type = 'text' }) {
  return (
    <div className="scholar-field">
      <label className="scholar-field__label">
        {label} {required && <span className="scholar-field__req">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea className="scholar-field__input scholar-field__textarea" placeholder={placeholder} disabled rows={3} />
      ) : (
        <input className="scholar-field__input" type={type} placeholder={placeholder} disabled />
      )}
    </div>
  );
}

/* ─── Pricing Previews per Booking Type ─── */
function TimePricingPreview() {
  return (
    <div className="scholar-pricing-card">
      <div className="scholar-pricing-card__header">
        <Timer size={14} /> Session Package
      </div>
      <div className="scholar-pricing-card__body">
        <div className="scholar-pricing-card__row">
          <PreviewField label="Session Name" placeholder="e.g. Basic Consultation" required />
          <PreviewField label="Duration" placeholder="60" />
        </div>
        <div className="scholar-pricing-card__row">
          <PreviewField label="Price" placeholder="0" />
          <PreviewField label="Currency" placeholder="MYR (RM)" />
        </div>
      </div>
      <button className="scholar-pricing-card__add" disabled>
        <Plus size={14} /> Add Another Session
      </button>
    </div>
  );
}

function PackagePricingPreview() {
  return (
    <div className="scholar-pricing-card">
      <div className="scholar-pricing-card__header">
        <Package size={14} /> Service Package
      </div>
      <div className="scholar-pricing-card__body">
        <div className="scholar-pricing-card__row">
          <PreviewField label="Package Name" placeholder="e.g. Umrah Standard" required />
          <PreviewField label="Tier" placeholder="Standard" />
        </div>
        <div className="scholar-pricing-card__row">
          <PreviewField label="Duration (Days)" placeholder="7" />
          <PreviewField label="Price" placeholder="0" />
        </div>
        <PreviewField label="What's Included" placeholder="List inclusions..." type="textarea" />
      </div>
      <button className="scholar-pricing-card__add" disabled>
        <Plus size={14} /> Add Another Package
      </button>
    </div>
  );
}

function OnDemandPricingPreview() {
  return (
    <div className="scholar-pricing-card">
      <div className="scholar-pricing-card__header">
        <Zap size={14} /> Event Pricing
      </div>
      <div className="scholar-pricing-card__body">
        <div className="scholar-pricing-card__row">
          <PreviewField label="Event Type" placeholder="e.g. Friday Prayer, Nikah" />
          <PreviewField label="Pricing Model" placeholder="Fixed / Quote" />
        </div>
        <PreviewField label="Base Price (if fixed)" placeholder="0" />
        <PreviewField label="Special Requirements" placeholder="Custom notes from client..." type="textarea" />
      </div>
    </div>
  );
}

/* ─── Availability Previews ─── */
function RecurringPreview() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="scholar-avail-recurring">
      {days.map(d => (
        <div key={d} className="scholar-avail-day">
          <span className="scholar-avail-day__name">{d}</span>
          <div className="scholar-avail-day__slots">
            <span className="scholar-avail-day__slot">
              <Clock size={11} /> 09:00 — 17:00
            </span>
          </div>
          <button className="scholar-avail-day__add" disabled>
            <Plus size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}

function SpecificDatesPreview() {
  return (
    <div className="scholar-avail-dates">
      <div className="scholar-avail-dates__calendar">
        <CalendarCheck size={24} style={{ opacity: 0.3 }} />
        <span>Date picker will appear here</span>
      </div>
    </div>
  );
}

function ByMonthPreview() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div className="scholar-avail-months">
      {months.map(m => (
        <button key={m} className="scholar-avail-month" disabled>{m}</button>
      ))}
    </div>
  );
}
