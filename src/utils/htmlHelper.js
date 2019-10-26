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
  const realOnError = window.onerror;
  window.onerror = function(message, url, lineNumber) {
    callback({ message, url, lineNumber });
    return realOnError ? realOnError(message, url, lineNumber) : false;
  };
  return () => (window.onerror = realOnError);
}

export { getOffset, listenToError };
