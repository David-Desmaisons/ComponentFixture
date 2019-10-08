function compareAttribute(o1, o2, attr) {
  const value1 = o1[attr];
  const value2 = o2[attr];
  return compare(value1, value2);
}

function compareArray(o1, o2) {
  if (!Array.isArray(o2)) {
    return false;
  }
  if (o1.length != o2.length) {
    return false;
  }
  return o1.every((el1, idx) => compare(el1, o2[idx]));
}

function compareObject(o1, o2) {
  if (typeof o2 !== "object") {
    return false;
  }

  const compareKey = key => compareAttribute(o1, o2, key);
  const keys1 = Object.keys(o1);
  return Object.keys(o2).length === keys1.length && keys1.every(compareKey);
}

function compare(o1, o2) {
  if (o1 == null || o2 == null) {
    return o1 === o2;
  }

  if (o1 === o2) {
    return true;
  }

  if (Array.isArray(o1)) {
    return compareArray(o1, o2);
  }

  if (typeof o1 !== "object") {
    return Number.isNaN(o1) && Number.isNaN(o2);
  }

  return compareObject(o1, o2);
}

export default compare;
