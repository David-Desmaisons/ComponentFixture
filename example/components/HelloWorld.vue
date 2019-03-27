<template>
  <div>
    {{msg}}
    <pre>{{name}}</pre>
  </div>
</template>
<script>
export default {
  name: "hello",
  props: {
    msg: {
      type: String,
      default: "msg"
    },
    name: {
      default: undefined
    }
  }
};
</script>
<style>
</style>

