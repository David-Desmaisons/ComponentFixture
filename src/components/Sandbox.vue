<template>
  <div class="root">
    <div class="component__container">
      <div
        class="component__content"
        :class="{ 'editor-closed': !showEditor }"
      >
        <component-fixture  ref="fixture" v-bind="$attrs" :isResizable="isResizable" @success="success">
          <!-- Use the default slot to manipulate the component under test -->
          <template v-slot:header="{componentName, update}">
            <FixtureHeader
              @toggle="showEditor = !showEditor"
              @resize="isResizable = !isResizable"
              @success="success"
              v-bind="{componentName, update, isResizable}"
            />
          </template>

          <!-- Use the default slot to create the component under test -->
          <template v-slot:default>
            <slot />
          </template>

          <!-- Use this slot to enable edition of props values -->
          <template v-slot:control="scope">
            <Editor
              v-bind="scope"
              @success="success"
              @error="error"
              @changed="scope.changed"
            />
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
import VueNotifications from "./base/notifificationInit";

export default {
  name: "sandbox",

  inheritAttrs: false,

  components: {
    ComponentFixture,
    Editor,
    FixtureHeader
  },

  data() {
    return {
      showEditor: true,
      isResizable: false
    };
  },

  methods: {
    success(message) {
      this.showSuccess({ message });
    },

    error(message) {
      this.showError({ message });
    }
  },

  notifications: {
    showSuccess: {
      type: VueNotifications.types.success,
      title: "Success"
    },
    showError: {
      type: VueNotifications.types.error,
      title: "Error"
    }
  }
};
</script>
<style lang="less" scoped="true">
/deep/ .splitter-pane.splitter-paneL {
  overflow: hidden;
}

.editor-closed {
  /deep/ .splitter-pane.splitter-paneL,
  /deep/ .splitter-pane-resizer {
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
  height: calc(100vh - 48px);
  background: #fff;
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
  height: calc(100vh - 48px) !important;
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
    }
  }

  /deep/ .component {
    display: flex;
    justify-content: center;
    padding: 40px;
    background: rgba(0, 0, 0, 0.03);

    .real-component {
      max-height: 100%;
    }
  }
}
</style>
