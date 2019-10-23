import { getOffset } from "./htmlHelper";
import { log, warn, info, error } from "@/utils/logger";

function addClick(horde, element, callback) {
  if (!element) {
    return horde;
  }
  return horde.gremlin(
    gremlins.species.clicker().positionSelector(() => {
      var offset = getOffset(element);
      callback();
      return [
        parseInt(Math.random() * element.clientWidth + offset.x),
        parseInt(Math.random() * element.clientHeight + offset.y)
      ];
    })
  );
}

function addProps(horde, prop, callback) {
  return horde;
}

function createGremlins(gremlins, { props, element, delay }, callback) {
  let horde = gremlins
    .createHorde()
    .logger({ log, warn, info, error })
    .mogwai(gremlins.mogwais.fps()
      .delay(500)
      .levelSelector(fps => {
        callback();
        if (fps < 5) return 'error';
        return (fps < 10) ? 'warn' : 'log';
      })
    );

  if (props) {
    props.forEach(prop => {
      horde = addProps(horde, prop, callback);
    });
  }

  return addClick(horde, element, callback).strategy(
    gremlins.strategies
      .distribution()
      .delay(delay)
      .distribution([0.8, 0.04, 0.04, 0.04, 0.08])
  );
}

export { createGremlins };
