<template>
  <input
    :id="'attribute-'+attribute"
    v-model="textValue"
    class="form-control"
  />
</template>
<script>
import { parseFunction } from "@/utils/TypeHelper";
import { editorMixin } from "./EditorMixin";

export default {
  name: "function-attribute-editor",

  mixins: [editorMixin],

  props: {
    value: {
      required: false,
      type: Function
    }
  },

  computed: {
    textValue: {
      get() {
        return String(this.value);
      },
      set(value) {
        try {
          const functionValue = parseFunction(value);
          this.updateIfValid(functionValue);
        } catch (e) {
          this.$emit("error", "Provide a valid function");
        }
      }
    }
  }
};
</script>
