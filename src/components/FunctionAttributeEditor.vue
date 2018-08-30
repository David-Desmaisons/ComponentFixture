<template>
  <input v-model="textValue" />
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
      functionValue: this.object[this.attribute]
    };
  },

  watch: {
    textValue(value) {
      try {
        this.functionValue = new Function(value);
        this.object[this.attribute] = this.functionValue;
      } catch (e) {
        return;
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
