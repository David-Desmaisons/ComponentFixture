import {
  extractDefaultValue,
  getTypeForProp,
  validateProp
} from "@/utils/VueHelper";
import Vue from "vue";

function normalizeToArray(value) {
  if (!value || Array.isArray(value)) {
    return value;
  }
  return [value];
}

function createProperty(
  props,
  key,
  { defaults, component, componentModel, possibleValues },
  { dynamicAttributes, propsDefinition }
) {
  const propsValue = props[key];
  const proposedValue = defaults[key];
  const defaultValue = extractDefaultValue(
    component,
    propsValue,
    key,
    proposedValue
  );
  Vue.set(dynamicAttributes, key, defaultValue);
  Vue.set(propsDefinition, key, {
    defaultValue,
    definition: propsValue,
    types: getTypeForProp(propsValue, defaultValue),
    validate: validateProp.bind(null, propsValue),
    possibleValues: normalizeToArray(possibleValues[key]),
    isModel: key === componentModel.prop
  });
}

function dynamicObjectBuilder(props, context) {
  const result = {
    dynamicAttributes: {},
    propsDefinition: {}
  };
  if (!props) {
    return result;
  }
  Object.keys(props).forEach(key =>
    createProperty(props, key, context, result)
  );
  return result;
}

export { dynamicObjectBuilder };
