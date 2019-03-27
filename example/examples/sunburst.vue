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
import Sandbox from "@/components/Sandbox";

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
    Sandbox,
    sunburst
  }
};
</script>
