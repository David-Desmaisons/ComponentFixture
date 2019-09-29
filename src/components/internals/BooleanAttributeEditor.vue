<template>
  <switch-component v-model="object[attribute]" />
</template>
<script>
import switchComponent from "@/components/base/SwitchComponent";

export default {
  props: {
    attribute: {
      required: false,
      type: String
    },
    object: {
      required: true,
      type: Object
    }
  },

  components: {
    switchComponent
  },

  methods: {
    reset() {}
  }
};
</script>
