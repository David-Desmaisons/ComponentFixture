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
  },
  data() {
    return {
      a: 90
    };
  },
  computed: {
    computed() {
      return this.a + 10;
    }
  }
};
</script>
