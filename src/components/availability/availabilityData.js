import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/* ─── Default Weekly Slots ─── */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function createDefaultWeekly() {
  const w = {};
  DAYS.forEach(d => { w[d.toLowerCase()] = { enabled: false, slots: [] }; });
  w.monday = { enabled: true, slots: [{ id: uuidv4(), start: '09:00', end: '10:00' }] };
  w.tuesday = { enabled: true, slots: [] };
  return w;
}

function getInitialState() {
  return {
    defaultAvailability: {
      active: true,
      scheduleType: 'recurring',
      timeRules: {
        bufferBefore: 60,
        bufferAfter: 30,
        maxBookingPerDay: 2,
        leadTimeHours: 24,
        allowSameDayBooking: false,
      },
      timeFormat: '12h',
      weeklySlots: createDefaultWeekly(),
      availableMonths: [],
      availableDates: [],
    },
    allUseDefault: false,
    packages: [
      { id: 'pkg-1', name: 'Package 1', useDefault: true, scheduleType: 'recurring', timeFormat: '12h', bufferTime: 120, startTime: '08:00', endTime: '', weeklySlots: createDefaultWeekly(), availableMonths: [], availableDates: [], season: '' },
      { id: 'pkg-2', name: 'Package 2', useDefault: false, scheduleType: 'by-month', timeFormat: '12h', bufferTime: 120, startTime: '08:00', endTime: '', weeklySlots: createDefaultWeekly(), availableMonths: [0, 2, 5], availableDates: [], season: '' },
      { id: 'pkg-3', name: 'Package 3', useDefault: false, scheduleType: 'specific-dates', timeFormat: '12h', bufferTime: 120, startTime: '08:00', endTime: '', weeklySlots: createDefaultWeekly(), availableMonths: [], availableDates: ['2026-05-16', '2026-05-17', '2026-05-18'], season: 'hajj-1447' },
    ],
  };
}

export { DAYS, MONTHS, getInitialState };
