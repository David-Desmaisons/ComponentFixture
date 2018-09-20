const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
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
  return typeof def === "function" && getType(prop.type) !== "Function"
    ? def.call(vm)
    : def;
}

function returnTypeFromValue(value) {
  if ((value === null) || (value === undefined)) {
    return ["Object", "String", "Number", "Boolean"];
  }
  if (typeof value === "boolean") {
    return ["Boolean"];
  }
  if (typeof value === "string") {
    return ["String"];
  }
  if (typeof value === "function") {
    return ["Function"];
  }
  if (Array.isArray(value)) {
    return ["Array"];
  }
  if (!isNaN(value)) {
    return ["Number"];
  }
  return ["Object"];
}

function extractDefaultValue(vm, prop, key) {
  const defaultValue = getPropDefaultValue(vm, prop, key);
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (!prop.required) {
    return undefined;
  }
  return prop.type ? prop.type() : {};
}

function getTypeForProp(prop, defaultValue) {
  if (prop.type) {
    const types = Array.isArray(prop.type) ? prop.type : [prop.type];
    return types.map(getType);
  }
  return returnTypeFromValue(defaultValue);
}

export { extractDefaultValue, getTypeForProp };
