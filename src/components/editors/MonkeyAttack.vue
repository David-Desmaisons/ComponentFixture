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
import { createGremlins } from "@/utils/random/gremlinBuilder";

function format(value) {
  return Math.round(value * 100) / 100;
}

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
      delay: 50,
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
      const changeProp = (key, value) => this.$emit("changed", { key, value });
      const options = {
        props,
        element: getUnderTestComponent().$el,
        delay,
        changeProp
      };
      const horde = createGremlins(options, onGremlinAction);
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
    realMax() {
      return this.maxOperation + this.delay;
    },
    completion() {
      if (!this.isUnderAttack) {
        return null;
      }
      return format(Math.min(100, (100 * this.action) / this.realMax));
    }
  }
};
</script>
