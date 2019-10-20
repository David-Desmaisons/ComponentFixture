<script>
import splitPane from "vue-splitpane";
import { getNodeFromSandBox } from "@/utils/VueHelper";
import { dynamicObjectBuilder } from "@/utils/dynamicObject";
import compare from "@/utils/compare";
import resizable from "./base/Resizable";
import {
  registerModuleIfNeeded,
  registerModule,
  unregisterModule,
  commit
} from "@/utils/storeUtility";
import { stringify } from "@/utils/stringify";

let id = 1;

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

function buildListener(vm, prop, vModel) {
  return value => {
    vm.changed({ key: prop, value });
    vm.$emit(
      "success",
      `Updated props "${prop}" to ${stringify(value)} based on ${
        vModel ? "v-model" : "update event"
      }`
    );
  };
}

function getSafe(valueGetter) {
  try {
    return valueGetter();
  } catch (error) {
    return error;
  }
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
    possibleValues: {
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
    },
    useStore: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  renderError: (h, err) => h("pre", { style: { color: "red" } }, err.stack),

  methods: {
    getUnderTestComponent() {
      return this.$refs.cut;
    },

    setupEventsListeners(props, { event, prop }) {
      const on = {};
      if (props.hasOwnProperty(prop)) {
        on[event] = buildListener(this, prop, true);
      }
      Object.keys(props)
        .filter(p => p !== prop)
        .forEach(key => {
          on[`update:${key}`] = buildListener(this, key, false);
        });
      return on;
    },

    clearEvents() {
      this.events = [];
    },

    changed({ key: prop, value }) {
      const { $store, storeName } = this;
      const commited = commit({ $store, prop, storeName, value });
      if (commited) {
        return;
      }
      this.dynamicAttributes[prop] = value;
    },

    updateValuesAndMethod(component, options) {
      this.computeValuesFromProps(component, options);
      this.updateMethods(component, options);

      this.$nextTick(() => {
        this.updateData();
        this.updateComputed(options);
      });
    },

    updateData() {
      const { $data } = this.getUnderTestComponent();
      if (compare(this.data, $data)) {
        return;
      }
      this.data = $data;
    },

    updateComputed({ computed }) {
      if (this.$computedWatcher) {
        this.$computedWatcher();
      }

      this.$computedWatcher = this.$watch(
        () => {
          const component = this.getUnderTestComponent();
          return Object.keys(computed || {}).reduce((acc, key) => {
            acc[key] = getSafe(() => component[key]);
            return acc;
          }, {});
        },
        newComputed => {
          const { computed: currentComputed } = this;
          if (compare(currentComputed, newComputed)) {
            return;
          }
          this.computed = newComputed;
        },
        {
          immediate: true
        }
      );
    },

    computeValuesFromProps(component, { props, name, model }) {
      this.componentName = name;
      this.componentModel = model || defaultModel;
      const photo = Object.assign({}, props);
      const { $store, storeName } = this;

      if (this.$photo !== undefined && compare(photo, this.$photo)) {
        registerModuleIfNeeded({
          $store,
          storeName,
          state: this.dynamicAttributes
        });
        return;
      }

      this.$photo = photo;
      const { defaults, componentModel, possibleValues } = this;
      const { dynamicAttributes, propsDefinition } = dynamicObjectBuilder(
        props,
        { component, defaults, componentModel, possibleValues }
      );
      this.dynamicAttributes = dynamicAttributes;
      this.propsDefinition = propsDefinition;

      registerModule({ $store, storeName, state: dynamicAttributes });
    },

    updateMethods(component, { methods: rawMethods }) {
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
    },

    afterMount() {
      const componentUnderTest = this.getUnderTestComponent();
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
    }
  },

  created() {
    this.id = id++;
  },

  beforeDestroy() {
    const { $store, storeName } = this;
    unregisterModule({ $store, storeName });
  },

  render(h) {
    const { default: defaultSlot } = this.$slots;
    if (!defaultSlot || defaultSlot.length !== 1) {
      throw new Error("ComponentFixture should have one unique default slot");
    }

    const {
      node: {
        componentOptions: { Ctor: componentConstructor },
        componentInstance: { $scopedSlots: scopedSlots, $slots: childSlots } = {
          $scopedSlots: undefined,
          $slots: undefined
        }
      },
      component
    } = this.getComponentInformation();
    this.updateValuesAndMethod(component, componentConstructor.options);

    const {
      clearEvents,
      dynamicAttributes,
      data,
      computed,
      componentName,
      componentMethods: methods,
      componentModel,
      events,
      propsDefinition,
      update,
      componentHeight: inicialHeight,
      componentWidth: inicialWidth,
      isResizable,
      changed,
      storeName
    } = this;

    const props = storeName ? this.$store.state[storeName] : dynamicAttributes;
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
                  data,
                  computed,
                  componentName,
                  propsDefinition,
                  methods,
                  events,
                  clearEvents,
                  changed
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
    this.$nextTick(() => this.afterMount());
  },

  computed: {
    storeName() {
      const { shouldUseStore, componentName, id } = this;
      return shouldUseStore ? `componentFixture-${componentName}-${id}` : null;
    },
    shouldUseStore() {
      const { $store, useStore } = this;
      return !!$store && useStore;
    }
  },

  data() {
    this.$stage = 0;
    this.$photo == null;
    return {
      /**
       * The component id.
       */
      id: 0,

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
      data: {},

      /**
       * This object will contain the component under test computed.
       */
      computed: {},

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
