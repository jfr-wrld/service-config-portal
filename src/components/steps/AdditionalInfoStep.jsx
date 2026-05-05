import { useServiceConfig } from '../../context/ServiceConfigContext';
import { Plus, Trash2, Type, AlignLeft, FileText } from 'lucide-react';

export default function AdditionalInfoStep() {
  const { config, addCustomField, updateCustomField, removeCustomField } = useServiceConfig();
  const fields = config.additionalInfo.fields;

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">Step 4: Additional Info</div>
          <div className="main-content__subtitle">Optional custom fields for extra information</div>
        </div>
      </div>

      {/* Info */}
      <div className="config-banner" style={{ borderLeftColor: 'var(--accent)' }}>
        <FileText size={18} />
        <div className="config-banner__text">
          <strong>Lightweight Custom Fields</strong>
          <span>Add simple text or notes fields if you need to collect additional information from scholars. Keep it simple — not a form builder.</span>
        </div>
      </div>

      {/* Fields */}
      <div className="config-custom-fields animate-fade-in">
        {fields.length === 0 ? (
          <div className="config-empty-state config-empty-state--small">
            <div className="config-empty-state__icon">📝</div>
            <div className="config-empty-state__title">No Custom Fields</div>
            <div className="config-empty-state__desc">
              Add optional text or notes fields if needed. Most services don't need this.
            </div>
          </div>
        ) : (
          fields.map((field, idx) => (
            <div key={field.id} className="custom-field-card animate-fade-in">
              <div className="custom-field-card__header">
                <span className="custom-field-card__number">{idx + 1}</span>
                <div className="custom-field-card__type-icon">
                  {field.type === 'textarea' ? <AlignLeft size={14} /> : <Type size={14} />}
                </div>
                <button
                  className="btn btn--ghost btn--icon btn--sm"
                  onClick={() => removeCustomField(field.id)}
                >
                  <Trash2 size={14} color="var(--danger)" />
                </button>
              </div>

              <div className="config-form">
                <div className="config-form__row">
                  <div className="config-form__group config-form__group--grow">
                    <label className="config-form__label">Field Label</label>
                    <input
                      className="config-form__input"
                      value={field.label}
                      onChange={e => updateCustomField(field.id, { label: e.target.value })}
                      placeholder="e.g. Special Notes, Dietary Requirements"
                    />
                  </div>
                  <div className="config-form__group">
                    <label className="config-form__label">Type</label>
                    <select
                      className="config-form__input"
                      value={field.type}
                      onChange={e => updateCustomField(field.id, { type: e.target.value })}
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text / Notes</option>
                    </select>
                  </div>
                </div>

                <div className="config-form__row">
                  <div className="config-form__group config-form__group--grow">
                    <label className="config-form__label">Placeholder</label>
                    <input
                      className="config-form__input"
                      value={field.placeholder}
                      onChange={e => updateCustomField(field.id, { placeholder: e.target.value })}
                      placeholder="Hint text for the scholar..."
                    />
                  </div>
                  <div className="config-form__group" style={{ paddingTop: 24, minWidth: 120 }}>
                    <div
                      className={`toggle ${field.required ? 'toggle--on' : ''}`}
                      onClick={() => updateCustomField(field.id, { required: !field.required })}
                    >
                      <div className="toggle__track"><div className="toggle__thumb" /></div>
                      <span className="toggle__label">Required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <button className="config-add-btn" onClick={addCustomField}>
          <Plus size={16} /> Add Custom Field
        </button>
      </div>
    </div>
  );
}
