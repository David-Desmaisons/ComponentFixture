<template>
  <input :id="'attribute-'+attribute" v-model="textValue" class="form-control" />
</template>
<script>
export default {
  name: "string-attribute-editor",

  props: {
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

  computed: {
    textValue: {
      get() {
        return this.value;
      },
      set(value) {
        const validated = this.metaData.validate(value);
        if (!validated.ok) {
          this.$emit("onError", validated.message);
          return;
        }
        this.$emit("changed", { key: this.attribute, value });
        this.$emit("onError", null);
      }
    }
  }
};
</script>
