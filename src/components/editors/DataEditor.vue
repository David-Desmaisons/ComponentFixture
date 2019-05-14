<template>
  <div>
    <prism-editor
      v-if="hasData"
      :code="data | stringify"
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
import stringify from "@/utils/stringify";
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
  filters: {
    stringify
  }
};
</script>
<style lang="less" scoped>
.description {
  margin: 10px;
}
</style>
