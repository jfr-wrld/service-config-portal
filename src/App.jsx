import { FormBuilderProvider, useFormBuilder } from './context/FormBuilderContext';
import StepNavigator from './components/StepNavigator';
import StepContent from './components/StepContent';
import FieldEditor from './components/FieldEditor';
import PreviewMode from './components/PreviewMode';
import JsonViewer from './components/JsonViewer';
import ServiceManagement from './components/ServiceManagement';
import { Layers, Eye, Code2, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { getDefaultSchema } from './data/formSchema';
import { getSchemaForService } from './data/serviceRegistry';

function FormBuilder({ service, onBack }) {
  const { schema, updateSchemaName, setSchema } = useFormBuilder();
  const [viewMode, setViewMode] = useState('build'); // build | preview | json

  const handleReset = () => {
    if (confirm('Reset form schema to default? This cannot be undone.')) {
      setSchema(getSchemaForService(service));
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.name.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
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
            <span>Form Builder</span>
          </div>
          <div className="app-header__divider" />
          <input
            className="app-header__schema-name"
            value={schema.name}
            onChange={(e) => updateSchemaName(e.target.value)}
            spellCheck={false}
          />
          <span className="app-header__service-badge" style={{ background: `${service.color}12`, color: service.color, borderColor: `${service.color}30` }}>
            {service.bookingType}
          </span>
        </div>

        <div className="app-header__right">
          <div className="tab-bar">
            <button
              className={`tab-bar__item ${viewMode === 'build' ? 'tab-bar__item--active' : ''}`}
              onClick={() => setViewMode('build')}
            >
              <Layers size={13} style={{ marginRight: 4, verticalAlign: -2 }} /> Build
            </button>
            <button
              className={`tab-bar__item ${viewMode === 'preview' ? 'tab-bar__item--active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={13} style={{ marginRight: 4, verticalAlign: -2 }} /> Preview
            </button>
            <button
              className={`tab-bar__item ${viewMode === 'json' ? 'tab-bar__item--active' : ''}`}
              onClick={() => setViewMode('json')}
            >
              <Code2 size={13} style={{ marginRight: 4, verticalAlign: -2 }} /> JSON
            </button>
          </div>

          <div className="app-header__divider" />
          <button className="btn btn--ghost btn--sm" onClick={handleReset} title="Reset to default">
            <RotateCcw size={14} /> Reset
          </button>
          <button className="btn btn--primary btn--sm" onClick={handleExport}>
            <Save size={14} /> Export
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="app-layout">
        <StepNavigator />
        {viewMode === 'build' && <StepContent />}
        {viewMode === 'preview' && <PreviewMode />}
        {viewMode === 'json' && <JsonViewer />}
        {viewMode === 'build' && <FieldEditor />}
      </div>
    </>
  );
}

function AppRouter() {
  const [activeService, setActiveService] = useState(null);
  const { setSchema } = useFormBuilder();

  const handleSelectService = (service) => {
    setSchema(getSchemaForService(service));
    setActiveService(service);
  };

  const handleBack = () => {
    setActiveService(null);
  };

  if (!activeService) {
    return <ServiceManagement onSelectService={handleSelectService} />;
  }

  return <FormBuilder service={activeService} onBack={handleBack} />;
}

export default function App() {
  return (
    <FormBuilderProvider>
      <AppRouter />
    </FormBuilderProvider>
  );
}
