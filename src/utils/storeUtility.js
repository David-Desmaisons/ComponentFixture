function capitalize(value) {
  return value.replace(/^\w/, c => c.toUpperCase());
}

function getMutationName(prop) {
  return `update${capitalize(prop)}`;
}

function updateMutation(prop) {
  return (state, payload) => state[prop] = payload;
}

function buildStore(initialState) {
  const mutations = Object.keys(initialState).reduce((acc, key) => {
    acc[getMutationName(key)] = updateMutation(key);
    return acc;
  }, {});
  return {
    state: { ...initialState },
    mutations
  }
}

export {
  buildStore
}