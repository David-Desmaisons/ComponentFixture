import {
  extractDefaultValue,
  getTypeForProp,
  validateProp
} from "@/utils/VueHelper";

describe("getTypeForProp", () => {
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
    [null, ["Object", "Array", "String", "Number", "Boolean"]],
    [undefined, ["Object", "Array", "String", "Number", "Boolean"]]
  ];

  test.each(typesFromValue)(
    "returns type from default value if there is no type received: %p should return: %p",
    (arg, expected) => {
      const value = getTypeForProp({ type: null }, arg);
      expect(value).toEqual(expected);
    }
  );

  const typesFromPropType = [
    [String, ["String"]],
    [Boolean, ["Boolean"]],
    [Function, ["Function"]],
    [Number, ["Number"]],
    [Object, ["Object"]],
    [Array, ["Array"]],
    [[Object, String], ["Object", "String"]],
    [[Object, String, Boolean], ["Object", "String", "Boolean"]]
  ];

  test.each(typesFromPropType)(
    "returns type from prop when prop as type attribute: %p should return: %p",
    (arg, expected) => {
      const value = getTypeForProp({ type: arg }, {});
      expect(value).toEqual(expected);
    }
  );
});

describe("extractDefaultValue", () => {
  const defaults = [
    ["ab", "ab"],
    [false, false],
    [true, true],
    [() => 56, 56],
    [() => ({ fromFactory: true }), { fromFactory: true }]
  ];

  test.each(defaults)(
    "returns default from prop, received: %p should return: %p",
    (defaultValue, expected) => {
      const value = extractDefaultValue(
        { $options: {} },
        { default: defaultValue },
        "key"
      );
      expect(value).toEqual(expected);
    }
  );

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
      const value = extractDefaultValue({}, { required: true, type }, "key");
      expect(value).toEqual(expected);
    }
  );

  test.each(typesFromProp)(
    "returns undefined if there is no default defined in prop and prop is not required, received: %p should return: undefined",
    type => {
      const value = extractDefaultValue({}, { required: false, type }, "key");
      expect(value).toBe(undefined);
    }
  );
});

describe("validateProp", () => {
  const ok = { ok: true };
  const required = { ok: false, message: "Prop is required" };
  const notValidated = { ok: false, message: "Invalid prop: custom validator check failed" };

  const propsData = [
    [{ required: true }, undefined, required],
    [{ required: true }, null, required],
    [{ required: false }, null, ok],
    [{ required: true, validator: () => true }, {}, ok],
    [{ required: true }, {}, ok],
    [{ required: true, validator: () => false }, {}, notValidated],
    [{ required: true, validator: v => v === 1 }, 0, notValidated],
    [{ required: true, validator: v => v === 1 }, 2, notValidated],
    [{ required: true, validator: v => v === 1 }, 23, notValidated],
    [{ required: true, validator: v => v === 1 }, "uuu", notValidated],
    [{ required: true, validator: v => v === 1 }, 1, ok],
    [{ validator: () => true }, {}, ok],
    [{}, {}, ok],
    [{ validator: () => false }, {}, notValidated],
    [{ validator: v => v === 1 }, 0, notValidated],
    [{ validator: v => v === 1 }, 2, notValidated],
    [{ validator: v => v === 1 }, 23, notValidated],
    [{ validator: v => v === 1 }, "uuu", notValidated],
    [{ validator: v => v === 1 }, 1, ok]
  ];

  test.each(propsData)(
    "returns validation based on prop validator and required: prop:%p value:%p should return: %p",
    (prop, value, expected) => {
      const validated = validateProp(prop, value);
      expect(validated).toEqual(expected);
    }
  );
});
