<template>
  <div>
    <input :id="'attribute-'+attribute" :class="{'is-invalid':!valid}" v-model="textValue" class="form-control" />
    <div class="invalid-feedback">
      {{error}}
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
    const textValue = this.object[this.attribute];
    return {
      textValue,
      error: null
    };
  },

  watch: {
    textValue(value) {
      const validated = this.metaData.validate(value);
      if (!validated.ok) {
        this.error = validated.message;
        return;
      }
      this.object[this.attribute] = value;
      this.error = null;
    },
    value(value) {
      this.textValue = value;
      this.error = null;
    }
  },

  computed: {
    valid() {
      return this.error === null;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
