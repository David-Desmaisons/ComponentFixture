<template>
  <sandbox :defaults="{text:'abc'}">
    <VueTyper></VueTyper>
  </sandbox>
</template>
<script>
import {Sandbox} from "@/index";
import { VueTyper } from "vue-typer";

export default {
  name: "vue-typer-example",
  meta: {
    display: "Typer"
  },
  components: {
    Sandbox,
    VueTyper
  }
};
</script>