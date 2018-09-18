<template>
  <div id="app">

    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#sunburst-tab" role="tab" aria-controls="home" aria-selected="true">Sunburst</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#tree-tab" role="tab" aria-controls="profile" aria-selected="false">Vued3tree</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="sunburst-tab" role="tabpanel" aria-labelledby="home-tab">
        <component-fixture>

          <!-- Use the default slot to create the component under test -->
          <sunburst></sunburst>

          <!-- Use this slot to enable edition of props values -->
          <Editor slot="control" slot-scope="scope" v-bind="scope">
          </Editor>

        </component-fixture>
      </div>
      <div class="tab-pane fade" id="tree-tab" role="tabpanel" aria-labelledby="profile-tab">
        <component-fixture>

          <!-- Use the default slot to create the component under test -->
          <tree></tree>

          <!-- Use this slot to enable edition of props values -->
          <Editor slot="control" slot-scope="scope" v-bind="scope">
          </Editor>

        </component-fixture>
      </div>
    </div>

  </div>
</template>

<script>
import ComponentFixture from "@/components/ComponentFixture";
import Editor from "@/components/Editor";

import { tree } from "vued3tree";
import { sunburst } from "vue-d3-sunburst";
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";

export default {
  name: "app",
  components: {
    ComponentFixture,
    Editor,
    sunburst,
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
</style>
