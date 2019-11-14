jest.mock("gremlins.js/src/main", () => {
  const horde = {
    logger: jest.fn(() => horde),
    randomizer: jest.fn(() => horde),
    mogwai: jest.fn(() => horde),
    gremlin: jest.fn(() => horde),
    strategy: jest.fn(() => horde)
  };
  const mogwais = {
    delay: jest.fn(() => mogwais),
    levelSelector: jest.fn(() => mogwais)
  };
  const clickerSpecie = {
    positionSelector: jest.fn(() => clickerSpecie)
  };
  const distribution ={
    delay: jest.fn(() => distribution),
    distribution: jest.fn(() => distribution),
    randomizer: jest.fn(() => distribution),
  };
  return {
    createHorde: jest.fn(() => horde),
    mogwais: {
      fps: jest.fn(() => mogwais)
    },
    species: {
      clicker: jest.fn(() => clickerSpecie)
    },
    strategies: {
      distribution: jest.fn(() => distribution)
    },
    mocks: {
      horde,
      mogwais,
      clickerSpecie,
      distribution
    }
  };
});

import { createGremlins } from "@/utils/random/gremlinBuilder";
import { mocks } from "gremlins.js/src/main";

describe("createGremlins", () => {
  let option;
  let watchers;

  beforeEach(() => {
    option = {};
    watchers = {
      onGremlin: jest.fn(),
      fpsWatcher: jest.fn()
    };
  });
  it("returns horde", () => {
    const res = createGremlins(option, watchers);
    expect(res).toBe(mocks.horde);
  });
});
