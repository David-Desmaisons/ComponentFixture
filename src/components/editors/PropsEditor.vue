<template>
  <div>
    <template v-if="props.length>0">
      <attributeEditor
        v-for="prop in props"
        :key="prop.key"
        :object="attributes"
        :attribute="prop.key"
        :metaData="prop.metaData"
        @success="success"
      />
    </template>

    <template v-else><span class="no-info">No props detected.</span></template>
  </div>
</template>
<script>
import attributeEditor from "../internals/AttributeEditor";

const props = {
  props: {
    type: Array,
    required: true
  },
  attributes: {
    type: Object,
    required: true
  }
};
export default {
  name: "props-editor",
  key: "props",
  display: "Props",

  components: {
    attributeEditor
  },
  props,
  methods: {
    success(message) {
      this.$emit("success", message);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


