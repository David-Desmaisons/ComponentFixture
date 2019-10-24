const randomByTypes = {
  String() {
    return "a";
  },
  Number() {
    return 78;
  },
  Boolean() {
    return false;
  }
};

const typesWithRandom = Object.keys(randomByTypes);

function getRandomTypes(types) {
  return types.filter(t => typesWithRandom.includes(t));
}

function oneOf(array) {
  if (!array || array.length === 0) {
    return undefined;
  }
  return array[0];
}

function range(min, max) {
  return Math.random() * max + min;
}

export { randomByTypes, getRandomTypes, oneOf, range };
