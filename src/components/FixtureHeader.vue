<template>
  <div class="component__segment">
    <div class="controls navbar-light start">
      <button
        class="btn btn--toggle-editor navbar-toggler"
        @click="toggleEditor()"
        v-tooltip.left="'Toggle sidebar editor'"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <h4 class="component__title">{{componentName}}</h4>
    </div>

    <div class="controls end">
      <button
        class="btn btn--refresh-component"
        @click="update"
        v-tooltip.left="'Update component'"
      >
        <i
          class="fa fa-refresh"
          aria-hidden="true"
        ></i>
      </button>
    </div>

  </div>
</template>
<script>
import { VTooltip } from "v-tooltip";

const props = {
  componentName: {
    required: true,
    type: String
  },
  update: {
    required: true,
    type: Function
  }
};

export default {
  directives: {
    tooltip: VTooltip
  },
  props,
  name: "FixtureHeader",
  methods: {
    toggleEditor(){
      this.$emit('toggle');
    }
  }
};
</script>
<style lang="less" scoped>
.component__segment {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px 16px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px 5px 0 0;
  overflow-x: auto;
  position: relative;
  z-index: 9;

  .controls {
    display: flex;
    align-items: center;


    &.start {
      flex: 1;
    }

    .btn {
      border: 0;
      margin: 0;
      padding: 0;
      background: transparent;
    }
  }

  .component__title {
    margin: 0;
    font-size: 26px;
    text-transform: capitalize;
    // background: #f4f4f4;
    margin-left: 10px;
    padding: 5px 15px;
    border-radius: 3px;
    line-height: 1;
  }

}
</style>
