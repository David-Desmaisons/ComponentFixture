<template>
  <sandbox>
    <AtomSpinner></AtomSpinner>
  </sandbox>
</template>
<script>
import Sandbox from "@/components/Sandbox";
import {AtomSpinner} from 'epic-spinners'

export default {
  name: "AtomSpinner-example",
  meta: {
    display: "Epic spinner"
  },
  components: {
    Sandbox,
    AtomSpinner
  }
};
</script>

