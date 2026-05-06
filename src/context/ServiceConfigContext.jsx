import { createContext, useContext, useReducer, useCallback } from 'react';
import { getDefaultRules } from '../data/configSchema';

const ServiceConfigContext = createContext(null);

/* ─── Action Types ─── */
const ACTIONS = {
  SET_RULES: 'SET_RULES',
  UPDATE_RULES: 'UPDATE_RULES',
  TOGGLE_AVAILABILITY_TYPE: 'TOGGLE_AVAILABILITY_TYPE',
  UPDATE_BOOKING_RULES: 'UPDATE_BOOKING_RULES',
};

/* ─── Reducer ─── */
function reducer(state, action) {
  const ts = () => new Date().toISOString();

  switch (action.type) {
    case ACTIONS.SET_RULES:
      return { ...state, rules: action.payload };

    case ACTIONS.UPDATE_RULES:
      return {
        ...state,
        rules: { ...state.rules, ...action.payload, updatedAt: ts() },
      };

    case ACTIONS.TOGGLE_AVAILABILITY_TYPE: {
      const typeKey = action.payload;
      const current = state.rules.availabilityTypes[typeKey] || false;
      return {
        ...state,
        rules: {
          ...state.rules,
          updatedAt: ts(),
          availabilityTypes: {
            ...state.rules.availabilityTypes,
            [typeKey]: !current,
          },
        },
      };
    }

    case ACTIONS.UPDATE_BOOKING_RULES:
      return {
        ...state,
        rules: {
          ...state.rules,
          updatedAt: ts(),
          rules: { ...state.rules.rules, ...action.payload },
        },
      };

    default:
      return state;
  }
}

/* ─── Provider ─── */
export function ServiceConfigProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { rules: null });

  const actions = {
    setRules: useCallback((rules) =>
      dispatch({ type: ACTIONS.SET_RULES, payload: rules }), []),

    updateRules: useCallback((updates) =>
      dispatch({ type: ACTIONS.UPDATE_RULES, payload: updates }), []),

    toggleAvailabilityType: useCallback((typeKey) =>
      dispatch({ type: ACTIONS.TOGGLE_AVAILABILITY_TYPE, payload: typeKey }), []),

    updateBookingRules: useCallback((updates) =>
      dispatch({ type: ACTIONS.UPDATE_BOOKING_RULES, payload: updates }), []),
  };

  return (
    <ServiceConfigContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ServiceConfigContext.Provider>
  );
}

export function useServiceConfig() {
  const ctx = useContext(ServiceConfigContext);
  if (!ctx) throw new Error('useServiceConfig must be used within ServiceConfigProvider');
  return ctx;
}
