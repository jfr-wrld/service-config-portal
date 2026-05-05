import { useFormBuilder } from '../context/FormBuilderContext';

export default function PreviewMode() {
  const { schema, activeStep } = useFormBuilder();

  const step = activeStep || schema.steps[0];

  return (
    <div className="main-content">
      <div className="preview-container animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="badge badge--mandatory" style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
            👁️ Scholar Preview Mode
          </span>
        </div>

        <div className="preview-step-title">{step.name}</div>

        {step.sections.filter(s => s.visible).map((section) => (
          <div className="preview-section" key={section.id}>
            <div className="preview-section__title">{section.name}</div>
            {section.fields.filter(f => f.visible !== false).map((field) => (
              <div className="preview-field" key={field.id}>
                <div className="preview-field__label">
                  {field.label}
                  {field.required && <span className="preview-field__required">*</span>}
                  {field.locked && field.defaultValue && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 500, marginLeft: 6 }}>
                      🔒 Auto
                    </span>
                  )}
                </div>
                {renderPreviewField(field)}
                {field.helpText && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {field.helpText}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Step navigation preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn btn--secondary" disabled={step.order === 1}>← Previous</button>
          <button className="btn btn--primary">
            {step.order === schema.steps.length ? 'Submit' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function renderPreviewField(field) {
  const isLocked = field.locked && field.defaultValue;

  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
    case 'time':
      return (
        <input
          className="preview-field__input"
          type={field.type === 'number' ? 'text' : field.type}
          value={isLocked ? (field.placeholder || field.defaultValue) : ''}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          disabled
          readOnly
          style={isLocked ? { background: 'var(--bg-tertiary)', fontWeight: 600, color: 'var(--accent)' } : {}}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="preview-field__input"
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          rows={3}
          disabled
          style={{ resize: 'vertical' }}
        />
      );
    case 'dropdown':
      return (
        <select
          className="preview-field__input"
          disabled
          value={field.defaultValue || ''}
          style={isLocked ? { background: 'var(--bg-tertiary)', fontWeight: 600, color: 'var(--accent)' } : {}}
        >
          {!isLocked && <option>Select {field.label.toLowerCase()}...</option>}
          {field.options?.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
        </select>
      );
    case 'multiselect':
      return (
        <div className="preview-field__checkbox-group">
          {field.options?.length > 0 ? field.options.map(o => (
            <label className="preview-field__checkbox" key={o.id}>
              <input type="checkbox" disabled /> {o.label}
            </label>
          )) : (
            <input className="preview-field__input" placeholder="Multi-select field" disabled />
          )}
        </div>
      );
    case 'radio':
      return (
        <div className="preview-field__radio-group">
          {field.options?.map(o => (
            <label className="preview-field__radio" key={o.id}>
              <input type="radio" name={field.id} disabled defaultChecked={o.isDefault} /> {o.label}
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <label className="preview-field__checkbox">
          <input type="checkbox" disabled /> {field.label}
        </label>
      );
    case 'toggle':
      return (
        <div className="preview-field__toggle">
          <div className={`toggle ${field.defaultValue ? 'toggle--on' : ''}`}>
            <div className="toggle__track"><div className="toggle__thumb" /></div>
            <span className="toggle__label">{field.label}</span>
          </div>
        </div>
      );
    default:
      return <input className="preview-field__input" placeholder={field.placeholder} disabled />;
  }
}
