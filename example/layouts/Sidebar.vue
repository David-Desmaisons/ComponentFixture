<template>
  <div class="app__sidebar sidebar">
    <div class="sidebar__title">
      <strong>Components</strong>
    </div>
    <div class="sidebar__items list-group">
      <a
        href="#tab-vue-slider"
        class="list-group-item list-group-item-action"
        :class="{'selected': tabSelected('#tab-vue-slider')}"
      >Vue Slider Component</a>
      <a
        href="#tab-sunburst"
        class="list-group-item list-group-item-action"
        :class="{'selected': tabSelected('#tab-sunburst')}"
      >Sunburst</a>
      <a
        href="#tab-tree"
        class="list-group-item list-group-item-action"
        :class="{'selected': tabSelected('#tab-tree')}"
      >D3tree</a>
      <a
        href="#tab-hello-world"
        class="list-group-item list-group-item-action"
        :class="{'selected': tabSelected('#tab-hello-world')}"
      >Hello World</a>
      <a
        href="#tab-gauge"
        class="list-group-item list-group-item-action"
        :class="{'selected': tabSelected('#tab-gauge')}"
      >Gauge</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    tabSelected(tab) {
      return location.hash === tab;
    }
  }
};
</script>


<style lang="less" scoped>
.app__sidebar {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px 0;
  max-width: 200px;
  height: 100vh;
  border-right: 1px solid #eaeaea;

  .sidebar__title {
    color: #ccc;
    font-size: 14px;
    text-transform: uppercase;
    padding: 10px 20px;
  }

  .sidebar__items {
    margin: 0;
    padding: 0;

    a {
      color: #000;
      border-right: 0;
      border-left: 0;
      border-radius: 0;
      text-transform: none;
      font-size: 14px;

      &.selected {
        font-weight: bold;
        color: #007bff;
        background: #f8f9fa;
      }
    }
  }
}
</style>
