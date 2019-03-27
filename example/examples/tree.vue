<template>
  <sandbox :showEditor="showEditor">
    <tree></tree>
  </sandbox>
</template>
<script>
import { tree } from "vued3tree";
import Sandbox from "@/components/Sandbox";

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
    Sandbox,
    tree
  }
};
</script>