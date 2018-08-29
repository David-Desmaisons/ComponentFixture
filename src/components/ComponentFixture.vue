<script>
import Vue from "vue";

function extractDefaultValue(prop) {
  const { default: defaultValue } = prop;
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
    if (this.stage === 0) {
      return h("div", {}, [slot]);
    }

    const { control } = this.$scopedSlots;
    const { tag, Ctor: ctor } = slot.componentOptions;
    if (this.stage === 1) {
      Vue.component(tag, ctor);
    }
    this.stage = 2;
    const props = this.dynamicAttributes;

    if (!control) {
      return h(tag, { props }, []);
    }

    return h("div", { class: { main: true } }, [
      h("div", { class: { control: true } }, [
        control({
          componentName: this.componentName,
          attributes: this.dynamicAttributes
        })
      ]),
      h("div", { class: { component: true } }, [h(tag, { props }, [])])
    ]);
  },
  mounted() {
    if (this.stage !== 0) {
      return;
    }
    this.stage = 1;
    const [child] = this.$children;
    const { props, name } = child.$options;
    this.componentName = name;
    const dynamicAttributes = this.dynamicAttributes;
    Object.keys(props).forEach(key =>
      Vue.set(dynamicAttributes, key, extractDefaultValue(props[key]))
    );
  },
  data() {
    return {
      componentName: null,
      stage: 0,
      dynamicAttributes: {}
    };
  }
};
</script>
<style lang="less">
.main {
  display: flex;
  flex-direction: row;
}
</style>
