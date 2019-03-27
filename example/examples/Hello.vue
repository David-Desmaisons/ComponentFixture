<template>
  <sandbox :showEditor="showEditor">
    <hello-world></hello-world>
  </sandbox>
</template>
<script>
import HelloWorld from "../components/HelloWorld";
import Sandbox from "@/components/Sandbox";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "hellow-world-example",
  meta: {
    display: "Hellow world"
  },
  components: {
    Sandbox,
    HelloWorld
  }
};
</script>

