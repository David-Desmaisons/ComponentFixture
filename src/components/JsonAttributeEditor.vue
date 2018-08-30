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
    this.textValue = JSON.stringify(this.object[this.attribute]);
  },

  data() {
    return {
      textValue: null
    };
  },

  watch: {
    textValue(value) {
      try {
        const newObject = JSON.parse(value);
        this.object[this.attribute] = newObject;
      } catch (e) {
        return;
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
