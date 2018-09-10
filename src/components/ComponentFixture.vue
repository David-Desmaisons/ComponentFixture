<script>
import Vue from "vue";
import { getPropDefaultValue } from "@/utils/vueHelper";

function extractDefaultValue(vm, prop, key) {
  const defaultValue = getPropDefaultValue(vm, prop, key);
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (!prop.required) {
    return undefined;
  }
  return prop.type ? prop.type() : {};
}

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
    if (this._stage === 0) {
      return h("div", {}, [slot]);
    }

    const { control } = this.$scopedSlots;
    const { tag, Ctor: ctor } = slot.componentOptions;
    if (this._stage === 1) {
      Vue.component(tag, ctor);
      this._stage = 2;
    }

    const props = this.dynamicAttributes;
    if (!control) {
      return h(tag, { props }, []);
    }

    const { componentName, propsDefinition } = this;
    return h("div", { class: { main: true } }, [
      h("div", { class: { control: true } }, [
        control({
          componentName,
          propsDefinition,
          attributes: this.dynamicAttributes
        })
      ]),
      h("div", { class: { component: true } }, [h(tag, { props }, [])])
    ]);
  },

  mounted() {
    if (this._stage !== 0) {
      return;
    }
    if (this.$children.length !== 1) {
      return;
    }
    this._stage = 1;
    const [child] = this.$children;
    const { props, name } = child.$options;
    this.componentName = name;
    const dynamicAttributes = this.dynamicAttributes;
    const propsDefinition = this.propsDefinition;
    Object.keys(props).forEach(key => {
      const propsValue = props[key];
      Vue.set(
        dynamicAttributes,
        key,
        extractDefaultValue(child, propsValue, key)
      );
      Vue.set(propsDefinition, key, propsValue);
    });
    Vue.nextTick(() => {
      this.$forceUpdate();
    });
  },

  data() {
    this._stage = 0;
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
      propsDefinition: {}
    };
  }
};
</script>
<style lang="less">
.main {
  display: flex;
  flex-direction: row;

  .component {
    width: 100%;
  }
}
</style>
