<script>
import Vue from "vue";
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
    computedValuesFromProps(component, props, photo) {
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
      this.$photo = photo || JSON.stringify(props);
    }
  },

  render(h) {
    const { default: defaultSlot } = this.$slots;
    if (!defaultSlot || defaultSlot.length !== 1) {
      throw new Error("ComponentFixture should have one unique default slot");
    }
    const { control } = this.$scopedSlots;

    if (this.__stage == 2) {
      //Updates (needed for hot-reload)
      const testedComponentIndex = control ? 1 : 0;
      const component = this.$children[testedComponentIndex];
      const {
        props: currentProps,
        name: currentName,
        model: currentModel
      } = component.$options;

      this.componentName = currentName;
      this.componentModel = currentModel || defaultModel;
      const currentPhoto = JSON.stringify(currentProps);
      if (currentPhoto != this.$photo) {
        this.dynamicAttributes = {};
        this.propsDefinition = {};
        this.computedValuesFromProps(component, currentProps, currentPhoto);
        this.$photo = currentPhoto;
        this.__stage == 1;
      }
    }

    const [slot] = defaultSlot;
    if (this.__stage === 0) {
      return h("div", {}, [slot]);
    }

    const { Ctor: ctor } = slot.componentOptions;
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

    if (!control) {
      return h(ctor, options, []);
    }

    return h("div", { class: { main: true } }, [
      h("div", { class: { control: true } }, [
        control({
          attributes: this.dynamicAttributes,
          componentName,
          propsDefinition
        })
      ]),
      h("div", { class: { component: true } }, [h(ctor, options, [])])
    ]);
  },

  mounted() {
    if (this.$children.length !== 1) {
      return;
    }
    this.__stage = 1;
    const [component] = this.$children;
    const { props, name, model } = component.$options;
    this.componentName = name;
    this.componentModel = model || defaultModel;
    this.computedValuesFromProps(component, props);
    this.$forceUpdate();
  },

  updated() {
    if (this.__stage !== 1) {
      return;
    }
    this.__stage = 2;
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
    this.__stage = 0;
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
<style lang="less">
.main {
  display: flex;
  flex-direction: row;
  height: 100%;

  .component {
    width: calc(100% - 500px);
    padding: 40px;
    border: 1px solid black;
    border-radius: 5px;
  }

  .control {
    height: 100%;
    width: 500px;
  }
}
</style>
