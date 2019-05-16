<template>
  <div></div>
</template>
<script>
export default {
  name: "fake-component-vmodel",
  props: {
    value: {
      type: Array,
      required: true
    },
    int: {
      default: 1,
      type: Number
    }
  }
};
</script>
