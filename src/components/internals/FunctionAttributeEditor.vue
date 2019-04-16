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
  props: {
    attribute: {
      required: true,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
    object: {
      required: true,
      type: Object
    }
  },

  data() {
    const textValue = String(this.object[this.attribute]);
    return {
      textValue,
      functionValue: this.object[this.attribute]
    };
  },

  watch: {
    textValue(value) {
      try {
        const functionValue = parseFunction(value);
        const validated = this.metaData.validate(functionValue);
        if (!validated.ok) {
          this.$emit("onError", validated.message);
          return;
        }
        this.functionValue = functionValue;
        this.object[this.attribute] = functionValue;
        this.$emit("onError", null);
      } catch (e) {
        this.$emit("onError", "Provide a valid function");
      }
    }
  },

  methods: {
    reset(value) {
      this.textValue = String(value);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
