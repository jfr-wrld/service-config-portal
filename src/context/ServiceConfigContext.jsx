import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getDefaultServiceConfig,
  createTimePackage,
  createPackageItem,
  createOnDemandPackage,
  createAddon,
  createCustomField,
} from '../data/configSchema';

const ServiceConfigContext = createContext(null);

/* ─── Action Types ─── */
const ACTIONS = {
  SET_CONFIG: 'SET_CONFIG',
  SET_ACTIVE_STEP: 'SET_ACTIVE_STEP',

  // Step 1: Basic Info
  UPDATE_BASIC_INFO: 'UPDATE_BASIC_INFO',

  // Step 2: Pricing
  UPDATE_PRICING: 'UPDATE_PRICING',
  ADD_PACKAGE: 'ADD_PACKAGE',
  UPDATE_PACKAGE: 'UPDATE_PACKAGE',
  REMOVE_PACKAGE: 'REMOVE_PACKAGE',
  TOGGLE_ADDONS: 'TOGGLE_ADDONS',
  ADD_ADDON: 'ADD_ADDON',
  UPDATE_ADDON: 'UPDATE_ADDON',
  REMOVE_ADDON: 'REMOVE_ADDON',

  // Step 3: Availability
  UPDATE_AVAILABILITY: 'UPDATE_AVAILABILITY',
  TOGGLE_AVAILABILITY_TYPE: 'TOGGLE_AVAILABILITY_TYPE',
  SET_ACTIVE_AVAILABILITY_TYPE: 'SET_ACTIVE_AVAILABILITY_TYPE',

  // Step 4: Additional Info
  ADD_CUSTOM_FIELD: 'ADD_CUSTOM_FIELD',
  UPDATE_CUSTOM_FIELD: 'UPDATE_CUSTOM_FIELD',
  REMOVE_CUSTOM_FIELD: 'REMOVE_CUSTOM_FIELD',
};

/* ─── Steps Definition ─── */
export const CONFIG_STEPS = [
  { id: 'basic-info', order: 1, name: 'Service Setup', icon: 'Settings' },
  { id: 'pricing', order: 2, name: 'Pricing', icon: 'DollarSign' },
  { id: 'availability', order: 3, name: 'Availability', icon: 'CalendarDays' },
  { id: 'additional', order: 4, name: 'Additional Info', icon: 'FileText' },
  { id: 'review', order: 5, name: 'Review', icon: 'CheckCircle' },
];

/* ─── Initial State ─── */
const initialState = {
  config: null,
  activeStepId: 'basic-info',
};

/* ─── Reducer ─── */
function reducer(state, action) {
  const ts = () => new Date().toISOString();

  switch (action.type) {
    case ACTIONS.SET_CONFIG:
      return { ...state, config: action.payload, activeStepId: 'basic-info' };

    case ACTIONS.SET_ACTIVE_STEP:
      return { ...state, activeStepId: action.payload };

    /* ── Basic Info ── */
    case ACTIONS.UPDATE_BASIC_INFO:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          basicInfo: { ...state.config.basicInfo, ...action.payload },
        },
      };

    /* ── Pricing ── */
    case ACTIONS.UPDATE_PRICING:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: { ...state.config.pricing, ...action.payload },
        },
      };

    case ACTIONS.ADD_PACKAGE: {
      const bt = state.config.bookingType;
      const newPkg = bt === 'time-based' ? createTimePackage()
        : bt === 'on-demand' ? createOnDemandPackage()
        : createPackageItem();
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            packages: [...state.config.pricing.packages, newPkg],
          },
        },
      };
    }

    case ACTIONS.UPDATE_PACKAGE: {
      const { packageId, updates } = action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            packages: state.config.pricing.packages.map(p =>
              p.id === packageId ? { ...p, ...updates } : p
            ),
          },
        },
      };
    }

    case ACTIONS.REMOVE_PACKAGE: {
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            packages: state.config.pricing.packages.filter(p => p.id !== action.payload),
          },
        },
      };
    }

    case ACTIONS.TOGGLE_ADDONS:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            addonsEnabled: !state.config.pricing.addonsEnabled,
          },
        },
      };

    case ACTIONS.ADD_ADDON:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            addons: [...state.config.pricing.addons, createAddon()],
          },
        },
      };

    case ACTIONS.UPDATE_ADDON: {
      const { addonId, updates } = action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            addons: state.config.pricing.addons.map(a =>
              a.id === addonId ? { ...a, ...updates } : a
            ),
          },
        },
      };
    }

    case ACTIONS.REMOVE_ADDON:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          pricing: {
            ...state.config.pricing,
            addons: state.config.pricing.addons.filter(a => a.id !== action.payload),
          },
        },
      };

    /* ── Availability ── */
    case ACTIONS.UPDATE_AVAILABILITY:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          availability: { ...state.config.availability, ...action.payload },
        },
      };

    case ACTIONS.TOGGLE_AVAILABILITY_TYPE: {
      const typeKey = action.payload;
      const current = state.config.availability.enabledTypes[typeKey] || false;
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          availability: {
            ...state.config.availability,
            enabledTypes: {
              ...state.config.availability.enabledTypes,
              [typeKey]: !current,
            },
            // If toggling on and no active type, set this as active
            activeType: !current && !state.config.availability.activeType
              ? typeKey
              : current && state.config.availability.activeType === typeKey
                ? null
                : state.config.availability.activeType,
          },
        },
      };
    }

    case ACTIONS.SET_ACTIVE_AVAILABILITY_TYPE:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          availability: {
            ...state.config.availability,
            activeType: action.payload,
          },
        },
      };

    /* ── Additional Info ── */
    case ACTIONS.ADD_CUSTOM_FIELD:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          additionalInfo: {
            ...state.config.additionalInfo,
            fields: [...state.config.additionalInfo.fields, createCustomField()],
          },
        },
      };

    case ACTIONS.UPDATE_CUSTOM_FIELD: {
      const { fieldId, updates } = action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          additionalInfo: {
            ...state.config.additionalInfo,
            fields: state.config.additionalInfo.fields.map(f =>
              f.id === fieldId ? { ...f, ...updates } : f
            ),
          },
        },
      };
    }

    case ACTIONS.REMOVE_CUSTOM_FIELD:
      return {
        ...state,
        config: {
          ...state.config,
          updatedAt: ts(),
          additionalInfo: {
            ...state.config.additionalInfo,
            fields: state.config.additionalInfo.fields.filter(f => f.id !== action.payload),
          },
        },
      };

    default:
      return state;
  }
}

