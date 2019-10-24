import gremlins from "gremlins.js/src/main";
import { getOffset } from "../htmlHelper";
import { randomUpdateForProp } from "./VuePropRandom";
import { range } from "./randomHelper";
import { log, warn, info, error } from "@/utils/logger";

function repeat(count, value) {
  return Array(count).fill(value);
}

function addClickGremlin(horde, element, callback) {
  if (!element) {
    return horde;
  }
  return horde.gremlin(
    gremlins.species.clicker().positionSelector(() => {
      var offset = getOffset(element);
      callback();
      return [
        parseInt(range(0, element.clientWidth) + offset.x),
        parseInt(range(0, element.clientHeight) + offset.y)
      ];
    })
  );
}

function addPropsGremlin(horde, { prop, changeProp, maxTentative }, callback) {
  const updater = randomUpdateForProp({ prop, changeProp, maxTentative });
  if (!updater) {
    return false;
  }

  horde.gremlin(() => {
    callback();
    updater();
  });
  return true;
}

function addFpsMogwai(horde, callback) {
  return horde.mogwai(
    gremlins.mogwais
      .fps()
      .delay(500)
      .levelSelector(fps => {
        callback();
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
    clickProbability = 0.5,
    maxTentative = 10
  },
  callback
) {
  const horde = gremlins.createHorde().logger({ log, warn, info, error });
  addFpsMogwai(horde, callback);
  let successCount = 0;

  if (props) {
    props.forEach(prop => {
      if (addPropsGremlin(
        horde,
        { prop, changeProp, maxTentative },
        callback
      )) {
        successCount++;
      }
    });
  }

  const distribution = computeDistribution(successCount, clickProbability);
  return addClickGremlin(horde, element, callback).strategy(
    gremlins.strategies
      .distribution()
      .delay(delay)
      .distribution(distribution)
  );
}

export { createGremlins };
