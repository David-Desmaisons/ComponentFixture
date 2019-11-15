jest.mock("gremlins.js/src/main", () => {
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
  return {
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
});

jest.mock("@/utils/random/VuePropRandom", () => {
  const mockUpdaters = {};
  return {
    randomUpdateForProp: jest.fn(({ key }) => {
      const res = jest.fn();
      mockUpdaters[key] = res;
      return res;
    }),
    mockUpdaters
  };
});

jest.mock("@/utils/random/RandomGenerator", () => {
  return {
    RandomGenerator: jest.fn()
  };
});

import { createGremlins } from "@/utils/random/gremlinBuilder";
import { mocks } from "gremlins.js/src/main";
import { randomUpdateForProp } from "@/utils/random/VuePropRandom";
import { RandomGenerator } from "@/utils/random/RandomGenerator";

function resetAllJestFn(mock) {
  Object.keys(mock).forEach(key => mock[key].mockClear());
}

function resetAllJestFnForMocks(mocks) {
  Object.keys(mocks).forEach(key => resetAllJestFn(mocks[key]));
}

describe("createGremlins", () => {
  let option;
  let watchers;

  beforeEach(() => {
    option = {
      props: [
        {
          key: "prop1"
        },
        {
          key: "prop2"
        }
      ],
      methods: [
        { name: "method1", execute: jest.fn() },
        { name: "method1", execute: jest.fn() }
      ],
      includeMethod: true,
      mouseEvents: true,
      delay: 10,
      maxTentative: 40,
      changeProp: jest.fn()
    };
    watchers = {
      onGremlin: jest.fn(),
      fpsWatcher: jest.fn()
    };
  });

  beforeEach(() => {
    resetAllJestFnForMocks(mocks);
    randomUpdateForProp.mockClear();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("returns horde", () => {
    const res = createGremlins(option, watchers);
    expect(res).toBe(mocks.horde);
  });

  it("add fps mogwais", () => {
    const horde = createGremlins(option, watchers);
    expect(horde.mogwai).toHaveBeenCalledWith(mocks.fpsMogwais);
  });

  describe("configure mogwai", () => {
    let fpsMogwais;
    beforeEach(() => {
      createGremlins(option, watchers);
      fpsMogwais = mocks.fpsMogwais;
    });

    it("with 500ms delay", () => {
      expect(fpsMogwais.delay).toHaveBeenCalledWith(500);
    });

    it("with levelSelector", () => {
      expect(fpsMogwais.levelSelector).toHaveBeenCalled();
    });

    describe("when calling levelSelector", () => {
      let levelSelector;
      beforeEach(() => {
        levelSelector = fpsMogwais.levelSelector.mock.calls[0][0];
      });

      test.each([30, 60])("calls fpsWatcher with passed %d", arg => {
        levelSelector(arg);
        expect(watchers.fpsWatcher).toHaveBeenCalledTimes(1);
        expect(watchers.fpsWatcher).toHaveBeenCalledWith(arg);
      });

      test.each([
        [60, "log"],
        [30, "log"],
        [19, "log"],
        [10, "log"],
        [9, "warn"],
        [5, "warn"],
        [4.9, "error"],
        [0, "error"],
      ])("when called with %d return %s", (arg, expected) => {
        const actual = levelSelector(arg);
        expect(actual).toBe(expected);
      });
    });
  });

  it("create gremlins from props", () => {
    createGremlins(option, watchers);

    const { changeProp, maxTentative } = option;
    const { onGremlin } = watchers;
    expect(randomUpdateForProp).toHaveBeenCalledTimes(option.props.length);
    option.props.forEach(prop => {
      expect(randomUpdateForProp).toHaveBeenCalledWith({
        prop,
        changeProp,
        maxTentative,
        onGremlin,
        randomGenerator: new RandomGenerator()
      });
    });
  });
});
