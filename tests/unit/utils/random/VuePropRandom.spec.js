import { randomUpdateForProp } from "@/utils/random/VuePropRandom";

describe("randomUpdateForProp", () => {
  let randomGenerator;
  let changeProp;
  let validate;
  let randomForType;
  const maxTentative = 15;
  const keyProp = "props1";
  const oneOfResult = "one-of-result";
  const randomTypes = ["string", "number"];
  const randomResult = {
    random: true
  };

  beforeEach(() => {
    randomForType = jest.fn(() => randomResult);
    changeProp = jest.fn();
    validate = jest.fn(() => ({
      ok: true
    }));
    randomGenerator = {
      getRandomForType: jest.fn(() => randomForType),
      getRandomTypes: jest.fn(() => randomTypes),
      oneOf: jest.fn(() => oneOfResult),
      range: jest.fn()
    };
  });

  function buildArgument({ key = key, possibleValues = null, types = [] }) {
    key = key || keyProp;
    return {
      prop: { key, metaData: { possibleValues, types, validate } },
      changeProp,
      maxTentative,
      randomGenerator
    };
  }

  describe("when called with possibleValues returns a function that", () => {
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

    it("calls validate with chosen option", () => {
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
      updater();
      expect(changeProp).not.toHaveBeenCalled();
    });
  });

  describe("when called without possibleValues returns a function that", () => {
    let updater;
    let argument;

    beforeEach(() => {
      argument = buildArgument({ possibleValues: null });
      updater = randomUpdateForProp(argument);
    });

    it("is null when there is no random types available", () => {
      randomGenerator.getRandomTypes = () => [];
      updater = randomUpdateForProp(argument);
      expect(updater).toBe(null);
    });

    it("calls randomGenerator oneOf with random types", () => {
      updater();
      expect(randomGenerator.oneOf).toHaveBeenCalledWith(randomTypes);
    });

    it("calls randomGenerator getRandomForType with choosen type", () => {
      updater();
      expect(randomGenerator.getRandomForType).toHaveBeenCalledWith(
        oneOfResult
      );
    });

    it("calls changeProp with random value", () => {
      updater();
      expect(changeProp).toHaveBeenCalledWith(keyProp, randomResult);
    });

    describe("when random value is invalid", () => {
      beforeEach(() => {
        validate = jest.fn(() => ({ ok: false }));
        argument = buildArgument({ possibleValues: null });
        updater = randomUpdateForProp(argument);
      });

      it("does not calls changeProp", () => {
        updater();
        expect(changeProp).not.toHaveBeenCalled();
      });

      it("calls validate maxTentative times", () => {
        updater();
        expect(validate.mock.calls.length).toBe(maxTentative);
      });
    });
  });
});
