<template>
  <section class="app__content">
    <div class="component">
      <router-view :key="$route.fullPath"/>
    </div>
  </section>
</template>

<script>
export default {};
</script>


<style lang="less" scoped="true">
.app__content {
  flex-grow: 1;

  .component {
    height: 100%;
    background: rgba(0, 0, 0, 0.03);
  }
}
</style>
