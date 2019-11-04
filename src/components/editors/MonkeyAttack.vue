<template>
  <div class="monkey-attack-editor">
    <AttackBuilder
      @run="run"
      @stop="stop"
      v-bind="{attack, isUnderAttack}"
    />

    <AttackResult
      v-for="(result,idx) in attacks"
      :key="idx"
      :result="result"
    />
  </div>
</template>
<script>
import AttackBuilder from "../internals/monkey/AttackBuilder";
import AttackResult from "../internals/monkey/AttackResult";
import { createGremlins } from "@/utils/random/gremlinBuilder";
import { Attack } from "@/utils/random/attack";

import { listenToError } from "../../utils/htmlHelper";

const props = {
  props: {
    type: Array,
    required: true
  },
  getUnderTestComponent: {
    required: true,
    type: Function
  },
  methods: {
    required: true,
    type: Array
  }
};

export default {
  name: "monkey-editor",
  key: "monkey",
  display: "Monkey attack",
  components: {
    AttackBuilder,
    AttackResult
  },
  inheritAttrs: false,
  props,
  data() {
    return {
      horde: null,
      currentAttack: null,
      attack: {
        delay: 50,
        maxOperation: 500,
        mouseEvents: true,
        generateSeed: true,
        includeMethod: false,
        stopOnErrorLog: false,
        seed: 0
      },
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
        attack: {
          delay,
          seed: inputSeed,
          generateSeed,
          maxOperation,
          includeMethod,
          mouseEvents,
          stopOnErrorLog
        },
        onStart,
        onEnded,
        methods
      } = this;
      if (isUnderAttack) {
        return;
      }
      const seed = generateSeed
        ? Math.floor(Math.random() * 100000)
        : inputSeed;
      this.attack.seed = seed;
      const changeProp = (key, value) => this.$emit("changed", { key, value });
      const currentAttack = new Attack({
        delay,
        stopOnErrorLog,
        maxOperation,
        mouseEvents
      });
      const watchers = currentAttack.getWatchers();
      const options = {
        props,
        element: getUnderTestComponent().$el,
        includeMethod,
        mouseEvents,
        methods,
        delay,
        seed,
        changeProp
      };
      const horde = createGremlins(options, watchers);
      currentAttack.setHorde(horde);
      this.attacks.unshift(currentAttack);
      this.currentAttack = currentAttack;
      horde.before(onStart);
      horde.after(onEnded);
      horde.unleash({ nb: maxOperation });
    },
    onStart() {
      const {currentAttack} = this;
      this._listener = listenToError(currentAttack.onError.bind(currentAttack));
    },
    onEnded() {
      if (this._listener) {
        this._listener();
        this._listener = null;
      }
      const { currentAttack } = this;
      currentAttack.onEnded();
      this.currentAttack = null;
      const res = currentAttack.error.length === 0 ? "success" : "error";
      this.$emit(res, `Monkey attack ended with ${res}`);
    },
    stop() {
      const { currentAttack } = this;
      if (!currentAttack) {
        return;
      }
      this.currentAttack.stop();
    }
  },
  computed: {
    isUnderAttack() {
      return this.currentAttack !== null;
    }
  }
};
</script>
