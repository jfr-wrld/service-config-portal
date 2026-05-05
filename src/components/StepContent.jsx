import { useFormBuilder } from '../context/FormBuilderContext';
import SectionCard from './SectionCard';
import { Info } from 'lucide-react';

export default function StepContent() {
  const { activeStep, activeSectionId } = useFormBuilder();

  if (!activeStep) return null;

  // Only render visible sections
  const visibleSections = activeStep.sections.filter(s => s.visible);
  const hiddenCount = activeStep.sections.length - visibleSections.length;

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">
            Step {activeStep.order}: {activeStep.name}
          </div>
          <div className="main-content__subtitle">
            Configure sections and fields for this step
          </div>
        </div>
      </div>

      {hiddenCount > 0 && (
        <div className="step-info-banner">
          <Info size={15} />
          <span>{hiddenCount} section{hiddenCount > 1 ? 's' : ''} hidden — not applicable for this service's booking type</span>
        </div>
      )}

      {visibleSections.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__title">No Active Sections</div>
          <div className="empty-state__desc">
            All sections in this step are hidden for this service's booking type configuration.
          </div>
        </div>
      ) : (
        visibleSections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            stepId={activeStep.id}
            isActive={activeSectionId === section.id}
          />
        ))
      )}
    </div>
  );
}
