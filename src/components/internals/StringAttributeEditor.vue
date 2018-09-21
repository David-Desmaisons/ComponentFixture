<template>
  <div>
    <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
    <div class="invalid-feedback">
    </div>
  </div>
</template>
<script>
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
      required: false,
      type: String
    }
  },

  data() {
    const textValue = this.object[this.attribute];
    return {
      textValue,
      valid: true,
      stringValue: textValue
    };
  },

  watch: {
    textValue(value) {
      this.stringValue = value;
      this.object[this.attribute] = value;
      this.valid = true;
    },
    value(value) {
      this.stringValue = value;
      this.textValue = value;
      this.valid = true;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
