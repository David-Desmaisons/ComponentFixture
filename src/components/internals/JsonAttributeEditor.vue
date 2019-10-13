<template>
  <input
    :id="'attribute-'+attribute"
    v-model="textValue"
    class="form-control"
  />
</template>
<script>
import {
  getTypeFromValue,
  parseObject,
  stringifyObject
} from "@/utils/TypeHelper";

export default {
  name: "json-attribute-editor",

  props: {
    attribute: {
      required: false,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
    types: {
      required: true,
      type: Array
    },
    value: {
      type: [Object, Array]
    }
  },

  computed: {
    textValue: {
      get() {
        return stringifyObject(this.value);
      },
      set(value) {
        try {
          const newObject = parseObject(value);
          const types = getTypeFromValue(newObject);
          const valid = types.find(t => this.types.find(st => st === t));
          if (!valid) {
            this.$emit(
              "onError",
              `types: ${types} not compatible with ${this.types}`
            );
            return;
          }
          const validated = this.metaData.validate(newObject);
          if (!validated.ok) {
            this.$emit("onError", validated.message);
            return;
          }
          this.$emit("changed", { key: this.attribute, value: newObject });
          this.$emit("onError", null);
        } catch (e) {
          this.$emit("onError", "Unable to convert JSON data");
        }
      }
    }
  }
};
</script>
