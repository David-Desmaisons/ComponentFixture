function capitalize(value) {
  return value.replace(/^\w/, c => c.toUpperCase());
}

function getFullMutationName({ prop, storeName }) {
  return `${storeName}/${getMutationName(prop)}`;
}

function getMutationName(prop) {
  return `update${capitalize(prop)}`;
}

function updateMutation(prop) {
  return (state, payload) => {
    state[prop] = payload;
  };
}

function registerModuleIfNeeded({ $store, storeName, state }) {
  if (storeName == null || $store.state[storeName]) {
    return;
  }
  registerModule({ $store, storeName, state });
}

function registerModule({ $store, storeName, state }) {
  if (storeName == null) {
    return;
  }
  const module = buildStoreModule(state);
  $store.registerModule(storeName, module);
}

function buildStoreModule(initialState) {
  const mutations = Object.keys(initialState).reduce((acc, key) => {
    acc[getMutationName(key)] = updateMutation(key);
    return acc;
  }, {});
  return {
    namespaced: true,
    state: () => ({ ...initialState }),
    mutations
  };
}

function unregisterModule({ $store, storeName }) {
  if (storeName === null) {
    return;
  }
  $store.unregisterModule(storeName);
}

function commit({ $store, prop, storeName, value }) {
  if (storeName === null) {
    return false;
  }
  $store.commit(getFullMutationName({ prop, storeName }), value);
  return true;
}

export { registerModuleIfNeeded, registerModule, unregisterModule, commit };
