<template>
  <div id="app">

    <ul
      class="nav nav-tabs"
      role="tablist"
    >
      <li class="nav-item">
        <a
          class="nav-link active"
          data-toggle="tab"
          href="#vue-slider-tab"
          role="tab"
          aria-controls="profile"
          aria-selected="true"
        >Vue Slider Component</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#sunburst-tab"
          role="tab"
          aria-controls="home"
          aria-selected="false"
        >Sunburst</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#tree-tab"
          role="tab"
          aria-controls="profile"
          aria-selected="false"
        >D3tree</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#hello-world-tab"
          role="tab"
          aria-controls="profile"
          aria-selected="false"
        >Hello World</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#gauge"
          role="tab"
          aria-controls="profile"
          aria-selected="false"
        >Gauge</a>
      </li>

    </ul>
    <div
      class="tab-content"
      id="myTabContent"
    >

      <div
        class="tab-pane show active"
        id="vue-slider-tab"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <component-fixture :defaults="{value: 45}">

          <!-- Use the default slot to create the component under test -->
          <vue-slider>
            <div
              class="diy-tooltip"
              slot="tooltip"
              slot-scope="{ value }"
            >
              {{ value }}
            </div>
          </vue-slider>

          <!-- Use this slot to enable edition of props values -->
          <Editor
            slot="control"
            slot-scope="scope"
            v-bind="scope"
          >
          </Editor>

        </component-fixture>
      </div>

      <div
        class="tab-pane fade"
        id="sunburst-tab"
        role="tabpanel"
        aria-labelledby="home-tab"
      >
        <component-fixture :defaults="{data: {size:220, children:[{size:45}]}}">

          <!-- Use the default slot to create the component under test -->
          <sunburst></sunburst>

          <!-- Use this slot to enable edition of props values -->
          <Editor
            slot="control"
            slot-scope="scope"
            v-bind="scope"
          >
          </Editor>

        </component-fixture>
      </div>
      <div
        class="tab-pane fade"
        id="tree-tab"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <component-fixture>

          <!-- Use the default slot to create the component under test -->
          <tree></tree>

          <!-- Use this slot to enable edition of props values -->
          <Editor
            slot="control"
            slot-scope="scope"
            v-bind="scope"
          >
          </Editor>

        </component-fixture>
      </div>

      <div
        class="tab-pane fade"
        id="hello-world-tab"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <component-fixture>

          <!-- Use the default slot to create the component under test -->
          <HelloWorld></HelloWorld>

          <!-- Use this slot to enable edition of props values -->
          <Editor
            slot="control"
            slot-scope="scope"
            v-bind="scope"
          >
          </Editor>

        </component-fixture>
      </div>

      <div
        class="tab-pane fade"
        id="gauge"
        role="tabpanel"
        aria-labelledby="profile-tab"
      >
        <component-fixture>

          <!-- Use the default slot to create the component under test -->
          <VueSvgGauge></VueSvgGauge>

          <!-- Use this slot to enable edition of props values -->
          <Editor
            slot="control"
            slot-scope="scope"
            v-bind="scope"
          >
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
import vueSlider from "vue-slider-component";
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";
import HelloWorld from "./components/HelloWorld";

export default {
  name: "app",
  components: {
    ComponentFixture,
    Editor,
    HelloWorld,
    sunburst,
    tree,
    vueSlider
  }
};
</script>

<style lang="less">
html {
  height: 100%;
}

body {
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  margin-top: 5px;
}

.treeclass {
  height: 300px;
}

#myTabContent {
  height: calc(100% - 55px);
  padding-bottom: 40px;
}

.tab-pane {
  height: 100%;
}
</style>
