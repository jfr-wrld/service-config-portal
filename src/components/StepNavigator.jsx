import { useFormBuilder } from '../context/FormBuilderContext';
import {
  Settings, DollarSign, Percent, MapPin, CalendarDays, Image as ImageIcon,
  Lock
} from 'lucide-react';

const STEP_ICONS = {
  Settings, DollarSign, Percent, MapPin, CalendarDays, Image: ImageIcon,
};

export default function StepNavigator() {
  const { schema, activeStepId, setActiveStep } = useFormBuilder();

  return (
    <aside className="sidebar">
      <div className="sidebar__title">Form Steps</div>
      <div className="sidebar__steps">
        {schema.steps.map((step) => {
          const Icon = STEP_ICONS[step.icon] || Settings;
          // Only count visible sections and their fields
          const visibleSections = step.sections.filter(s => s.visible);
          const fieldCount = visibleSections.reduce((sum, s) => sum + s.fields.filter(f => f.visible !== false).length, 0);
          const isActive = step.id === activeStepId;

          return (
            <div
              key={step.id}
              className={`step-item ${isActive ? 'step-item--active' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="step-item__number">{step.order}</span>
              <div className="step-item__icon">
                <Icon size={18} />
              </div>
              <div className="step-item__info">
                <div className="step-item__name">{step.name}</div>
                <div className="step-item__meta">
                  {visibleSections.length} sections · {fieldCount} fields
                </div>
              </div>
              {step.locked && <Lock size={12} color="var(--text-tertiary)" />}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
