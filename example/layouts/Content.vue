<template>
  <section class="app__content">
    <div class="component">
      <div class="component__container">
        <div class="component__segment">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="customSwitch1"
              v-model="showEditor"
            >
            <label
              class="custom-control-label"
              for="customSwitch1"
            >Show Atributes</label>
          </div>
        </div>

        <div class="component__content">
          <div class="components__list">
            <template v-if="tab === 'tab-vue-slider'">
              <div
                class="component__single"
                id="vue-slider"
              >
                <component-fixture :defaults="{value: 45}">
                  <!-- Use the default slot to create the component under test -->
                  <vue-slider>
                    <div
                      class="diy-tooltip"
                      slot="tooltip"
                      slot-scope="{ value }"
                    >{{ value }}</div>
                  </vue-slider>

                  <!-- Use this slot to enable edition of props values -->
                  <Editor
                    v-show="showEditor"
                    slot="control"
                    slot-scope="scope"
                    v-bind="scope"
                  ></Editor>
                </component-fixture>
              </div>
            </template>
            <!-- .component__single -->

            <template v-if="tab === 'tab-sunburst'">
              <div
                class="component__single"
                id="sunburst"
              >
                <component-fixture :defaults="{data: {size:220, children:[{size:45}]}}">
                  <!-- Use the default slot to create the component under test -->
                  <sunburst></sunburst>

                  <!-- Use this slot to enable edition of props values -->
                  <Editor
                    v-show="showEditor"
                    slot="control"
                    slot-scope="scope"
                    v-bind="scope"
                  ></Editor>
                </component-fixture>
              </div>
            </template>

            <template v-if="tab === 'tab-tree'">
              <div
                class="component__single"
                id="tree"
              >
                <component-fixture>
                  <!-- Use the default slot to create the component under test -->
                  <tree></tree>

                  <!-- Use this slot to enable edition of props values -->
                  <Editor
                    v-show="showEditor"
                    slot="control"
                    slot-scope="scope"
                    v-bind="scope"
                  ></Editor>
                </component-fixture>
              </div>
            </template>

            <template v-if="tab === 'tab-hello-world'">
              <div
                class="component__single"
                id="hello-world"
              >
                <component-fixture>
                  <!-- Use the default slot to create the component under test -->
                  <HelloWorld></HelloWorld>

                  <!-- Use this slot to enable edition of props values -->
                  <Editor
                    v-show="showEditor"
                    slot="control"
                    slot-scope="scope"
                    v-bind="scope"
                  ></Editor>
                </component-fixture>
              </div>
            </template>
            <!-- .component__single -->

            <template v-if="tab === 'tab-gauge'">
              <div
                class="component__single"
                id="gauge"
              >
                <component-fixture>
                  <!-- Use the default slot to create the component under test -->
                  <VueSvgGauge></VueSvgGauge>

                  <!-- Use this slot to enable edition of props values -->
                  <Editor
                    v-show="showEditor"
                    slot="control"
                    slot-scope="scope"
                    v-bind="scope"
                  ></Editor>
                </component-fixture>
              </div>
            </template>
            <!-- .component__single -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ComponentFixture from "@/components/ComponentFixture";
import Editor from "@/components/Editor";

import { tree } from "vued3tree";
import { sunburst } from "vue-d3-sunburst";
import vueSlider from "vue-slider-component";
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";
import HelloWorld from "../components/HelloWorld";

export default {
  props: {
    tab: String
  },
  components: {
    ComponentFixture,
    Editor,
    HelloWorld,
    sunburst,
    tree,
    vueSlider
  },
  data() {
    return {
      showEditor: true
    };
  }
};
</script>


<style lang="less">
.app__content {
  flex-grow: 1;

  .component {
    padding: 40px;
    height: 100%;
    background: rgba(0, 0, 0, 0.03);
  }
  .component__container {
    width: 100%;
    height: calc(100vh - 140px);
    background: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: hidden;
  }
  .component__segment {
    display: flex;
    padding: 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    border-radius: 5px 5px 0 0;

    .segment {
      text-align: center;
      min-width: 125px;
      text-align: center;
      color: #2b3e50;
      background-color: #eeeeee;
      padding: 8px;
      font-weight: 500;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 14px;

      &.selected {
        font-weight: bold;
        background: #d5dade;
        color: #2b3e50;
        box-shadow: inset 0px 3px #2b3e50;
      }

      &:first-child {
        border-radius: 2px 0 0 2px;
      }

      &:last-child {
        border-radius: 0 2px 2px 0;
      }

      &:hover {
        opacity: 0.9;
      }

      &:active {
        -webkit-transform: translateY(1px);
        transform: translateY(1px);
      }
    }

    .segment-divider {
      height: 100%;
      width: 2px;
      background: #000;
    }
  }

  .component__single {
    .main {
      display: flex;

      > div {
        flex-grow: 1;
        width: 50%;
        height: calc(100vh - 186px);
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px;
        border: 1px solid #ddd;

        &::-webkit-scrollbar-track {
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #999;
          border: 1px solid #ffffff40;
          border-radius: 20px;
        }

        &:first-child {
          border-radius: 0 0 0 4px;
        }
        &:last-child {
          border-radius: 0 0 4px 0;
        }
      }
    }

    .component {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .custom-switch {
    margin: 0 20px;
    cursor: pointer;

    label {
      font-weight: 500;
      cursor: pointer;
    }

    .custom-control-label::before {
      left: -2.25rem;
      width: 1.75rem;
      pointer-events: all;
      border-radius: 0.5rem;
    }
    .custom-control-label::after {
      top: calc(0.25rem + 2px);
      left: calc(-2.25rem + 2px);
      width: calc(1rem - 4px);
      height: calc(1rem - 4px);
      background-color: #adb5bd;

      border-radius: 0.5rem;
      transition: background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
        -webkit-transform 0.15s ease-in-out;
      transition: transform 0.15s ease-in-out,
        background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
      transition: transform 0.15s ease-in-out,
        background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out, -webkit-transform 0.15s ease-in-out;
    }
    .custom-control-input:checked ~ .custom-control-label::after {
      background-color: #fff;
      -webkit-transform: translateX(0.75rem);
      transform: translateX(0.75rem);
    }
  }
}
</style>
