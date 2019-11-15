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

jest.mock("@/utils/random/VuePropRandom",()=>{
  return {
    randomUpdateForProp: jest.fn()
  }
});

jest.mock("@/utils/random/RandomGenerator",()=>{
  return {
    RandomGenerator: jest.fn()
  }
});

import { createGremlins } from "@/utils/random/gremlinBuilder";
import { mocks } from "gremlins.js/src/main";
import { randomUpdateForProp } from "@/utils/random/VuePropRandom";
import { RandomGenerator } from "@/utils/random/RandomGenerator";

describe("createGremlins", () => {
  let option;
  let watchers;

  beforeEach(() => {
    option = {
      props:[{
        key: "prop1"
      },{
        key: "prop2"
      }],
      methods:[

      ],
      delay: 10,
      maxTentative: 40,
      changeProp: jest.fn()
    };
    watchers = {
      onGremlin: jest.fn(),
      fpsWatcher: jest.fn()
    };
  });

  beforeEach(()=>{
    randomUpdateForProp.mockReset();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("returns horde", () => {
    const res = createGremlins(option, watchers);
    expect(res).toBe(mocks.horde);
  });

  it("create gremlins from props horde", () => {
    createGremlins(option, watchers);

    const {changeProp, maxTentative} = option;
    const {onGremlin} = watchers;
    expect(randomUpdateForProp).toHaveBeenCalledTimes(option.props.length);
    option.props.forEach(prop=>{
      expect(randomUpdateForProp).toHaveBeenCalledWith({
        prop,
        changeProp,
        maxTentative,
        onGremlin,
        randomGenerator: new RandomGenerator()
      });
    })
  });
});
