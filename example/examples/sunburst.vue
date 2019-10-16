<template>
  <sandbox
    :defaults="{data: {size:220, children:[{size:45}]}}"
  >
    <sunburst></sunburst>
  </sandbox>
</template>
<script>
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";
import { sunburst } from "vue-d3-sunburst";
import {Sandbox} from "@/index";

export default {
  name: "sunburst-example",
  meta: {
    display: "Sunburst"
  },
  components: {
    Sandbox,
    sunburst
  }
};
</script>
