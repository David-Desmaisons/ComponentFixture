<template>
  <div>
  </div>
</template>
<script>
function valueWithError() {
  throw new Error("Problem here");
}
export default {
  name: "fake-component",
  props: {
    objectWithFactory: {
      type: Object,
      default() {
        return {
          createdByFactory: true,
          madeBy: this.$options.name
        };
      }
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
    },
    oddNumber: {
      type: Number,
      required: false,
      default: 2,
      validator: value => value % 2 === 0
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
    },
    computedWithError() {
      return valueWithError();
    }
  }
};
</script>
