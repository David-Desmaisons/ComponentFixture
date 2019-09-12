<template>
  <div>
    {{message}}
    <pre>{{name}}</pre>
  </div>
</template>
<script>
export default {
  name: "hello",
  props: {
    message: {
      type: String,
      default: "message"
    },
    name: {
      default: undefined
    }
  },
  methods: {
    sayHello() {
      return this.message;
    }
  }
};
</script>
<style>
</style>

