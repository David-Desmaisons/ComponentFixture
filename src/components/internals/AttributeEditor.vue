<template>
  <div class="form-group row">
    <label :for="'attribute-'+attribute" class="col-sm-4 col-form-label">{{attribute}}</label>
    <div class="col-sm-8">
      <numberAttributeEditor v-if="type === 'Number'" v-bind="{object, attribute, value:object[attribute]}"></numberAttributeEditor>
      <input v-else-if="type === 'Boolean'" :id="'attribute-'+attribute" v-model="object[attribute]" type="checkbox" class="form-control" />
      <input v-else-if="type === 'String'" :id="'attribute-'+attribute" v-model="object[attribute]" class="form-control" />
      <functionAttributeEditor v-else-if="type === 'Function'" v-bind="{object, attribute}"></functionAttributeEditor>
      <jsonAttributeEditor v-else v-bind="{object, attribute, value:object[attribute]}"></jsonAttributeEditor>
    </div>
  </div>
</template> 
<script>
import jsonAttributeEditor from "./JsonAttributeEditor";
import functionAttributeEditor from "./FunctionAttributeEditor";
import numberAttributeEditor from "./NumberAttributeEditor";
import { getTypeForProp } from "@/utils/VueHelper";

export default {
  components: {
    jsonAttributeEditor,
    functionAttributeEditor,
    numberAttributeEditor
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

  data() {
    const type = getTypeForProp(this.metaData, this.object[this.attribute]);
    return {
      type
    };
  }
};
</script>
<style lang="less" scoped>
</style>
