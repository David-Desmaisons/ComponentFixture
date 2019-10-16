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
import { editorMixin } from "./EditorMixin";

export default {
  name: "json-attribute-editor",

  mixins: [editorMixin],

  props: {
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
              "error",
              `types: ${types} not compatible with ${this.types}`
            );
            return;
          }
          this.updateIfValid(newObject);
        } catch (e) {
          this.$emit("error", "Unable to convert JSON data");
        }
      }
    }
  }
};
</script>
