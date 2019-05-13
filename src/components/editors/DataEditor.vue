<template>
  <div>
    <template v-if="hasData">
      <pre class="description">{{stringify(data)}}</pre>
    </template>

    <template v-else><span class="no-info">No data detected.</span></template>
  </div>
</template>
<script>
import CircularJSON from "circular-json";
import Vue from "vue";

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
