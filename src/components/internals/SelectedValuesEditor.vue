<template>
  <select
    v-model="textValue"
    class="form-control"
  >
    <option
      v-for="(v, idx) in metaData.possibleValues"
      :key="idx"
    >
      {{v}}
    </option>
  </select>
</template>
<script>
import { editorMixin } from "./EditorMixin";

export default {
  name: "selected-values-editor",

  props: {
    value: {
      required: false,
      type: String
    }
  },

  mixins: [editorMixin],

  computed: {
    textValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.updateIfValid(value);
      }
    }
  }
};
</script>
