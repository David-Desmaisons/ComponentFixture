<template>
  <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
</template>
<script>
function stringify(value) {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  return JSON.stringify(value);
}

function parse(value) {
  if (value === "undefined") {
    return undefined;
  }
  if (value === "null") {
    return null;
  }
  return JSON.parse(value);
}

export default {
  props: {
    object: {
      required: true,
      type: Object
    },
    value: {
      type: Object
    },
    attribute: {
      required: true,
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
        const newObject = parse(value);
        this.object[this.attribute] = newObject;
        this.valid = true;
      } catch (e) {
        this.valid = false;
        return;
      }
    },
    value: {
      handler(value) {
        this.textValue = stringify(value);
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
</style>
