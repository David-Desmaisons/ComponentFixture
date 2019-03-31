<template>
  <sandbox
    :showEditor="showEditor"
    :defaults="{data, nodeText}"
  >
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
  meta: {
    display: "Vue D3 tree"
  },
  data() {
    return {
      data: {
        name: "father",
        children: [
          {
            name: "son1",
            children: [{ name: "grandson" }, { name: "grandson2" }]
          },
          {
            name: "son2",
            children: [{ name: "grandson3" }, { name: "grandson4" }]
          }
        ]
      }
    };
  },
  components: {
    Sandbox,
    tree
  }
};
</script>