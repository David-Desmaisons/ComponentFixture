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

  renderError(h, err) {
    return h("pre", { style: { color: "red" } }, err.stack);
  },

  render(h) {
    const { default: defaultSlot } = this.$slots;
    if (!defaultSlot || defaultSlot.length !== 1) {
      throw new Error("ComponentFixture should have one unique default slot");
    }

    const [slot] = defaultSlot;
    if (this.stage === 0) {
      return h("div", {}, [slot]);
    }

    const { control } = this.$scopedSlots;
    const { Ctor: ctor } = slot.componentOptions;

    const props = this.dynamicAttributes;
    if (!control) {
      return h(ctor, { props }, []);
    }

    const { componentName, componentModel, propsDefinition } = this;
    const { event, prop } = componentModel;

    const options = { props };
    if (this.dynamicAttributes.hasOwnProperty(prop)) {
      options.on = {
        [event]: evt => {
          this.dynamicAttributes[prop] = evt;
        }
      };
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
    this.stage = 1;
    const [component] = this.$children;
    const { props, name, model } = component.$options;
    this.componentName = name;
    this.componentModel = model || defaultModel;
    const dynamicAttributes = this.dynamicAttributes;
    const propsDefinition = this.propsDefinition;
    Object.keys(props).forEach(key => {
      const propsValue = props[key];
      const defaultValue = extractDefaultValue(component, propsValue, key);
      Vue.set(dynamicAttributes, key, defaultValue);
      Vue.set(propsDefinition, key, {
        definition: propsValue,
        types: getTypeForProp(propsValue, defaultValue),
        validate: validateProp.bind(null, propsValue)
      });
    });
  },

  data() {
    return {
      /**
       * The fixture stage: 0 not ready, 1: ready.
       */
      stage: 0,

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
      propsDefinition: {}
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
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 40px;
  }
}
</style>
