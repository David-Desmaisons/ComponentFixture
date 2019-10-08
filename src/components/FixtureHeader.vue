<template>
  <div class="component__segment">
    <div class="controls navbar-light start">
      <button
        class="btn btn--toggle-editor navbar-toggler"
        @click="toggleEditor"
        v-tooltip.left="'Toggle sidebar editor'"
      >
        <i class="fa fa-bars"></i>
      </button>
      <h4 class="component__title">{{componentName}}</h4>
    </div>

    <div class="controls end">
      <button
        class="btn btn--resize"
        :class="{not: !isResizable}"
        @click="toogleResize"
        v-tooltip.left="resizeText"
      >
        <i
          class="fa fa-expand"
          aria-hidden="true"
        ></i>
      </button>

      <button
        class="btn btn--refresh-component"
        @click="executeUpdate"
        v-tooltip.left="'Update component'"
      >
        <i
          class="fa fa-repeat"
          aria-hidden="true"
        ></i>
      </button>
    </div>
  </div>
</template>
<script>
import { VTooltip } from "v-tooltip";

const props = {
  componentName: {
    type: String,
    default: () => "Component without name"
  },
  isResizable: {
    type: Boolean,
    required: true
  },
  update: {
    required: true,
    type: Function
  }
};

export default {
  name: "fixture-header",
  directives: {
    tooltip: VTooltip
  },
  props,
  methods: {
    toggleEditor() {
      this.$emit("toggle");
    },

    toogleResize() {
      this.$emit("resize", !this.isResizable);
    },

    executeUpdate() {
      this.update();
      this.$nextTick(() => {
        this.$emit("success", "$forceUpdate called on component");
      });
    }
  },
  computed: {
    resizeText() {
      return this.isResizable ? "disable resize" : "enable resize";
    }
  }
};
</script>
<style lang="less" scoped>
.component__segment {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 3px 16px;
  border-bottom: 1px solid #ddd;
  border-radius: 0;
  overflow-x: auto;
  position: relative;
  z-index: 9;

  .btn--toggle-editor.navbar-toggler {
    outline: transparent;
    box-shadow: none;
  }

  .controls {
    display: flex;
    align-items: center;

    &.start {
      flex: 1;
    }

    .btn {
      border: 0;
      margin: 0;
      padding: 0;
      background: transparent;
      font-size: 14px;
    }
  }

  .component__title {
    margin: 0;
    font-size: 14px;
    text-transform: capitalize;
    padding: 5px 15px;
    border-radius: 3px;
    line-height: 1;
  }

  .btn--resize.not {
    opacity: 0.2;
  }

  .controls.end {
    button {
      margin: 5px;
    }
  }
}
</style>
