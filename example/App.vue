<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <ComponentFixture>
      <tree></tree>
      <div slot="control" slot-scope="{ attributes, componentName }" class="control">
        <h1>{{componentName}}</h1>
        <pre>{{attributes}}</pre>
      </div>
    </ComponentFixture>
  </div>
</template>

<script>
import ComponentFixture from "@/components/ComponentFixture";
import { tree } from "vued3tree";

export default {
  name: "app",
  components: {
    ComponentFixture,
    tree
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.treeclass {
  height: 300px;
}
.control {
  background-color: lightgrey;
}
</style>
