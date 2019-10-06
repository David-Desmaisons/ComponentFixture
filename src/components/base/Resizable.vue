<template>
  <div
    class="resizable-container"
    :class="{active}"
    :style="realStyle"
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
    },
    inicialHeight: {
      type: String,
      required: false,
      default: null
    },
    inicialWidth: {
      type: String,
      required: false,
      default: null
    }
  },
  name: "resizable",
  data() {
    return {
      style: null,
      active: false,
      inicial: true
    };
  },
  mounted() {
    const { document } = window;
    document.addEventListener("mousemove", this.resize, false);
    document.addEventListener("mouseup", this.stopResize, false);
  },
  beforeDestroy() {
    const { document } = window;
    document.removeEventListener("mousemove", this.resize, false);
    document.removeEventListener("mouseup", this.stopResize, false);
  },
  methods: {
    initResize() {
      this.active = true;
    },
    toOriginalSize() {
      this.style = this.inicialStyle;
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
      this.inicial = false;
      this.style = style;
    },
    stopResize() {
      this.active = false;
    }
  },
  computed: {
    realStyle() {
      return this.inicial ? this.inicialStyle : this.style;
    },
    inicialStyle() {
      const style = {};
      const { inicialHeight: heigth, inicialWidth: width } = this;
      if (heigth !== null) {
        style.height = heigth;
      }
      if (width !== null) {
        style.width = width;
      }
      return style;
    }
  },
  watch: {
    inicialStyle() {
      this.inicial = true;
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
