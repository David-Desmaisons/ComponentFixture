<template>
  <sandbox :defaults="{text:'abc'}">
    <VueTyper></VueTyper>
  </sandbox>
</template>
<script>
import Sandbox from "@/components/Sandbox";
import { VueTyper } from "vue-typer";

export default {
  name: "vue-typer-example",
  meta: {
    display: "Vue typer"
  },
  components: {
    Sandbox,
    VueTyper
  }
};
</script>