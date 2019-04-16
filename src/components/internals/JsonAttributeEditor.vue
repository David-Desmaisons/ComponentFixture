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

export default {
  props: {
    attribute: {
      required: false,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
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
    }
  },

  data() {
    return {
      textValue: ""
    };
  },

  watch: {
    textValue(value) {
      try {
        const newObject = parseObject(value);
        const types = getTypeFromValue(newObject);
        const valid = types.find(t => this.types.find(st => st === t));
        if (!valid) {
          this.$emit(
            "onError",
            `types: ${types} not compatible with ${this.types}`
          );
          return;
        }
        const validated = this.metaData.validate(newObject);
        if (!validated.ok) {
          this.$emit("onError", validated.message);
          return;
        }
        this.object[this.attribute] = newObject;
        this.$emit("onError", null);
      } catch (e) {
        this.$emit("onError", "Unable to convert JSON data");
      }
    },
    value: {
      handler(value) {
        this.textValue = stringifyObject(value);
        this.$emit("onError", null);
      },
      immediate: true
    }
  },

  methods: {
    reset() {
      this.textValue = this.value;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
