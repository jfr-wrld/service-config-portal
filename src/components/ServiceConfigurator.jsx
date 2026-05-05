import { useServiceConfig } from '../context/ServiceConfigContext';
import ConfigStepNav from './ConfigStepNav';
import ServiceSetupStep from './steps/ServiceSetupStep';
import PricingStep from './steps/PricingStep';
import AvailabilityConfigStep from './steps/AvailabilityConfigStep';
import AdditionalInfoStep from './steps/AdditionalInfoStep';
import ReviewStep from './steps/ReviewStep';
import {
  Layers, ArrowLeft, Save, RotateCcw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { BOOKING_TYPES } from '../data/configSchema';
import { CONFIG_STEPS } from '../context/ServiceConfigContext';

export default function ServiceConfigurator({ service, onBack }) {
  const { config, activeStepId, setActiveStep, setConfig } = useServiceConfig();
  const bt = BOOKING_TYPES[service.bookingType];

  const currentStepIdx = CONFIG_STEPS.findIndex(s => s.id === activeStepId);
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === CONFIG_STEPS.length - 1;

  const goNext = () => {
    if (!isLast) setActiveStep(CONFIG_STEPS[currentStepIdx + 1].id);
  };
  const goPrev = () => {
    if (!isFirst) setActiveStep(CONFIG_STEPS[currentStepIdx - 1].id);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.serviceName.replace(/\s+/g, '_').toLowerCase()}_config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-header__left">
          <button className="btn btn--ghost btn--sm btn--back" onClick={onBack} title="Back to Service Management">
            <ArrowLeft size={16} />
          </button>
          <div className="app-header__logo">
            <div className="app-header__logo-icon" style={{ background: service.color }}>
              <Layers size={18} />
            </div>
            <span>Service Config</span>
          </div>
          <div className="app-header__divider" />
          <span className="app-header__schema-name" style={{ cursor: 'default' }}>
            {service.name}
          </span>
          <span className="app-header__service-badge" style={{
            background: `${bt.color}12`, color: bt.color, borderColor: `${bt.color}30`
          }}>
            {bt.label}
          </span>
        </div>

        <div className="app-header__right">
          {/* Step Navigation */}
          <div className="step-nav-inline">
            <button className="btn btn--ghost btn--sm" onClick={goPrev} disabled={isFirst}>
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="step-nav-inline__label">
              Step {currentStepIdx + 1} of {CONFIG_STEPS.length}
            </span>
            <button className="btn btn--ghost btn--sm" onClick={goNext} disabled={isLast}>
              Next <ChevronRight size={14} />
            </button>
          </div>

          <div className="app-header__divider" />
          <button className="btn btn--primary btn--sm" onClick={handleExport}>
            <Save size={14} /> Export
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="app-layout">
        <ConfigStepNav />
        {activeStepId === 'basic-info' && <ServiceSetupStep />}
        {activeStepId === 'pricing' && <PricingStep />}
        {activeStepId === 'availability' && <AvailabilityConfigStep />}
        {activeStepId === 'additional' && <AdditionalInfoStep />}
        {activeStepId === 'review' && <ReviewStep />}
      </div>
    </>
  );
}
