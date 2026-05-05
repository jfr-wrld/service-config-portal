import { createContext, useContext, useReducer, useCallback } from 'react';
import { getDefaultSchema, createField, createOption } from '../data/formSchema';
import { v4 as uuidv4 } from 'uuid';

const FormBuilderContext = createContext(null);

/* ─── Action Types ─── */
const ACTIONS = {
  SET_SCHEMA: 'SET_SCHEMA',
  SET_ACTIVE_STEP: 'SET_ACTIVE_STEP',
  SET_ACTIVE_SECTION: 'SET_ACTIVE_SECTION',
  SET_ACTIVE_FIELD: 'SET_ACTIVE_FIELD',
  TOGGLE_PREVIEW: 'TOGGLE_PREVIEW',
  
  // Section
  TOGGLE_SECTION_VISIBILITY: 'TOGGLE_SECTION_VISIBILITY',
  
  // Field actions
  ADD_FIELD: 'ADD_FIELD',
  REMOVE_FIELD: 'REMOVE_FIELD',
  UPDATE_FIELD: 'UPDATE_FIELD',
  TOGGLE_FIELD_VISIBILITY: 'TOGGLE_FIELD_VISIBILITY',
  TOGGLE_FIELD_REQUIRED: 'TOGGLE_FIELD_REQUIRED',
  REORDER_FIELDS: 'REORDER_FIELDS',
  
  // Field options
  ADD_OPTION: 'ADD_OPTION',
  UPDATE_OPTION: 'UPDATE_OPTION',
  REMOVE_OPTION: 'REMOVE_OPTION',
  REORDER_OPTIONS: 'REORDER_OPTIONS',
  SET_DEFAULT_OPTION: 'SET_DEFAULT_OPTION',
  
  // Rule engine
  ADD_CONDITION: 'ADD_CONDITION',
  REMOVE_CONDITION: 'REMOVE_CONDITION',
  UPDATE_CONDITION: 'UPDATE_CONDITION',

  // Schema metadata
  UPDATE_SCHEMA_NAME: 'UPDATE_SCHEMA_NAME',
};

/* ─── Initial State ─── */
const initialState = {
  schema: getDefaultSchema(),
  activeStepId: 'step-service-setup',
  activeSectionId: null,
  activeFieldId: null,
  isPreview: false,
  history: [],
};

/* ─── Helper: Deep update field in schema ─── */
function updateFieldInSchema(schema, stepId, sectionId, fieldId, updater) {
  return {
    ...schema,
    updatedAt: new Date().toISOString(),
    steps: schema.steps.map(step => {
      if (step.id !== stepId) return step;
      return {
        ...step,
        sections: step.sections.map(section => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.id !== fieldId) return field;
              return updater(field);
            }),
          };
        }),
      };
    }),
  };
}

function findFieldContext(schema, fieldId) {
  for (const step of schema.steps) {
    for (const section of step.sections) {
      for (const field of section.fields) {
        if (field.id === fieldId) {
          return { stepId: step.id, sectionId: section.id };
        }
      }
    }
  }
  return null;
}

