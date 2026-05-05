import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  X, MessageSquare, Heart, Scale, Map, Star, Mic,
  Timer, Package, Zap, Briefcase, BookOpen, Headphones,
  GraduationCap, Users, Globe, Sparkles, Check
} from 'lucide-react';

const BOOKING_TYPES = [
  {
    value: 'time-based',
    label: 'Time-based',
    description: 'Session with duration & time slots. For consultation, therapy, advisory.',
    icon: Timer,
    color: '#0d9488',
    example: 'e.g. Consultation, Ruqyah',
  },
  {
    value: 'package-based',
    label: 'Package-based',
    description: 'Fixed package with multi-day itinerary. For guided services.',
    icon: Package,
    color: '#f59e0b',
    example: 'e.g. Mutawwif, Umrah Guide',
  },
  {
    value: 'on-demand',
    label: 'On-demand',
    description: 'Flexible request-based booking. For event services.',
    icon: Zap,
    color: '#059669',
    example: 'e.g. Imam, Speaker',
  },
];

const ICON_OPTIONS = [
  { value: 'MessageSquare', icon: MessageSquare, label: 'Chat' },
  { value: 'Heart', icon: Heart, label: 'Heart' },
  { value: 'Scale', icon: Scale, label: 'Scale' },
  { value: 'Map', icon: Map, label: 'Map' },
  { value: 'Star', icon: Star, label: 'Star' },
  { value: 'Mic', icon: Mic, label: 'Mic' },
  { value: 'BookOpen', icon: BookOpen, label: 'Book' },
  { value: 'Headphones', icon: Headphones, label: 'Audio' },
  { value: 'GraduationCap', icon: GraduationCap, label: 'Education' },
  { value: 'Users', icon: Users, label: 'Group' },
  { value: 'Globe', icon: Globe, label: 'Globe' },
  { value: 'Briefcase', icon: Briefcase, label: 'Briefcase' },
];

const COLOR_OPTIONS = [
  '#0d9488', '#0284c7', '#7c3aed', '#e11d48',
  '#f59e0b', '#059669', '#dc2626', '#8b5cf6',
  '#06b6d4', '#d97706', '#16a34a', '#6366f1',
];

const initialForm = {
  name: '',
  slug: '',
  description: '',
  bookingType: '',
  icon: 'MessageSquare',
  color: '#0d9488',
};

