<template>
  <button class="stop-button">
    <div class="stop-root">
      <i
        class="fa fa-stop"
        aria-hidden="true"
      ></i>

      <div>
        stop
      </div>
    </div>
  </button>
</template>
<script>
export default {
  name: "stop-button",
  props: {
    activated: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="less" scoped>
@button-color: white;
@button-size: 40px;

button.stop-button {
  padding: 0;
  border: 0;
  border-radius: 40px;
  box-shadow: 0;
  color: @button-color;
  background: red;

  .stop-root {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: bold;
    height: @button-size;
    padding: 2px 10px;
  }

  &:focus {
    outline: 0;
  }
  &:hover {
    color: black;
  }
  &:active {
    color: black;
  }
}
</style>
