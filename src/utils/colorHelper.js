function getHashCode(stringValue) {
  var hash = 0;
  if (!stringValue || stringValue.length == 0) return hash;
  for (var i = 0; i < stringValue.length; i++) {
    hash = stringValue.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function getColor(stringValue, { saturation = 100, lightness = 30 } = {}) {
  const angle = getHashCode(stringValue) % 360;
  return `hsl(${angle},${saturation}%,${lightness}%)`;
}

export { getHashCode, getColor };
