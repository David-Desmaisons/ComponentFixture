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

function randomUpdateFromPossibleValues(
  { key, validate, changeProp, possibleValues },
  random
) {
  return () => {
    const value = random.oneOf(possibleValues);
    if (!validate(value).ok) {
      return;
    }
    changeProp(key, value);
  };
}

function randomUpdateFromPureRandom(
  { key, compatibleTypes, validate, changeProp, maxTentative },
  random
) {
  return () => {
    const type = random.oneOf(compatibleTypes);
    const getRandom = random.getRandomForType(type);
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

function randomUpdateForProp(
  { prop: { key, metaData }, changeProp, maxTentative },
  random
) {
  const { possibleValues, types, validate } = metaData;
  if (possibleValues) {
    return randomUpdateFromPossibleValues(
      {
        key,
        validate,
        changeProp,
        possibleValues
      },
      random
    );
  }
  const compatibleTypes = random.getRandomTypes(types, random);
  if (compatibleTypes.length === 0) {
    return null;
  }
  return randomUpdateFromPureRandom(
    {
      key,
      compatibleTypes,
      validate,
      changeProp,
      maxTentative
    },
    random
  );
}

export { randomUpdateForProp };
