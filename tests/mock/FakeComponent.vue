<template>
  <div>
  </div>
</template>
<script>
export default {
  name: "fake-component",
  props: {
    objectWithFactory: {
      type: Object,
      default: () => ({
        createdByFactory: true
      })
    },
    number: {
      type: Number,
      default: 25
    },
    string: {
      type: String,
      required: true
    },
    undefinedString: {
      type: String,
      required: false
    }
  }
};
</script>
