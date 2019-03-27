<template>
  <sandbox :showEditor="showEditor">
    <VueSvgGauge></VueSvgGauge>
  </sandbox>
</template>
<script>
import sandbox from "./sandbox";

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
    sandbox
  }
};
</script>