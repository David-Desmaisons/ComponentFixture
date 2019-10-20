<template>
  <div>
    <template v-if="props.length>0">
      <attributeEditor
        v-for="prop in props"
        :key="prop.key"
        :value="attributes[prop.key]"
        :attribute="prop.key"
        :metaData="prop.metaData"
        @success="success"
        @changed="changed"
        @error="error"
      />
    </template>

    <div
      class="no-info"
      v-else
    >No props detected.
    </div>
  </div>
</template>
<script>
import attributeEditor from "../internals/AttributeEditor";
import { delegateEvents } from "@/utils/delegateEvents";

const props = {
  props: {
    type: Array,
    required: true
  },
  attributes: {
    type: Object,
    required: true
  }
};
export default {
  name: "props-editor",
  key: "props",
  display: "Props",
  inheritAttrs: false,
  components: {
    attributeEditor
  },
  props,
  methods: {
    ...delegateEvents(["success", "changed", "error"])
  }
};
</script>