/* ─── Reducer ─── */
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCHEMA:
      return { ...state, schema: action.payload };

    case ACTIONS.SET_ACTIVE_STEP:
      return { ...state, activeStepId: action.payload, activeSectionId: null, activeFieldId: null };

    case ACTIONS.SET_ACTIVE_SECTION:
      return { ...state, activeSectionId: action.payload, activeFieldId: null };

    case ACTIONS.SET_ACTIVE_FIELD:
      return { ...state, activeFieldId: action.payload };

    case ACTIONS.TOGGLE_PREVIEW:
      return { ...state, isPreview: !state.isPreview };

    case ACTIONS.UPDATE_SCHEMA_NAME:
      return {
        ...state,
        schema: { ...state.schema, name: action.payload, updatedAt: new Date().toISOString() },
      };

    case ACTIONS.TOGGLE_SECTION_VISIBILITY: {
      const { stepId, sectionId } = action.payload;
      return {
        ...state,
        schema: {
          ...state.schema,
          updatedAt: new Date().toISOString(),
          steps: state.schema.steps.map(step => {
            if (step.id !== stepId) return step;
            return {
              ...step,
              sections: step.sections.map(section => {
                if (section.id !== sectionId) return section;
                if (section.mandatory) return section;
                return { ...section, visible: !section.visible };
              }),
            };
          }),
        },
      };
    }

    case ACTIONS.ADD_FIELD: {
      const { stepId, sectionId, field } = action.payload;
      return {
        ...state,
        schema: {
          ...state.schema,
          updatedAt: new Date().toISOString(),
          steps: state.schema.steps.map(step => {
            if (step.id !== stepId) return step;
            return {
              ...step,
              sections: step.sections.map(section => {
                if (section.id !== sectionId) return section;
                return { ...section, fields: [...section.fields, field] };
              }),
            };
          }),
        },
        activeFieldId: field.id,
      };
    }

    case ACTIONS.REMOVE_FIELD: {
      const { fieldId } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: {
          ...state.schema,
          updatedAt: new Date().toISOString(),
          steps: state.schema.steps.map(step => {
            if (step.id !== ctx.stepId) return step;
            return {
              ...step,
              sections: step.sections.map(section => {
                if (section.id !== ctx.sectionId) return section;
                return {
                  ...section,
                  fields: section.fields.filter(f => f.id !== fieldId),
                };
              }),
            };
          }),
        },
        activeFieldId: state.activeFieldId === fieldId ? null : state.activeFieldId,
      };
    }

    case ACTIONS.UPDATE_FIELD: {
      const { fieldId, updates } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({ ...f, ...updates })),
      };
    }

    case ACTIONS.TOGGLE_FIELD_VISIBILITY: {
      const { fieldId } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({ ...f, visible: !f.visible })),
      };
    }

    case ACTIONS.TOGGLE_FIELD_REQUIRED: {
      const { fieldId } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({ ...f, required: !f.required })),
      };
    }

    case ACTIONS.REORDER_FIELDS: {
      const { stepId, sectionId, fieldIds } = action.payload;
      return {
        ...state,
        schema: {
          ...state.schema,
          updatedAt: new Date().toISOString(),
          steps: state.schema.steps.map(step => {
            if (step.id !== stepId) return step;
            return {
              ...step,
              sections: step.sections.map(section => {
                if (section.id !== sectionId) return section;
                const fieldMap = {};
                section.fields.forEach(f => { fieldMap[f.id] = f; });
                return {
                  ...section,
                  fields: fieldIds.map(id => fieldMap[id]).filter(Boolean),
                };
              }),
            };
          }),
        },
      };
    }

    case ACTIONS.ADD_OPTION: {
      const { fieldId, option } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f, options: [...f.options, option],
        })),
      };
    }

    case ACTIONS.UPDATE_OPTION: {
      const { fieldId, optionId, updates } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f,
          options: f.options.map(o => o.id === optionId ? { ...o, ...updates } : o),
        })),
      };
    }

    case ACTIONS.REMOVE_OPTION: {
      const { fieldId, optionId } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f,
          options: f.options.filter(o => o.id !== optionId),
        })),
      };
    }

    case ACTIONS.SET_DEFAULT_OPTION: {
      const { fieldId, optionId } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f,
          options: f.options.map(o => ({ ...o, isDefault: o.id === optionId })),
        })),
      };
    }

    case ACTIONS.ADD_CONDITION: {
      const { fieldId, condition } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f,
          conditions: [...f.conditions, { id: uuidv4(), ...condition }],
        })),
      };
    }

    case ACTIONS.REMOVE_CONDITION: {
      const { fieldId, conditionId } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f,
          conditions: f.conditions.filter(c => c.id !== conditionId),
        })),
      };
    }

    case ACTIONS.UPDATE_CONDITION: {
      const { fieldId, conditionId, updates } = action.payload;
      const ctx = findFieldContext(state.schema, fieldId);
      if (!ctx) return state;
      return {
        ...state,
        schema: updateFieldInSchema(state.schema, ctx.stepId, ctx.sectionId, fieldId, f => ({
          ...f,
          conditions: f.conditions.map(c => c.id === conditionId ? { ...c, ...updates } : c),
        })),
      };
    }

    default:
      return state;
  }
}

