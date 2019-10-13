<template>
  <input
    :id="'attribute-'+attribute"
    v-model="textValue"
    class="form-control"
  />
</template>
<script>
import { parseFunction } from "@/utils/TypeHelper";

export default {
  name: "function-attribute-editor",

  props: {
    attribute: {
      required: true,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
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
          const validated = this.metaData.validate(functionValue);
          if (!validated.ok) {
            this.$emit("onError", validated.message);
            return;
          }
          this.$emit("changed", { key: this.attribute, value: functionValue });
          this.$emit("onError", null);
        } catch (e) {
          this.$emit("onError", "Provide a valid function");
        }
      }
    }
  }
};
</script>
