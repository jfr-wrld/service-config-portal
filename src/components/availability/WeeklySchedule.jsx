import { useState } from 'react';
import { DAYS } from './availabilityData';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Check, X, Clock } from 'lucide-react';

/* ─── Time formatting helpers ─── */
function to12h(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

function generateTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      opts.push(val);
    }
  }
  return opts;
}

const TIME_OPTIONS = generateTimeOptions();

export default function WeeklySchedule({ weeklySlots, timeFormat, onChange }) {
  const [newSlot, setNewSlot] = useState({});

  const toggleDay = (day) => {
    const updated = { ...weeklySlots };
    updated[day] = { ...updated[day], enabled: !updated[day].enabled };
    onChange(updated);
  };

  const addSlot = (day) => {
    const updated = { ...weeklySlots };
    updated[day] = {
      ...updated[day],
      slots: [...updated[day].slots, { id: uuidv4(), start: '', end: '' }],
    };
    onChange(updated);
  };

  const updateSlot = (day, slotId, field, value) => {
    const updated = { ...weeklySlots };
    updated[day] = {
      ...updated[day],
      slots: updated[day].slots.map(s => s.id === slotId ? { ...s, [field]: value } : s),
    };
    onChange(updated);
  };

  const removeSlot = (day, slotId) => {
    const updated = { ...weeklySlots };
    updated[day] = {
      ...updated[day],
      slots: updated[day].slots.filter(s => s.id !== slotId),
    };
    onChange(updated);
  };

  const formatTime = (t) => timeFormat === '12h' ? to12h(t) : t;

  return (
    <div className="weekly-schedule">
      {DAYS.map((dayLabel) => {
        const key = dayLabel.toLowerCase();
        const day = weeklySlots[key];

        return (
          <div key={key} className={`weekly-day ${day.enabled ? 'weekly-day--active' : ''}`}>
            <div className="weekly-day__header">
              <label className="weekly-day__toggle">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={() => toggleDay(key)}
                />
                <span className="weekly-day__name">{dayLabel}</span>
              </label>
              {day.enabled && (
                <button className="btn btn--ghost btn--sm" onClick={() => addSlot(key)}>
                  <Plus size={12} /> Add Slot
                </button>
              )}
            </div>

            {day.enabled && (
              <div className="weekly-day__slots">
                {day.slots.length === 0 && (
                  <div className="weekly-day__empty">No time slots configured</div>
                )}
                {day.slots.map((slot) => (
                  <div key={slot.id} className="time-slot-row">
                    <Clock size={13} color="var(--text-tertiary)" />
                    <select
                      className="time-slot-row__select"
                      value={slot.start}
                      onChange={(e) => updateSlot(key, slot.id, 'start', e.target.value)}
                    >
                      <option value="">Start</option>
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{formatTime(t)}</option>
                      ))}
                    </select>
                    <span className="time-slot-row__sep">→</span>
                    <select
                      className="time-slot-row__select"
                      value={slot.end}
                      onChange={(e) => updateSlot(key, slot.id, 'end', e.target.value)}
                    >
                      <option value="">End</option>
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{formatTime(t)}</option>
                      ))}
                    </select>
                    {slot.start && slot.end && (
                      <Check size={14} color="var(--success)" />
                    )}
                    <button
                      className="btn btn--ghost btn--icon btn--sm"
                      onClick={() => removeSlot(key, slot.id)}
                    >
                      <X size={13} color="var(--danger)" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
