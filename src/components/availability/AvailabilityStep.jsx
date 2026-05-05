import { useState } from 'react';
import { getInitialState, DAYS } from './availabilityData';
import WeeklySchedule from './WeeklySchedule';
import MonthPicker from './MonthPicker';
import DatePicker from './DatePicker';
import { v4 as uuidv4 } from 'uuid';
import {
  Info, Power, Calendar, CalendarDays, CalendarRange,
  Clock, Shield, ChevronDown, ChevronRight, Package,
  Copy, Settings2
} from 'lucide-react';

const BUFFER_OPTIONS = [
  { value: 0, label: 'None' }, { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' }, { value: 60, label: '60 minutes' },
  { value: 120, label: '2 hours' }, { value: 180, label: '3 hours' },
];

function ScheduleTypeSelector({ value, onChange }) {
  const types = [
    { id: 'recurring', label: 'Recurring', icon: Calendar, desc: 'Weekly slot-based' },
    { id: 'by-month', label: 'By Month', icon: CalendarDays, desc: 'Month selection' },
    { id: 'specific-dates', label: 'Specific Dates', icon: CalendarRange, desc: 'Calendar-based' },
  ];
  return (
    <div className="schedule-type-selector">
      {types.map(t => (
        <button
          key={t.id}
          className={`schedule-type-btn ${value === t.id ? 'schedule-type-btn--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <t.icon size={16} />
          <span className="schedule-type-btn__label">{t.label}</span>
          <span className="schedule-type-btn__desc">{t.desc}</span>
        </button>
      ))}
    </div>
  );
}

function TimeRulesSection({ rules, onChange }) {
  const update = (key, val) => onChange({ ...rules, [key]: val });
  return (
    <div className="avail-subsection">
      <div className="avail-subsection__title"><Clock size={14} /> Time Rules</div>
      <div className="avail-grid avail-grid--3">
        <div className="form-group">
          <label className="form-group__label">Buffer Before</label>
          <select className="form-group__input" value={rules.bufferBefore} onChange={e => update('bufferBefore', Number(e.target.value))}>
            {BUFFER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-group__label">Buffer After</label>
          <select className="form-group__input" value={rules.bufferAfter} onChange={e => update('bufferAfter', Number(e.target.value))}>
            {BUFFER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-group__label">Max Booking / Day</label>
          <input className="form-group__input" type="number" min={1} value={rules.maxBookingPerDay} onChange={e => update('maxBookingPerDay', Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-group__label">Lead Time (Hour)</label>
          <input className="form-group__input" type="number" min={0} value={rules.leadTimeHours} onChange={e => update('leadTimeHours', Number(e.target.value))} />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
          <label className="avail-checkbox">
            <input type="checkbox" checked={rules.allowSameDayBooking} onChange={e => update('allowSameDayBooking', e.target.checked)} />
            Allow Same-day Booking
          </label>
        </div>
      </div>
    </div>
  );
}

function PackageTimeConfig({ pkg, onChange }) {
  const update = (key, val) => onChange({ ...pkg, [key]: val });
  return (
    <div className="avail-grid avail-grid--4">
      <div className="form-group">
        <label className="form-group__label">Buffer Time</label>
        <select className="form-group__input" value={pkg.bufferTime} onChange={e => update('bufferTime', Number(e.target.value))}>
          {BUFFER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-group__label">Format Time</label>
        <select className="form-group__input" value={pkg.timeFormat} onChange={e => update('timeFormat', e.target.value)}>
          <option value="12h">12 Hour</option>
          <option value="24h">24 Hour</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-group__label">Start Time</label>
        <input className="form-group__input" type="time" value={pkg.startTime} onChange={e => update('startTime', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-group__label">End Time</label>
        <input className="form-group__input" type="time" value={pkg.endTime} onChange={e => update('endTime', e.target.value)} placeholder="Select end time" />
      </div>
    </div>
  );
}

export default function AvailabilityStep() {
  const [state, setState] = useState(getInitialState);
  const [expandedPkgs, setExpandedPkgs] = useState({ 'pkg-1': true, 'pkg-2': true, 'pkg-3': true });
  const [monthYear, setMonthYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // --- Default Availability ---
  const da = state.defaultAvailability;
  const updateDA = (updates) => setState(s => ({ ...s, defaultAvailability: { ...s.defaultAvailability, ...updates } }));

  // --- Packages ---
  const updatePkg = (pkgId, updates) => {
    setState(s => ({
      ...s,
      packages: s.packages.map(p => p.id === pkgId ? { ...p, ...updates } : p),
    }));
  };
  const togglePkgExpand = (pkgId) => setExpandedPkgs(s => ({ ...s, [pkgId]: !s[pkgId] }));
  const setAllDefault = (checked) => {
    setState(s => ({
      ...s,
      allUseDefault: checked,
      packages: s.packages.map(p => ({ ...p, useDefault: checked ? true : p.useDefault })),
    }));
  };

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">Step 5: Availability & Schedule</div>
          <div className="main-content__subtitle">Configure default schedules and per-package overrides</div>
        </div>
      </div>

      {/* ─── Info Banner ─── */}
      <div className="avail-banner animate-fade-in">
        <Info size={18} />
        <div>
          <strong>Package-based services require detailed schedule</strong>
          <div style={{ fontSize: '0.82rem', marginTop: 2, opacity: 0.8 }}>
            Slots configured here will be visible to users for direct booking. Default availability applies to all packages unless overridden.
          </div>
        </div>
      </div>

      {/* ═══ A. Default Availability ═══ */}
      <div className="avail-section animate-fade-in">
        <div className="avail-section__header">
          <div className="avail-section__header-left">
            <Shield size={16} color="var(--accent)" />
            <span className="avail-section__title">Default Availability</span>
            <span className="badge badge--mandatory">Global</span>
          </div>
          <div
            className={`toggle ${da.active ? 'toggle--on' : ''}`}
            onClick={() => updateDA({ active: !da.active })}
          >
            <div className="toggle__track"><div className="toggle__thumb" /></div>
            <span className="toggle__label">{da.active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {da.active && (
          <div className="avail-section__body">
            {/* Schedule Type */}
            <div className="avail-subsection">
              <div className="avail-subsection__title"><Settings2 size={14} /> Schedule Type</div>
              <ScheduleTypeSelector value={da.scheduleType} onChange={v => updateDA({ scheduleType: v })} />
            </div>

            {/* Time Rules */}
            <TimeRulesSection rules={da.timeRules} onChange={r => updateDA({ timeRules: r })} />

            {/* Schedule Content */}
            {da.scheduleType === 'recurring' && (
              <div className="avail-subsection">
                <div className="avail-subsection__title"><Calendar size={14} /> Available Day (Weekly Setup)</div>
                <div className="avail-format-row">
                  <label className="form-group__label" style={{ margin: 0 }}>Format Time</label>
                  <select className="form-group__input" style={{ width: 140 }} value={da.timeFormat} onChange={e => updateDA({ timeFormat: e.target.value })}>
                    <option value="12h">12 Hour</option>
                    <option value="24h">24 Hour</option>
                  </select>
                </div>
                <WeeklySchedule
                  weeklySlots={da.weeklySlots}
                  timeFormat={da.timeFormat}
                  onChange={ws => updateDA({ weeklySlots: ws })}
                />
              </div>
            )}

            {da.scheduleType === 'by-month' && (
              <div className="avail-subsection">
                <div className="avail-subsection__title"><CalendarDays size={14} /> Available Schedule</div>
                <MonthPicker
                  availableMonths={da.availableMonths}
                  onChange={m => updateDA({ availableMonths: m })}
                  year={monthYear}
                  onYearChange={setMonthYear}
                />
              </div>
            )}

            {da.scheduleType === 'specific-dates' && (
              <div className="avail-subsection">
                <div className="avail-subsection__title"><CalendarRange size={14} /> Available Schedule</div>
                <DatePicker
                  availableDates={da.availableDates}
                  onChange={d => updateDA({ availableDates: d })}
                  month={calMonth}
                  year={calYear}
                  onMonthChange={setCalMonth}
                  onYearChange={setCalYear}
                  season=""
                  onSeasonChange={() => {}}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ B. Package Overrides ═══ */}
      <div className="avail-section animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="avail-section__header">
          <div className="avail-section__header-left">
            <Package size={16} color="var(--warning)" />
            <span className="avail-section__title">Package Availability</span>
            <span className="badge badge--count">{state.packages.length} packages</span>
          </div>
        </div>

        <div className="avail-section__body">
          <label className="avail-checkbox avail-checkbox--highlight">
            <input
              type="checkbox"
              checked={state.allUseDefault}
              onChange={e => setAllDefault(e.target.checked)}
            />
            <Copy size={14} />
            Set all to default availability
          </label>

          {state.packages.map((pkg, idx) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={idx}
              expanded={expandedPkgs[pkg.id]}
              onToggleExpand={() => togglePkgExpand(pkg.id)}
              onChange={(updates) => updatePkg(pkg.id, updates)}
              disabled={state.allUseDefault}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Package Card Component ─── */
function PackageCard({ pkg, index, expanded, onToggleExpand, onChange, disabled }) {
  const [pkgMonthYear, setPkgMonthYear] = useState(2026);
  const [pkgCalMonth, setPkgCalMonth] = useState(new Date().getMonth());
  const [pkgCalYear, setPkgCalYear] = useState(new Date().getFullYear());

  const modeLabel = pkg.useDefault
    ? `Default – ${capitalize(pkg.scheduleType)}`
    : `Custom – ${capitalize(pkg.scheduleType)}`;

  return (
    <div className={`pkg-card ${disabled ? 'pkg-card--disabled' : ''}`}>
      <div className="pkg-card__header" onClick={onToggleExpand}>
        <div className="pkg-card__header-left">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="pkg-card__name">Package {index + 1}</span>
          <span className={`badge ${pkg.useDefault ? 'badge--count' : 'badge--conditional'}`}>
            {modeLabel}
          </span>
        </div>
      </div>

      {expanded && !disabled && (
        <div className="pkg-card__body">
          {/* Mode selector */}
          <div className="pkg-mode-selector">
            <button
              className={`pkg-mode-btn ${pkg.useDefault ? 'pkg-mode-btn--active' : ''}`}
              onClick={() => onChange({ useDefault: true })}
            >
              <Shield size={14} /> Use Default Schedule
            </button>
            <button
              className={`pkg-mode-btn ${!pkg.useDefault ? 'pkg-mode-btn--active' : ''}`}
              onClick={() => onChange({ useDefault: false })}
            >
              <Settings2 size={14} /> Custom Schedule
            </button>
          </div>

          {!pkg.useDefault && (
            <>
              <ScheduleTypeSelector value={pkg.scheduleType} onChange={v => onChange({ scheduleType: v })} />
              <PackageTimeConfig pkg={pkg} onChange={onChange} />

              {pkg.scheduleType === 'recurring' && (
                <WeeklySchedule
                  weeklySlots={pkg.weeklySlots}
                  timeFormat={pkg.timeFormat}
                  onChange={ws => onChange({ weeklySlots: ws })}
                />
              )}

              {pkg.scheduleType === 'by-month' && (
                <MonthPicker
                  availableMonths={pkg.availableMonths}
                  onChange={m => onChange({ availableMonths: m })}
                  year={pkgMonthYear}
                  onYearChange={setPkgMonthYear}
                />
              )}

              {pkg.scheduleType === 'specific-dates' && (
                <DatePicker
                  availableDates={pkg.availableDates}
                  onChange={d => onChange({ availableDates: d })}
                  month={pkgCalMonth}
                  year={pkgCalYear}
                  onMonthChange={setPkgCalMonth}
                  onYearChange={setPkgCalYear}
                  season={pkg.season}
                  onSeasonChange={s => onChange({ season: s })}
                />
              )}
            </>
          )}

          {pkg.useDefault && (
            <div className="pkg-default-notice">
              <Shield size={16} color="var(--accent)" />
              This package follows the Default Availability configuration above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function capitalize(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