export default function CreateServiceModal({ isOpen, onClose, onCreateService }) {
  const [form, setForm] = useState({ ...initialForm });
  const [step, setStep] = useState(1); // 1 = details, 2 = booking type, 3 = appearance
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const updateField = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {}),
    }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = 'Service name is required';
      if (!form.description.trim()) errs.description = 'Description is required';
    }
    if (s === 2) {
      if (!form.bookingType) errs.bookingType = 'Please select a booking type';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleCreate = () => {
    if (!validateStep(3)) return;
    const newService = {
      id: uuidv4(),
      name: form.name.trim(),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description.trim(),
      bookingType: form.bookingType,
      priceUnit: form.bookingType === 'time-based' ? 'Per Session'
        : form.bookingType === 'package-based' ? 'Per Trip' : 'Per Event',
      icon: form.icon,
      color: form.color,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      eventTypes: [],
      durationRange: '',
      hasEventTypes: false,
    };
    onCreateService(newService);
    setForm({ ...initialForm });
    setStep(1);
    setErrors({});
  };

  const handleClose = () => {
    setForm({ ...initialForm });
    setStep(1);
    setErrors({});
    onClose();
  };

  const selectedBT = BOOKING_TYPES.find(b => b.value === form.bookingType);
  const SelectedIcon = ICON_OPTIONS.find(i => i.value === form.icon)?.icon || MessageSquare;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal__header">
          <div>
            <h2 className="modal__title">
              <Sparkles size={18} style={{ color: 'var(--accent)' }} />
              Create New Service
            </h2>
            <p className="modal__subtitle">Step {step} of 3 — {step === 1 ? 'Basic Details' : step === 2 ? 'Booking Type' : 'Appearance'}</p>
          </div>
          <button className="modal__close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="modal__progress">
          <div className="modal__progress-bar" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="modal__body">
            <div className="modal-form">
              <div className="modal-form__group">
                <label className="modal-form__label">
                  Service Name <span className="modal-form__required">*</span>
                </label>
                <input
                  className={`modal-form__input ${errors.name ? 'modal-form__input--error' : ''}`}
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. Family Consultation, Quran Tutoring..."
                  autoFocus
                />
                {errors.name && <span className="modal-form__error">{errors.name}</span>}
              </div>

              <div className="modal-form__group">
                <label className="modal-form__label">Slug</label>
                <input
                  className="modal-form__input modal-form__input--mono"
                  value={form.slug}
                  onChange={e => updateField('slug', e.target.value)}
                  placeholder="auto-generated-from-name"
                />
                <span className="modal-form__hint">URL-friendly identifier, auto-generated from name</span>
              </div>

              <div className="modal-form__group">
                <label className="modal-form__label">
                  Description <span className="modal-form__required">*</span>
                </label>
                <textarea
                  className={`modal-form__input modal-form__textarea ${errors.description ? 'modal-form__input--error' : ''}`}
                  value={form.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Describe what this service offers, who it's for, and how it works..."
                  rows={4}
                />
                {errors.description && <span className="modal-form__error">{errors.description}</span>}
                <span className="modal-form__hint">{form.description.length}/200 characters</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Booking Type */}
        {step === 2 && (
          <div className="modal__body">
            <p className="modal__body-intro">
              Choose how scholars will manage bookings for this service. This determines pricing, availability, and scheduling options.
            </p>
            {errors.bookingType && <span className="modal-form__error" style={{ marginBottom: 12, display: 'block' }}>{errors.bookingType}</span>}
            <div className="modal-bt-grid">
              {BOOKING_TYPES.map(bt => {
                const BtIcon = bt.icon;
                const isSelected = form.bookingType === bt.value;
                return (
                  <div
                    key={bt.value}
                    className={`modal-bt-card ${isSelected ? 'modal-bt-card--selected' : ''}`}
                    onClick={() => updateField('bookingType', bt.value)}
                    style={isSelected ? { borderColor: bt.color, boxShadow: `0 0 0 3px ${bt.color}20` } : {}}
                  >
                    {isSelected && (
                      <div className="modal-bt-card__check" style={{ background: bt.color }}>
                        <Check size={12} color="white" />
                      </div>
                    )}
                    <div className="modal-bt-card__icon" style={{ background: `${bt.color}12`, color: bt.color }}>
                      <BtIcon size={28} />
                    </div>
                    <h4 className="modal-bt-card__name">{bt.label}</h4>
                    <p className="modal-bt-card__desc">{bt.description}</p>
                    <span className="modal-bt-card__example">{bt.example}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Appearance */}
        {step === 3 && (
          <div className="modal__body">
            {/* Live Preview */}
            <div className="modal-preview">
              <div className="modal-preview__card">
                <div className="modal-preview__icon" style={{ background: `${form.color}15`, color: form.color }}>
                  <SelectedIcon size={28} />
                </div>
                <h4 className="modal-preview__name">{form.name || 'Service Name'}</h4>
                <p className="modal-preview__desc">{form.description || 'Service description...'}</p>
                <div className="modal-preview__tags">
                  {selectedBT && (
                    <span className="modal-preview__tag" style={{ background: `${selectedBT.color}12`, color: selectedBT.color, borderColor: `${selectedBT.color}30` }}>
                      {selectedBT.label}
                    </span>
                  )}
                  <span className="modal-preview__tag modal-preview__tag--draft">Draft</span>
                </div>
              </div>
            </div>

            {/* Icon Picker */}
            <div className="modal-form__group">
              <label className="modal-form__label">Service Icon</label>
              <div className="modal-icon-grid">
                {ICON_OPTIONS.map(opt => {
                  const Ic = opt.icon;
                  const isSelected = form.icon === opt.value;
                  return (
                    <button
                      key={opt.value}
                      className={`modal-icon-btn ${isSelected ? 'modal-icon-btn--selected' : ''}`}
                      onClick={() => updateField('icon', opt.value)}
                      title={opt.label}
                      style={isSelected ? { borderColor: form.color, color: form.color, background: `${form.color}10` } : {}}
                    >
                      <Ic size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Picker */}
            <div className="modal-form__group">
              <label className="modal-form__label">Brand Color</label>
              <div className="modal-color-grid">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    className={`modal-color-btn ${form.color === c ? 'modal-color-btn--selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => updateField('color', c)}
                  >
                    {form.color === c && <Check size={14} color="white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="modal__footer">
          <div className="modal__footer-left">
            {step > 1 && (
              <button className="btn btn--secondary" onClick={handleBack}>
                ← Back
              </button>
            )}
          </div>
          <div className="modal__footer-right">
            <button className="btn btn--ghost" onClick={handleClose}>Cancel</button>
            {step < 3 ? (
              <button className="btn btn--primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button className="btn btn--primary" onClick={handleCreate}>
                <Sparkles size={14} /> Create Service
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
