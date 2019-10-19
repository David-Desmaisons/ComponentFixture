<template>
  <div class="custom-control custom-switch">
    <input
      type="checkbox"
      class="custom-control-input"
      :id="id"
      :checked="value"
      @change.prevent="changed"
    >
    <label
      class="custom-control-label"
      :for="id"
    ></label>

  </div>
</template>
<script>
let id = 1;
export default {
  name: "switchComponent",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: `customSwitch${id++}`
    };
  },
  methods: {
    changed(evt) {
      this.$emit("input", evt.target.checked);
    }
  }
};
</script>
<style lang="less" scoped>
.custom-switch {
  cursor: pointer;

  label {
    font-weight: 500;
    cursor: pointer;
  }

  .custom-control-label {
    position: absolute;
  }

  .custom-control-label::before {
    left: -2.25rem;
    width: 1.75rem;
    pointer-events: all;
    border-radius: 0.5rem;
  }
  .custom-control-label::after {
    top: calc(0.25rem + 2px);
    left: calc(-2.25rem + 2px);
    width: calc(1rem - 4px);
    height: calc(1rem - 4px);
    background-color: #adb5bd;

    border-radius: 0.5rem;
    transition: background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
      -webkit-transform 0.15s ease-in-out;
    transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
      -webkit-transform 0.15s ease-in-out;
  }
  .custom-control-input:checked ~ .custom-control-label::after {
    background-color: #fff;
    -webkit-transform: translateX(0.75rem);
    transform: translateX(0.75rem);
  }
}
</style>
