<template>
  <input
    :id="'attribute-'+attribute"
    v-model="textValue"
    class="form-control"
  />
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
    metaData: {
      required: true,
      type: Object
    },
    value: {
      required: false,
      type: String
    }
  },

  data() {
    const textValue = this.value;
    return {
      textValue
    };
  },

  watch: {
    textValue(value) {
      const validated = this.metaData.validate(value);
      if (!validated.ok) {
        this.$emit("onError", validated.message);
        return;
      }
      this.object[this.attribute] = value;
      this.$emit("onError", null);
    },
    value(value) {
      this.textValue = value;
      this.$emit("onError", null);
    }
  },

  methods: {
    reset(value) {
      this.textValue = value;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
