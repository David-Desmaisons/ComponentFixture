<template>
  <div class="component__segment">
    <div class="controls">
      <label class="props-switch">
        <switch-component :value="showEditor" @input="input"/>
        <span :class="{'checked': showEditor}">Show Editor</span>
      </label>

      <h2 class="component__title">{{componentName}}</h2>

      <button class="btn btn-sm" @click="update" v-tooltip.left="'Update component'">
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>
<script>
import switchComponent from "./base/Switch";
import { VTooltip } from "v-tooltip";

const props = {
  componentName: {
    required: true,
    type: String
  },
  methods: {
    required: true,
    type: Array
  },
  update: {
    required: true,
    type: Function
  },
  showEditor: {
    required: true,
    type: Boolean
  }
};

export default {
  directives: {
    tooltip: VTooltip
  },
  model: {
    event: "input",
    prop: "showEditor"
  },
  props,
  components: {
    switchComponent
  },
  name: "FixtureFeader",
  methods: {
    input(evt) {
      this.$emit("input", evt);
    }
  }
};
</script>
<style lang="less" scoped>
.component__segment {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 14px 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px 5px 0 0;
  overflow-x: auto;
  position: relative;
  z-index: 9;

  .controls {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
  }

  div {
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 0;
  }

  .component__title {
    margin: 0;
    font-size: 26px;
    text-transform: capitalize;
    background: #f4f4f4;
    padding: 5px 15px;
    border-radius: 3px;
    line-height: 1;
  }

  .segment {
    text-align: center;
    min-width: 125px;
    text-align: center;
    color: #2b3e50;
    background-color: #eeeeee;
    padding: 8px;
    font-weight: 500;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 14px;

    &.selected {
      font-weight: bold;
      background: #d5dade;
      color: #2b3e50;
      box-shadow: inset 0px 3px #2b3e50;
    }

    &:first-child {
      border-radius: 2px 0 0 2px;
    }

    &:last-child {
      border-radius: 0 2px 2px 0;
    }

    &:hover {
      opacity: 0.9;
    }

    &:active {
      -webkit-transform: translateY(1px);
      transform: translateY(1px);
    }
  }

  .custom-control.custom-switch {
    margin-right: 0;
  }

  .segment-divider {
    height: 100%;
    width: 2px;
    background: #000;
  }

  .props-switch {
    display: flex;
    align-items: center;
    padding: 0 8px;
    margin: 0;
    cursor: pointer;

    span {
      margin-left: 5px;
    }

    .checked {
      font-weight: bold;
    }
  }
}
</style>
