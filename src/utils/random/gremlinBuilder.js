import gremlins from "gremlins.js/src/main";
import { getOffset } from "../htmlHelper";
import { log, warn, info, error } from "@/utils/logger";
import { randomUpdateForProp } from "./VuePropRandom";
import { RandomGenerator } from "./randomHelper";
import Chance from "chance";

function repeat(count, value) {
  return Array(count).fill(value);
}

function addClickGremlin(horde, element, random, callback) {
  if (!element) {
    return horde;
  }
  return horde.gremlin(
    gremlins.species.clicker().positionSelector(() => {
      var offset = getOffset(element);
      callback();
      return [
        parseInt(random.range(0, element.clientWidth) + offset.x),
        parseInt(random.range(0, element.clientHeight) + offset.y)
      ];
    })
  );
}

function addPropsGremlin(
  horde,
  { prop, changeProp, maxTentative },
  random,
  callback
) {
  const updater = randomUpdateForProp(
    { prop, changeProp, maxTentative },
    random
  );
  if (!updater) {
    return false;
  }

  horde.gremlin(() => {
    callback();
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
  let successCount = 0;

  if (props) {
    const propChanger = (key, value) => {
      log(`Updating props: ${key} with value:`, value);
      changeProp(key, value);
    };
    props.forEach(prop => {
      if (
        addPropsGremlin(
          horde,
          { prop, changeProp: propChanger, maxTentative },
          randomGenerator,
          onGremlin
        )
      ) {
        successCount++;
      }
    });
  }
  if (includeMethod) {
    methods.forEach(({ name, execute }) => {
      horde.gremlin(() => {
        onGremlin();
        log(`calling ${name} method`);
        execute();
      });
      successCount++;
    });
  }

  const distribution = computeDistribution(successCount, clickProbability);
  return addClickGremlin(horde, element, randomGenerator, onGremlin).strategy(
    gremlins.strategies
      .distribution()
      .delay(delay)
      .distribution(distribution)
      .randomizer(chance)
  );
}

export { createGremlins };
