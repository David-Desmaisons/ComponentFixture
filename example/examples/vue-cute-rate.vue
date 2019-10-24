<template>
  <sandbox :useStore="true">
    <VueCuteRate></VueCuteRate>
  </sandbox>
</template>
<script>
import {Sandbox} from "@/index";
import VueCuteRate from "vue-cute-rate";

export default {
  name: "vue-cute-rate",
  meta: {
    display: "Cute rate"
  },
  components: {
    Sandbox,
    VueCuteRate
  }
};
</script>
