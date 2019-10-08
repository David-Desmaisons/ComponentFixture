<template>
  <div class="card">
    <div
      class="card-header expander"
      :style="headerStyle"
    >
      <button
        class="btn expander-button"
        aria-expanded="false"
        :class="{ collapsed: collapse}"
        type="button"
        @click="collapse=!collapse"
      >
        <div class="expander-header">
          <i class="fa fa-caret-down expander-icon"></i>
          <slot name="header">
            <strong>{{title}}</strong>
          </slot>
        </div>
      </button>
    </div>

    <div
      class="collapse"
      :class="{ show: !collapse}"
    >
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "collaspable",
  props: {
    title: {
      type: String,
      default: ""
    },
    initialShow: {
      type: Boolean,
      default: true
    },
    headerStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      collapse: !this.initialShow
    };
  }
};
</script>
<style lang="less" scoped>
.card {
  padding: 0;
  border: 0;
  margin-bottom: 3px;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0;

  &:first-child,
  & + .card {
    border-bottom: 0;
  }

  .card-header {
    padding: 0;
    border-radius: 0;
    background: #eee;
    top: 0;
    z-index: 2;
  }

  .expander-button {
    background-color: transparent;
    outline-color: transparent;
    box-shadow: none;
    width: 100%;
    text-align: left;
    padding-top: 0;
    padding-bottom: 0;

    .expander-icon {
      height: 100%;
      margin-right: 10px;
      transition: all 0.15s;
    }
  }

  .expander-header {
    display: flex;
    align-items: center;
    padding: 3px 0;

    strong {
      font-size: 13px;
    }
  }

  .expander-button.collapsed {
    .expander-icon {
      transform: rotate(0.5turn);
    }
  }

  &-body {
    padding: 10px 8px;
  }

  .card-body {
    padding: 10px;
    overflow-x: hidden;
  }
}
</style>
