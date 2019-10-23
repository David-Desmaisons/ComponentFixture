function getOffset(element) {
  const offset = { x: 0, y: 0 };
  while (element) {
    offset.x += element.offsetLeft;
    offset.y += element.offsetTop;
    element = element.offsetParent;
  }
  return offset;
}

export { getOffset };
