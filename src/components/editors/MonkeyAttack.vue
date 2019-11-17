<template>
  <div class="monkey-attack-editor">
    <AttackBuilder
      @run="run"
      @stop="stop"
      v-bind="{attack, isUnderAttack}"
    />

    <div
      class="attack-cleaner"
      v-if="attacks.length!==0"
    >
      <button
        type="button"
        @click.prevent="clear"
        v-tooltip.bottom="'Clear'"
      >
        <i class="fa fa-times-circle"></i>
      </button>
    </div>

    <AttackResult
      v-for="(result,idx) in attacks"
      :key="idx"
      :result="result"
      @reUse="reUse"
    />
  </div>
</template>
<script>
import AttackBuilder from "../internals/monkey/AttackBuilder";
import AttackResult from "../internals/monkey/AttackResult";
import { createGremlins } from "@/utils/random/gremlinBuilder";
import { Attack } from "@/utils/random/attack";
import { VTooltip } from "v-tooltip";
import { listenToError } from "../../utils/browserHelper";
import { log } from "@/utils/logger";

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
  directives: {
    tooltip: VTooltip
  },
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
    changeProp(key, value) {
      log(`Updating props: ${key} with value:`, value);
      this.$emit("changed", { key, value });
    },
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
        changeProp,
        methods
      } = this;
      if (isUnderAttack) {
        return;
      }
      const seed = generateSeed
        ? Math.floor(Math.random() * 100000)
        : inputSeed;
      this.attack.seed = seed;
      const currentAttack = new Attack({
        delay,
        stopOnErrorLog,
        maxOperation,
        mouseEvents,
        includeMethod
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
    reUse({
      delay,
      mouseEvents,
      includeMethod,
      seed,
      maxOperation,
      stopOnErrorLog
    }) {
      const { attack } = this;
      attack.delay = delay;
      attack.mouseEvents = mouseEvents;
      attack.seed = seed;
      attack.includeMethod = includeMethod;
      attack.maxOperation = maxOperation;
      attack.generateSeed = false;
      attack.stopOnErrorLog = stopOnErrorLog;
    },
    clear() {
      this.attacks = [];
    },
    onStart() {
      const { currentAttack } = this;
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
<style lang="less" scoped>
.attack-cleaner {
  button {
    background: white;
    border: 0;
    font-size: 16px;
  }
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 1em;
}
</style>
