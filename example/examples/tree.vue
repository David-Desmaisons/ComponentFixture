<template>
  <sandbox :showEditor="showEditor">
    <tree></tree>
  </sandbox>
</template>
<script>
import { tree } from "vued3tree";
import sandbox from "./sandbox";

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
    sandbox,
    tree
  }
};
</script>