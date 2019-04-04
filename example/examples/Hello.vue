<template>
  <sandbox>
    <hello-world></hello-world>
  </sandbox>
</template>
<script>
import HelloWorld from "../components/HelloWorld";
import Sandbox from "@/components/Sandbox";

export default {
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

