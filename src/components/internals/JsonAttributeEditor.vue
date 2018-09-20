<template>
  <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
</template>
<script>
import {
  getTypeFromValue,
  parseObject,
  stringifyObject
} from "@/utils/TypeHelper";

export default {
  props: {
    object: {
      required: true,
      type: Object
    },
    types: {
      required: true,
      type: Array
    },
    value: {
      type: [Object, Array]
    },
    attribute: {
      required: false,
      type: String
    }
  },

  data() {
    return {
      textValue: "",
      valid: true
    };
  },

  watch: {
    textValue(value) {
      try {
        const newObject = parseObject(value);
        const types = getTypeFromValue(newObject);
        const valid = types.find(t => this.types.find(st => st === t));
        if (!valid) {
          const error = new Error(
            `types: ${types} not compatible with ${this.types}`
          );
          window.console.log(error);
          throw error;
        }
        this.object[this.attribute] = newObject;
        this.valid = true;
      } catch (e) {
        this.valid = false;
        return;
      }
    },
    value: {
      handler(value) {
        this.textValue = stringifyObject(value);
        this.valid = true;
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
</style>
