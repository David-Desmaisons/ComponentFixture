<template>
  <sandbox :useStore="true">
    <VueSvgGauge></VueSvgGauge>
  </sandbox>
</template>
<script>
import {Sandbox} from "@/index";

export default {
  name: "vue-svg-gauge-example",
  meta: {
    display: "Svg Gauge"
  },
  components: {
    Sandbox
  }
};
</script>