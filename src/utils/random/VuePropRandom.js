import { getRandomTypes, oneOf, randomByTypes } from "./randomHelper";

function getCompatibleValue(getRandom, validate, maxTentative) {
  let value;
  let success = false;
  let tentative = 0;
  while (tentative++ <= maxTentative && !success) {
    value = getRandom();
    success = validate(value).ok;
  }
  return { value, success };
}

function randomUpdateFromPossibleValues({
  key,
  validate,
  changeProp,
  possibleValues
}) {
  return () => {
    const value = oneOf(possibleValues);
    if (!validate(value).ok) {
      return;
    }
    changeProp(key, value);
  };
}

function randomUpdateFromPureRandom({
  key,
  compatibleTypes,
  validate,
  changeProp,
  maxTentative
}) {
  return () => {
    const type = oneOf(compatibleTypes);
    const getRandom = randomByTypes[type];
    const { success, value } = getCompatibleValue(
      getRandom,
      validate,
      maxTentative
    );
    if (success) {
      changeProp(key, value);
    }
  };
}

function randomUpdateForProp({
  prop: { key, metaData },
  changeProp,
  maxTentative
}) {
  const { possibleValues, types, validate } = metaData;
  if (possibleValues) {
    return randomUpdateFromPossibleValues({
      key,
      validate,
      changeProp,
      possibleValues
    });
  }
  const compatibleTypes = getRandomTypes(types);
  if (compatibleTypes.length === 0) {
    return null;
  }
  return randomUpdateFromPureRandom({
    key,
    compatibleTypes,
    validate,
    changeProp,
    maxTentative
  });
}

export { randomUpdateForProp };
