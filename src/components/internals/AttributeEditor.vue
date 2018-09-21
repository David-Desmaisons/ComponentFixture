<template>
  <div class="form-group row">
    <label :for="'attribute-'+attribute" class="col-sm-4 col-form-label">{{attribute}}</label>
    <div class="col-sm-8">
      <input v-if="type === 'Boolean'" :id="'attribute-'+attribute" v-model="object[attribute]" type="checkbox" class="checkbox control-input" />
      <numberAttributeEditor v-else-if="type === 'Number'" v-bind="{object, attribute, metaData, value:object[attribute]}"></numberAttributeEditor>
      <stringAttributeEditor v-else-if="type === 'String'" v-bind="{object, attribute, metaData, value:object[attribute]}" />
      <functionAttributeEditor v-else-if="type === 'Function'" v-bind="{object, attribute, metaData}"></functionAttributeEditor>
      <jsonAttributeEditor v-else v-bind="{object, attribute, metaData, types, value:object[attribute]}"></jsonAttributeEditor>
    </div>
  </div>
</template> 
<script>
import jsonAttributeEditor from "./JsonAttributeEditor";
import functionAttributeEditor from "./FunctionAttributeEditor";
import numberAttributeEditor from "./NumberAttributeEditor";
import stringAttributeEditor from "./StringAttributeEditor";

export default {
  components: {
    jsonAttributeEditor,
    functionAttributeEditor,
    numberAttributeEditor,
    stringAttributeEditor
  },

  props: {
    object: {
      required: true,
      type: Object
    },
    metaData: {
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
      return this.metaData.types[0];
    },
    types() {
      return this.metaData.types;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
