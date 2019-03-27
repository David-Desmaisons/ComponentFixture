<template>
  <div>
    <component-fixture :defaults="{value: 45}">
      <!-- Use the default slot to create the component under test -->
      <tree></tree>

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
import { tree } from "vued3tree";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "tree-example",
  meta:{
    display: "Vue D3 tree"
  },
  components: {
    ComponentFixture,
    Editor,
    tree
  }
};
</script>

