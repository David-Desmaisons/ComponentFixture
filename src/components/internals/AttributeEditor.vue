<template>
  <div class="form-group row">
    <label :for="'attribute-'+attribute" class="col-sm-4 col-form-label">{{attribute}}</label>

    <select class="col-sm-2 col-form-label form-control form-control-sm" :disabled="types.length === 1" v-model="type">
      <option v-for="typeDescription in avalaibleTypes" :value="typeDescription.value" :key="typeDescription.value">{{typeDescription.display}}</option>
    </select>

    <div class="col-sm-6">
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

import { getTypeFromValue } from "@/utils/TypeHelper";

const typesDescription = [
  { display: "{}", value: "Object" },
  { display: "[]", value: "Array" },
  { display: "Π", value: "Number" },
  { display: '""', value: "String" },
  { display: "&&", value: "Boolean" },
  { display: "=>", value: "Function" }
];

function getDefaultType(types, defaultValue) {
  if (types.length === 1) {
    return types[0];
  }
  const fromDefault = getTypeFromValue(defaultValue);
  return fromDefault[0];
}

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

  data() {
    const { types } = this.metaData;
    const type = getDefaultType(types, this.object[this.attribute]);
    return {
      type
    };
  },

  computed: {
    types() {
      return this.metaData.types;
    },
    avalaibleTypes() {
      return typesDescription.filter(t => this.types.indexOf(t.value) !== -1);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
