<template>
  <div class="form-group row">
    <label :for="'attribute-'+attribute" class="col-sm-4 col-form-label">{{attribute}}</label>
    <div class="col-sm-8">
      <input :id="'attribute-'+attribute" v-if="type === 'number'" v-model.number="object[attribute]" class="form-control" />
      <input :id="'attribute-'+attribute" v-else-if="type === 'boolean'" v-model="object[attribute]" type="checkbox" class="form-control" />
      <input :id="'attribute-'+attribute" v-else-if="type === 'string'" v-model="object[attribute]" class="form-control" />
      <functionAttributeEditor v-else-if="type === 'function'" v-bind="{object, attribute}"></functionAttributeEditor>
      <jsonAttributeEditor v-else v-bind="{object, attribute}"></jsonAttributeEditor>
    </div>
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
      // const typeFromMetada = this.metaData.type;
      // if (!typeFromMetada) {
      //   return null;
      // }

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
