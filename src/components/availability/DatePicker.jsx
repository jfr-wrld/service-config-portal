import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { MONTHS } from './availabilityData';

const SEASONS = [
  { value: '', label: 'Select season...' },
  { value: 'hajj-1447', label: 'Hajj 1447H / 2026 (15 May – 20 Jun)' },
  { value: 'hajj-1448', label: 'Hajj 1448H / 2027 (5 May – 10 Jun)' },
  { value: 'umrah-2026', label: 'Umrah Season 2026 (Oct – Apr)' },
  { value: 'ramadan-1447', label: 'Ramadan 1447H / 2026 (18 Feb – 19 Mar)' },
];

export default function DatePicker({ availableDates, onChange, month, year, onMonthChange, onYearChange, season, onSeasonChange }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

  const toggleDate = (dateStr) => {
    const updated = availableDates.includes(dateStr)
      ? availableDates.filter(d => d !== dateStr)
      : [...availableDates, dateStr];
    onChange(updated);
  };

  const selectAllDates = () => {
    const all = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date >= now) {
        all.push(formatDate(year, month, d));
      }
    }
    onChange(all);
  };

  const clearAll = () => onChange([]);

  function formatDate(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  const isDatePassed = (day) => {
    const date = new Date(year, month, day);
    return date < now;
  };

  // Build calendar grid
  const cells = [];
  // Empty cells for offset
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className="date-picker__cell date-picker__cell--empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(year, month, d);
    const passed = isDatePassed(d);
    const selected = availableDates.includes(dateStr);
    cells.push(
      <button
        key={d}
        className={`date-picker__cell ${selected ? 'date-picker__cell--selected' : ''} ${passed ? 'date-picker__cell--passed' : ''}`}
        onClick={() => !passed && toggleDate(dateStr)}
        disabled={passed}
      >
        {d}
      </button>
    );
  }

  const prevMonth = () => {
    if (month === 0) { onMonthChange(11); onYearChange(year - 1); }
    else { onMonthChange(month - 1); }
  };
  const nextMonth = () => {
    if (month === 11) { onMonthChange(0); onYearChange(year + 1); }
    else { onMonthChange(month + 1); }
  };

  return (
    <div className="date-picker">
      <div className="date-picker__instruction">
        <CheckCircle2 size={14} color="var(--accent)" />
        Click once on the date to set it as available
      </div>

      <div className="date-picker__controls">
        <label className="date-picker__checkbox">
          <input type="checkbox" onChange={(e) => e.target.checked ? selectAllDates() : clearAll()} />
          Select All Dates
        </label>
        <button className="btn btn--ghost btn--sm" onClick={clearAll}>Clear All</button>
      </div>

      {/* Season selector */}
      <div className="date-picker__season">
        <label className="form-group__label">Season (Platform Defined)</label>
        <select className="form-group__input" value={season} onChange={(e) => onSeasonChange(e.target.value)}>
          {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Calendar nav */}
      <div className="date-picker__nav">
        <button className="btn btn--ghost btn--icon btn--sm" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>
        <div className="date-picker__nav-center">
          <select className="date-picker__month-select" value={month} onChange={(e) => onMonthChange(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="date-picker__year-select" value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
            {[2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button className="btn btn--ghost btn--icon btn--sm" onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="date-picker__grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="date-picker__day-header">{d}</div>
        ))}
        {cells}
      </div>

      {/* Legend */}
      <div className="date-picker__legend">
        <span className="date-picker__legend-item"><span className="date-picker__dot date-picker__dot--available" /> Available</span>
        <span className="date-picker__legend-item"><span className="date-picker__dot date-picker__dot--unavailable" /> Not Available</span>
        <span className="date-picker__legend-item"><span className="date-picker__dot date-picker__dot--passed" /> Date Passed</span>
      </div>
    </div>
  );
}
