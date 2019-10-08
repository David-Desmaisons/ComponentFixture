import compare from "@/utils/compare";

describe("compare", () => {
  test.each([
    [1, 1, true],
    [null, null, true],
    [undefined, undefined, true],
    ["abc", "abc", true],
    [{}, {}, true],
    [[], [], true],
    [["a"], ["a"], true],
    [[1], [1], true],
    [["a", "b", 56], ["a", "b", 56], true],
    [[{ a: 78 }], [{ a: 78 }], true],
    [{ a: 78, b: "a" }, { a: 78, b: "a" }, true],
    [{ a: {b: 5, c: 45, d: "string"}, b: "a" }, { a: {b: 5, c: 45, d: "string"}, b: "a" }, true],
    [{ a: 78 }, { a: 78 }, true],
    [{ a: "78" }, { a: "78" }, true],
    [{ a: 78 }, {}, false],
    [{ a: 78 }, { a: "78" }, false],
    [{ a: 78 }, { a: 78, b: "a" }, false],
    [[], ["a"], false],
    [[], {}, false],
    [[], { length: 0 }, false],
    [["a"], ["b"], false],
    [[1], [2], false],
    ["abc", "bac", false],
    [1, 2, false],
    [undefined, null, false],
    [null, undefined, false]
  ])("compare for %o and %o should return: %o", (arg1, arg2, expected) => {
    const value = compare(arg1, arg2);
    expect(value).toEqual(expected);
  });
});
