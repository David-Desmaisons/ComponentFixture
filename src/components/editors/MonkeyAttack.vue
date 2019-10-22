<template>
  <div class="monkey-attack-editor">

    <div
      v-for="(p,idx) in props"
      :key="idx"
    >
      {{p.key}}
    </div>

    <MonkeyButton
      v-tooltip.left="'Run monkey attack'"
      @click.native="run"
    />
  </div>
</template>
<script>
import { VTooltip } from "v-tooltip";
import MonkeyButton from "../internals/MonkeyButton";

const props = {
  props: {
    type: Array,
    required: true
  }
};

export default {
  name: "monkey-editor",
  key: "monkey",
  display: "Monkey attack",
  directives: {
    tooltip: VTooltip
  },
  components: {
    MonkeyButton
  },
  inheritAttrs: false,
  props,
  methods: {
    run() {
      window.console.log("monkey attack!!!");
    }
  }
};
</script>
<style lang="less" scoped>
@button-color: black;
@button-color-hover: black;
@button-size: 40px;

.monkey-attack-editor {
  button {
    padding: 0;
    background: white;
    border: 0;
    border: 2px solid @button-color;
    border-radius: 40%;
    box-shadow: 0;
    &:focus {
      outline: 0;
    }
    svg {
      fill: @button-color;
      width: @button-size;
      height: @button-size;

      &:hover {
        fill: @button-color-hover;
      }
    }
    &:hover {
      border-color: @button-color-hover;
      background: lightgray;
      svg {
        fill: @button-color-hover;
      }
    }
  }
}
</style>
