<template>
  <input :id="'attribute-'+attribute" v-model="textValue" class="form-control" />
</template>
<script>
export default {
  props: {
    object: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Object
    },
    attribute: {
      required: true,
      type: String
    }
  },

  data() {
    const textValue = JSON.stringify(this.object[this.attribute]);
    return {
      textValue
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
    },
    value() {
      this.textValue = JSON.stringify(this.object[this.attribute]);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
