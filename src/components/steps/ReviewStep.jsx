import { useServiceConfig } from '../../context/ServiceConfigContext';
import {
  BOOKING_TYPES, AVAILABILITY_TYPES, AVAILABILITY_BY_BOOKING_TYPE,
} from '../../data/configSchema';
import {
  Check, CheckCircle, Copy, Code2, Settings, DollarSign,
  CalendarDays, FileText, Package, Timer, Zap, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

const BT_ICONS = { 'time-based': Timer, 'package-based': Package, 'on-demand': Zap };

export default function ReviewStep() {
  const { config } = useServiceConfig();
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const bt = config.bookingType;
  const btMeta = BOOKING_TYPES[bt];
  const BtIcon = BT_ICONS[bt] || Package;

  const jsonStr = JSON.stringify(config, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.serviceName.replace(/\s+/g, '_').toLowerCase()}_config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Validation checks
  const checks = [
    { label: 'Service name', ok: !!config.basicInfo.name },
    { label: 'Description', ok: !!config.basicInfo.description },
    { label: 'At least 1 package', ok: config.pricing.packages.length > 0 },
    { label: 'Package has name', ok: config.pricing.packages.some(p => !!p.name) },
    { label: 'Package has price', ok: config.pricing.packages.some(p => p.price > 0) },
    ...(bt !== 'on-demand' ? [{
      label: 'Availability configured',
      ok: Object.values(config.availability.enabledTypes).some(v => v),
    }] : []),
  ];
  const allPassed = checks.every(c => c.ok);

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">Step 5: Review</div>
          <div className="main-content__subtitle">Review your configuration and export</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--secondary btn--sm" onClick={() => setShowJson(!showJson)}>
            <Code2 size={14} /> {showJson ? 'Summary' : 'JSON'}
          </button>
          <button className="btn btn--secondary btn--sm" onClick={handleCopy}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy JSON</>}
          </button>
          <button className="btn btn--primary btn--sm" onClick={handleExport}>
            <DollarSign size={14} /> Export
          </button>
        </div>
      </div>

      {showJson ? (
        <div className="json-panel animate-fade-in" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <pre>{jsonStr}</pre>
        </div>
      ) : (
        <div className="review-content animate-fade-in">
          {/* Validation Checklist */}
          <div className={`review-checklist ${allPassed ? 'review-checklist--pass' : 'review-checklist--warn'}`}>
            <div className="review-checklist__header">
              {allPassed ? <CheckCircle size={18} color="var(--success)" /> : <AlertCircle size={18} color="var(--warning)" />}
              <span>{allPassed ? 'All checks passed — ready to publish' : 'Some items need attention'}</span>
            </div>
            <div className="review-checklist__items">
              {checks.map((c, i) => (
                <div key={i} className={`review-check ${c.ok ? 'review-check--ok' : 'review-check--fail'}`}>
                  {c.ok ? <Check size={14} /> : <AlertCircle size={14} />}
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="review-grid">
            {/* Service Info */}
            <ReviewCard title="Service Setup" icon={<Settings size={16} />} step="basic-info">
              <ReviewRow label="Name" value={config.basicInfo.name || '—'} />
              <ReviewRow label="Location" value={config.basicInfo.locationType} />
              <ReviewRow label="Booking Mode" value={config.basicInfo.bookingMode.replace(/-/g, ' ')} />
              <ReviewRow label="Gender" value={config.basicInfo.gender} />
              <ReviewRow label="Countries" value={config.basicInfo.targetCountries.join(', ') || '—'} />
              <ReviewRow label="Languages" value={config.basicInfo.languages.join(', ') || '—'} />
            </ReviewCard>

            {/* Pricing */}
            <ReviewCard title="Pricing" icon={<DollarSign size={16} />} step="pricing">
              <ReviewRow label="Booking Type" value={btMeta.label} badge badgeColor={btMeta.color} />
              <ReviewRow label="Packages" value={`${config.pricing.packages.length} configured`} />
              {config.pricing.packages.map((pkg, i) => (
                <ReviewRow key={pkg.id} label={pkg.name || `Package ${i + 1}`}
                  value={`${pkg.currency?.split(' ')[0] || 'MYR'} ${pkg.price.toLocaleString()}`} />
              ))}
              <ReviewRow label="Add-ons" value={config.pricing.addonsEnabled ? `${config.pricing.addons.length} items` : 'Disabled'} />
            </ReviewCard>

            {/* Availability */}
            <ReviewCard title="Availability" icon={<CalendarDays size={16} />} step="availability">
              {bt === 'on-demand' ? (
                <ReviewRow label="Mode" value="Request-based (no schedule)" />
              ) : (
                <>
                  {Object.entries(config.availability.enabledTypes).map(([key, enabled]) => (
                    <ReviewRow key={key} label={AVAILABILITY_TYPES[key]?.label || key}
                      value={enabled ? '✅ Enabled' : '❌ Disabled'} />
                  ))}
                  <ReviewRow label="Time Format" value={config.availability.timeFormat} />
                  <ReviewRow label="Lead Time" value={`${config.availability.timeRules.leadTimeHours}h`} />
                </>
              )}
            </ReviewCard>

            {/* Additional Info */}
            <ReviewCard title="Additional Info" icon={<FileText size={16} />} step="additional">
              {config.additionalInfo.fields.length === 0 ? (
                <ReviewRow label="Custom Fields" value="None" />
              ) : (
                config.additionalInfo.fields.map((f, i) => (
                  <ReviewRow key={f.id} label={f.label || `Field ${i + 1}`}
                    value={`${f.type}${f.required ? ' (required)' : ''}`} />
                ))
              )}
            </ReviewCard>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ title, icon, step, children }) {
  const { setActiveStep } = useServiceConfig();
  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__title">{icon} {title}</div>
        <button className="btn btn--ghost btn--sm" onClick={() => setActiveStep(step)}>Edit</button>
      </div>
      <div className="review-card__body">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, badge, badgeColor }) {
  return (
    <div className="review-row">
      <span className="review-row__label">{label}</span>
      {badge ? (
        <span className="review-row__badge" style={{ background: `${badgeColor}12`, color: badgeColor, borderColor: `${badgeColor}30` }}>
          {value}
        </span>
      ) : (
        <span className="review-row__value">{value}</span>
      )}
    </div>
  );
}
