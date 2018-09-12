<template>
  <div>
  </div>
</template>
<script>
export default {
  name: "fake-component",
  props: {
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
    },
    objectWithFactory: {
      type: Object,
      default: () => ({
        createdByFactory: true
      })
    }
  }
};
</script>
