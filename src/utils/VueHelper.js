import Vue from "vue";
import { getTypeFromValue } from "./TypeHelper";
import { warn } from "@/utils/logger";
import { stringify } from "@/utils/stringify";
import consoleSilenter from "@/utils/consoleSilenter";

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}

function resolveFunctionIfNeeded(def, prop, vm) {
  return typeof def === "function" && getType(prop.type) !== "Function"
    ? def.call(vm)
    : def;
}

function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, "default")) {
    return undefined;
  }
  const def = prop.default;

  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (
    vm &&
    vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key];
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return resolveFunctionIfNeeded(def, prop, vm);
}

function typeIsCompatible(proposedValue, prop) {
  const propTypes = getTypeForProp(prop);
  const proposedTypes = getTypeFromValue(proposedValue);
  return propTypes.some(t => proposedTypes.includes(t));
}

function warnDiscarded(proposedValue, reason) {
  warn(
    `defaults: ${stringify(proposedValue)} will be discarded because ${reason}`
  );
}

function validateProposedValue(proposedValue, prop) {
  if (proposedValue === undefined) {
    return false;
  }
  const typeMatch = typeIsCompatible(proposedValue, prop);
  if (!typeMatch) {
    warnDiscarded(proposedValue, "type is not matching props type");
    return false;
  }

  const validation = validateProp(prop, proposedValue);
  if (validation.ok) {
    return true;
  }

  warnDiscarded(proposedValue, validation.message);
  return false;
}

function extractDefaultValue(vm, prop, key, proposedValue) {
  if (validateProposedValue(proposedValue, prop)) {
    return proposedValue;
  }
  const defaultValue = getPropDefaultValue(vm, prop, key);
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (!prop.required) {
    return undefined;
  }
  const { type } = prop;
  if (!type) {
    return {};
  }
  return !Array.isArray(type) ? type() : type[0]();
}

function getTypeForProp(prop, defaultValue) {
  if (prop.type) {
    const types = Array.isArray(prop.type) ? prop.type : [prop.type];
    return types.map(getType);
  }
  return getTypeFromValue(defaultValue);
}

function validateProp(prop, value) {
  const absent = value === undefined || value === null;
  if (prop.required && absent) {
    return { ok: false, message: "Prop is required" };
  }
  if (value === null && !prop.required) {
    return { ok: true };
  }
  const { validator } = prop;
  if (!validator || validator(value)) {
    return { ok: true };
  }
  return { ok: false, message: "Custom validation failed" };
}

function getNodeFromSandBox(slot) {
  const silenter = consoleSilenter(window);
  const component = {
    render: slot
  };
  const instance = new Vue(component);
  const mainComponent = instance.$mount().$children[0];
  silenter();
  return {
    node: mainComponent.$vnode,
    component: mainComponent
  };
}

export {
  extractDefaultValue,
  getTypeForProp,
  getNodeFromSandBox,
  validateProp
};
