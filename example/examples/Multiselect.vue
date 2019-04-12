<template>
  <sandbox>
    <multiselect></multiselect>
  </sandbox>
</template>
<script>
import "vue-multiselect/dist/vue-multiselect.min.css";
import multiselect from "vue-multiselect";
import Sandbox from "@/components/Sandbox";

export default {
  name: "multiselect-example",
  meta: {
    display: "Vue Multiselect"
  },
  components: {
    Sandbox,
    multiselect
  }
};
</script>