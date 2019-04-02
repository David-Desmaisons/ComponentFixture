<template>
  <section class="app__content">
    <div class="component">
      <router-view :key="$route.fullPath" />
    </div>
  </section>
</template>

<script>
import switchComponent from "@/components/switch";
export default {
  components: {
    switchComponent
  }
};
</script>


<style lang="less" scoped="true">
.app__content {
  flex-grow: 1;
  width: calc(100% - 400px);

  .component {
    padding: 40px;
    background: rgba(0, 0, 0, 0.03);
  }
}
</style>
