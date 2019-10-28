<template>
  <div
    class="attack-result"
    :class="status"
  >
    <div class="attack-sum-up">
      <h1
        class="main-feedback"
        :class="status"
      >{{status}}</h1>
    </div>

    <div class="attack-type">
      <p><b>Seed: </b>{{result.seed}}</p>
      <p><b>Operations: </b>{{result.maxOperation}}</p>
      <p><b>Delay: </b>{{result.delay}}</p>
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
      v-if="status!=='success'"
      class="problems"
    >
      <div><b>Problems: </b></div>
      <div
        v-for="(problem,idx) in problems"
        :key="idx"
      >{{problem}}</div>
    </div>
  </div>
</template>
<script>
import FpsFeedback from "./FpsFeedback";
export default {
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
      if (this.errorCount !== 0) {
        return "erro";
      }
      return this.fpsProblem ? "warn" : "success";
    },
    problems() {
      const { minimunAcceptableFps, fpsProblem } = this;
      const result = this.result.error.map(
        erro => `Exception raised: ${erro.message}`
      );
      if (fpsProblem) {
        result.push(`Fps lower than ${minimunAcceptableFps}`);
      }
      return result;
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
  margin: 5px;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.03);

  .attack-sum-up {
    flex: 1 100%;
  }

  h1 {
    font-size: 14px;
    margin: 5px 0 12px 0;
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

  .main-feedback {
    text-transform: capitalize;

    &.success {
      color: green;
    }

    &.warn {
      color: orange;
    }

    &.erro {
      color: red;
    }
  }
}
</style>
