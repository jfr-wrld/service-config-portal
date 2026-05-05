import { MONTHS } from './availabilityData';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function MonthPicker({ availableMonths, onChange, year, onYearChange }) {
  const now = new Date();

  const toggleMonth = (idx) => {
    const updated = availableMonths.includes(idx)
      ? availableMonths.filter(m => m !== idx)
      : [...availableMonths, idx];
    onChange(updated);
  };

  const selectAll = () => onChange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const clearAll = () => onChange([]);

  const isDatePassed = (monthIdx) => {
    if (year < now.getFullYear()) return true;
    if (year === now.getFullYear() && monthIdx < now.getMonth()) return true;
    return false;
  };

  return (
    <div className="month-picker">
      <div className="month-picker__instruction">
        <CheckCircle2 size={14} color="var(--accent)" />
        Click once on the month to set it as available
      </div>

      <div className="month-picker__controls">
        <label className="month-picker__checkbox">
          <input
            type="checkbox"
            checked={availableMonths.length === 12}
            onChange={(e) => e.target.checked ? selectAll() : clearAll()}
          />
          Select All Available Months
        </label>
        <button className="btn btn--ghost btn--sm" onClick={clearAll}>Clear All</button>
      </div>

      <div className="month-picker__nav">
        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => onYearChange(year - 1)}>
          <ChevronLeft size={16} />
        </button>
        <span className="month-picker__year">{year}</span>
        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => onYearChange(year + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="month-picker__grid">
        {MONTHS.map((month, idx) => {
          const passed = isDatePassed(idx);
          const selected = availableMonths.includes(idx);
          return (
            <button
              key={month}
              className={`month-picker__cell ${selected ? 'month-picker__cell--selected' : ''} ${passed ? 'month-picker__cell--passed' : ''}`}
              onClick={() => !passed && toggleMonth(idx)}
              disabled={passed}
            >
              {month.substring(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
