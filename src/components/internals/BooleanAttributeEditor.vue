<template>
  <div>
    <switch-component v-model="object[attribute]" />
  </div>
</template>
<script>
import switchComponent from "@/components/switch";

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
  }
};
</script>
<style lang="less" scoped>
</style>
