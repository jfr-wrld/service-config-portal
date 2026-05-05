import { useServiceConfig } from '../../context/ServiceConfigContext';
import { BOOKING_TYPES, COUNTRY_OPTIONS, LANGUAGE_OPTIONS } from '../../data/configSchema';
import {
  MapPin, Globe, Users, BookOpen,
  Clock, Shield, Timer, Package, Zap, Info,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const BT_ICONS = { 'time-based': Timer, 'package-based': Package, 'on-demand': Zap };

export default function ServiceSetupStep() {
  const { config, updateBasicInfo } = useServiceConfig();
  const info = config.basicInfo;
  const bt = BOOKING_TYPES[config.bookingType];
  const BtIcon = BT_ICONS[config.bookingType] || Timer;

  const [expandedSections, setExpandedSections] = useState({
    target: true,
    booking: true,
    flexibility: false,
  });

  const toggle = (key) => setExpandedSections(s => ({ ...s, [key]: !s[key] }));

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">Step 1: Service Setup</div>
          <div className="main-content__subtitle">Configure operational rules for this service</div>
        </div>
      </div>

      {/* ─── Service Identity Card (Read-only from CreateService) ─── */}
      <div className="service-identity-card animate-fade-in">
        <div className="service-identity-card__icon" style={{ background: `${bt.color}12`, color: bt.color }}>
          <BtIcon size={28} />
        </div>
        <div className="service-identity-card__info">
          <div className="service-identity-card__name">{config.serviceName}</div>
          <div className="service-identity-card__desc">{info.description || '—'}</div>
          <div className="service-identity-card__tags">
            <span className="service-identity-card__tag" style={{ background: `${bt.color}12`, color: bt.color, borderColor: `${bt.color}30` }}>
              <BtIcon size={11} /> {bt.label}
            </span>
          </div>
        </div>
        <div className="service-identity-card__hint">
          <Info size={13} />
          <span>Edit in Service Management</span>
        </div>
      </div>

      {/* ─── Target Audience ─── */}
      <ConfigSection
        title="Target Audience"
        icon={<Globe size={16} />}
        badge="Configure"
        expanded={expandedSections.target}
        onToggle={() => toggle('target')}
      >
        <div className="config-form">
          <div className="config-form__row">
            <div className="config-form__group">
              <label className="config-form__label">
                <MapPin size={13} style={{ verticalAlign: -2 }} /> Location Type
              </label>
              <div className="config-radio-group">
                {['online', 'offline', 'both'].map(v => (
                  <label key={v} className={`config-radio ${info.locationType === v ? 'config-radio--active' : ''}`}>
                    <input
                      type="radio" name="locationType" value={v}
                      checked={info.locationType === v}
                      onChange={() => updateBasicInfo({ locationType: v })}
                    />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="config-form__group">
              <label className="config-form__label">
                <Users size={13} style={{ verticalAlign: -2 }} /> Gender
              </label>
              <div className="config-radio-group">
                {['male', 'female', 'both'].map(v => (
                  <label key={v} className={`config-radio ${info.gender === v ? 'config-radio--active' : ''}`}>
                    <input
                      type="radio" name="gender" value={v}
                      checked={info.gender === v}
                      onChange={() => updateBasicInfo({ gender: v })}
                    />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="config-form__group">
              <label className="config-form__label">Age Range</label>
              <select
                className="config-form__input"
                value={info.ageRange}
                onChange={e => updateBasicInfo({ ageRange: e.target.value })}
              >
                <option value="all-ages">All Ages</option>
                <option value="adults">Adults Only (18+)</option>
                <option value="children">Children (Under 18)</option>
                <option value="seniors">Seniors (60+)</option>
              </select>
            </div>
          </div>

          <div className="config-form__row">
            <div className="config-form__group">
              <label className="config-form__label">
                <Globe size={13} style={{ verticalAlign: -2 }} /> Target Countries
              </label>
              <div className="config-checkbox-list">
                {COUNTRY_OPTIONS.map(c => (
                  <label key={c} className="config-checkbox">
                    <input
                      type="checkbox"
                      checked={info.targetCountries.includes(c)}
                      onChange={e => {
                        const updated = e.target.checked
                          ? [...info.targetCountries, c]
                          : info.targetCountries.filter(x => x !== c);
                        updateBasicInfo({ targetCountries: updated });
                      }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="config-form__group">
              <label className="config-form__label">
                <BookOpen size={13} style={{ verticalAlign: -2 }} /> Languages
              </label>
              <div className="config-checkbox-list">
                {LANGUAGE_OPTIONS.map(l => (
                  <label key={l} className="config-checkbox">
                    <input
                      type="checkbox"
                      checked={info.languages.includes(l)}
                      onChange={e => {
                        const updated = e.target.checked
                          ? [...info.languages, l]
                          : info.languages.filter(x => x !== l);
                        updateBasicInfo({ languages: updated });
                      }}
                    />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ConfigSection>

      {/* ─── Booking Rules ─── */}
      <ConfigSection
        title="Booking Rules"
        icon={<Clock size={16} />}
        badge="Configure"
        expanded={expandedSections.booking}
        onToggle={() => toggle('booking')}
      >
        <div className="config-form">
          <div className="config-form__group">
            <label className="config-form__label">Booking Mode</label>
            <div className="config-radio-group config-radio-group--vertical">
              {[
                { value: 'instant-booking', label: 'Instant Booking', desc: 'Confirmations are automatic' },
                { value: 'request-to-book', label: 'Request to Book', desc: 'Review every guest request' },
                { value: 'both', label: 'Both', desc: 'Offer both options to guests' },
              ].map(opt => (
                <label key={opt.value} className={`config-radio config-radio--card ${info.bookingMode === opt.value ? 'config-radio--active' : ''}`}>
                  <input
                    type="radio" name="bookingMode" value={opt.value}
                    checked={info.bookingMode === opt.value}
                    onChange={() => updateBasicInfo({ bookingMode: opt.value })}
                  />
                  <div>
                    <div className="config-radio__title">{opt.label}</div>
                    <div className="config-radio__desc">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="config-toggle-grid">
            <ToggleField
              label="Allow Same-Day Booking"
              hint="Accept bookings within 24h"
              checked={info.allowSameDayBooking}
              onChange={v => updateBasicInfo({ allowSameDayBooking: v })}
            />
            <ToggleField
              label="Allow Custom Time Request"
              hint="Clients can suggest hours"
              checked={info.allowCustomTimeRequest}
              onChange={v => updateBasicInfo({ allowCustomTimeRequest: v })}
            />
            <ToggleField
              label="Auto-confirm After Payment"
              hint="Skip manual review for paid bookings"
              checked={info.autoConfirmAfterPayment}
              onChange={v => updateBasicInfo({ autoConfirmAfterPayment: v })}
            />
          </div>

          <div className="config-form__group">
            <label className="config-form__label">Max Participants</label>
            <input
              className="config-form__input config-form__input--sm"
              type="number"
              value={info.maxParticipants}
              onChange={e => updateBasicInfo({ maxParticipants: e.target.value })}
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>
      </ConfigSection>

      {/* ─── Flexibility ─── */}
      <ConfigSection
        title="Flexibility & Cancellation"
        icon={<Shield size={16} />}
        badge="Optional"
        expanded={expandedSections.flexibility}
        onToggle={() => toggle('flexibility')}
      >
        <div className="config-form">
          <div className="config-toggle-grid">
            <ToggleField
              label="Allow Reschedule"
              hint={`Min ${info.rescheduleWindowHours}h before session`}
              checked={info.allowReschedule}
              onChange={v => updateBasicInfo({ allowReschedule: v })}
            />
            <ToggleField
              label="Allow Cancellation"
              hint={`Min ${info.cancellationWindowHours}h before session`}
              checked={info.allowCancellation}
              onChange={v => updateBasicInfo({ allowCancellation: v })}
            />
          </div>

          {info.allowReschedule && (
            <div className="config-form__group">
              <label className="config-form__label">Reschedule Window (Hours Before)</label>
              <input
                className="config-form__input config-form__input--sm"
                type="number" min={1}
                value={info.rescheduleWindowHours}
                onChange={e => updateBasicInfo({ rescheduleWindowHours: Number(e.target.value) })}
              />
            </div>
          )}

          {info.allowCancellation && (
            <>
              <div className="config-form__group">
                <label className="config-form__label">Cancellation Window (Hours Before)</label>
                <input
                  className="config-form__input config-form__input--sm"
                  type="number" min={1}
                  value={info.cancellationWindowHours}
                  onChange={e => updateBasicInfo({ cancellationWindowHours: Number(e.target.value) })}
                />
              </div>
              <div className="config-form__group">
                <label className="config-form__label">Cancellation Policy</label>
                <textarea
                  className="config-form__input config-form__textarea"
                  value={info.cancellationPolicy}
                  onChange={e => updateBasicInfo({ cancellationPolicy: e.target.value })}
                  placeholder="Describe your cancellation policy..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </ConfigSection>
    </div>
  );
}

/* ─── Reusable: Config Section ─── */
function ConfigSection({ title, icon, badge, expanded, onToggle, children }) {
  return (
    <div className={`config-section animate-fade-in ${expanded ? 'config-section--expanded' : ''}`}>
      <div className="config-section__header" onClick={onToggle}>
        <div className="config-section__header-left">
          {expanded ? <ChevronDown size={16} color="var(--text-tertiary)" /> : <ChevronRight size={16} color="var(--text-tertiary)" />}
          <span className="config-section__icon">{icon}</span>
          <span className="config-section__title">{title}</span>
          {badge && <span className={`badge ${badge === 'Required' ? 'badge--mandatory' : 'badge--count'}`}>{badge}</span>}
        </div>
      </div>
      {expanded && <div className="config-section__body">{children}</div>}
    </div>
  );
}

/* ─── Reusable: Toggle Field ─── */
function ToggleField({ label, hint, checked, onChange }) {
  return (
    <div className="config-toggle-item">
      <div
        className={`toggle ${checked ? 'toggle--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <div className="toggle__track"><div className="toggle__thumb" /></div>
        <div>
          <span className="toggle__label">{label}</span>
          {hint && <span className="toggle__hint">{hint}</span>}
        </div>
      </div>
    </div>
  );
}

export { ConfigSection, ToggleField };
