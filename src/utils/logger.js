const { console: { log: nativeLog } } = window;

function log(...args){
  nativeLog.apply(null, ['ComponentFixture:',...args])
}

export {
  log
}