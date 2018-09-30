<template>
  <div>
  </div>
</template>
<script>
export default {
  name: "fake-component-vmodel-custom",
  model: {
    prop: "customValue",
    event: "customInput"
  },
  props: {
    customValue: {
      type: Array,
      default: "string",
      required: true
    }
  }
};
</script>