/* ─── Provider ─── */
export function FormBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    setSchema: useCallback((schema) => dispatch({ type: ACTIONS.SET_SCHEMA, payload: schema }), []),
    setActiveStep: useCallback((id) => dispatch({ type: ACTIONS.SET_ACTIVE_STEP, payload: id }), []),
    setActiveSection: useCallback((id) => dispatch({ type: ACTIONS.SET_ACTIVE_SECTION, payload: id }), []),
    setActiveField: useCallback((id) => dispatch({ type: ACTIONS.SET_ACTIVE_FIELD, payload: id }), []),
    togglePreview: useCallback(() => dispatch({ type: ACTIONS.TOGGLE_PREVIEW }), []),
    updateSchemaName: useCallback((name) => dispatch({ type: ACTIONS.UPDATE_SCHEMA_NAME, payload: name }), []),
    
    toggleSectionVisibility: useCallback((stepId, sectionId) =>
      dispatch({ type: ACTIONS.TOGGLE_SECTION_VISIBILITY, payload: { stepId, sectionId } }), []),

    addField: useCallback((stepId, sectionId, overrides = {}) => {
      const field = createField(overrides);
      dispatch({ type: ACTIONS.ADD_FIELD, payload: { stepId, sectionId, field } });
      return field;
    }, []),
    removeField: useCallback((fieldId) =>
      dispatch({ type: ACTIONS.REMOVE_FIELD, payload: { fieldId } }), []),
    updateField: useCallback((fieldId, updates) =>
      dispatch({ type: ACTIONS.UPDATE_FIELD, payload: { fieldId, updates } }), []),
    toggleFieldVisibility: useCallback((fieldId) =>
      dispatch({ type: ACTIONS.TOGGLE_FIELD_VISIBILITY, payload: { fieldId } }), []),
    toggleFieldRequired: useCallback((fieldId) =>
      dispatch({ type: ACTIONS.TOGGLE_FIELD_REQUIRED, payload: { fieldId } }), []),
    reorderFields: useCallback((stepId, sectionId, fieldIds) =>
      dispatch({ type: ACTIONS.REORDER_FIELDS, payload: { stepId, sectionId, fieldIds } }), []),

    addOption: useCallback((fieldId, label) => {
      const option = createOption(label);
      dispatch({ type: ACTIONS.ADD_OPTION, payload: { fieldId, option } });
      return option;
    }, []),
    updateOption: useCallback((fieldId, optionId, updates) =>
      dispatch({ type: ACTIONS.UPDATE_OPTION, payload: { fieldId, optionId, updates } }), []),
    removeOption: useCallback((fieldId, optionId) =>
      dispatch({ type: ACTIONS.REMOVE_OPTION, payload: { fieldId, optionId } }), []),
    setDefaultOption: useCallback((fieldId, optionId) =>
      dispatch({ type: ACTIONS.SET_DEFAULT_OPTION, payload: { fieldId, optionId } }), []),

    addCondition: useCallback((fieldId, condition) =>
      dispatch({ type: ACTIONS.ADD_CONDITION, payload: { fieldId, condition } }), []),
    removeCondition: useCallback((fieldId, conditionId) =>
      dispatch({ type: ACTIONS.REMOVE_CONDITION, payload: { fieldId, conditionId } }), []),
    updateCondition: useCallback((fieldId, conditionId, updates) =>
      dispatch({ type: ACTIONS.UPDATE_CONDITION, payload: { fieldId, conditionId, updates } }), []),
  };

  // Computed values
  const activeStep = state.schema.steps.find(s => s.id === state.activeStepId);
  const activeSection = activeStep?.sections.find(s => s.id === state.activeSectionId);
  const activeField = (() => {
    if (!state.activeFieldId) return null;
    for (const step of state.schema.steps) {
      for (const section of step.sections) {
        const field = section.fields.find(f => f.id === state.activeFieldId);
        if (field) return field;
      }
    }
    return null;
  })();

  return (
    <FormBuilderContext.Provider value={{ ...state, ...actions, activeStep, activeSection, activeField }}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) throw new Error('useFormBuilder must be used within FormBuilderProvider');
  return ctx;
}
