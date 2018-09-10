function filterFloat(value) {
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
  return JSON.parse(value);
}

function stringifyObject(value) {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  return JSON.stringify(value);
}

function parseFunction(value) {
  const functionValue = eval.call(null, `(${value})`);
  if (typeof functionValue !== "function") {
    throw new Error("unable to convert string into function");
  }
  return functionValue;
}

export { filterFloat, parseFunction, parseObject, stringifyObject };
