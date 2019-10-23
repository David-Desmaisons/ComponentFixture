<template>
  <div class="monkey-attack-editor">

    <span v-if="isUnderAttack">{{completion}}%</span>
    <div
      v-for="(p,idx) in props"
      :key="idx"
    >
      {{p.key}}
    </div>

    <MonkeyButton
      :disabled="isUnderAttack"
      :activated="isUnderAttack"
      v-tooltip.left="'Run monkey attack'"
      @click.native="run"
    />
  </div>
</template>
<script>
import { VTooltip } from "v-tooltip";
import MonkeyButton from "../internals/MonkeyButton";
import gremlins from "gremlins.js/src/main";
import { createGremlins } from "@/utils/gremlinBuilder";

const props = {
  props: {
    type: Array,
    required: true
  },
  getUnderTestComponent: {
    required: true,
    type: Function
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
  data() {
    return {
      horde: null,
      action: 0,
      delay: 100,
      maxOperation: 500
    };
  },
  methods: {
    run() {
      const {
        isUnderAttack,
        getUnderTestComponent,
        props,
        delay,
        maxOperation: nb,
        onGremlinAction,
        onEnded
      } = this;
      if (isUnderAttack) {
        return;
      }
      const options = { props, element: getUnderTestComponent().$el, delay };
      const horde = createGremlins(gremlins, options, onGremlinAction);
      this.horde = horde;
      horde.before(() => (this.action = 0));
      horde.after(onEnded);
      horde.unleash({ nb });
    },
    onEnded() {
      this.horde = null;
    },
    stop() {
      const { horde } = this;
      if (!horde) {
        return;
      }
      horde.stop();
    },
    onGremlinAction() {
      this.action++;
    }
  },
  computed: {
    isUnderAttack() {
      return this.horde !== null;
    },
    completion() {
      if (!this.isUnderAttack) {
        return null;
      }
      return Math.min(100, (100 * this.action) / this.maxOperation);
    }
  }
};
</script>
