function applyNative(native, args) {
  native.apply(null, ["ComponentFixture:", ...args]);
}

function log(...args) {
  applyNative(window.console.log, args);
}

function warn(...args) {
  applyNative(window.console.warn, args);
}

function info(...args) {
  applyNative(window.console.info, args);
}

function error(...args) {
  applyNative(window.console.error, args);
}

export { info, error, log, warn };
