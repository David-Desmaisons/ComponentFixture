<template>
  <div class="card">
    <div class="card-header expander" :style="headerStyle">
      <h2 class="mb-0">
        <button
          class="btn expander-button"
          type="button"
          data-toggle="collapse"
          :data-target="`#${id}`"
          aria-expanded="false"
          :aria-controls="id"
        >
          <slot name="header">
            {{title}}

            <span>{{leftTitle}}</span>
          </slot>
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
    leftTitle: {
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
    padding-left: 1.25em;
  }

  .expander-button {
    background-color: transparent;
    outline-color: transparent;
    box-shadow: none;
    width: 100%;
    text-align: left;
    padding-top: 0;
    padding-bottom: 0;
  }

  span {
    font-size: 12px;
  }
}
</style>
