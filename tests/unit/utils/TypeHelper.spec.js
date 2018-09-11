import { filterFloat, parseFunction, parseObject, stringifyObject } from "@/utils/TypeHelper";


describe("filterFloat", () => {

  const notConvertibleToNumber = [
    '',
    'notANumber',
    '15a',
    'b289',
    '16767.u898',
    '16.767.898'
  ].map(v => [v]);

  test.each(notConvertibleToNumber)(
    "returns NaN when input is not a number",
    arg => {
      const value = filterFloat(arg);
      expect(isNaN(value)).toBe(true);
    }
  );

  const convertibleToNumber = [
    ['25', 25],
    ['-35', -35],
    ['-0.98', -0.98],
    ['1000.788898', 1000.788898],
  ];

  test.each(convertibleToNumber)(
    "returns converted value when input is not a number",
    (arg, expected) => {
      const value = filterFloat(arg);
      expect(value).toEqual(expected);
    }
  );
});