<template>
  <sandbox :defaults="{value:'String'}">
    <TypeSymbol/>
  </sandbox>
</template>
<script>
import TypeSymbol from "@/components/internals/TypeSymbol";
import {Sandbox} from "@/index";

export default {
  name: "TypeSymbol-demo",
  meta: {
    display: "Type symbol"
  },
  components: {
    Sandbox,
    TypeSymbol
  }
};
</script>
<style lang="less" scoped>
.content {
  background: red;
  height: 100%;
}
</style>