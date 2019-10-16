<template>
  <switch-component v-model="boolValue" />
</template>
<script>
import switchComponent from "@/components/base/SwitchComponent";
import { editorMixin } from "./EditorMixin";

export default {
  name: "boolean-attribute-editor",

  mixins: [editorMixin],

  props: {
    value: {
      required: false,
      type: Boolean
    }
  },

  computed: {
    boolValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.updateIfValid(value);
      }
    }
  },

  components: {
    switchComponent
  }
};
</script>
