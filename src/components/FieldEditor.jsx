import { useFormBuilder } from '../context/FormBuilderContext';
import { FIELD_TYPES, CONDITION_TYPES } from '../data/formSchema';
import {
  X, Lock, Plus, Trash2, Star, GripVertical, GitBranch
} from 'lucide-react';
import { useState } from 'react';

export default function FieldEditor() {
  const {
    activeField, activeFieldId, setActiveField,
    updateField, addOption, updateOption, removeOption, setDefaultOption,
    addCondition, removeCondition, updateCondition,
  } = useFormBuilder();

  if (!activeField) {
    return (
      <aside className="right-panel">
        <div className="right-panel__header">
          <span className="right-panel__title">Field Properties</span>
        </div>
        <div className="right-panel__empty">
          <div className="right-panel__empty-icon">🎯</div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Field Selected</div>
          <div style={{ fontSize: '0.82rem' }}>Click on a field to edit its properties, visibility rules, and options.</div>
        </div>
      </aside>
    );
  }

  const hasOptions = ['dropdown', 'multiselect', 'radio'].includes(activeField.type);

  return (
    <aside className="right-panel animate-slide-in" key={activeFieldId}>
      <div className="right-panel__header">
        <span className="right-panel__title">
          {activeField.locked && <Lock size={12} style={{ marginRight: 6, color: 'var(--warning)' }} />}
          Field Properties
        </span>
        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setActiveField(null)}>
          <X size={16} />
        </button>
      </div>

      <div className="right-panel__body">
        {/* Label */}
        <div className="form-group">
          <label className="form-group__label">Label</label>
          <input
            className="form-group__input"
            value={activeField.label}
            onChange={(e) => updateField(activeFieldId, { label: e.target.value })}
            disabled={activeField.locked}
          />
        </div>

        {/* Field Type */}
        <div className="form-group">
          <label className="form-group__label">Field Type</label>
          <select
            className="form-group__input"
            value={activeField.type}
            onChange={(e) => updateField(activeFieldId, { type: e.target.value })}
            disabled={activeField.locked}
          >
            {FIELD_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Placeholder */}
        <div className="form-group">
          <label className="form-group__label">Placeholder</label>
          <input
            className="form-group__input"
            value={activeField.placeholder || ''}
            onChange={(e) => updateField(activeFieldId, { placeholder: e.target.value })}
            placeholder="Enter placeholder text..."
          />
        </div>

        {/* Help Text */}
        <div className="form-group">
          <label className="form-group__label">Help Text</label>
          <input
            className="form-group__input"
            value={activeField.helpText || ''}
            onChange={(e) => updateField(activeFieldId, { helpText: e.target.value })}
            placeholder="Guidance for the scholar..."
          />
        </div>

        {/* Default Value */}
        <div className="form-group">
          <label className="form-group__label">Default Value</label>
          <input
            className="form-group__input"
            value={activeField.defaultValue || ''}
            onChange={(e) => updateField(activeFieldId, { defaultValue: e.target.value })}
            placeholder="Pre-filled value (if any)..."
            disabled={activeField.locked}
          />
          {activeField.defaultValue && activeField.locked && (
            <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginTop: 4, fontWeight: 500 }}>
              🔒 Auto-set by service configuration
            </div>
          )}
        </div>

        {/* Required Toggle */}
        <div className="form-group">
          <div
            className={`toggle ${activeField.required ? 'toggle--on' : ''}`}
            onClick={() => !activeField.locked && updateField(activeFieldId, { required: !activeField.required })}
            style={activeField.locked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <div className="toggle__track"><div className="toggle__thumb" /></div>
            <span className="toggle__label">Required Field</span>
          </div>
        </div>

        {/* Visible Toggle */}
        <div className="form-group">
          <div
            className={`toggle ${activeField.visible ? 'toggle--on' : ''}`}
            onClick={() => updateField(activeFieldId, { visible: !activeField.visible })}
          >
            <div className="toggle__track"><div className="toggle__thumb" /></div>
            <span className="toggle__label">Visible</span>
          </div>
        </div>

        {/* Options (for dropdown/radio/multiselect) */}
        {hasOptions && (
          <div className="form-group">
            <label className="form-group__label">Options</label>
            <div className="options-editor">
              {activeField.options.map((opt) => (
                <div className="option-row" key={opt.id}>
                  <button
                    className="btn btn--ghost btn--icon btn--sm"
                    onClick={() => setDefaultOption(activeFieldId, opt.id)}
                    title={opt.isDefault ? 'Default option' : 'Set as default'}
                  >
                    <Star size={12} fill={opt.isDefault ? 'var(--warning)' : 'none'} color={opt.isDefault ? 'var(--warning)' : 'var(--text-tertiary)'} />
                  </button>
                  <input
                    className="option-row__input"
                    value={opt.label}
                    onChange={(e) => updateOption(activeFieldId, opt.id, {
                      label: e.target.value,
                      value: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })}
                  />
                  <button
                    className="btn btn--ghost btn--icon btn--sm"
                    onClick={() => removeOption(activeFieldId, opt.id)}
                  >
                    <Trash2 size={12} color="var(--danger)" />
                  </button>
                </div>
              ))}
              <button
                className="btn btn--secondary btn--sm"
                style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
                onClick={() => addOption(activeFieldId, `Option ${activeField.options.length + 1}`)}
              >
                <Plus size={12} /> Add Option
              </button>
            </div>
          </div>
        )}

        {/* Conditions / Rules */}
        <div className="form-group" style={{ marginTop: 24 }}>
          <label className="form-group__label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GitBranch size={12} /> Visibility Rules
          </label>

          {activeField.conditions?.map((cond) => (
            <div className="condition-row" key={cond.id || cond.type}>
              <select
                value={cond.type}
                onChange={(e) => updateCondition(activeFieldId, cond.id, { type: e.target.value, value: '' })}
              >
                <option value="">Select trigger...</option>
                {Object.values(CONDITION_TYPES).map(ct => (
                  <option key={ct.key} value={ct.key}>{ct.label}</option>
                ))}
              </select>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', flexShrink: 0 }}>=</span>
              <select
                value={cond.value}
                onChange={(e) => updateCondition(activeFieldId, cond.id, { value: e.target.value })}
              >
                <option value="">Select value...</option>
                {cond.type && CONDITION_TYPES[
                  Object.keys(CONDITION_TYPES).find(
                    k => CONDITION_TYPES[k].key === cond.type
                  )
                ]?.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                className="btn btn--ghost btn--icon btn--sm"
                onClick={() => removeCondition(activeFieldId, cond.id)}
              >
                <Trash2 size={12} color="var(--danger)" />
              </button>
            </div>
          ))}

          <button
            className="btn btn--secondary btn--sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => addCondition(activeFieldId, { type: '', operator: 'equals', value: '' })}
          >
            <Plus size={12} /> Add Rule
          </button>
        </div>
      </div>
    </aside>
  );
}
