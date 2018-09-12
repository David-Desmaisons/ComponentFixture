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

describe("parseObject", () => {
  const valuesForParse = [
    ['undefined', undefined],
    ['null', null],
    ['{}', {}],
    ['{"value":25}', { value: 25 }],
  ];

  test.each(valuesForParse)(
    "returns parsed values %p => %p",
    (arg, expected) => {
      const value = parseObject(arg);
      expect(value).toEqual(expected);
    }
  );
});

describe("stringifyObject", () => {
  const valuesForStringify = [
    [undefined, 'undefined'],
    [null, 'null'],
    [{}, '{}'],
    [{ value: 25 }, '{"value":25}'],
  ];

  test.each(valuesForStringify)(
    "returns parsed values %p => %p",
    (arg, expected) => {
      const value = stringifyObject(arg);
      expect(value).toEqual(expected);
    }
  );
});

