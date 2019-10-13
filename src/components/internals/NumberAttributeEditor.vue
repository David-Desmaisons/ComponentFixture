<template>
  <div class="main-control">
    <div class="input-control">
      <input
        class="range min"
        v-model.number="min"
      >
      <input
        class="range max"
        v-model.number="max"
      >
    </div>
    <div class="inputs">

      <input
        :min="min"
        :max="max"
        type="range"
        :id="'attribute-'+attribute"
        v-model="textValue"
        class="range form-control"
      >

      <input
        class="value form-control"
        :id="'attribute-2-'+attribute"
        v-model="textValue"
      >
    </div>
  </div>
</template>
<script>
import { filterFloat } from "@/utils/TypeHelper";

export default {
  name: "number-attribute-editor",

  props: {
    attribute: {
      required: true,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
    value: {
      required: false,
      type: Number
    }
  },

  data() {
    return {
      min: 0,
      max: 100
    };
  },

  computed: {
    textValue: {
      get() {
        return this.value;
      },
      set(value) {
        const numberValue = filterFloat(value);
        if (isNaN(numberValue)) {
          this.$emit("onError", "Provide a valid number");
          return;
        }
        const validated = this.metaData.validate(numberValue);
        if (!validated.ok) {
          this.$emit("onError", validated.message);
          return;
        }
        if (this.NumberValue === numberValue) {
          return;
        }
        this.$emit("changed", { key: this.attribute, value: numberValue });
        this.$emit("onError", null);
      }
    }
  },

  watch: {
    value: {
      handler(value) {
        this.$emit("onError", null);
        if (value > this.max) {
          this.max = value * 2;
        }
        if (value < this.min) {
          this.min = value * 2;
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
@range-width: 40px;
@value-width: 60px;

.main-control {
  width: 100%;
}

.input-control {
  display: flex;
  align-items: flex-end;
  margin-right: @value-width;
  justify-content: space-between;

  .range {
    border-width: 0;
    font-size: 10px;
    max-width: @range-width;
    min-width: @range-width;
    height: auto;
    line-height: 0px;
    overflow-x: visible;
    background-color: transparent;

    &:hover {
      background: #eee;
    }
  }
}

.inputs {
  display: flex;
  align-items: center;

  .value.form-control {
    margin-left: auto;
    background-color: transparent;
    max-width: @value-width;
  }
}
</style>
