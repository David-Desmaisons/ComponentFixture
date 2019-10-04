<template>
  <div
    class="resizable-container"
    :class="{active}"
    :style="style"
  >
    <slot>
    </slot>
    <div
      v-if="isResizable"
      class="resizer-element"
      @mousedown.prevent="initResize"
    >
      <i
        class="fa fa-arrows-alt"
        aria-hidden="true"
      ></i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isResizable: {
      type: Boolean,
      default: true
    }
  },
  name: "resizable",
  data() {
    return {
      style: null,
      active: false,
      original: null
    };
  },
  mounted() {
    const { $el } = this;
    const parent = $el.parentNode;
    parent.addEventListener("mousemove", this.resize, false);
    parent.addEventListener("mouseup", this.stopResize, false);
    this.original = {
      x: `${$el.clientWidth}px`,
      y: `${$el.clientHeight}px`
    };
  },
  beforeDestroy() {
    const parent = this.$el.parentNode;
    if (!parent) {
      return;
    }
    parent.removeEventListener("mousemove", this.resize, false);
    parent.removeEventListener("mouseup", this.stopResize, false);
  },
  methods: {
    initResize() {
      this.active = true;
    },
    toOriginalSize() {
      this.style = this.original;
    },
    resize(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false;
      }
      if (!this.active) {
        return;
      }
      let target = this.$el;
      const offset = { x: 0, y: 0 };
      while (target) {
        offset.x += target.offsetLeft;
        offset.y += target.offsetTop;
        target = target.offsetParent;
      }
      const style = {
        width: e.pageX - offset.x + "px",
        height: e.pageY - offset.y + "px"
      };
      this.style = style;
    },
    stopResize() {
      this.active = false;
    }
  }
};
</script>
<style lang="less" scoped>
.resizable-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.resizable-container.active {
  outline: 1px dashed black;
}

.resizer-element {
  width: 10px;
  height: 10px;
  position: absolute;
  opacity: 0.5;
  right: 0;
  bottom: 0;
  cursor: se-resize;
}
</style>
