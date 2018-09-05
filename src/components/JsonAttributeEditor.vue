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
    value: {
      type: Object
    },
    attribute: {
      required: true,
      type: String
    }
  },

  data() {
    const textValue = JSON.stringify(this.value);
    return {
      textValue,
      valid: true
    };
  },

  watch: {
    textValue(value) {
      try {
        const newObject = JSON.parse(value);
        this.object[this.attribute] = newObject;
        this.valid = true;
      } catch (e) {
        this.valid = false;
        return;
      }
    },
    value() {
      this.textValue = JSON.stringify(this.object[this.attribute]);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
