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

export { buildStoreModule, getFullMutationName };
