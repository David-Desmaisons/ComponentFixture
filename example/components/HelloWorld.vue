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
  }
};
</script>
<style>
</style>

