<template>
  <div>
    <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
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
      error: null
    };
  },

  watch: {
    textValue(value) {
      try {
        const newObject = parseObject(value);
        const types = getTypeFromValue(newObject);
        const valid = types.find(t => this.types.find(st => st === t));
        if (!valid) {
          this.error = `types: ${types} not compatible with ${this.types}`;
          return;
        }
        this.object[this.attribute] = newObject;
        this.error = null;
      } catch (e) {
        this.error = "Unable to convert JSON data";
      }
    },
    value: {
      handler(value) {
        this.textValue = stringifyObject(value);
        this.error = null;
      },
      immediate: true
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
