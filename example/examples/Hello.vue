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
  name: "hello-world-example",
  meta: {
    display: "Hello world"
  },
  components: {
    Sandbox,
    HelloWorld
  }
};
</script>

