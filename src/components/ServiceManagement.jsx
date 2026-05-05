import { useState } from 'react';
import {
  MessageSquare, Heart, Scale, Map, Star, Mic,
  Layers, Search, Plus, Clock, CheckCircle2, FileEdit,
  ArrowRight, MoreVertical, Filter, BarChart3,
  Briefcase, Timer, Zap, Package, BookOpen, Headphones,
  GraduationCap, Users, Globe
} from 'lucide-react';
import { SERVICE_REGISTRY, getServiceStats } from '../data/serviceRegistry';
import CreateServiceModal from './CreateServiceModal';

const ICONS = {
  MessageSquare, Heart, Scale, Map, Star, Mic,
  BookOpen, Headphones, GraduationCap, Users, Globe, Briefcase,
};

const BOOKING_TYPE_META = {
  'time-based': { label: 'Time-based', icon: Timer, color: '#0d9488' },
  'package-based': { label: 'Package-based', icon: Package, color: '#f59e0b' },
  'on-demand': { label: 'On-demand', icon: Zap, color: '#059669' },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ServiceManagement({ onSelectService }) {
  const [services, setServices] = useState([...SERVICE_REGISTRY]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = getServiceStats(services);

  const filteredServices = services.filter(s => {
    const matchFilter = filter === 'all' || s.bookingType === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCreateService = (newService) => {
    setServices(prev => [...prev, newService]);
    setShowCreateModal(false);
  };

  return (
    <div className="svc-mgmt">
      {/* Header */}
      <header className="svc-mgmt__header">
        <div className="svc-mgmt__header-left">
          <div className="svc-mgmt__logo">
            <div className="svc-mgmt__logo-icon"><Layers size={20} /></div>
            <div>
              <h1 className="svc-mgmt__title">Service Management</h1>
              <p className="svc-mgmt__subtitle">Manage form templates for each service type</p>
            </div>
          </div>
        </div>
        <div className="svc-mgmt__header-right">
          <button className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create Service
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="svc-stats">
        <div className="svc-stats__card">
          <div className="svc-stats__card-icon" style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488' }}>
            <Briefcase size={20} />
          </div>
          <div className="svc-stats__card-info">
            <span className="svc-stats__card-value">{stats.total}</span>
            <span className="svc-stats__card-label">Total Services</span>
          </div>
        </div>
        <div className="svc-stats__card">
          <div className="svc-stats__card-icon" style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="svc-stats__card-info">
            <span className="svc-stats__card-value">{stats.published}</span>
            <span className="svc-stats__card-label">Published</span>
          </div>
        </div>
        <div className="svc-stats__card">
          <div className="svc-stats__card-icon" style={{ background: 'rgba(249,115,22,0.08)', color: '#f97316' }}>
            <FileEdit size={20} />
          </div>
          <div className="svc-stats__card-info">
            <span className="svc-stats__card-value">{stats.draft}</span>
            <span className="svc-stats__card-label">Draft</span>
          </div>
        </div>
        <div className="svc-stats__card">
          <div className="svc-stats__card-icon" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}>
            <BarChart3 size={20} />
          </div>
          <div className="svc-stats__card-info">
            <span className="svc-stats__card-value">3</span>
            <span className="svc-stats__card-label">Booking Types</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="svc-toolbar">
        <div className="svc-toolbar__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="svc-toolbar__filters">
          <Filter size={14} />
          {['all', 'time-based', 'package-based', 'on-demand'].map((f) => (
            <button
              key={f}
              className={`svc-toolbar__filter-btn ${filter === f ? 'svc-toolbar__filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : BOOKING_TYPE_META[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Grid */}
      <div className="svc-grid">
        {filteredServices.map((service) => {
          const Icon = ICONS[service.icon] || Briefcase;
          const bookingMeta = BOOKING_TYPE_META[service.bookingType];
          const BookingIcon = bookingMeta?.icon || Briefcase;

          return (
            <div
              key={service.id}
              className="svc-card"
              onClick={() => onSelectService(service)}
            >
              {/* Card Header with Icon */}
              <div className="svc-card__header">
                <div className="svc-card__icon" style={{ background: `${service.color}15`, color: service.color }}>
                  <Icon size={24} />
                </div>
                <div className="svc-card__actions">
                  <button className="svc-card__menu-btn" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="svc-card__body">
                <h3 className="svc-card__name">{service.name}</h3>
                <p className="svc-card__desc">{service.description}</p>
              </div>

              {/* Tags */}
              <div className="svc-card__tags">
                <span
                  className="svc-card__tag"
                  style={{ background: `${bookingMeta.color}10`, color: bookingMeta.color, borderColor: `${bookingMeta.color}25` }}
                >
                  <BookingIcon size={12} /> {bookingMeta.label}
                </span>
                <span className={`svc-card__status svc-card__status--${service.status}`}>
                  {service.status === 'published' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {service.status}
                </span>
              </div>

              {/* Card Footer */}
              <div className="svc-card__footer">
                <div className="svc-card__meta">
                  <span>v{service.version}</span>
                  <span>·</span>
                  <span>Updated {formatDate(service.updatedAt)}</span>
                </div>
                <div className="svc-card__enter">
                  <span>Edit Template</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Card */}
        <div className="svc-card svc-card--add" onClick={() => setShowCreateModal(true)}>
          <div className="svc-card--add__inner">
            <Plus size={28} />
            <span>Create New Service</span>
          </div>
        </div>
      </div>

      {/* Create Service Modal */}
      <CreateServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateService={handleCreateService}
      />
    </div>
  );
}
