import {
  filterFloat,
  getTypeFromValue,
  getDefaultForType,
  parseFunction,
  parseObject,
  stringifyObject
} from "@/utils/TypeHelper";

describe("getTypeFromValue", () => {
  const typesFromValue = [
    ["", ["String"]],
    [13, ["Number"]],
    [true, ["Boolean"]],
    [false, ["Boolean"]],
    [() => 26, ["Function"]],
    [{}, ["Object"]],
    [{ value: 33 }, ["Object"]],
    [[], ["Array"]],
    [[2, 7], ["Array"]],
    [null, ["Object", "Array", "String", "Number", "Boolean", "Function"]],
    [undefined, ["Object", "Array", "String", "Number", "Boolean", "Function"]]
  ];

  test.each(typesFromValue)(
    "returns type from value: %p should return: %p",
    (arg, expected) => {
      const value = getTypeFromValue(arg);
      expect(value).toEqual(expected);
    }
  );
});

describe("getDefaultForType", () => {
  const defaultForType = [
    ["Array", []],
    ["String", ""],
    ["Function", null],
    ["Boolean", false],
    ["Object", {}],
    ["Number", 0]
  ];

  test.each(defaultForType)(
    "returns type from value: %p should return: %o",
    (arg, expected) => {
      const value = getDefaultForType(arg);
      expect(value).toEqual(expected);
    }
  );
});

describe("filterFloat", () => {
  const notConvertibleToNumber = [
    "notANumber",
    "15a",
    "b289",
    "16767.u898",
    "16.767.898"
  ];

  test.each(notConvertibleToNumber)(
    "returns NaN when input is not a number: %p",
    arg => {
      const value = filterFloat(arg);
      expect(isNaN(value)).toBe(true);
    }
  );

  const convertibleToNumber = [
    ["", null],
    [null, null],
    [undefined, undefined],
    ["25", 25],
    ["-35", -35],
    ["-0.98", -0.98],
    ["1000.788898", 1000.788898]
  ];

  test.each(convertibleToNumber)(
    "returns converted value when input is a number: %p",
    (arg, expected) => {
      const value = filterFloat(arg);
      expect(value).toEqual(expected);
    }
  );
});

describe("parseObject", () => {
  const valuesForParse = [
    ["undefined", undefined],
    ["null", null],
    ["{}", {}],
    ['{"value":25}', { value: 25 }]
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
    [undefined, "undefined"],
    [null, "null"],
    [{}, "{}"],
    [{ value: 25 }, '{"value":25}']
  ];

  test.each(valuesForStringify)(
    "returns parsed values %p => %p",
    (arg, expected) => {
      const value = stringifyObject(arg);
      expect(value).toEqual(expected);
    }
  );
});

describe("parseFunction", () => {
  const valuesForParseFunction = [
    ["() => 24", () => 24, [null, undefined, 66]],
    ["v => v", v => v, [null, undefined, 66, "id"]],
    ["function(v) {return v + 12;}", v => v + 12, [0, 1, 66, -100]],
    [
      "({value}) => value",
      function(v) {
        return v.value;
      },
      [{ value: null }, { value: 33 }, { value: undefined }]
    ]
  ];

  test.each(valuesForParseFunction)(
    "returns parsed values %p => %p",
    (arg, expected, values) => {
      const actualFunction = parseFunction(arg);

      values.forEach(v => {
        const actualResult = actualFunction(v);
        const expectedResult = expected(v);
        expect(actualResult).toEqual(expectedResult);
      });
    }
  );

  const invalidValuesForParseFunction = [["{}"], ["23 * 55"], ["34"]];

  test.each(invalidValuesForParseFunction)(
    "throws when expression is not a function %p",
    arg => {
      const parse = () => parseFunction(arg);
      expect(parse).toThrow("unable to convert string into function");
    }
  );
});
