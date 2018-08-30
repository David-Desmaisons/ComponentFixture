<template>
  <div>
    <label>{{attribute}}</label>
    <input v-if="type === 'number'" v-model.number="object[attribute]" />
    <input v-else-if="type === 'boolean'" v-model="object[attribute]" type="checkbox" />
    <input v-else-if="type === 'string'" v-model="object[attribute]" />
    <functionAttributeEditor v-else-if="type === 'function'" v-bind="{object, attribute}"></functionAttributeEditor>
    <jsonAttributeEditor v-else v-bind="{object, attribute}"></jsonAttributeEditor>
  </div>
</template>
<script>
import jsonAttributeEditor from "./JsonAttributeEditor";
import functionAttributeEditor from "./FunctionAttributeEditor";

export default {
  components: {
    jsonAttributeEditor,
    functionAttributeEditor
  },

  props: {
    object: {
      required: true,
      type: Object
    },
    attribute: {
      required: true,
      type: String
    }
  },

  computed: {
    type() {
      const value = this.object[this.attribute];
      if (typeof value === "boolean") {
        return "boolean";
      }
      if (typeof value === "string") {
        return "string";
      }
      if (typeof value === "function") {
        return "function";
      }
      if (!isNaN(value)) {
        return "number";
      }
      return "";
    }
  }
};
</script>
<style lang="less" scoped>
</style>
