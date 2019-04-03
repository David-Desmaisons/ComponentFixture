<template>
  <sandbox>
    <VueSlideBar></VueSlideBar>
  </sandbox>
</template>
<script>
import Sandbox from "@/components/Sandbox";
import VueSlideBar from "vue-slide-bar";

export default {
  name: "vue-slide-bar",
  meta: {
    display: "Vue slide bar"
  },
  components: {
    Sandbox,
    VueSlideBar
  }
};
</script>
<style lang="less">
.vue-slide-bar-horizontal {
  width: 100%;
}
</style>
