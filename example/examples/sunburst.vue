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
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";
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
