<template>
  <div>
    <InformationDisplayer
      :data="data"
      label="data"
    />

    <InformationDisplayer
      :data="computed"
      label="computed"
    />

  </div>
</template>
<script>
import InformationDisplayer from "@/components/base/InformationDisplayer";

const props = {
  data: {
    type: Object,
    required: false
  },
  computed: {
    type: Object,
    required: false
  }
};

export default {
  name: "state-editor",
  key: "state",
  display: "State",
  props,
  inheritAttrs: false,
  components: {
    InformationDisplayer
  }
};
</script>
<style lang="less" scoped>
.description {
  margin: 10px;
}
</style>
