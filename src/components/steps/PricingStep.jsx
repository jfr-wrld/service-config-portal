import { useServiceConfig } from '../../context/ServiceConfigContext';
import {
  BOOKING_TYPES, CURRENCY_OPTIONS, DURATION_TYPES,
  PACKAGE_TIERS, ADDON_PRICING_MODELS,
} from '../../data/configSchema';
import { ConfigSection, ToggleField } from './ServiceSetupStep';
import {
  Plus, Trash2, DollarSign, Package, Timer, Zap,
  ChevronDown, ChevronRight, Star, Gift
} from 'lucide-react';
import { useState } from 'react';

const BT_ICONS = { 'time-based': Timer, 'package-based': Package, 'on-demand': Zap };

export default function PricingStep() {
  const {
    config, updatePricing,
    addPackage, updatePackage, removePackage,
    toggleAddons, addAddon, updateAddon, removeAddon,
  } = useServiceConfig();

  const bt = config.bookingType;
  const btMeta = BOOKING_TYPES[bt];
  const pricing = config.pricing;
  const BtIcon = BT_ICONS[bt] || DollarSign;

  return (
    <div className="main-content">
      <div className="main-content__header">
        <div>
          <div className="main-content__title">Step 2: Pricing</div>
          <div className="main-content__subtitle">Configure pricing based on your booking type</div>
        </div>
      </div>

      {/* Booking Type Banner */}
      <div className="config-banner" style={{ borderLeftColor: btMeta.color }}>
        <div className="config-banner__icon" style={{ background: `${btMeta.color}12`, color: btMeta.color }}>
          <BtIcon size={22} />
        </div>
        <div className="config-banner__text">
          <strong>{btMeta.label} Pricing</strong>
          <span>{btMeta.description}</span>
        </div>
      </div>

      {/* ─── Packages ─── */}
      <ConfigSection
        title={bt === 'time-based' ? 'Session Packages' : bt === 'package-based' ? 'Service Packages' : 'Event Packages'}
        icon={<Package size={16} />}
        badge={`${pricing.packages.length} item${pricing.packages.length !== 1 ? 's' : ''}`}
        expanded={true}
        onToggle={() => {}}
      >
        <div className="config-packages">
          {pricing.packages.map((pkg, idx) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={idx}
              bookingType={bt}
              onUpdate={(updates) => updatePackage(pkg.id, updates)}
              onRemove={() => removePackage(pkg.id)}
              canRemove={pricing.packages.length > 1}
            />
          ))}

          <button className="config-add-btn" onClick={addPackage}>
            <Plus size={16} /> Add {bt === 'time-based' ? 'Session' : bt === 'package-based' ? 'Package' : 'Event'}
          </button>
        </div>
      </ConfigSection>

      {/* ─── Add-ons ─── */}
      <ConfigSection
        title="Add-ons"
        icon={<Gift size={16} />}
        badge="Optional"
        expanded={pricing.addonsEnabled}
        onToggle={toggleAddons}
      >
        {pricing.addonsEnabled && (
          <div className="config-packages">
            {pricing.addons.map((addon, idx) => (
              <AddonCard
                key={addon.id}
                addon={addon}
                index={idx}
                onUpdate={(updates) => updateAddon(addon.id, updates)}
                onRemove={() => removeAddon(addon.id)}
              />
            ))}
            <button className="config-add-btn" onClick={addAddon}>
              <Plus size={16} /> Add Add-on
            </button>
          </div>
        )}
      </ConfigSection>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* Package Card                                                   */
/* ═══════════════════════════════════════════════════════════════ */
function PackageCard({ pkg, index, bookingType, onUpdate, onRemove, canRemove }) {
  const [expanded, setExpanded] = useState(index === 0);

  const labels = {
    'time-based': { title: 'Session', durLabel: 'Session Duration' },
    'package-based': { title: 'Package', durLabel: 'Trip Duration' },
    'on-demand': { title: 'Event', durLabel: 'Event Duration' },
  };
  const l = labels[bookingType] || labels['time-based'];

  return (
    <div className="pkg-config-card">
      <div className="pkg-config-card__header" onClick={() => setExpanded(!expanded)}>
        <div className="pkg-config-card__header-left">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="pkg-config-card__title">
            {pkg.name || `${l.title} ${index + 1}`}
          </span>
          {pkg.price > 0 && (
            <span className="pkg-config-card__price">
              {pkg.currency?.split(' ')[0]} {pkg.price.toLocaleString()}
            </span>
          )}
        </div>
        <div className="pkg-config-card__header-right">
          <span className={`badge ${pkg.status === 'active' ? 'badge--mandatory' : 'badge--hidden'}`}>
            {pkg.status}
          </span>
          {canRemove && (
            <button className="btn btn--ghost btn--icon btn--sm" onClick={e => { e.stopPropagation(); onRemove(); }}>
              <Trash2 size={14} color="var(--danger)" />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="pkg-config-card__body">
          <div className="config-form">
            {/* Row 1: Name + Tier */}
            <div className="config-form__row">
              <div className="config-form__group config-form__group--grow">
                <label className="config-form__label">{l.title} Name <span className="config-form__required">*</span></label>
                <input
                  className="config-form__input"
                  value={pkg.name}
                  onChange={e => onUpdate({ name: e.target.value })}
                  placeholder={`e.g. ${bookingType === 'time-based' ? 'Basic Consultation' : bookingType === 'package-based' ? 'Umrah Standard' : 'Wedding Ceremony'}`}
                />
              </div>
              {bookingType === 'package-based' && (
                <div className="config-form__group">
                  <label className="config-form__label">Tier</label>
                  <select className="config-form__input" value={pkg.packageTier || ''} onChange={e => onUpdate({ packageTier: e.target.value })}>
                    <option value="">Select tier</option>
                    {PACKAGE_TIERS.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="config-form__group">
              <label className="config-form__label">Description</label>
              <textarea
                className="config-form__input config-form__textarea"
                value={pkg.description}
                onChange={e => onUpdate({ description: e.target.value })}
                placeholder="What does this package include?"
                rows={2}
              />
            </div>

            {/* Row 2: Duration + Sessions */}
            <div className="config-form__row">
              <div className="config-form__group">
                <label className="config-form__label">{l.durLabel}</label>
                <div className="config-form__inline">
                  <input
                    className="config-form__input config-form__input--sm"
                    type="number" min={1}
                    value={pkg.durationValue}
                    onChange={e => onUpdate({ durationValue: Number(e.target.value) })}
                  />
                  <select className="config-form__input" value={pkg.durationType} onChange={e => onUpdate({ durationType: e.target.value })}>
                    {DURATION_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              {bookingType === 'time-based' && (
                <div className="config-form__group">
                  <label className="config-form__label">Total Sessions</label>
                  <input
                    className="config-form__input config-form__input--sm"
                    type="number" min={1}
                    value={pkg.totalSessions}
                    onChange={e => onUpdate({ totalSessions: Number(e.target.value) })}
                  />
                </div>
              )}

              <div className="config-form__group">
                <label className="config-form__label">Participant</label>
                <div className="config-radio-group">
                  {['personal', 'group'].map(v => (
                    <label key={v} className={`config-radio ${pkg.participantType === v ? 'config-radio--active' : ''}`}>
                      <input type="radio" name={`participant-${pkg.id}`} value={v}
                        checked={pkg.participantType === v} onChange={() => onUpdate({ participantType: v })} />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {pkg.participantType === 'group' && (
                <div className="config-form__group">
                  <label className="config-form__label">Max Quota</label>
                  <input className="config-form__input config-form__input--sm" type="number" min={1}
                    value={pkg.maxQuota} onChange={e => onUpdate({ maxQuota: Number(e.target.value) })} />
                </div>
              )}
            </div>

            {/* Row 3: Pricing */}
            <div className="config-form__row">
              <div className="config-form__group">
                <label className="config-form__label">Currency</label>
                <select className="config-form__input" value={pkg.currency} onChange={e => onUpdate({ currency: e.target.value })}>
                  {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="config-form__group">
                <label className="config-form__label">
                  <DollarSign size={13} style={{ verticalAlign: -2 }} /> Price <span className="config-form__required">*</span>
                </label>
                <input
                  className="config-form__input"
                  type="number" min={0}
                  value={pkg.price}
                  onChange={e => onUpdate({ price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="config-form__group" style={{ paddingTop: 24 }}>
                <ToggleField label="One-Time" checked={pkg.oneTime} onChange={v => onUpdate({ oneTime: v })} />
              </div>
            </div>

            {/* Tax */}
            <div className="config-form__row">
              <ToggleField label="Apply Tax" hint="Add tax to pricing" checked={pkg.taxEnabled} onChange={v => onUpdate({ taxEnabled: v })} />
              {pkg.taxEnabled && (
                <div className="config-form__group">
                  <label className="config-form__label">Tax Rate (%)</label>
                  <input className="config-form__input config-form__input--sm" type="number" min={0} max={100}
                    value={pkg.taxRate} onChange={e => onUpdate({ taxRate: Number(e.target.value) })} />
                </div>
              )}
            </div>

            {/* Status */}
            <div className="config-form__group">
              <label className="config-form__label">Status</label>
              <div className="config-radio-group">
                {['active', 'inactive', 'draft'].map(v => (
                  <label key={v} className={`config-radio ${pkg.status === v ? 'config-radio--active' : ''}`}>
                    <input type="radio" name={`status-${pkg.id}`} value={v}
                      checked={pkg.status === v} onChange={() => onUpdate({ status: v })} />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* Add-on Card                                                    */
/* ═══════════════════════════════════════════════════════════════ */
function AddonCard({ addon, index, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="pkg-config-card pkg-config-card--addon">
      <div className="pkg-config-card__header" onClick={() => setExpanded(!expanded)}>
        <div className="pkg-config-card__header-left">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Gift size={14} color="var(--accent)" />
          <span className="pkg-config-card__title">{addon.name || `Add-on ${index + 1}`}</span>
          {addon.price > 0 && <span className="pkg-config-card__price">+{addon.price}</span>}
        </div>
        <div className="pkg-config-card__header-right">
          {addon.mandatory && <span className="badge badge--mandatory">Mandatory</span>}
          <button className="btn btn--ghost btn--icon btn--sm" onClick={e => { e.stopPropagation(); onRemove(); }}>
            <Trash2 size={14} color="var(--danger)" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pkg-config-card__body">
          <div className="config-form">
            <div className="config-form__row">
              <div className="config-form__group config-form__group--grow">
                <label className="config-form__label">Add-on Name</label>
                <input className="config-form__input" value={addon.name}
                  onChange={e => onUpdate({ name: e.target.value })}
                  placeholder="e.g. Extra Consultation Hour" />
              </div>
              <div className="config-form__group">
                <label className="config-form__label">Pricing Model</label>
                <select className="config-form__input" value={addon.pricingModel}
                  onChange={e => onUpdate({ pricingModel: e.target.value })}>
                  {ADDON_PRICING_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>

            <div className="config-form__row">
              <div className="config-form__group">
                <label className="config-form__label">Price</label>
                <input className="config-form__input" type="number" min={0}
                  value={addon.price} onChange={e => onUpdate({ price: Number(e.target.value) })} />
              </div>
              <div className="config-form__group">
                <label className="config-form__label">Max Quantity</label>
                <input className="config-form__input config-form__input--sm" type="number" min={0}
                  value={addon.maxQuantity} onChange={e => onUpdate({ maxQuantity: Number(e.target.value) })}
                  placeholder="0 = unlimited" />
              </div>
              <div className="config-form__group" style={{ paddingTop: 24 }}>
                <ToggleField label="Mandatory" checked={addon.mandatory} onChange={v => onUpdate({ mandatory: v })} />
              </div>
            </div>

            <div className="config-form__group">
              <label className="config-form__label">Delivery Format</label>
              <div className="config-radio-group">
                {['online', 'physical', 'both'].map(v => (
                  <label key={v} className={`config-radio ${addon.deliveryFormat === v ? 'config-radio--active' : ''}`}>
                    <input type="radio" name={`delivery-${addon.id}`} value={v}
                      checked={addon.deliveryFormat === v} onChange={() => onUpdate({ deliveryFormat: v })} />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
