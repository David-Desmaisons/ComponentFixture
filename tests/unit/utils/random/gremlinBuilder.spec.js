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
    randomUpdateForProp: jest.fn(({ prop: { key } }) => {
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

jest.mock("@/utils/logger", () => {
  return {
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  };
});

import { createGremlins } from "@/utils/random/gremlinBuilder";
import { mocks } from "gremlins.js/src/main";
import {
  randomUpdateForProp,
  mockUpdaters
} from "@/utils/random/VuePropRandom";
import { RandomGenerator } from "@/utils/random/RandomGenerator";
import { log } from "@/utils/logger";

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
        { name: "method2", execute: jest.fn() }
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
    [randomUpdateForProp, log].forEach(f => f.mockClear());
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
        [0, "error"]
      ])("when called with %d return %s", (arg, expected) => {
        const actual = levelSelector(arg);
        expect(actual).toBe(expected);
      });
    });
  });

  describe("configure gremlins", () => {
    it("adding gremlin for props and methods and click", () => {
      const { props, methods } = option;
      const expectedCount = props.length + methods.length + 1;

      createGremlins(option, watchers);

      expect(mocks.horde.gremlin).toHaveBeenCalledTimes(expectedCount);
    });

    describe("adding gremlins for methods", () => {
      let methodsGremlins;
      beforeEach(() => {
        createGremlins(option, watchers);
        methodsGremlins = mocks.horde.gremlin.mock.calls
          .slice(-2)
          .map(([arg]) => arg);
      });

      test.each([0, 1])(
        "that when called on gremlins methods %d calls execute of the same method",
        index => {
          const notCalledIndex = index === 0 ? 1 : 0;
          methodsGremlins[index]();

          expect(option.methods[index].execute).toHaveBeenCalled();
          expect(option.methods[notCalledIndex].execute).not.toHaveBeenCalled();
        }
      );

      test.each([[0, "method1"], [1, "method2"]])(
        "that log the information",
        (index, name) => {
          methodsGremlins[index]();

          expect(log).toHaveBeenCalledTimes(1);
          expect(log).toHaveBeenCalledWith(`calling ${name} method`);
        }
      );

      test.each([0, 1])(
        "that when called on gremlins methods %d calls onGremlin",
        index => {
          methodsGremlins[index]();
          expect(watchers.onGremlin).toHaveBeenCalledTimes(1);
        }
      );
    });

    describe("adding gremlins for props", () => {
      let propsGremlins;
      beforeEach(() => {
        createGremlins(option, watchers);
        propsGremlins = mocks.horde.gremlin.mock.calls
          .slice(1, -2)
          .map(([arg]) => arg);
      });

      it("calls randomUpdateForProp to create gremlins from props", () => {
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

      function getMockForProp(index) {
        return mockUpdaters[`prop${index + 1}`];
      }

      test.each([0, 1])(
        "that when called on gremlins props %d calls randomUpdateForProp result",
        index => {
          const expectedFunction = getMockForProp(index);
          const notCalledFunction = getMockForProp(index === 0 ? 1 : 0);

          propsGremlins[index]();

          expect(expectedFunction).toHaveBeenCalled();
          expect(notCalledFunction).not.toHaveBeenCalled();
        }
      );

      test.each([0, 1])(
        "that when called on gremlins methods %d calls onGremlin",
        index => {
          propsGremlins[index]();
          expect(watchers.onGremlin).toHaveBeenCalledTimes(1);
        }
      );
    });
  });
});
