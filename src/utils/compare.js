function compareAttribute(o1, o2, attr) {
  return o1[attr] === o2[attr];
}

function compareArray(o1, o2) {
  if (o1.length != o2.length) {
    return false;
  }
  return o1.every((el1, idx) => compare(el1, o2[idx]));
}

function compare(o1, o2) {
  if (o1 == null || o2 == null){
    return o1 === o2;
  }

  if (Array.isArray(o1)) {
    if (!Array.isArray(o2)) {
      return false;
    }
    return compareArray(o1, o2);
  }

  if (typeof o1 !== 'object') {
    return o1 === o2;
  }

  const compareKey = key => compareAttribute(o1, o2, key);
  return Object.keys(o1).every(compareKey) && Object.keys(o2).every(compareKey);
}

export default compare;
