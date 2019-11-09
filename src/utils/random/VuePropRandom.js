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
  possibleValues,
  randomGenerator
}) {
  return () => {
    const value = randomGenerator.oneOf(possibleValues);
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
  maxTentative,
  randomGenerator
}) {
  if (compatibleTypes.length === 0) {
    return null;
  }
  return () => {
    const type = randomGenerator.oneOf(compatibleTypes);
    const getRandom = randomGenerator.getRandomForType(type);
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
  maxTentative,
  randomGenerator
}) {
  const { possibleValues, types, validate } = metaData;
  const option = {
    key,
    validate,
    changeProp,
    maxTentative,
    possibleValues,
    randomGenerator
  };
  if (possibleValues) {
    return randomUpdateFromPossibleValues(option);
  }
  const compatibleTypes = randomGenerator.getRandomTypes(types);
  Object.assign(option, {compatibleTypes});
  return randomUpdateFromPureRandom(option);
}

export { randomUpdateForProp };
