<template>
  <div>
    <h1>{{label}}</h1>
    <ObjectDisplayer
      v-if="hasData"
      :data="data"
    />

    <div
      class="no-info"
      v-else
    >No {{label}} detected.
    </div>
  </div>
</template>
<script>
import ObjectDisplayer from "@/components/base/ObjectDisplayer";

const props = {
  label: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: false
  }
};

export default {
  name: "information-displayer",
  props,
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
