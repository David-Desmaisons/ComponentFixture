<template>
  <sandbox :showEditor="showEditor">
    <vueSlider>
      <div
        class="diy-tooltip"
        slot="tooltip"
        slot-scope="{ value }"
      >{{ value }}</div>
    </vueSlider>
  </sandbox>
</template>
<script>
import Sandbox from "@/components/Sandbox";
import vueSlider from "vue-slider-component";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "slider-example",
  meta: {
    display: "Vue slider"
  },
  components: {
    Sandbox,
    vueSlider
  }
};
</script>

