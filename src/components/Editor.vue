<template>
  <div class="control">
    <h1>{{componentName}}</h1>
    <div>
      <attributeEditor v-for="(value, key) in attributes" :key="key" :object="attributes" :attribute="key" :metaData="propsDefinition[key]">
      </attributeEditor>
    </div>
  </div>
</template>
<script>
import attributeEditor from "./AttributeEditor";

export default {
  components: {
    attributeEditor
  },
  props: {
    attributes: {
      required: true,
      type: Object
    },
    componentName: {
      required: true,
      type: String
    },
    propsDefinition: {
      required: true,
      type: Object
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
