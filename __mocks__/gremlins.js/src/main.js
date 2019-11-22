const horde = {
  logger: jest.fn(() => horde),
  randomizer: jest.fn(() => horde),
  mogwai: jest.fn(() => horde),
  gremlin: jest.fn(() => horde),
  strategy: jest.fn(() => horde)
};
const fpsMogwais = {
  delay: jest.fn(() => fpsMogwais),
  levelSelector: jest.fn(() => fpsMogwais)
};
const clickerSpecie = {
  positionSelector: jest.fn(() => clickerSpecie)
};
const distribution = {
  delay: jest.fn(() => distribution),
  distribution: jest.fn(() => distribution),
  randomizer: jest.fn(() => distribution)
};

const gremlins = {
  createHorde: jest.fn(() => horde),
  mogwais: {
    fps: jest.fn(() => fpsMogwais)
  },
  species: {
    clicker: jest.fn(() => clickerSpecie)
  },
  strategies: {
    distribution: jest.fn(() => distribution)
  },
  mocks: {
    horde,
    fpsMogwais,
    clickerSpecie,
    distribution
  }
};

module.exports = gremlins;