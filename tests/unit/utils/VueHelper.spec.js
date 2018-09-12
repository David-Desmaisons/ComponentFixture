import { extractDefaultValue, getType, getPropDefaultValue, getTypeForProp } from "@/utils/VueHelper";

describe("getTypeForProp", () => {
  const typesFromDefault = [
    ["", "String"],
    [13, "Number"],
    [true, "Boolean"],
    [false, "Boolean"],
    [() => 26, "Function"],
    [{}, "Object"],
    [null, "Object"],
    [undefined, "Object"],
  ];

  test.each(typesFromDefault)(
    "returns type from default value if there is no type received: %p should return: %p",
    (arg, expected) => {
      const value = getTypeForProp({ type: null }, arg);
      expect(value).toBe(expected);
    }
  );

  const typesFromPropType = [
    [String, "String"],
    [Boolean, "Boolean"],
    [Function, "Function"],
    [Number, "Number"],
    [Object, "Object"],
  ];

  test.each(typesFromPropType)(
    "returns type from prop type value: %p should return: %p",
    (arg, expected) => {
      const value = getTypeForProp({ type: arg }, {});
      expect(value).toBe(expected);
    }
  );
});

describe("extractDefaultValue", () => {
  const typesFromProp = [
    [String, ""],
    [Boolean, false],
    [Number, 0],
    [Object, {}],
    [null, {}]
  ];

  test.each(typesFromProp)(
    "returns default from type if there is no default defined in prop and prop is required, received: %p should return: %p",
    (type, expected) => {
      const value = extractDefaultValue({}, {required: true, type}, 'key');
      expect(value).toEqual(expected);
    }
  );

  test.each(typesFromProp)(
    "returns undefined if there is no default defined in prop and prop is not required, received: %p should return: undefined",
    type => {
      const value = extractDefaultValue({}, {required: false, type}, 'key');
      expect(value).toBe(undefined);
    }
  );
});


