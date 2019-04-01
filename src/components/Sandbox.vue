<template>
  <div class="root">
    <div class="component__container">
      <div class="component__segment">
        <switch-component v-model="showEditor" />
        <label>Show Props Editor</label>
      </div>

      <div class="component__content">
        <div class="components__list">
          <component-fixture
            :defaults="defaults"
            ref="fixture"
          >
            <!-- Use the default slot to create the component under test -->
            <template v-slot:default>
              <slot />
            </template>

            <!-- Use this slot to enable edition of props values -->
            <template v-slot:control="scope">
              <Editor
                v-bind="scope"
                v-show="showEditor"
              />
            </template>

          </component-fixture>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentFixture from "./ComponentFixture";
import switchComponent from "./switch";
import Editor from "./Editor";

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
    switchComponent
  },
  data() {
    return {
      showEditor: true
    };
  },
  methods: {
    update() {
      this.$$refs.fixture.$forceUpdate();
    }
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

.main-panel {
  height: calc(100vh - 140px) !important;
}

.root {
  .main {
    display: flex;

    > div {
      flex-grow: 1;
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

