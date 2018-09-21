<template>
  <div>
    <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
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
    const textValue = this.object[this.attribute];
    return {
      textValue,
      error: null,
      functionValue: this.object[this.attribute]
    };
  },

  watch: {
    textValue(value) {
      try {
        const functionValue = parseFunction(value);
        const validated = this.metaData.validate(functionValue);
        if (!validated.ok) {
          this.error = validated.message;
          return;
        }
        this.functionValue = functionValue;
        this.object[this.attribute] = functionValue;
        this.error = null;
      } catch (e) {
        this.error = "Provide a valid function";
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
