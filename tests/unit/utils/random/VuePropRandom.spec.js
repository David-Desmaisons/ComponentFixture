import { randomUpdateForProp } from "@/utils/random/VuePropRandom";

describe("randomUpdateForProp", () => {
  let randomGenerator;
  let changeProp;
  let validate;
  const keyProp = "props1";
  const oneOfResult = "one-of-result";

  beforeEach(() => {
    changeProp = jest.fn();
    validate = jest.fn(() => ({
      ok: true
    }));
    randomGenerator = {
      getRandomForType: jest.fn(),
      getRandomTypes: jest.fn(),
      oneOf: jest.fn(() => oneOfResult),
      range: jest.fn()
    };
  });

  function buildArgument({
    key = key,
    possibleValues = null,
    types = [],
    maxTentative = 15
  }) {
    key = key || keyProp;
    return {
      prop: { key, metaData: { possibleValues, types, validate } },
      changeProp,
      maxTentative,
      randomGenerator
    };
  }

  describe("when called with possibleValues", () => {
    const possibleValues = [1, 2, 3, 4];
    let updater;
    let argument;

    beforeEach(() => {
      argument = buildArgument({ possibleValues });
      updater = randomUpdateForProp(argument);
    });

    it("calls randomGenerator oneOf with possibleValues", () => {
      updater();
      expect(randomGenerator.oneOf).toHaveBeenCalledWith(possibleValues);
    });

    it("calls validate with choosed option", () => {
      updater();
      expect(validate).toHaveBeenCalledWith(oneOfResult);
    });

    it("calls changeProp", () => {
      updater();
      expect(changeProp).toHaveBeenCalledWith(keyProp, oneOfResult);
    });

    it("does not calls changeProp when not valid", () => {
      validate = () => ({ ok: false });
      argument = buildArgument({ possibleValues });
      updater = randomUpdateForProp(argument);
      expect(changeProp).not.toHaveBeenCalled();
    });
  });
});
