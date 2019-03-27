<template>
  <sandbox
    :showEditor="showEditor"
    :defaults="{data: {size:220, children:[{size:45}]}}"
  >
    <sunburst></sunburst>
  </sandbox>
</template>
<script>
import { sunburst } from "vue-d3-sunburst";
import sandbox from "./sandbox";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "sunburst-example",
  meta: {
    display: "Vue sunburst"
  },
  components: {
    sandbox,
    sunburst
  }
};
</script>
