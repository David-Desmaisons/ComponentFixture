<template>
  <div class="editor">
    <attributeEditor
      v-for="prop in props"
      :key="prop.key"
      :object="attributes"
      :attribute="prop.key"
      :metaData="prop.metaData"
    />
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.css";
import attributeEditor from "./internals/AttributeEditor";

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
      required: false,
      type: String
    },
    propsDefinition: {
      required: true,
      type: Object
    }
  },

  computed: {
    props() {
      return Object.keys(this.propsDefinition)
        .sort()
        .map(p => ({
          key: p,
          metaData: this.propsDefinition[p]
        }));
    }
  }
};
</script><style lang="less" scoped>
.editor {
  font-size: 12px;

  /deep/ input {
    font-size: 12px;
  }
}
</style>
