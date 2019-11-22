import { RandomGenerator } from "@/utils/random/RandomGenerator";

describe("RandomGenerator", () => {
  let chance;
  let randomGenerator;

  beforeEach(() => {
    chance = {
      string: jest.fn(() => "random"),
      pickone: jest.fn(arr => arr[0]),
      integer: jest.fn(() => 99),
      bool: jest.fn(() => true)
    };
    randomGenerator = new RandomGenerator(chance);
  });

  it("chance return chance instance", () => {
    const actual = randomGenerator.chance;
    expect(actual).toBe(chance);
  });

  it("range delegate to chance integer", () => {
    const actual = randomGenerator.range(6, 10);
    expect(actual).toBe(99);
    expect(chance.integer).toHaveBeenCalledWith({ min: 6, max: 10 });
  });

  test.each([[[1, 2, 3]], [[2, 3]], [["one"]]])(
    "oneOf delegate to chance pickone",
    array => {
      const actual = randomGenerator.oneOf(array);
      expect(actual).toBe(chance.pickone(array));
      expect(chance.pickone).toHaveBeenCalledWith(array);
    }
  );

  test.each([undefined, null, []])(
    "oneOf do not delegate to chance pickone when array is %o",
    array => {
      const actual = randomGenerator.oneOf(array);
      expect(actual).toBe(undefined);
      expect(chance.pickone).not.toHaveBeenCalledWith();
    }
  );

  test.each([
    [["Function", "Object"], []],
    [["String"], ["String"]],
    [["Number"], ["Number"]],
    [["Boolean"], ["Boolean"]],
    [["Boolean", "String", "Number"], ["Boolean", "String", "Number"]],
    [["String", "Object"], ["String"]],
    [["Number", "Function"], ["Number"]],
    [["Boolean", "String", "Number", "Object"], ["Boolean", "String", "Number"]]
  ])("getRandomTypes receiving %o returns %o", (argument, expected) => {
    const actual = randomGenerator.getRandomTypes(argument);
    expect(actual).toEqual(expected);
  });

  test.each([
    ["String", "random", "string"],
    ["Number", 99, "integer"],
    ["Boolean", true, "bool"]
  ])(
    "getRandomForType receiving %o returns %o and calls %o",
    (type, expected, method) => {
      const actual = randomGenerator.getRandomForType(type)();
      expect(actual).toEqual(expected);
      expect(chance[method]).toHaveBeenCalled();
    }
  );
});