/* ─── Provider ─── */
export function ServiceConfigProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    setConfig: useCallback((config) =>
      dispatch({ type: ACTIONS.SET_CONFIG, payload: config }), []),
    setActiveStep: useCallback((id) =>
      dispatch({ type: ACTIONS.SET_ACTIVE_STEP, payload: id }), []),

    // Basic Info
    updateBasicInfo: useCallback((updates) =>
      dispatch({ type: ACTIONS.UPDATE_BASIC_INFO, payload: updates }), []),

    // Pricing
    updatePricing: useCallback((updates) =>
      dispatch({ type: ACTIONS.UPDATE_PRICING, payload: updates }), []),
    addPackage: useCallback(() =>
      dispatch({ type: ACTIONS.ADD_PACKAGE }), []),
    updatePackage: useCallback((packageId, updates) =>
      dispatch({ type: ACTIONS.UPDATE_PACKAGE, payload: { packageId, updates } }), []),
    removePackage: useCallback((packageId) =>
      dispatch({ type: ACTIONS.REMOVE_PACKAGE, payload: packageId }), []),
    toggleAddons: useCallback(() =>
      dispatch({ type: ACTIONS.TOGGLE_ADDONS }), []),
    addAddon: useCallback(() =>
      dispatch({ type: ACTIONS.ADD_ADDON }), []),
    updateAddon: useCallback((addonId, updates) =>
      dispatch({ type: ACTIONS.UPDATE_ADDON, payload: { addonId, updates } }), []),
    removeAddon: useCallback((addonId) =>
      dispatch({ type: ACTIONS.REMOVE_ADDON, payload: addonId }), []),

    // Availability
    updateAvailability: useCallback((updates) =>
      dispatch({ type: ACTIONS.UPDATE_AVAILABILITY, payload: updates }), []),
    toggleAvailabilityType: useCallback((typeKey) =>
      dispatch({ type: ACTIONS.TOGGLE_AVAILABILITY_TYPE, payload: typeKey }), []),
    setActiveAvailabilityType: useCallback((typeKey) =>
      dispatch({ type: ACTIONS.SET_ACTIVE_AVAILABILITY_TYPE, payload: typeKey }), []),

    // Additional Info
    addCustomField: useCallback(() =>
      dispatch({ type: ACTIONS.ADD_CUSTOM_FIELD }), []),
    updateCustomField: useCallback((fieldId, updates) =>
      dispatch({ type: ACTIONS.UPDATE_CUSTOM_FIELD, payload: { fieldId, updates } }), []),
    removeCustomField: useCallback((fieldId) =>
      dispatch({ type: ACTIONS.REMOVE_CUSTOM_FIELD, payload: fieldId }), []),
  };

  const activeStep = CONFIG_STEPS.find(s => s.id === state.activeStepId);

  return (
    <ServiceConfigContext.Provider value={{ ...state, ...actions, activeStep }}>
      {children}
    </ServiceConfigContext.Provider>
  );
}

export function useServiceConfig() {
  const ctx = useContext(ServiceConfigContext);
  if (!ctx) throw new Error('useServiceConfig must be used within ServiceConfigProvider');
  return ctx;
}
