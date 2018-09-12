<script>
import Vue from "vue";
import { extractDefaultValue } from "@/utils/VueHelper";

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

    const { componentName, propsDefinition } = this;
    return h("div", { class: { main: true } }, [
      h("div", { class: { control: true } }, [
        control({
          componentName,
          propsDefinition,
          attributes: this.dynamicAttributes
        })
      ]),
      h("div", { class: { component: true } }, [h(ctor, { props }, [])])
    ]);
  },

  mounted() {
    if (this.stage !== 0) {
      return;
    }
    if (this.$children.length !== 1) {
      return;
    }
    this.stage = 1;
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

  .component {
    width: 100%;
  }
}
</style>
