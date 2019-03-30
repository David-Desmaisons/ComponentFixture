function compareAttribute(o1, o2, attr) {
  return o1[attr] === o2[attr];
}

function compare(o1, o2) {
  const compareKey = key => compareAttribute(o1, o2, key);
  return Object.keys(o1).every(compareKey) && Object.keys(o2).every(compareKey);
}

export default compare;
