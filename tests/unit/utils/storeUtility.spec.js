import { buildStoreModule, getFullMutationName } from "@/utils/storeUtility";

describe("buildStoreModule", () => {
  it("returns namespaced module", () => {
    const module = buildStoreModule({});
    expect(module.namespaced).toBe(true);
  });

  test.each([
    [{ a: 1 }, { a: 1 }],
    [{ a: 1, b: "abcde" }, { a: 1, b: "abcde" }]
  ])("buildStoreModule for %o should return state: %o", (arg, expected) => {
    const store = buildStoreModule(arg);
    const state = store.state();
    expect(state).toEqual(expected);
    expect(state).not.toBe(arg);
  });

  test.each([
    [{ a: 1 }, ["updateA"]],
    [{ a: 1, b: "abcde" }, ["updateA", "updateB"]],
    [
      { value1: 1, value2: 2, valueA: "a" },
      ["updateValue1", "updateValue2", "updateValueA"]
    ]
  ])(
    "buildStoreModule for %o should return mutations for each state: %o",
    (arg, expected) => {
      const store = buildStoreModule(arg);
      const mutations = Object.keys(store.mutations);
      expect(mutations).toEqual(expected);
    }
  );

  test.each([
    ["updateValue1", "value1", 676],
    ["updateValue2", "value2", "newValue"],
    ["updateValueA", "valueA", {}]
  ])(
    "buildStoreModule build mutation %s that alter state %s",
    (mutationName, prop, payload) => {
      const state = { value1: 1, value2: 2, valueA: "a" };
      const store = buildStoreModule(state);
      store.mutations[mutationName](state, payload);

      expect(state[prop]).toEqual(payload);
    }
  );
});

describe("getFullMutationName", () => {
  test.each([
    [{ prop: "value1", storeName: "store" }, "store/updateValue1"],
    [{ prop: "a", storeName: "store2" }, "store2/updateA"]
  ])("build mutation with path", (arg, expected) => {
    const mutationName = getFullMutationName(arg);
    expect(mutationName).toEqual(expected);
  });
});
