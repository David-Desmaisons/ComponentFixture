<template>
  <div class="monkey-attack-editor">
    <AttackBuilder
      @run="run"
      @stop="stop"
      :attack="attack"
      :isUnderAttack="isUnderAttack"
      :completion="completion"
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
      action: 0,
      attack: {
        delay: 50,
        maxOperation: 500,
        generateSeed: true,
        includeMethod: false,
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
          maxOperation: nb,
          includeMethod
        },
        onGremlin,
        onStart,
        onEnded,
        methods,
        fpsWatcher
      } = this;
      if (isUnderAttack) {
        return;
      }
      const seed = generateSeed
        ? Math.floor(Math.random() * 100000)
        : inputSeed;
      this.attack.seed = seed;
      const changeProp = (key, value) => this.$emit("changed", { key, value });
      const options = {
        props,
        element: getUnderTestComponent().$el,
        includeMethod,
        methods,
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
      const {
        attack: { delay, maxOperation }
      } = this;
      this._currentAttack = {
        status: null,
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
      const { status } = _currentAttack;
      if (status === null) {
        _currentAttack.status = "completed";
      }
      this.attacks.push(_currentAttack);
      this.action = 0;
      const res = _currentAttack.error.length === 0 ? "success" : "error";
      this.$emit(res, `Monkey attack ended with ${res}`);
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
      this._currentAttack.status = "stopped";
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
      return this.attack.maxOperation + this.attack.delay;
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
