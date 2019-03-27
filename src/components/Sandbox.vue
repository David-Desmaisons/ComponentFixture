<template>
  <div>
    <component-fixture :defaults="defaults">
      <!-- Use the default slot to create the component under test -->
      <template v-slot:default>
        <slot/>
      </template>

      <!-- Use this slot to enable edition of props values -->
      <template v-slot:control="scope">
        <Editor
          v-bind="scope"
          v-show="showEditor"
        />
      </template>

    </component-fixture>
  </div>
</template>
<script>
import ComponentFixture from "./ComponentFixture";
import Editor from "./Editor";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    },
    defaults: {
      type: Object,
      default: () => {}
    }
  },
  name: "sandbox",
  components: {
    ComponentFixture,
    Editor
  }
};
</script>

