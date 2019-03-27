<template>
  <sandbox :showEditor="showEditor">
    <VueSvgGauge></VueSvgGauge>
  </sandbox>
</template>
<script>
import Sandbox from "@/components/Sandbox";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "vue-svg-gauge-example",
  meta: {
    display: "Vue Svg Gauge"
  },
  components: {
    Sandbox
  }
};
</script>