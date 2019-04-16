<template>
  <div class="root">
    <div class="component__container">
      <div class="component__content" :class="{ 'editor-closed': !showEditor }">
        <component-fixture
          :defaults="defaults"
          ref="fixture"
        >
          <!-- Use the default slot to manipulate the component under test -->
          <template v-slot:header="{componentName, methods, update}">
            <FixtureHeader @toggle="showEditor = !showEditor" v-bind="{componentName, methods, update}"/>
          </template>

          <!-- Use the default slot to create the component under test -->
          <template v-slot:default>
            <slot />
          </template>

          <!-- Use this slot to enable edition of props values -->
          <template v-slot:control="scope">
            <Editor v-bind="scope"/>
          </template>
        </component-fixture>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentFixture from "./ComponentFixture";
import Editor from "./Editor";
import FixtureHeader from "./FixtureHeader";

export default {
  props: {
    defaults: {
      type: Object,
      default: () => {}
    }
  },
  name: "sandbox",
  components: {
    ComponentFixture,
    Editor,
    FixtureHeader
  },
  data(){
    return {
      showEditor: true,
    }
  },
};
</script>
<style lang="less" scoped="true">
/deep/ .splitter-pane.splitter-paneL {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 60px) !important;
}

.editor-closed {
  /deep/ .splitter-pane.splitter-paneL,
  /deep/ .splitter-pane-resizer  {
    display: none;
  }
  /deep/ .splitter-pane.splitter-paneR {
    width: 100% !important;
    padding: 0 !important;
  }
}

.root {
  display: flex;
  align-items: center;
  justify-content: center;
}

.component__container {
  width: 100%;
  height: calc(100vh - 140px);
  background: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
}

.component__editor-hide {
  .vue-splitter-container {
    .splitter-paneL,
    .splitter-pane-resizer {
      display: none;
    }
    .splitter-paneR {
      width: 100% !important;
      padding: 0 !important;
    }
  }
}

.main-panel {
  height: calc(100vh - 140px) !important;
}

.splitter-pane {
  height: 100vh;
}

&::-webkit-scrollbar-track {
  background-color: transparent;
}
&::-webkit-scrollbar {
  width: 8px;
  height: 6px;
}
&::-webkit-scrollbar-thumb {
  background-color: #999;
  border: 1px solid #ffffff40;
  border-radius: 20px;
}

.root {
  .main {
    display: flex;

    > div {
      flex-grow: 1;
      border: 1px solid #ddd;

      &:first-child {
        border-radius: 0 0 0 4px;
      }
      &:last-child {
        border-radius: 0 0 4px 0;
      }
    }
  }

  /deep/ .component {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: rgba(0, 0, 0, 0.03);
    height: 50%;

    .real-component {
      height: 100%;
    }
  }
}
</style>
