<template>
  <div>
    <prism-editor
      v-if="hasData"
      :code="stringify(data)"
      language="js"
      readonly
    />

    <span
      class="no-info"
      v-else
    >
      No data detected.
    </span>
  </div>
</template>
<script>
import CircularJSON from "circular-json";
import Vue from "vue";
import PrismEditor from "vue-prism-editor";
import "prismjs";
import "prismjs/themes/prism.css";

const props = {
  data: {
    type: Object,
    required: false
  }
};

export default {
  name: "data-editor",
  key: "data",
  display: "Data",
  props,
  components: {
    PrismEditor
  },
  computed: {
    hasData() {
      return this.data != null && Object.keys(this.data).length > 0;
    }
  },
  methods: {
    stringify(value) {
      return CircularJSON.stringify(
        value,
        (key, value) => {
          if (value instanceof Vue && value._isVue) {
            return { name: value.name, type: "VueComponent" };
          }
          return value;
        },
        "  "
      );
    }
  }
};
</script>
<style lang="less" scoped>
.description {
  margin: 10px;
}
</style>
