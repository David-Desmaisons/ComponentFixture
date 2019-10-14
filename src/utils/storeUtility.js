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

function registerModuleIfNeeded({ $store, storeName, dynamicAttributes }) {
  if (storeName == null || $store.state[storeName]) {
    return;
  }
  registerModule({ $store, storeName, dynamicAttributes });
}

function registerModule({ $store, storeName, dynamicAttributes }) {
  if (storeName == null) {
    return;
  }
  const module = buildStoreModule(dynamicAttributes);
  $store.registerModule(storeName, module);
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
