<template>
  <div>
    <ObjectDisplayer v-if="hasData" :data="data"/>

    <div class="no-info" v-else>No data detected.</div>
  </div>
</template>
<script>
import ObjectDisplayer from "@/components/base/ObjectDisplayer";

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
  inheritAttrs: false,
  components: {
    ObjectDisplayer
  },
  computed: {
    hasData() {
      return this.data != null && Object.keys(this.data).length > 0;
    }
  }
};
</script>
<style lang="less" scoped>
.description {
  margin: 10px;
}
</style>
