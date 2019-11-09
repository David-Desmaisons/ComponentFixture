import gremlins from "gremlins.js/src/main";
import { getOffset } from "../htmlHelper";
import { log, warn, info, error } from "@/utils/logger";
import { randomUpdateForProp } from "./VuePropRandom";
import { RandomGenerator } from "./RandomGenerator";
import Chance from "chance";

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

function getPropGremlin(option) {
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
      getPropGremlin({
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

function getAllGremlins(option) {
  const allGgremlins = getPropsGremlins(option);
  if (!option.includeMethod) {
    return allGgremlins;
  }
  return [...allGgremlins, ...getMethodsGremlins(option)];
}

function repeat(count, value) {
  return Array(count).fill(value);
}

function computeDistribution({ gremlinsCount, clickProbability }) {
  return gremlinsCount === 0
    ? [1]
    : [
        ...repeat(gremlinsCount, (1 - clickProbability) / gremlinsCount),
        clickProbability
      ];
}

function getStrategy(
  { delay, chance, mouseEvents, clickProbability },
  gremlinsCount
) {
  const realClickProbability = mouseEvents ? clickProbability : 0;
  const distribution = computeDistribution({
    gremlinsCount,
    clickProbability: realClickProbability
  });
  return gremlins.strategies
    .distribution()
    .delay(delay)
    .distribution(distribution)
    .randomizer(chance);
}

function createGremlins(option, watcher) {
  const chance = new Chance(option.seed);
  const randomGenerator = new RandomGenerator(chance);
  const completeOption = Object.assign(
    { maxTentative: 10, clickProbability: 0.5 },
    option,
    watcher,
    { randomGenerator }
  );
  const horde = gremlins
    .createHorde()
    .logger({ log, warn, info, error })
    .randomizer(chance)
    .mogwai(getFpsMogwai(completeOption.fpsWatcher, completeOption.onGremlin));

  const allGremlins = getAllGremlins(completeOption);
  allGremlins.forEach(gremlin => horde.gremlin(gremlin));

  horde.gremlin(getClickGremlin(completeOption));
  const strategy = getStrategy(completeOption, allGremlins.length);
  return horde.strategy(strategy);
}

export { createGremlins };
