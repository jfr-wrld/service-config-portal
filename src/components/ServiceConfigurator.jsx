import { useServiceConfig } from '../context/ServiceConfigContext';
import AdminConfigPage from './AdminConfigPage';
import { BOOKING_TYPES } from '../data/configSchema';
import {
  Layers, ArrowLeft, Save, Download, Timer, Package, Zap,
} from 'lucide-react';

const BT_ICONS = { Timer, Package, Zap };

export default function ServiceConfigurator({ service, onBack }) {
  const { rules } = useServiceConfig();
  if (!rules) return null;

  const bt = BOOKING_TYPES[service.bookingType];
  const BtIcon = BT_ICONS[bt.icon] || Timer;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(rules, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rules.serviceName.replace(/\s+/g, '_').toLowerCase()}_rules.json`;
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
            <div className="app-header__logo-icon" style={{ background: service.color || bt.color }}>
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
            <BtIcon size={11} /> {bt.label}
          </span>
        </div>

        <div className="app-header__right">
          <button className="btn btn--secondary btn--sm" onClick={handleExport}>
            <Download size={14} /> Export Rules
          </button>
          <button className="btn btn--primary btn--sm">
            <Save size={14} /> Save Config
          </button>
        </div>
      </header>

      {/* One-page body */}
      <div className="admin-page-wrapper">
        <AdminConfigPage />
      </div>
    </>
  );
}
