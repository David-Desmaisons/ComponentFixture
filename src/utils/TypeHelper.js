import { stringify, parse } from "@/utils/stringify";

function filterFloat(value) {
  if (value === "") {
    return null;
  }
  if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}

function parseObject(value) {
  if (value === "undefined") {
    return undefined;
  }
  if (value === "null") {
    return null;
  }
  return parse(value);
}

function stringifyObject(value) {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  return stringify(value);
}

function parseFunction(value) {
  const functionValue = eval.call(null, `(${value})`);
  if (typeof functionValue !== "function") {
    throw new Error("unable to convert string into function");
  }
  return functionValue;
}

function getTypeFromValue(value) {
  if (value === null || value === undefined) {
    return ["Object", "Array", "String", "Number", "Boolean"];
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

export {
  filterFloat,
  getTypeFromValue,
  parseFunction,
  parseObject,
  stringifyObject
};
