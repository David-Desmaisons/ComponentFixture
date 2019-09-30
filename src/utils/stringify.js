import CircularJSON from "circular-json";
import Vue from "vue";

function stringify(value) {
  return CircularJSON.stringify(
    value,
    (key, value) => {
      if (value instanceof Vue && value._isVue) {
        return { name: value.$options.name, type: "VueComponent" };
      }
      return value;
    },
    "  "
  );
}

function parse(value) {
  return CircularJSON.parse(value);
}

export { stringify, parse };
