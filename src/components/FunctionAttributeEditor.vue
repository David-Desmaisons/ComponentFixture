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

  mounted() {
    this.textValue = this.object[this.attribute];
  },

  data() {
    return {
      textValue: null
    };
  },

  watch: {
    textValue(value) {
      try {
        this.object[this.attribute] = new Function(value);
      } catch (e) {
        return;
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
