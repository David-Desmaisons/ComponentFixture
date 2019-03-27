<template>
  <div>
    <component-fixture :defaults="defaults">
      <!-- Use the default slot to create the component under test -->
      <template v-slot:default>
        <slot></slot>>
      </template>

      <!-- Use this slot to enable edition of props values -->
      <Editor
        v-show="showEditor"
        slot="control"
        slot-scope="scope"
        v-bind="scope"
      ></Editor>
    </component-fixture>
  </div>
</template>
<script>
import ComponentFixture from "@/components/ComponentFixture";
import Editor from "@/components/Editor";

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

