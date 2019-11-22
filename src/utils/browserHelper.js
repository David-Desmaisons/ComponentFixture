function getOffset(element) {
  const offset = { x: 0, y: 0 };
  while (element) {
    offset.x += element.offsetLeft;
    offset.y += element.offsetTop;
    element = element.offsetParent;
  }
  return offset;
}

function listenToError(callback) {
  const {
    onerror: realOnError,
    console: { error: realConsoleError }
  } = window;
  window.onerror = (message, url, lineNumber) => {
    callback({ type: "exception", message, url, lineNumber });
    return realOnError ? realOnError(message, url, lineNumber) : false;
  };
  window.console.error = function() {
    callback({ type: "console.error", message: [...arguments] });
    realConsoleError.apply(window.console, arguments);
  };
  return () => {
    window.onerror = realOnError;
    window.console.error = realConsoleError;
  };
}

export { getOffset, listenToError };
