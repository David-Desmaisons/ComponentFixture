<template>
  <sandbox>
    <resizable>
      <div class="content">
        resizable content
      </div>
    </resizable>
  </sandbox>
</template>
<script>
import resizable from "@/components/base/Resizable";
import {Sandbox} from "@/index";

export default {
  name: "resizable-demo",
  meta: {
    display: "resizable"
  },
  components: {
    Sandbox,
    resizable
  }
};
</script>
<style lang="less" scoped>
.content {
  background: red;
  height: 100%;
}
</style>