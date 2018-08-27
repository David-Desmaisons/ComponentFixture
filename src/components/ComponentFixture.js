import Vue from "vue";

function extractValue(prop) {
  const defaultValue = prop.default;
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  if (prop.type) {
    return prop.type();
  }

  return prop.required ? undefined : {};
}

export default {
  name: "ComponentFixture",
  render(h) {
    const [slot] = this.$slots.default;

    if (this.stage === 0) {
      return h("div", {}, [slot]);
    }

    if (this.stage == 1) {
      Vue.component(slot.componentOptions.tag, slot.componentOptions.Ctor);
    }
    this.stage = 2;
    const props = this.dynamicAttributes;
    return h(slot.componentOptions.tag, { props }, []);
  },
  mounted() {
    if (this.stage !== 0) {
      return;
    }
    this.stage = 1;
    const [child] = this.$children;
    const { props } = child.$options;
    const dynamicAttributes = this.dynamicAttributes;
    Object.keys(props).forEach(key =>
      Vue.set(dynamicAttributes, key, extractValue(props[key]))
    );
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },
  data() {
    return {
      stage: 0,
      dynamicAttributes: {}
    };
  }
};
