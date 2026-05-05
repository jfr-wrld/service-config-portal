import { useServiceConfig, CONFIG_STEPS } from '../context/ServiceConfigContext';
import {
  Settings, DollarSign, CalendarDays, FileText, CheckCircle,
  Check
} from 'lucide-react';

const STEP_ICONS = { Settings, DollarSign, CalendarDays, FileText, CheckCircle };

export default function ConfigStepNav() {
  const { activeStepId, setActiveStep, config } = useServiceConfig();

  return (
    <aside className="sidebar">
      <div className="sidebar__title">Configuration</div>
      <div className="sidebar__steps">
        {CONFIG_STEPS.map((step) => {
          const Icon = STEP_ICONS[step.icon] || Settings;
          const isActive = step.id === activeStepId;
          const isCompleted = getStepCompletion(step.id, config);

          return (
            <div
              key={step.id}
              className={`step-item ${isActive ? 'step-item--active' : ''} ${isCompleted ? 'step-item--completed' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="step-item__number">
                {isCompleted ? <Check size={12} /> : step.order}
              </span>
              <div className="step-item__icon">
                <Icon size={18} />
              </div>
              <div className="step-item__info">
                <div className="step-item__name">{step.name}</div>
                <div className="step-item__meta">{getStepMeta(step.id, config)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function getStepCompletion(stepId, config) {
  if (!config) return false;
  switch (stepId) {
    case 'basic-info':
      return config.basicInfo.name && config.basicInfo.description;
    case 'pricing':
      return config.pricing.packages.length > 0 && config.pricing.packages.some(p => p.name);
    case 'availability': {
      const enabled = Object.values(config.availability.enabledTypes).some(v => v);
      return config.bookingType === 'on-demand' || enabled;
    }
    case 'additional':
      return true; // optional step
    case 'review':
      return false;
    default:
      return false;
  }
}

function getStepMeta(stepId, config) {
  if (!config) return '';
  switch (stepId) {
    case 'basic-info':
      return config.basicInfo.locationType || 'Configure';
    case 'pricing':
      return `${config.pricing.packages.length} package${config.pricing.packages.length !== 1 ? 's' : ''}`;
    case 'availability': {
      const count = Object.values(config.availability.enabledTypes).filter(v => v).length;
      return config.bookingType === 'on-demand' ? 'Request-based' : `${count} type${count !== 1 ? 's' : ''} active`;
    }
    case 'additional':
      return `${config.additionalInfo.fields.length} field${config.additionalInfo.fields.length !== 1 ? 's' : ''}`;
    case 'review':
      return 'Review & Export';
    default:
      return '';
  }
}
