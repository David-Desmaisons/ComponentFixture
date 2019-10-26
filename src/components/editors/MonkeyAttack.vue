<template>
  <div class="monkey-attack-editor">

    <span v-if="isUnderAttack">{{completion | decimal}}%</span>

    <MonkeyButton
      :disabled="isUnderAttack"
      :activated="isUnderAttack"
      v-tooltip.left="'Run monkey attack'"
      @click.native="run"
    />

    <AttackResult
      v-for="(result,idx) in attacks"
      :key="idx"
      :result="result"
    />
  </div>
</template>
<script>
import { VTooltip } from "v-tooltip";
import MonkeyButton from "../internals/monkey/MonkeyButton";
import AttackResult from "../internals/monkey/AttackResult";
import { createGremlins } from "@/utils/random/gremlinBuilder";
import { listenToError } from "../../utils/htmlHelper";

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
  filters: {
    decimal(value) {
      return Math.round(value * 100) / 100;
    }
  },
  components: {
    MonkeyButton,
    AttackResult
  },
  inheritAttrs: false,
  props,
  data() {
    return {
      horde: null,
      action: 0,
      delay: 50,
      maxOperation: 500,
      seed: null,
      attacks: []
    };
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    run() {
      const {
        isUnderAttack,
        getUnderTestComponent,
        props,
        delay,
        maxOperation: nb,
        onGremlin,
        onStart,
        onEnded,
        fpsWatcher,
        seed
      } = this;
      if (isUnderAttack) {
        return;
      }
      const changeProp = (key, value) => this.$emit("changed", { key, value });
      const options = {
        props,
        element: getUnderTestComponent().$el,
        delay,
        seed,
        changeProp
      };
      const horde = createGremlins(options, { onGremlin, fpsWatcher });

      this.horde = horde;
      horde.before(onStart);
      horde.after(onEnded);
      horde.unleash({ nb });
    },
    onStart() {
      const { delay, maxOperation } = this;
      this._currentAttack = {
        fps: [],
        error: [],
        delay: delay,
        maxOperation,
        seed: this.horde.randomizer().seed,
        attackNumber: 0
      };
      this._listener = listenToError(this.onError);
    },
    onEnded() {
      if (this._listener) {
        this._listener();
        this._listener = null;
      }
      this.horde = null;
      const { _currentAttack } = this;
      _currentAttack.attackNumber = this.action;
      this.attacks.push(_currentAttack);
      this.action = 0;
    },
    onError(error) {
      this._currentAttack.error.push(error);
    },
    fpsWatcher(fps) {
      this._currentAttack.fps.push(fps);
    },
    stop() {
      const { horde } = this;
      if (!horde) {
        return;
      }
      horde.stop();
    },
    onGremlin() {
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
      return Math.min(100, (100 * this.action) / this.realMax);
    }
  }
};
</script>
