<template>
  <div>
    <switch-component v-model="value" />
  </div>
</template>
<script>
import switchComponent from "@/components/switch";

export default {
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },

  components: {
    switchComponent
  }
};
</script>
<style lang="less" scoped>
</style>
