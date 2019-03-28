<script>
import Vue from "vue";
import splitPane from "vue-splitpane";
import {
  extractDefaultValue,
  getTypeForProp,
  validateProp
} from "@/utils/VueHelper";

const defaultModel = {
  event: "input",
  prop: "value"
};

export default {
  name: "ComponentFixture",

  props: {
    defaults: {
      required: false,
      type: Object,
      default: () => ({})
    }
  },

  renderError(h, err) {
    return h("pre", { style: { color: "red" } }, err.stack);
  },

  methods: {
    computedValuesFromProps(component, { props, name, model }) {
      this.componentName = name;
      this.componentModel = model || defaultModel;

      const photo = JSON.stringify(props);

      if (photo === this.$photo) {
        return;
      }

      this.$photo = photo;
      this.dynamicAttributes = {};
      this.propsDefinition = {};
      const dynamicAttributes = this.dynamicAttributes;
      const propsDefinition = this.propsDefinition;
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
          definition: propsValue,
          types: getTypeForProp(propsValue, defaultValue),
          validate: validateProp.bind(null, propsValue)
        });
      });
    },

    getUnderTestComponent() {
      if (this.$stage === 1) {
        const [component] = this.$children;
        return component;
      }

      const { control } = this.$scopedSlots;
      const firstChild = this.$children[0];
      if (!control) {
        return firstChild;
      }
      return firstChild.$children[2].$children[0];
    },

    updateValuesFromProps() {
      const component =  this.getUnderTestComponent();
      const options = (this.$stage === 1) ? this.$children[0].$options : this.ctor.options;
      this.computedValuesFromProps(component, options);
    }
  },

  render(h) {
    const { default: defaultSlot } = this.$slots;
    if (!defaultSlot || defaultSlot.length !== 1) {
      throw new Error("ComponentFixture should have one unique default slot");
    }

    if (this.$stage == 2) {
      //Updates (needed for hot-reload)
      this.updateValuesFromProps();
    }

    const [slot] = defaultSlot;
    if (this.$stage === 0) {
      return h("div", {}, [slot]);
    }

    const { Ctor: ctor } = slot.componentOptions;
    this.ctor = ctor;
    const { scopedSlots, slot: childSlot } = slot.data;
    const props = this.dynamicAttributes;
    const { componentName, componentModel, propsDefinition } = this;
    const { event, prop } = componentModel;
    const options = { props, scopedSlots, slot: childSlot, ref: "cut" };

    if (props.hasOwnProperty(prop)) {
      options.on = {
        [event]: evt => {
          props[prop] = evt;
        }
      };
    }

    const { control } = this.$scopedSlots;
    if (!control) {
      return h(ctor, options, []);
    }

    return h(
      splitPane,
      {
        class: {
          "main-panel": true
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
              componentName,
              propsDefinition
            })
          ]
        ),
        h(
          "div",
          {
            class: { component: true },
            slot: "paneR"
          },
          [h(ctor, options, [])]
        )
      ]
    );
  },

  mounted() {
    if (this.$children.length !== 1) {
      return;
    }

    this.$stage = 1;
    this.updateValuesFromProps();
    this.$forceUpdate();
  },

  updated() {
    if (this.$stage !== 1) {
      return;
    }
    this.$stage = 2;
    this.$nextTick(() => {
      const emit = this.$refs.cut.$emit;
      const newEmit = (eventName, ...args) => {
        this.events.push({ name: eventName, args: args });
        emit.call(this.$refs.cut, eventName, ...args);
      };
      this.$refs.cut.$emit = newEmit;
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
       * Array of events emitted by the component under test.
       */
      events: []
    };
  }
};
</script>
