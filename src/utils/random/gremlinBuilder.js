import gremlins from "gremlins.js/src/main";
import { getOffset } from "../htmlHelper";
import { log, warn, info, error } from "@/utils/logger";
import { randomUpdateForProp } from "./VuePropRandom";
import { RandomGenerator } from "./RandomGenerator";
import Chance from "chance";

function repeat(count, value) {
  return Array(count).fill(value);
}

function addClickGremlin(horde, { element, randomGenerator, onGremlin }) {
  if (!element) {
    return horde;
  }
  return horde.gremlin(
    gremlins.species.clicker().positionSelector(() => {
      var offset = getOffset(element);
      onGremlin();
      return [
        parseInt(randomGenerator.range(0, element.clientWidth) + offset.x),
        parseInt(randomGenerator.range(0, element.clientHeight) + offset.y)
      ];
    })
  );
}

function addPropsGremlin(horde, option) {
  const updater = randomUpdateForProp(option);
  if (!updater) {
    return false;
  }

  horde.gremlin(() => {
    option.onGremlin();
    updater();
  });
  return true;
}

function addFpsMogwai(horde, fpsWatcher, callback) {
  return horde.mogwai(
    gremlins.mogwais
      .fps()
      .delay(500)
      .levelSelector(fps => {
        callback();
        fpsWatcher(fps);
        if (fps < 5) return "error";
        return fps < 10 ? "warn" : "log";
      })
  );
}

function computeDistribution(successCount, clickProbability) {
  return successCount === 0
    ? [1]
    : [
        ...repeat(successCount, (1 - clickProbability) / successCount),
        clickProbability
      ];
}

function addPropsGremlins(
  horde,
  { props, changeProp, maxTentative, randomGenerator, onGremlin }
) {
  if (!props) {
    return 0;
  }

  const propChanger = (key, value) => {
    log(`Updating props: ${key} with value:`, value);
    changeProp(key, value);
  };

  return props.filter(prop =>
    addPropsGremlin(horde, {
      prop,
      changeProp: propChanger,
      maxTentative,
      randomGenerator,
      onGremlin
    })
  ).length;
}

function addMethodsGremlins(horde, { methods, onGremlin }) {
  methods.forEach(({ name, execute }) => {
    horde.gremlin(() => {
      onGremlin();
      log(`calling ${name} method`);
      execute();
    });
  });

  return methods.length;
}

function createGremlins(
  {
    props,
    element,
    delay,
    changeProp,
    includeMethod,
    methods,
    mouseEvents,
    clickProbability = 0.5,
    maxTentative = 10,
    seed
  },
  { onGremlin = () => {}, fpsWatcher = () => {} }
) {
  if (!mouseEvents) {
    clickProbability = 0;
  }
  const chance = new Chance(seed);
  const randomGenerator = new RandomGenerator(chance);
  const horde = gremlins
    .createHorde()
    .logger({ log, warn, info, error })
    .randomizer(chance);
  addFpsMogwai(horde, fpsWatcher, onGremlin);

  let successCount = addPropsGremlins(horde, {
    props,
    changeProp,
    maxTentative,
    randomGenerator,
    onGremlin
  });

  if (includeMethod) {
    successCount += addMethodsGremlins(horde, { methods, onGremlin });
  }

  const distribution = computeDistribution(successCount, clickProbability);
  return addClickGremlin(horde, {
    element,
    randomGenerator,
    onGremlin
  }).strategy(
    gremlins.strategies
      .distribution()
      .delay(delay)
      .distribution(distribution)
      .randomizer(chance)
  );
}

export { createGremlins };
