<template>
  <input :id="'attribute-'+attribute" v-model="textValue" class="form-control"/>
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
        const functionValue = eval.call(null, `(${value})`);
        if (typeof functionValue !== "function") {
          return;
        }
        this.functionValue = functionValue;
        this.object[this.attribute] = functionValue;
      } catch (e) {
        return;
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
