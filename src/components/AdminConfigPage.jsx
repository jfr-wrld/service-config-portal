import { useServiceConfig } from '../context/ServiceConfigContext';
import {
  BOOKING_TYPES, AVAILABILITY_TYPES, AVAILABILITY_BY_BOOKING_TYPE,
} from '../data/configSchema';
import {
  Timer, Package, Zap, Info, CalendarClock, CalendarCheck, CalendarRange,
  Shield, MapPin, Users, ArrowRight, Check, X, Sparkles, Eye,
} from 'lucide-react';
import ScholarFormPreview from './ScholarFormPreview';
import { useState } from 'react';

const AVAIL_ICONS = { CalendarClock, CalendarCheck, CalendarRange };
const BT_ICONS = { Timer, Package, Zap };

export default function AdminConfigPage() {
  const { rules, toggleAvailabilityType, updateBookingRules } = useServiceConfig();
  const [showPreview, setShowPreview] = useState(false);

  if (!rules) return null;

  const bt = BOOKING_TYPES[rules.bookingType];
  const BtIcon = BT_ICONS[bt.icon] || Timer;
  const allowedAvail = AVAILABILITY_BY_BOOKING_TYPE[rules.bookingType] || [];
  const isOnDemand = rules.bookingType === 'on-demand';
  const enabledCount = Object.values(rules.availabilityTypes).filter(Boolean).length;

  return (
    <div className="admin-page">
      {/* ─── Service Identity ─── */}
      <div className="admin-identity animate-fade-in">
        <div className="admin-identity__icon" style={{ background: `${rules.serviceColor}12`, color: rules.serviceColor }}>
          <BtIcon size={28} />
        </div>
        <div className="admin-identity__info">
          <h2 className="admin-identity__name">{rules.serviceName}</h2>
          <p className="admin-identity__desc">{rules.serviceDescription || 'No description'}</p>
        </div>
        <div className="admin-identity__meta">
          <span className="admin-identity__tag" style={{ background: `${bt.color}12`, color: bt.color, borderColor: `${bt.color}30` }}>
            <BtIcon size={12} /> {bt.label}
          </span>
          <span className={`admin-identity__status admin-identity__status--${rules.serviceStatus}`}>
            {rules.serviceStatus}
          </span>
        </div>
      </div>

      {/* ─── Section: Booking Type (Read-only) ─── */}
      <div className="admin-section animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <div className="admin-section__header">
          <div className="admin-section__header-left">
            <div className="admin-section__icon" style={{ background: `${bt.color}12`, color: bt.color }}>
              <BtIcon size={18} />
            </div>
            <div>
              <h3 className="admin-section__title">Booking Type</h3>
              <p className="admin-section__subtitle">{bt.label} — {bt.description}</p>
            </div>
          </div>
          <span className="admin-section__badge admin-section__badge--locked">
            <Shield size={11} /> Set at creation
          </span>
        </div>
        <div className="admin-section__body">
          <div className="admin-pricing-preview">
            <div className="admin-pricing-preview__header">
              <Info size={14} />
              <span>Scholar pricing form will include:</span>
            </div>
            <div className="admin-pricing-preview__fields">
              {bt.pricingFields.map(f => (
                <span key={f} className="admin-pricing-preview__field">
                  <ArrowRight size={11} /> {f}
                </span>
              ))}
            </div>
            <p className="admin-pricing-preview__hint">{bt.pricingHint}</p>
          </div>
        </div>
      </div>

      {/* ─── Section: Availability Types ─── */}
      <div className="admin-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="admin-section__header">
          <div className="admin-section__header-left">
            <div className="admin-section__icon" style={{ background: '#6366f112', color: '#6366f1' }}>
              <CalendarClock size={18} />
            </div>
            <div>
              <h3 className="admin-section__title">Availability Types</h3>
              <p className="admin-section__subtitle">
                {isOnDemand
                  ? 'On-demand services use request-based availability'
                  : `Toggle which schedule types scholars can use (${enabledCount} active)`
                }
              </p>
            </div>
          </div>
        </div>
        <div className="admin-section__body">
          {isOnDemand ? (
            <div className="admin-notice admin-notice--info">
              <Zap size={16} />
              <div>
                <strong>No schedule required</strong>
                <p>On-demand services are request-based. Scholars receive booking requests and respond manually.</p>
              </div>
            </div>
          ) : (
            <div className="admin-avail-grid">
              {allowedAvail.map(typeKey => {
                const at = AVAILABILITY_TYPES[typeKey];
                const AvIcon = AVAIL_ICONS[at.icon] || CalendarClock;
                const enabled = rules.availabilityTypes[typeKey] || false;

                return (
                  <div
                    key={typeKey}
                    className={`admin-avail-card ${enabled ? 'admin-avail-card--on' : ''}`}
                  >
                    <div className="admin-avail-card__top">
                      <div className="admin-avail-card__icon">
                        <AvIcon size={20} />
                      </div>
                      <button
                        className={`admin-toggle ${enabled ? 'admin-toggle--on' : ''}`}
                        onClick={() => toggleAvailabilityType(typeKey)}
                        aria-label={`Toggle ${at.label}`}
                      >
                        <div className="admin-toggle__track">
                          <div className="admin-toggle__thumb" />
                        </div>
                      </button>
                    </div>
                    <h4 className="admin-avail-card__name">{at.label}</h4>
                    <p className="admin-avail-card__desc">{at.description}</p>
                    {enabled && (
                      <div className="admin-avail-card__fields">
                        <span className="admin-avail-card__fields-label">Scholar will configure:</span>
                        {at.scholarFields.map(f => (
                          <span key={f} className="admin-avail-card__field-tag">
                            <Check size={10} /> {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Section: Booking Rules ─── */}
      <div className="admin-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="admin-section__header">
          <div className="admin-section__header-left">
            <div className="admin-section__icon" style={{ background: '#f9731612', color: '#f97316' }}>
              <Shield size={18} />
            </div>
            <div>
              <h3 className="admin-section__title">Booking Rules</h3>
              <p className="admin-section__subtitle">Operational policies applied to this service</p>
            </div>
          </div>
        </div>
        <div className="admin-section__body">
          {/* Booking Mode */}
          <div className="admin-rules__group">
            <label className="admin-rules__label">Booking Mode</label>
            <div className="admin-rules__options">
              {[
                { value: 'instant-booking', label: 'Instant Booking', desc: 'Auto-confirmed' },
                { value: 'request-to-book', label: 'Request to Book', desc: 'Manual review' },
                { value: 'both', label: 'Both', desc: 'Scholar chooses' },
              ].map(opt => (
                <button
                  key={opt.value}
                  className={`admin-rules__option ${rules.rules.bookingMode === opt.value ? 'admin-rules__option--active' : ''}`}
                  onClick={() => updateBookingRules({ bookingMode: opt.value })}
                >
                  <span className="admin-rules__option-label">{opt.label}</span>
                  <span className="admin-rules__option-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Gender */}
          <div className="admin-rules__row">
            <div className="admin-rules__group">
              <label className="admin-rules__label">
                <MapPin size={13} /> Location Type
              </label>
              <div className="admin-rules__pills">
                {['online', 'offline', 'both'].map(v => (
                  <button
                    key={v}
                    className={`admin-rules__pill ${rules.rules.locationType === v ? 'admin-rules__pill--active' : ''}`}
                    onClick={() => updateBookingRules({ locationType: v })}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-rules__group">
              <label className="admin-rules__label">
                <Users size={13} /> Gender
              </label>
              <div className="admin-rules__pills">
                {['male', 'female', 'both'].map(v => (
                  <button
                    key={v}
                    className={`admin-rules__pill ${rules.rules.gender === v ? 'admin-rules__pill--active' : ''}`}
                    onClick={() => updateBookingRules({ gender: v })}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="admin-rules__toggles">
            {[
              { key: 'allowSameDayBooking', label: 'Allow Same-Day Booking', desc: 'Accept bookings within 24h' },
              { key: 'allowCustomTimeRequest', label: 'Allow Custom Time', desc: 'Clients suggest hours' },
              { key: 'autoConfirmAfterPayment', label: 'Auto-Confirm After Payment', desc: 'Skip manual review' },
              { key: 'allowReschedule', label: 'Allow Reschedule', desc: 'Client can reschedule' },
              { key: 'allowCancellation', label: 'Allow Cancellation', desc: 'Client can cancel' },
            ].map(toggle => (
              <div key={toggle.key} className="admin-rules__toggle-item">
                <button
                  className={`admin-toggle ${rules.rules[toggle.key] ? 'admin-toggle--on' : ''}`}
                  onClick={() => updateBookingRules({ [toggle.key]: !rules.rules[toggle.key] })}
                >
                  <div className="admin-toggle__track">
                    <div className="admin-toggle__thumb" />
                  </div>
                </button>
                <div>
                  <span className="admin-rules__toggle-label">{toggle.label}</span>
                  <span className="admin-rules__toggle-desc">{toggle.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Max Participants */}
          <div className="admin-rules__group" style={{ maxWidth: 240 }}>
            <label className="admin-rules__label">Max Participants</label>
            <input
              className="admin-rules__input"
              type="number"
              placeholder="Unlimited"
              value={rules.rules.maxParticipants}
              onChange={e => updateBookingRules({ maxParticipants: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ─── Divider + Preview Toggle ─── */}
      <div className="admin-preview-divider animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="admin-preview-divider__line" />
        <button
          className={`admin-preview-divider__btn ${showPreview ? 'admin-preview-divider__btn--active' : ''}`}
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye size={14} />
          {showPreview ? 'Hide Scholar Form Preview' : 'Show Scholar Form Preview'}
        </button>
        <div className="admin-preview-divider__line" />
      </div>

      {/* ─── Scholar Form Preview ─── */}
      {showPreview && (
        <div className="animate-fade-in">
          <ScholarFormPreview rules={rules} />
        </div>
      )}
    </div>
  );
}
