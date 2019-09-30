function applyNative(native, args) {
  native.apply(null, ["ComponentFixture:", ...args]);
}

function log(...args) {
  applyNative(window.console.log, args);
}

function warn(...args) {
  applyNative(window.console.warn, args);
}

export { log, warn };
