<template>
  <div class="control">
    <h1>{{componentName}}</h1>
    <pre>{{attributes}}</pre>
  </div>
</template>
<script>
export default {
  props: {
    attributes: {
      required: true,
      type: Object
    },
    componentName: {
      required: true,
      type: String
    }
  }
};
</script>
<style lang="less" scoped>
.control {
  background-color: lightgrey;
  height: 100%;
}
</style>
