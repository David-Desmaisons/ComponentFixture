<template>
  <div>
  </div>
</template>
<script>
export default {
  name: "fake-component-with-methods",
  props: {
    number: {
      type: Number,
      default: 25
    }
  },
  methods: {
    method1: jest.fn(),
    method2: jest.fn(() => 23),
    method3(arg) {
      return arg;
    }
  }
};
</script>
