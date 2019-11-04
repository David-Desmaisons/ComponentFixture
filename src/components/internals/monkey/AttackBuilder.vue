<template>
  <div
    class="attack-builder"
  >
    <h1>
      Monkey test builder
    </h1>

    <div class="seed">
      <label class="main">Seed</label>
      <label>Random</label>
      <input
        type="checkbox"
        v-model="attack.generateSeed"
      />
      <input
        class="main form-control component-input"
        v-model.number="attack.seed"
        :disabled="isUnderAttack || attack.generateSeed"
      />
    </div>

    <div class="attack">
      <label class="main">Delay (ms)</label>
      <span>{{attack.delay}}</span>
      <input
        class="main form-control component-input"
        type="range"
        min="10"
        max="150"
        :disabled="isUnderAttack"
        v-model.number="attack.delay"
      />
    </div>

    <div class="attack">
      <label class="main">Attack number</label>
      <span>{{attack.maxOperation}}</span>
      <input
        class="main form-control component-input"
        type="range"
        min="10"
        max="1500"
        :disabled="isUnderAttack"
        v-model.number="attack.maxOperation"
      />
    </div>

    <div class="others">

      <div>
        <label class="main">Mouse events</label>
        <input
          class="form-control component-input"
          type="checkbox"
          :disabled="isUnderAttack"
          v-model="attack.mouseEvents"
        />
      </div>

      <div>
        <label class="main">Call methods</label>
        <input
          class="form-control component-input"
          type="checkbox"
          :disabled="isUnderAttack"
          v-model="attack.includeMethod"
        />
      </div>

      <div>
        <label class="main">Stop on console.error</label>
        <input
          class="form-control component-input"
          type="checkbox"
          :disabled="isUnderAttack"
          v-model="attack.stopOnErrorLog"
        />
      </div>
    </div>

    <div class="actions">

      <MonkeyButton
        v-show="!isUnderAttack"
        :disabled="isUnderAttack"
        :activated="isUnderAttack"
        @click.native="$emit('run')"
      />

      <StopButton
        v-show="isUnderAttack"
        @click.native="$emit('stop')"
      />

    </div>

  </div>
</template>
<script>
import MonkeyButton from "./MonkeyButton";
import StopButton from "./StopButton";

export default {
  name: "attack-builder",
  props: {
    attack: {
      type: Object,
      required: true
    },
    isUnderAttack: {
      type: Boolean,
      required: true
    }
  },
  components: {
    MonkeyButton,
    StopButton
  }
};
</script>
<style lang="less" scoped>
.attack-builder {
  border: 1px solid rgb(206, 212, 218);
  border-radius: 5px;
  margin: 5px;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;

  input:not(type[checkbock]) {
    min-width: 0;
  }

  &.attack {
    background: rgba(255, 0, 0, 0.5);
  }

  h1 {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  > div {
    width: 100%;
    margin: 2px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    label.main {
      font-weight: bold;
      display: inline-block;
      width: 130px;
    }

    &.actions {
      flex-direction: row-reverse;
      justify-content: space-between;
    }

    &.others {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        flex-direction: row;
        label {
          width: auto;
        }
        input.form-control.component-input {
          width: auto;
        }
      }
    }

    span {
      margin: 0 4px;
    }

    input {
      margin: 0 5px;
      &.main {
        width: 100%;

        &:disabled {
          background: lightgray;
        }
      }
    }
  }
}
</style>
