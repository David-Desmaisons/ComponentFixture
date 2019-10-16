<template>
  <sandbox>
    <multiselect></multiselect>
  </sandbox>
</template>
<script>
import "vue-multiselect/dist/vue-multiselect.min.css";
import multiselect from "vue-multiselect";
import {Sandbox} from "@/index";

export default {
  name: "multiselect-example",
  meta: {
    display: "Multiselect"
  },
  components: {
    Sandbox,
    multiselect
  }
};
</script>