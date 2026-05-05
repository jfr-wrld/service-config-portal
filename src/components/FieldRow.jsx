import { useFormBuilder } from '../context/FormBuilderContext';
import {
  Type, AlignLeft, Hash, ChevronDown, ListChecks, Circle,
  CheckSquare, Calendar, Clock, ToggleLeft, Lock, Eye, EyeOff,
  Star, Trash2, GripVertical, GitBranch
} from 'lucide-react';

const TYPE_ICONS = {
  text: Type, textarea: AlignLeft, number: Hash, dropdown: ChevronDown,
  multiselect: ListChecks, radio: Circle, checkbox: CheckSquare,
  date: Calendar, time: Clock, toggle: ToggleLeft,
};

export default function FieldRow({ field, isActive, onClick }) {
  const { removeField, toggleFieldVisibility, toggleFieldRequired } = useFormBuilder();
  const Icon = TYPE_ICONS[field.type] || Type;

  // Compute display value for pre-filled fields
  const prefilledValue = (() => {
    if (field.defaultValue && field.locked) {
      // For dropdowns/radio with options, show the default option label
      if (field.options?.length > 0) {
        const defaultOpt = field.options.find(o => o.isDefault);
        if (defaultOpt) return defaultOpt.label;
      }
      // For text/number fields, show placeholder or defaultValue
      if (field.placeholder) return field.placeholder;
      return String(field.defaultValue);
    }
    return null;
  })();

  return (
    <div
      className={`field-row ${isActive ? 'field-row--active' : ''} ${!field.visible ? 'field-row--hidden' : ''}`}
      onClick={onClick}
    >
      <div className="field-row__drag">
        <GripVertical size={14} />
      </div>
      <div className="field-row__icon">
        <Icon size={14} />
      </div>
      <div className="field-row__info">
        <div className="field-row__label">
          {field.label}
          {field.required && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>*</span>}
        </div>
        <div className="field-row__meta-row">
          <span className="field-row__type">{field.type}</span>
          {prefilledValue && (
            <span className="field-row__prefilled">
              → {prefilledValue}
            </span>
          )}
        </div>
      </div>
      <div className="field-row__badges">
        {field.locked && <span className="badge badge--locked"><Lock size={9} /> Core</span>}
        {field.conditions?.length > 0 && (
          <span className="badge badge--conditional"><GitBranch size={9} /> Conditional</span>
        )}
      </div>
      <div className="field-row__actions">
        <button
          className="btn btn--ghost btn--icon btn--sm"
          onClick={(e) => { e.stopPropagation(); toggleFieldRequired(field.id); }}
          title={field.required ? 'Make optional' : 'Make required'}
          disabled={field.locked}
        >
          <Star size={13} fill={field.required ? 'var(--warning)' : 'none'} color={field.required ? 'var(--warning)' : 'var(--text-tertiary)'} />
        </button>
        <button
          className="btn btn--ghost btn--icon btn--sm"
          onClick={(e) => { e.stopPropagation(); toggleFieldVisibility(field.id); }}
          title={field.visible ? 'Hide field' : 'Show field'}
        >
          {field.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        {!field.locked && (
          <button
            className="btn btn--ghost btn--icon btn--sm"
            onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
            title="Remove field"
          >
            <Trash2 size={13} color="var(--danger)" />
          </button>
        )}
      </div>
    </div>
  );
}
