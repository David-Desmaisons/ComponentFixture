<template>
  <div class="root">
    <div class="component__container">
      <div class="component__content">
        <component-fixture :defaults="defaults" ref="fixture">
          <!-- Use the default slot to manipulate the component under test -->
          <template v-slot:header="{componentName, methods, update}">
            <FixtureFeader v-bind="{componentName, methods, update}" v-model="showEditor"></FixtureFeader>
          </template>

          <!-- Use the default slot to create the component under test -->
          <template v-slot:default>
            <slot/>
          </template>

          <!-- Use this slot to enable edition of props values -->
          <template v-slot:control="scope">
            <Editor v-bind="scope" :showEditor="showEditor"/>
          </template>
        </component-fixture>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentFixture from "./ComponentFixture";
import Editor from "./Editor";
import FixtureFeader from "./FixtureFeader";

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
    FixtureFeader
  },
  data() {
    return {
      showEditor: true
    };
  }
};
</script>
<style lang="less" scoped="true">
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

.main-panel {
  height: calc(100vh - 140px) !important;
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
      height: calc(100vh - 186px);
      overflow-x: hidden;
      overflow-y: auto;
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
