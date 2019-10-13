<template>
  <switch-component v-model="boolValue" />
</template>
<script>
import switchComponent from "@/components/base/SwitchComponent";

export default {
  name: "boolean-attribute-editor",

  props: {
    attribute: {
      required: false,
      type: String
    },
    value: {
      required: true,
      type: Boolean
    }
  },

  computed: {
    boolValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("changed", { key: this.attribute, value });
      }
    }
  },

  components: {
    switchComponent
  }
};
</script>
