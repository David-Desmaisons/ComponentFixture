<template>
  <sandbox :showEditor="showEditor">
    <hello-world></hello-world>
  </sandbox>
</template>
<script>
import HelloWorld from "../components/HelloWorld";
import sandbox from "./sandbox";

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
    sandbox,
    HelloWorld
  }
};
</script>

