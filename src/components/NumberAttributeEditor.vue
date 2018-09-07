<template>
  <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
</template>
<script>
import { filterFloat } from "../utils/NumberHelper";
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
    value: {
      required: true,
      type: Number
    }
  },

  data() {
    const textValue = this.object[this.attribute];
    return {
      textValue,
      valid: true,
      NumberValue: textValue
    };
  },

  watch: {
    textValue(value) {
      const numberValue = filterFloat(value);
      if (isNaN(numberValue)) {
        this.valid = false;
        return;
      }
      this.NumberValue = numberValue;
      this.object[this.attribute] = numberValue;
      this.valid = true;
    },
    value: {
      handler(value) {
        this.NumberValue = value;
        this.valid = true;
        if (filterFloat(this.textValue) != value) {
          this.textValue = value;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
