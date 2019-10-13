const editorMixin = {
  props: {
    attribute: {
      required: true,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    }
  },

  methods: {
    updateIfValid(value) {
      const validated = this.metaData.validate(value);
      if (!validated.ok) {
        this.$emit("onError", validated.message);
        return;
      }
      this.$emit("changed", { key: this.attribute, value });
      this.$emit("onError", null);
    }
  }
};

export { editorMixin };
