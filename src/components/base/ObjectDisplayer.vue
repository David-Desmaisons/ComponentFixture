<template>
  <prism-editor :code="data | stringify" language="js" readonly/>
</template>
<script>
import { stringify } from "@/utils/stringify";
import PrismEditor from "vue-prism-editor";
import "prismjs";
import "prismjs/themes/prism.css";

const props = {
  data: {
    required: false
  }
};

export default {
  name: "object-displayer",
  props,
  components: {
    PrismEditor
  },
  filters: {
    stringify
  }
};
</script>
