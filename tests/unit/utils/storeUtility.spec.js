import { buildStore } from "@/utils/storeUtility";

describe("buildStore", () => {
  test.each([
    [{ a: 1 }, { a: 1 }],
    [{ a: 1, b: "abcde" }, { a: 1, b: "abcde" }],
  ])
    ("buildStore for %o should return state: %o", (arg, expected) => {
      const store = buildStore(arg);
      expect(store.state).toEqual(expected);
      expect(store.state).not.toBe(arg);
    });

  test.each([
    [{ a: 1 }, ["updateA"]],
    [{ a: 1, b: "abcde" }, ["updateA", "updateB"]],
    [{ value1: 1, value2: 2, valueA: "a" }, ["updateValue1", "updateValue2", "updateValueA"]],
  ])
    ("buildStore for %o should return mutations for each state: %o", (arg, expected) => {
      const store = buildStore(arg);
      const mutations = Object.keys(store.mutations)
      expect(mutations).toEqual(expected);
    });

  test.each([
    ["updateValue1", 676, "value1"],
    ["updateValue2", "newValue", "value2"],
    ["updateValueA", {}, "valueA"],
  ])
    ("buildStore for build mutations that alter state", (mutationName, payload, prop) => {
      const state = { value1: 1, value2: 2, valueA: "a" };
      const store = buildStore(state);
      store.mutations[mutationName](state, payload);

      expect(state[prop]).toEqual(payload);
    });
});