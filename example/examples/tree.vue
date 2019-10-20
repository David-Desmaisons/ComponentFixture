<template>
  <sandbox :defaults="{data, identifier}" componentHeight="300px">
    <tree>
    </tree>
  </sandbox>
</template>
<script>
import { tree } from "vued3tree";
import {Sandbox} from "@/index";

export default {
  name: "tree-example",
  meta: {
    display: "D3 tree"
  },
  data() {
    return {
      data: {
        name: "father",
        id: 0,
        children: [
          {
            name: "son1",
            id: 1,
            children: [
              { id: 2, name: "grandson" },
              { id: 6, name: "grandson2" }
            ]
          },
          {
            name: "son2",
            children: [
              { id: 4, name: "grandson3" },
              { id: 5, name: "grandson4" }
            ]
          }
        ]
      },
      identifier: n => n.id
    };
  },
  components: {
    Sandbox,
    tree
  }
};
</script>
