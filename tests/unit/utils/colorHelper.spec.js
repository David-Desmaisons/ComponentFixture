import { getHashCode, getColor } from "@/utils/colorHelper";

describe("colorHelper", () => {
  const stringAndHash = [
    ["", 0],
    ["a", 97],
    ["b", 98],
    ["c", 99],
    ["abc", 96354],
    ["abcdef", -1424385949]
  ];

  test.each(stringAndHash)(
    "getHashCode for %p should return: %p",
    (arg, expected) => {
      const value = getHashCode(arg);
      expect(value).toEqual(expected);
    }
  );

  const stringAndColor = [
    ["", "hsl(0,100%,30%)"],
    ["a", "hsl(97,100%,30%)"],
    ["b", "hsl(98,100%,30%)"],
    ["c", "hsl(99,100%,30%)"],
    ["abc", "hsl(234,100%,30%)"],
    ["abcdef", "hsl(-229,100%,30%)"]
  ];

  test.each(stringAndColor)(
    "getColor returns for %p should return: %p",
    (arg, expected) => {
      const value = getColor(arg);
      expect(value).toEqual(expected);
    }
  );

  const optionsAndColor = [
    [50, 10, "hsl(0,50%,10%)"],
    [30, 20, "hsl(0,30%,20%)"],
    [90, 56, "hsl(0,90%,56%)"],
    [1, 20, "hsl(0,1%,20%)"]
  ];

  test.each(optionsAndColor)(
    "getColor returns for saturation: %p and lightness:%p should return: %p",
    (saturation, lightness, expected) => {
      const value = getColor("", { saturation, lightness });
      expect(value).toEqual(expected);
    }
  );
});
