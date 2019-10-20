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
        this.emitErrorForAttribute(validated.message);
        return;
      }
      this.$emit("changed", { key: this.attribute, value });
      this.$emit("error", null);
    },

    emitErrorForAttribute(message) {
      this.$emit("error", `Update of "${this.attribute}" failed: ${message}`);
    },

    clear() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    }
  }
};

export { editorMixin };
