import gremlins from "gremlins.js/src/main";
import { getOffset } from "../htmlHelper";
import { log, warn, info, error } from "@/utils/logger";
import { randomUpdateForProp } from "./VuePropRandom";
import { RandomGenerator } from "./RandomGenerator";
import Chance from "chance";

function repeat(count, value) {
  return Array(count).fill(value);
}

function getClickGremlin({ element, randomGenerator, onGremlin }) {
  return gremlins.species.clicker().positionSelector(() => {
    var offset = getOffset(element);
    onGremlin();
    return [
      parseInt(randomGenerator.range(0, element.clientWidth) + offset.x),
      parseInt(randomGenerator.range(0, element.clientHeight) + offset.y)
    ];
  });
}

function getFpsMogwai(fpsWatcher, callback) {
  return gremlins.mogwais
    .fps()
    .delay(500)
    .levelSelector(fps => {
      callback();
      fpsWatcher(fps);
      if (fps < 5) {
        return "error";
      }
      return fps < 10 ? "warn" : "log";
    });
}

function getropsGremlin(option) {
  const updater = randomUpdateForProp(option);
  if (!updater) {
    return null;
  }

  return () => {
    option.onGremlin();
    updater();
  };
}

function getPropsGremlins({
  props,
  changeProp,
  maxTentative,
  randomGenerator,
  onGremlin
}) {
  if (!props) {
    return [];
  }

  const propChanger = (key, value) => {
    log(`Updating props: ${key} with value:`, value);
    changeProp(key, value);
  };

  return props
    .map(prop =>
      getropsGremlin({
        prop,
        changeProp: propChanger,
        maxTentative,
        randomGenerator,
        onGremlin
      })
    )
    .filter(gremlin => gremlin !== null);
}

function getMethodsGremlins({ methods, onGremlin }) {
  return methods.map(({ name, execute }) => () => {
    onGremlin();
    log(`calling ${name} method`);
    execute();
  });
}

function computeDistribution({ gremlinsCount, clickProbability }) {
  return gremlinsCount === 0
    ? [1]
    : [
        ...repeat(gremlinsCount, (1 - clickProbability) / gremlinsCount),
        clickProbability
      ];
}

function getStrategy({ delay, chance, gremlinsCount, clickProbability }) {
  const distribution = computeDistribution({ gremlinsCount, clickProbability });
  return gremlins.strategies
    .distribution()
    .delay(delay)
    .distribution(distribution)
    .randomizer(chance);
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
    .randomizer(chance)
    .mogwai(getFpsMogwai(fpsWatcher, onGremlin));

  const allGgremlins = getPropsGremlins({
    props,
    changeProp,
    maxTentative,
    randomGenerator,
    onGremlin
  });
  if (includeMethod) {
    allGgremlins.push(...getMethodsGremlins({ methods, onGremlin }));
  }
  allGgremlins.forEach(gremlin => horde.gremlin(gremlin));

  horde.gremlin(getClickGremlin({ element, randomGenerator, onGremlin }));

  const strategy = getStrategy({
    delay,
    chance,
    gremlinsCount: allGgremlins.length,
    clickProbability
  });
  return horde.strategy(strategy);
}

export { createGremlins };
