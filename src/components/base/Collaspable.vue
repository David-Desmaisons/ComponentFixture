<template>
  <div class="card">
    <div
      class="card-header expander"
      :style="headerStyle"
    >
      <h2 class="mb-0">

        <button
          class="btn expander-button"
          type="button"
          data-toggle="collapse"
          :data-target="`#${id}`"
          aria-expanded="false"
          :aria-controls="id"
        >
          <div class="expander-header">
            <i class="fa fa-caret-down expander-icon"></i>
            <slot name="header">
              {{title}}
            </slot>
          </div>
        </button>
      </h2>
    </div>

    <div
      :id="id"
      class="collapse"
      :class="{ show: initialShow}"
    >
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
  .card-header.expander {
    padding: 0;
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
      transition: all 0.3s;
    }
  }

  .expander-header {
    display: flex;
  }

  .expander-button.collapsed {
    .expander-icon {
      transform: rotate(0.5turn);
    }
  }

  span {
    font-size: 12px;
  }
}
</style>
