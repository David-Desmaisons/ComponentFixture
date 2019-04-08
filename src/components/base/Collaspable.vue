<template>
  <div class="card">
    <div class="card-header expander" :style="headerStyle">
      <button
        class="btn expander-button"
        type="button"
        data-toggle="collapse"
        :data-target="`#${id}`"
        aria-expanded="false"
        :aria-controls="id"
        :class="{ collapsed: !initialShow}"
      >
        <div class="expander-header">
          <i class="fa fa-caret-down expander-icon"></i>
          <slot name="header">
            <strong>{{title}}</strong>
          </slot>
        </div>
      </button>
    </div>

    <div :id="id" class="collapse" :class="{ show: initialShow}">
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
let id = 0;
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
      id: `collapse${id++}`,
      collapse: this.initialShow
    };
  }
};
</script>
<style lang="less" scoped>
.card {
  padding: 0;
  border: 0;
  margin-bottom: 5px;
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
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .expander-button {
    background-color: #f4f4f4;
    outline-color: transparent;
    box-shadow: none;
    width: 100%;
    text-align: left;
    padding-top: 0;
    padding-bottom: 0;

    .expander-icon {
      height: 100%;
      margin-right: 10px;
      transition: all 0.3s;
    }
  }

  .expander-header {
    display: flex;
    align-items: center;
    padding: 3px 0;
  }

  .expander-button.collapsed {
    .expander-icon {
      transform: rotate(0.5turn);
    }
  }

  span {
    font-size: 12px;
  }

  .card-body {
    padding: 10px;
    overflow-x: hidden;
  }
}
</style>
