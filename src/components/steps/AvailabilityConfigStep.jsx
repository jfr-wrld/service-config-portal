import { useServiceConfig } from '../../context/ServiceConfigContext';
import {
  AVAILABILITY_TYPES, AVAILABILITY_BY_BOOKING_TYPE, BOOKING_TYPES,
} from '../../data/configSchema';
import WeeklySchedule from '../availability/WeeklySchedule';
import MonthPicker from '../availability/MonthPicker';
import DatePicker from '../availability/DatePicker';
import {
  Calendar, CalendarDays, CalendarRange, Clock, Power,
  Shield, Info, Settings2
} from 'lucide-react';
import { useState } from 'react';

const TYPE_ICONS = {
  recurring: Calendar,
  'specific-dates': CalendarRange,
  'by-month': CalendarDays,
};

const BUFFER_OPTIONS = [
  { value: 0, label: 'None' }, { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' }, { value: 60, label: '60 minutes' },
  { value: 120, label: '2 hours' }, { value: 180, label: '3 hours' },
];

export default function AvailabilityConfigStep() {
  const {
    config, updateAvailability,
    toggleAvailabilityType, setActiveAvailabilityType,
  } = useServiceConfig();

  const bt = config.bookingType;
  const avail = config.availability;
  const allowedTypes = AVAILABILITY_BY_BOOKING_TYPE[bt] || [];

  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // On-demand has no availability config
  if (bt === 'on-demand') {
    return (
      <div className="main-content">
        <div className="main-content__header">
          <div>
            <div className="main-content__title">Step 3: Availability</div>
            <div className="main-content__subtitle">Schedule configuration</div>
          </div>
        </div>
        <div className="config-empty-state animate-fade-in">
          <div className="config-empty-state__icon">📋</div>
          <div className="config-empty-state__title">No Schedule Required</div>
          <div className="config-empty-state__desc">
            On-demand services use request-based booking — scholars accept or decline each request individually.
            No fixed availability schedule is needed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">Step 3: Availability</div>
          <div className="main-content__subtitle">Toggle availability types and configure schedules</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="config-banner" style={{ borderLeftColor: BOOKING_TYPES[bt].color }}>
        <Info size={18} />
        <div className="config-banner__text">
          <strong>Toggle availability types ON/OFF</strong>
          <span>Scholars will see the enabled types when setting their schedule. Forms are predefined — no manual setup needed.</span>
        </div>
      </div>

      {/* ─── Availability Type Toggles ─── */}
      <div className="avail-type-grid animate-fade-in">
        {allowedTypes.map(typeKey => {
          const typeDef = AVAILABILITY_TYPES[typeKey];
          const Icon = TYPE_ICONS[typeKey];
          const isEnabled = avail.enabledTypes[typeKey] || false;
          const isActive = avail.activeType === typeKey;

          return (
            <div
              key={typeKey}
              className={`avail-type-card ${isEnabled ? 'avail-type-card--enabled' : ''} ${isActive ? 'avail-type-card--active' : ''}`}
            >
              <div className="avail-type-card__header">
                <div className="avail-type-card__info">
                  <Icon size={20} />
                  <div>
                    <div className="avail-type-card__title">{typeDef.label}</div>
                    <div className="avail-type-card__desc">{typeDef.description}</div>
                  </div>
                </div>
                <div
                  className={`toggle ${isEnabled ? 'toggle--on' : ''}`}
                  onClick={() => toggleAvailabilityType(typeKey)}
                >
                  <div className="toggle__track"><div className="toggle__thumb" /></div>
                </div>
              </div>

              {isEnabled && (
                <button
                  className={`avail-type-card__configure ${isActive ? 'avail-type-card__configure--active' : ''}`}
                  onClick={() => setActiveAvailabilityType(typeKey)}
                >
                  <Settings2 size={13} /> {isActive ? 'Configuring...' : 'Configure'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Time Rules (for all enabled types) ─── */}
      {Object.values(avail.enabledTypes).some(v => v) && (
        <div className="avail-section animate-fade-in">
          <div className="avail-section__header">
            <div className="avail-section__header-left">
              <Clock size={16} color="var(--accent)" />
              <span className="avail-section__title">Time Rules</span>
              <span className="badge badge--count">Global</span>
            </div>
          </div>
          <div className="avail-section__body">
            <div className="avail-grid avail-grid--3">
              <div className="form-group">
                <label className="form-group__label">Buffer Before</label>
                <select className="form-group__input" value={avail.timeRules.bufferBefore}
                  onChange={e => updateAvailability({ timeRules: { ...avail.timeRules, bufferBefore: Number(e.target.value) } })}>
                  {BUFFER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-group__label">Buffer After</label>
                <select className="form-group__input" value={avail.timeRules.bufferAfter}
                  onChange={e => updateAvailability({ timeRules: { ...avail.timeRules, bufferAfter: Number(e.target.value) } })}>
                  {BUFFER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-group__label">Max Booking / Day</label>
                <input className="form-group__input" type="number" min={1} value={avail.timeRules.maxBookingPerDay}
                  onChange={e => updateAvailability({ timeRules: { ...avail.timeRules, maxBookingPerDay: Number(e.target.value) } })} />
              </div>
              <div className="form-group">
                <label className="form-group__label">Lead Time (Hours)</label>
                <input className="form-group__input" type="number" min={0} value={avail.timeRules.leadTimeHours}
                  onChange={e => updateAvailability({ timeRules: { ...avail.timeRules, leadTimeHours: Number(e.target.value) } })} />
              </div>
              <div className="form-group">
                <label className="form-group__label">Time Format</label>
                <select className="form-group__input" value={avail.timeFormat}
                  onChange={e => updateAvailability({ timeFormat: e.target.value })}>
                  <option value="12h">12 Hour</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                <label className="avail-checkbox">
                  <input type="checkbox" checked={avail.timeRules.allowSameDayBooking}
                    onChange={e => updateAvailability({ timeRules: { ...avail.timeRules, allowSameDayBooking: e.target.checked } })} />
                  Allow Same-day Booking
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Active Type Configuration ─── */}
      {avail.activeType && avail.enabledTypes[avail.activeType] && (
        <div className="avail-section animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="avail-section__header">
            <div className="avail-section__header-left">
              <Shield size={16} color="var(--accent)" />
              <span className="avail-section__title">
                {AVAILABILITY_TYPES[avail.activeType].label} Configuration
              </span>
              <span className="badge badge--mandatory">Active</span>
            </div>
          </div>
          <div className="avail-section__body">
            {avail.activeType === 'recurring' && (
              <WeeklySchedule
                weeklySlots={avail.weeklySlots}
                timeFormat={avail.timeFormat}
                onChange={ws => updateAvailability({ weeklySlots: ws })}
              />
            )}

            {avail.activeType === 'by-month' && (
              <MonthPicker
                availableMonths={avail.availableMonths}
                onChange={m => updateAvailability({ availableMonths: m })}
                year={avail.monthYear}
                onYearChange={y => updateAvailability({ monthYear: y })}
              />
            )}

            {avail.activeType === 'specific-dates' && (
              <DatePicker
                availableDates={avail.availableDates}
                onChange={d => updateAvailability({ availableDates: d })}
                month={calMonth}
                year={calYear}
                onMonthChange={setCalMonth}
                onYearChange={setCalYear}
                season=""
                onSeasonChange={() => {}}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
