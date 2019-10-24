import Chance from "chance";

const randomByTypes = {
  String(chance) {
    return chance.string();
  },
  Number(chance) {
    return chance.integer({ min: 0, max: 100 });
  },
  Boolean(chance) {
    return chance.bool();
  }
};

const typesWithRandom = Object.keys(randomByTypes);

class RandomGenerator {
  constructor(seed) {
    this._chance = new Chance(seed);
  }

  getRandomForType(type) {
    return () => randomByTypes[type](this._chance);
  }

  getRandomTypes(types) {
    return types.filter(t => typesWithRandom.includes(t));
  }

  oneOf(array) {
    if (!array || array.length === 0) {
      return undefined;
    }
    return this._chance.pickone(array);
  }

  range(min, max) {
    return Math.random() * max + min;
  }
}

export { RandomGenerator };
