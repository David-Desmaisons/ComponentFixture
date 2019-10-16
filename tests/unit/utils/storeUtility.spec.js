import {
  commit,
  registerModule,
  registerModuleIfNeeded,
  unregisterModule
} from "@/utils/storeUtility";

function buildFakeStore() {
  return {
    registerModule: jest.fn(),
    unregisterModule: jest.fn(),
    commit: jest.fn(),
    state: {}
  };
}

describe.each([
  ["registerModule", registerModule],
  ["registerModuleIfNeeded", registerModuleIfNeeded]
])("%s", (_, register) => {
  let $store;

  beforeEach(() => {
    $store = buildFakeStore();
  });

  function callRegisterModule({ storeName = "store", state = {} } = {}) {
    register({ $store, storeName, state });
  }

  function getRegisteredModule(store) {
    return store.registerModule.mock.calls[0][1];
  }

  function getRegisteredModuleName(store) {
    return store.registerModule.mock.calls[0][0];
  }

  test.each(["s", "storeName", "notNull"])(
    "calls store register module when name: %s is provided",
    storeName => {
      callRegisterModule({ storeName });
      expect($store.registerModule).toHaveBeenCalled();
      expect(getRegisteredModuleName($store)).toEqual(storeName);
    }
  );

  it("does not call store register module when name: is not provided", () => {
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
      callRegisterModule({ state });
      const store = getRegisteredModule($store);
      store.mutations[mutationName](state, payload);

      expect(state[prop]).toEqual(payload);
    }
  );
});

describe("registerModuleIfNeeded", () => {
  let $store;

  beforeEach(() => {
    $store = buildFakeStore();
  });

  function callRegisterModule({ storeName = "store", state = {} } = {}) {
    registerModuleIfNeeded({ $store, storeName, state });
  }

  test.each(["s", "storeName", "notNull"])(
    "does not call store register module when state with name: %s already exists",
    storeName => {
      $store.state[storeName] = {};
      callRegisterModule({ storeName });
      expect($store.registerModule).not.toHaveBeenCalled();
    }
  );
});

describe("unregisterModule", () => {
  let $store;

  beforeEach(() => {
    $store = buildFakeStore();
  });

  function callUnregisterModule({ storeName = "store" } = {}) {
    unregisterModule({ $store, storeName });
  }

  test.each(["s", "storeName", "notNull"])(
    "calls unregister on store when name %s is not null",
    storeName => {
      callUnregisterModule({ storeName });
      expect($store.unregisterModule).toHaveBeenCalledWith(storeName);
    }
  );

  it("does not call unregister on store when name is null", () => {
    callUnregisterModule({ storeName: null });
    expect($store.unregisterModule).not.toHaveBeenCalled();
  });
});

describe("commit", () => {
  let $store;

  beforeEach(() => {
    $store = buildFakeStore();
  });

  function callCommit({
    prop = "attributeA",
    storeName = "store",
    value = {}
  } = {}) {
    return commit({ $store, prop, storeName, value });
  }

  function getCommitName(store) {
    return store.commit.mock.calls[0][0];
  }

  function getCommitValue(store) {
    return store.commit.mock.calls[0][1];
  }

  test.each(["s", "storeName", "notNull"])(
    "calls commit on store when name %s is not null",
    storeName => {
      const res = callCommit({ storeName });
      expect($store.commit).toHaveBeenCalled();
      expect(res).toBe(true);
    }
  );

  test.each([
    [{ prop: "value1", storeName: "store" }, "store/updateValue1"],
    [{ prop: "a", storeName: "store2" }, "store2/updateA"]
  ])("when called with %o calls commit %s", (arg, expected) => {
    callCommit(arg);
    expect(getCommitName($store)).toEqual(expected);
  });

  test.each(["value", { object: true }, 25])(
    "when called with value %o calls commit with same value",
    value => {
      callCommit({ value });
      expect(getCommitValue($store)).toBe(value);
    }
  );

  it("does not call unregister on store when name is null", () => {
    const res = callCommit({ storeName: null });
    expect($store.commit).not.toHaveBeenCalled();
    expect(res).toBe(false);
  });
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
