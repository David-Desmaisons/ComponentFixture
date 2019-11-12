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
});
