import compare from "@/utils/compare";

describe("compare", () => {
  test.each([
    [{}, {}, true],
    [{ a: 78 }, { a: 78 }, true],
    [{ a: "78" }, { a: "78" }, true],
    [{ a: 78 }, {}, false],
    [{ a: 78 }, { a: "78" }, false],
    [{ a: 78 }, { a: 78, b: "a" }, false],
  ])(
    "compare for %o and %o should return: %o",
    (arg1, arg2, expected) => {
      const value = compare(arg1, arg2);
      expect(value).toEqual(expected);
    }
  );
});