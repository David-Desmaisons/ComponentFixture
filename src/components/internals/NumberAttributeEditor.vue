<template>
  <div>
    <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
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
      error: null,
      NumberValue: textValue
    };
  },

  watch: {
    textValue(value) {
      const numberValue = filterFloat(value);
      if (isNaN(numberValue)) {
        this.error = "Provide a valid number";
        return;
      }
      const validated = this.metaData.validate(numberValue);
      if (!validated.ok) {
        this.error = validated.message;
        return;
      }
      this.NumberValue = numberValue;
      this.object[this.attribute] = numberValue;
      this.error = null;
    },
    value: {
      handler(value) {
        this.NumberValue = value;
        this.error = null;
        if (filterFloat(this.textValue) != value) {
          this.textValue = value;
        }
      }
    }
  },

  computed: {
    valid() {
      return this.error === null;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
