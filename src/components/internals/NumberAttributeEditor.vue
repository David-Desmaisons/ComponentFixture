<template>
  <input
    
    :id="'attribute-'+attribute"
    v-model="textValue"
    class="form-control"
  />
  <!-- type="range" -->
</template>
<script>
import { filterFloat } from "@/utils/TypeHelper";

export default {
  props: {
    object: {
      required: true,
      type: Object
    },
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
      type: Number
    }
  },

  data() {
    const textValue = this.object[this.attribute];
    return {
      textValue,
      NumberValue: textValue
    };
  },

  watch: {
    textValue(value) {
      const numberValue = filterFloat(value);
      if (isNaN(numberValue)) {
        this.$emit("onError", "Provide a valid number");
        return;
      }
      const validated = this.metaData.validate(numberValue);
      if (!validated.ok) {
        this.$emit("onError", validated.message);
        return;
      }
      this.NumberValue = numberValue;
      this.object[this.attribute] = numberValue;
      this.$emit("onError", null);
    },
    value: {
      handler(value) {
        this.NumberValue = value;
        this.$emit("onError", null);
        if (filterFloat(this.textValue) != value) {
          this.textValue = value;
        }
      }
    }
  },

  methods: {
    reset(value) {
      this.textValue = value;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
