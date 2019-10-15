import { registerModule, registerModuleIfNeeded } from "@/utils/storeUtility";

describe("registerModule", () => {
  let $store;

  beforeEach(() => {
    $store = {
      registerModule: jest.fn(),
      unregisterModule: jest.fn()
    }
  });

  function callRegisterModule({ storeName = "store", state = {} } = {}) {
    registerModule({ $store, storeName, state })
  }

  function getRegisteredModule(store) {
    return store.registerModule.mock.calls[0][1];
  }

  function getRegisteredModuleName(store) {
    return store.registerModule.mock.calls[0][0];
  }

  test.each([
    "s",
    "storeName",
    "notNull"
  ])(
    "calls store register module when name: %s is provided",
    (storeName) => {
      callRegisterModule({ storeName });
      expect($store.registerModule).toHaveBeenCalled();
      expect(getRegisteredModuleName($store)).toEqual(storeName);
    });

  it("does not call store register module when name: is not provided",
    () => {
      callRegisterModule({ storeName: null });
      expect($store.registerModule).not.toHaveBeenCalled();
    });

  it("register a namespaced module", () => {
    callRegisterModule();
    expect(getRegisteredModule($store).namespaced).toEqual(true);
  });

  test.each([
    [{ a: 1 }, { a: 1 }],
    [{ a: 1, b: "abcde" }, { a: 1, b: "abcde" }]
  ])("buildStoreModule for %o should return state: %o", (state, expected) => {
    callRegisterModule({ state });
    const moduleState = getRegisteredModule($store).state();
    expect(moduleState).toEqual(expected);
    expect(moduleState).not.toBe(state);
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
    (state, expected) => {
      callRegisterModule({ state });
      const store = getRegisteredModule($store);
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
      callRegisterModule({state});
      const store = getRegisteredModule($store);
      store.mutations[mutationName](state, payload);

      expect(state[prop]).toEqual(payload);
    }
  );
});

describe("registerModuleIfNeeded", () => {
  let $store;

  beforeEach(() => {
    $store = {
      registerModule: jest.fn(),
      unregisterModule: jest.fn(),
      state: {}
    }
  });

  function callRegisterModuleIfNeeded({ storeName = "store", state = {} } = {}) {
    registerModuleIfNeeded({ $store, storeName, state })
  }

  function getRegisteredModule(store) {
    return store.registerModule.mock.calls[0][1];
  }

  function getRegisteredModuleName(store) {
    return store.registerModule.mock.calls[0][0];
  }

  test.each([
    "s",
    "storeName",
    "notNull"
  ])(
    "calls store register module when name: %s is provided",
    (storeName) => {
      callRegisterModuleIfNeeded({ storeName });
      expect($store.registerModule).toHaveBeenCalled();
      expect(getRegisteredModuleName($store)).toEqual(storeName);
    });

  it("does not call store register module when name: is not provided",
    () => {
      callRegisterModuleIfNeeded({ storeName: null });
      expect($store.registerModule).not.toHaveBeenCalled();
    });

  it("register a namespaced module", () => {
    callRegisterModuleIfNeeded();
    expect(getRegisteredModule($store).namespaced).toEqual(true);
  });

  test.each([
    [{ a: 1 }, { a: 1 }],
    [{ a: 1, b: "abcde" }, { a: 1, b: "abcde" }]
  ])("buildStoreModule for %o should return state: %o", (state, expected) => {
    callRegisterModuleIfNeeded({ state });
    const moduleState = getRegisteredModule($store).state();
    expect(moduleState).toEqual(expected);
    expect(moduleState).not.toBe(state);
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
    (state, expected) => {
      callRegisterModuleIfNeeded({ state });
      const store = getRegisteredModule($store);
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
      callRegisterModuleIfNeeded({state});
      const store = getRegisteredModule($store);
      store.mutations[mutationName](state, payload);

      expect(state[prop]).toEqual(payload);
    }
  );
});

// describe("getFullMutationName", () => {
//   test.each([
//     [{ prop: "value1", storeName: "store" }, "store/updateValue1"],
//     [{ prop: "a", storeName: "store2" }, "store2/updateA"]
//   ])("build mutation with path", (arg, expected) => {
//     const mutationName = getFullMutationName(arg);
//     expect(mutationName).toEqual(expected);
//   });
// });
