<template>
  <div class="app__sidebar sidebar">
    <div class="sidebar__title">
      <strong>Components</strong>
    </div>
    <div class="sidebar__items list-group">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="list-group-item list-group-item-action"
      >{{route.meta.display}}
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },
  computed: {
    routes() {
      return this.$router.options.routes.filter(r => r.meta);
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
