import { useFormBuilder } from '../context/FormBuilderContext';
import FieldRow from './FieldRow';
import {
  ChevronDown, ChevronRight, Eye, EyeOff, Lock, Plus, Shield, GitBranch
} from 'lucide-react';
import { useState } from 'react';

export default function SectionCard({ section, stepId, isActive }) {
  const {
    setActiveSection, setActiveField, activeFieldId,
    toggleSectionVisibility, addField
  } = useFormBuilder();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => setIsExpanded(!isExpanded);
  const handleClick = () => setActiveSection(section.id);

  const handleAddField = (e) => {
    e.stopPropagation();
    addField(stepId, section.id, { label: 'New Field' });
  };

  // Filter visible fields for display
  const visibleFields = section.fields.filter(f => f.visible !== false);
  const hiddenFieldCount = section.fields.length - visibleFields.length;

  return (
    <div
      className={`section-card animate-fade-in ${isActive ? 'section-card--active' : ''} ${!section.visible ? 'section-card--hidden' : ''}`}
    >
      <div className="section-card__header" onClick={() => { handleClick(); handleToggle(); }}>
        <div className="section-card__header-left">
          {isExpanded ? <ChevronDown size={16} color="var(--text-tertiary)" /> : <ChevronRight size={16} color="var(--text-tertiary)" />}
          <span className="section-card__name">{section.name}</span>
          <div className="section-card__badges">
            {section.mandatory && <span className="badge badge--mandatory"><Shield size={9} /> Required</span>}
            {section.locked && <span className="badge badge--locked"><Lock size={9} /> Locked</span>}
            {!section.visible && <span className="badge badge--hidden"><EyeOff size={9} /> Hidden</span>}
            {section.conditions?.length > 0 && <span className="badge badge--conditional"><GitBranch size={9} /> Conditional</span>}
            <span className="badge badge--count">{visibleFields.length} fields</span>
            {hiddenFieldCount > 0 && (
              <span className="badge badge--hidden" title={`${hiddenFieldCount} field(s) hidden for this booking type`}>
                +{hiddenFieldCount} hidden
              </span>
            )}
          </div>
        </div>
        <div className="section-card__actions">
          {!section.mandatory && (
            <button
              className="btn btn--ghost btn--icon btn--sm"
              onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(stepId, section.id); }}
              title={section.visible ? 'Hide section' : 'Show section'}
            >
              {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && section.visible && (
        <div className="section-card__body">
          {visibleFields.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              isActive={activeFieldId === field.id}
              onClick={() => { setActiveSection(section.id); setActiveField(field.id); }}
            />
          ))}
          <button className="add-field-btn" onClick={handleAddField}>
            <Plus size={14} /> Add Custom Field
          </button>
        </div>
      )}
    </div>
  );
}
