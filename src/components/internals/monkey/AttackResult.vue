<template>
  <div
    class="attack-result"
    :class="status"
  >
    <svg
      version="1.1"
      baseProfile="full"
      width="100%"
      height="6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        v-show="result.isUnderAttack"
        x1="0"
        y1="3"
        :x2="`${completion}%`"
        y2="3"
        stroke="blue"
        stroke-width="6"
        stroke-linecap="round"
      />

    </svg>

    <div class="attack-sum-up">
      <div class="status">
        <h1
          class="main-feedback"
          :class="status"
        >{{status}}</h1>
        <i
          v-if="stopped"
          :class="status"
          class="main-feedback fa fa-stop"
          aria-hidden="true"
        ></i>
      </div>

      <button
        v-if="!result.isUnderAttack"
        class="btn"
        @click="reUse"
        v-tooltip.left="'Use parameter for new attack'"
      >
        <i
          class="fa fa-recycle"
          aria-hidden="true"
        ></i>
      </button>
    </div>

    <div class="attack-type">
      <p><b>Seed: </b>{{result.seed}}</p>
      <p><b>Operations: </b>{{result.maxOperation}}</p>
      <p><b>Delay: </b>{{result.delay}}</p>
      <p><b>Mouse events used: </b>{{result.mouseEvents? 'yes' : 'no'}}</p>
      <p><b>Methods used: </b>{{result.includeMethod? 'yes' : 'no'}}</p>
    </div>
    <div class="attack-results">
      <FpsFeedback
        :value="minFps"
        text="Min fps"
        :min="minimunAcceptableFps"
      />

      <FpsFeedback
        :value="maxFps"
        text="Max fps"
        :min="minimunAcceptableFps"
      />

    </div>
    <div
      v-if="showProblems"
      class="problems"
    >
      <div><b>Problems ({{problems.length}}):</b></div>
      <div
        v-for="(problem,idx) in problems"
        :key="idx"
      >{{problem}}</div>
    </div>
  </div>
</template>
<script>
import FpsFeedback from "./FpsFeedback";
import { VTooltip } from "v-tooltip";

export default {
  directives: {
    tooltip: VTooltip
  },
  components: {
    FpsFeedback
  },
  data() {
    return {
      minimunAcceptableFps: 20
    };
  },
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  beforeDestroy() {
    this.result.stop();
  },
  methods: {
    reUse() {
      this.$emit("reUse", this.result);
    }
  },
  computed: {
    minFps() {
      return Math.min(...this.result.fps);
    },
    maxFps() {
      return Math.max(...this.result.fps);
    },
    errorCount() {
      return this.result.error.length;
    },
    fpsProblem() {
      return this.minFps < this.minimunAcceptableFps;
    },
    status() {
      const {
        result: { status }
      } = this;
      if (status === "running") {
        return status;
      }
      if (this.errorCount !== 0) {
        return "erro";
      }
      return this.fpsProblem ? "warn" : "success";
    },
    stopped() {
      return this.result.status === "stopped";
    },
    problems() {
      const { minimunAcceptableFps, fpsProblem } = this;
      const result = this.result.error.map(
        ({ message, type }) => `${type}: ${message}`
      );
      if (fpsProblem) {
        result.push(`Fps lower than ${minimunAcceptableFps}`);
      }
      return result;
    },
    showProblems() {
      return this.status !== "success" && this.status !== "running";
    },
    completion() {
      if (!this.result.isUnderAttack) {
        return 0;
      }
      return Math.min(
        100,
        (100 * this.result.attackNumber) / this.result.maxOperation
      );
    }
  }
};
</script>
<style lang="less" scoped>
.attack-result {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  margin: 2px;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.03);

  .attack-sum-up {
    flex: 1 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .status {
      display: flex;
      align-items: center;
      i {
        margin-left: 5px;
      }
    }
  }

  h1 {
    font-size: 14px;
    margin: 2px 0;
  }

  p {
    margin: 0;
  }

  &.success {
    border-color: green;
  }

  &.warn {
    border-color: orange;
  }

  &.erro {
    border-color: red;
  }

  &.running {
    border-color: blue;
  }

  .main-feedback {
    text-transform: capitalize;

    &.success {
      color: green;
    }

    &.running {
      color: blue;
    }

    &.warn {
      color: orange;
    }

    &.erro {
      color: red;
    }
  }

  button {
    outline: transparent;
    box-shadow: none;
    background: transparent;
    padding: 0;
  }
}
</style>
