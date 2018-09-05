<template>
  <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
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
    }
  },

  data() {
    const textValue = this.object[this.attribute];
    return {
      textValue,
      valid: true,
      functionValue: this.object[this.attribute]
    };
  },

  watch: {
    textValue(value) {
      try {
        const functionValue = eval.call(null, `(${value})`);
        if (typeof functionValue !== "function") {
          this.valid = false;
          return;
        }
        this.functionValue = functionValue;
        this.object[this.attribute] = functionValue;
        this.valid = true;
      } catch (e) {
        this.valid = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
