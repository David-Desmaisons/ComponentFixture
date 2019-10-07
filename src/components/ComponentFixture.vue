<script>
import Vue from "vue";
import splitPane from "vue-splitpane";
import {
  extractDefaultValue,
  getTypeForProp,
  getNodeFromSandBox,
  validateProp
} from "@/utils/VueHelper";
import compare from "@/utils/compare";
import resizable from "./base/Resizable";

function getMethods(methods, getUnderTestComponent) {
  return Object.keys(methods).map(name => ({
    name,
    argumentNumber: methods[name].length,
    execute: (parameters = []) => {
      const component = getUnderTestComponent();
      return methods[name].apply(component, parameters);
    }
  }));
}

function filterMethods(methods) {
  if (!methods) {
    return {};
  }
  return Object.keys(methods)
    .filter(name => methods[name].length === 0)
    .reduce((acc, name) => {
      acc[name] = methods[name];
      return acc;
    }, {});
}

function buildListener(props, prop) {
  return evt => {
    props[prop] = evt;
  };
}

const defaultModel = {
  event: "input",
  prop: "value"
};

export default {
  name: "component-fixture",

  props: {
    defaults: {
      required: false,
      type: Object,
      default: () => ({})
    },
    componentHeight: {
      required: false,
      type: String,
      default: null
    },
    componentWidth: {
      required: false,
      type: String,
      default: null
    },
    isResizable: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  renderError: (h, err) => h("pre", { style: { color: "red" } }, err.stack),

  methods: {
    computedValuesFromProps(component, { props, name, model }) {
      this.componentName = name;
      this.componentModel = model || defaultModel;
      const photo = Object.assign({}, props);

      if (this.$photo !== undefined && compare(photo, this.$photo)) {
        return;
      }

      this.$photo = photo;
      this.dynamicAttributes = {};
      this.propsDefinition = {};
      const { dynamicAttributes, propsDefinition } = this;
      if (!props) {
        return;
      }
      Object.keys(props).forEach(key => {
        const propsValue = props[key];
        const proposedValue = this.defaults[key];
        const defaultValue = extractDefaultValue(
          component,
          propsValue,
          key,
          proposedValue,
          this
        );
        Vue.set(dynamicAttributes, key, defaultValue);
        Vue.set(propsDefinition, key, {
          defaultValue,
          definition: propsValue,
          types: getTypeForProp(propsValue, defaultValue),
          validate: validateProp.bind(null, propsValue)
        });
      });
    },

    getUnderTestComponent() {
      return this.$refs.cut;
    },

    setupEventsListeners(props, { event, prop }) {
      const on = {};
      if (props.hasOwnProperty(prop)) {
        on[event] = buildListener(props, prop);
      }
      Object.keys(props)
        .filter(p => p !== prop)
        .forEach(key => {
          on[`update:${key}`] = buildListener(props, key);
        });
      return on;
    },

    updateValuesAndMethod(component, options) {
      this.computedValuesFromProps(component, options);
      this.updateMethods(component, options);
    },

    updateMethods(component, options) {
      const { methods: rawMethods } = options;
      const methods = filterMethods(rawMethods);
      const { $methods } = this;

      if ($methods !== undefined && compare(methods, $methods)) {
        return;
      }
      this.componentMethods = getMethods(methods, this.getUnderTestComponent);
      this.$methods = Object.assign({}, methods);
    },

    update() {
      this.getUnderTestComponent().$forceUpdate();
    },

    getComponentInformation() {
      const {
        $scopedSlots: { default: defaultSlot }
      } = this;
      if (this.$stage === 0) {
        return getNodeFromSandBox(defaultSlot);
      }
      return {
        node: defaultSlot()[0],
        component: this.getUnderTestComponent()
      };
    }
  },

  render(h) {
    const { default: defaultSlot } = this.$slots;
    if (!defaultSlot || defaultSlot.length !== 1) {
      throw new Error("ComponentFixture should have one unique default slot");
    }

    const {
      node: {
        componentOptions: { Ctor: componentConstructor },
        componentInstance: { $scopedSlots: scopedSlots, $slots: childSlots }
      },
      component
    } = this.getComponentInformation();
    this.updateValuesAndMethod(component, componentConstructor.options);

    const {
      dynamicAttributes : props,
      componentName,
      componentMethods: methods,
      componentModel,
      events,
      propsDefinition,
      update,
      componentHeight: inicialHeight,
      componentWidth: inicialWidth,
      isResizable
    } = this;

    const options = {
      props,
      scopedSlots,
      slots: childSlots,
      class: { "real-component": true },
      ref: "cut",
      on: this.setupEventsListeners(props, componentModel)
    };

    const { control, header = () => null } = this.$scopedSlots;
    if (!control) {
      return h(componentConstructor, options, []);
    }

    return h(
      "div",
      {
        class: {
          "main-panel": true
        }
      },
      [
        header({
          componentName,
          update,
          methods,
          isResizable
        }),
        h(
          splitPane,
          {
            class: {
              pane: true
            },
            props: {
              split: "vertical",
              defaultPercent: 30
            }
          },
          [
            h(
              "div",
              {
                class: { control: true, main: true },
                slot: "paneL"
              },
              [
                control({
                  attributes: props,
                  data: this.data,
                  componentName,
                  propsDefinition,
                  methods,
                  events
                })
              ]
            ),
            h(
              "div",
              {
                class: { component: true },
                slot: "paneR"
              },
              [
                h(
                  resizable,
                  {
                    props: {
                      inicialHeight,
                      inicialWidth,
                      isResizable
                    },
                    scopedSlots: {
                      default: () => h(componentConstructor, options, [])
                    }
                  },
                  []
                )
              ]
            )
          ]
        )
      ]
    );
  },

  updated() {
    if (this.$stage !== 0) {
      return;
    }
    this.$stage = 1;
    this.$nextTick(() => {
      const componentUnderTest = this.getUnderTestComponent();
      this.data = componentUnderTest.$data;
      const emit = componentUnderTest.$emit;
      const newEmit = (eventName, ...args) => {
        emit.call(componentUnderTest, eventName, ...args);
        if (eventName.startsWith("hook:")) {
          return;
        }
        this.events.push({
          name: eventName,
          args: args,
          instant: new Date()
        });
      };
      componentUnderTest.$emit = newEmit;
    });
  },

  data() {
    this.$stage = 0;
    this.$photo == null;
    return {
      /**
       * The component under test name.
       */
      componentName: null,

      /**
       * This object will contain all the props to be bound with the component under test.
       * after initialization.
       */
      dynamicAttributes: {},

      /**
       * This object will contain the props definition as declared in the component under test.
       */
      propsDefinition: {},

      /**
       * This array will contain the methods as declared in the component under test.
       */
      componentMethods: [],

      /**
       * This object will contain the component under test data.
       */
      data: null,

      /**
       * Array of events emitted by the component under test.
       */
      events: []
    };
  }
};
</script>

<style lang="less" scoped>
.splitter-pane {
  height: 100vh;
}
</style>
