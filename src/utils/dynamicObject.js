import {
  extractDefaultValue,
  getTypeForProp,
  validateProp
} from "@/utils/VueHelper";
import Vue from "vue";

function dynamicObjectBuilder(props, { defaults, component, componentModel }) {
  const dynamicAttributes = {};
  const propsDefinition = {};
  if (!props) {
    return {
      dynamicAttributes,
      propsDefinition
    };
  }
  Object.keys(props).forEach(key => {
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
      isModel: key === componentModel.prop
    });
  });

  return {
    dynamicAttributes,
    propsDefinition
  };
}

export { dynamicObjectBuilder };
