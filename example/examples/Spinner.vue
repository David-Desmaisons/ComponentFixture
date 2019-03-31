<template>
  <sandbox :showEditor="showEditor">
    <AtomSpinner></AtomSpinner>
  </sandbox>
</template>
<script>
import Sandbox from "@/components/Sandbox";
import {AtomSpinner} from 'epic-spinners'

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "AtomSpinner-example",
  meta: {
    display: "Epic slider"
  },
  components: {
    Sandbox,
    AtomSpinner
  }
};
</script>

