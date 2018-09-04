<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <ComponentFixture>
      <sunburst></sunburst>
      <Editor slot="control" slot-scope="scope" v-bind="scope">
      </Editor>
    </ComponentFixture>
  </div>
</template>

<script>
import ComponentFixture from "@/components/ComponentFixture";
import Editor from "@/components/Editor";

// import { tree } from "vued3tree";
import { sunburst } from "vue-d3-sunburst";
import 'vue-d3-sunburst/dist/vue-d3-sunburst.css';

export default {
  name: "app",
  components: {
    ComponentFixture,
    Editor,
    sunburst
    // tree
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
</style>
