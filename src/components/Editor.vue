<template>
  <transition-group
    type="transition"
    name="flip-list"
    tag="div"
    class="editor"
  >

    <collaspable
      title="Props"
      key="props"
      class="main-collapsable"
      v-if="showProps"
    >
      <template v-if="props.length>0">
        <attributeEditor
          v-for="prop in props"
          :key="prop.key"
          :object="attributes"
          :attribute="prop.key"
          :metaData="prop.metaData"
        />
      </template>

      <template v-else>
        No Props detected.
      </template>
    </collaspable>

    <collaspable
      title="Methods"
      v-if="showMethods"
      key="methods"
      class="main-collapsable"
    >
      <template v-if="methods.length>0">
        <div
          class="methods"
          role="group"
          aria-label="methods"
        >
          <button
            v-for="method in methods"
            :key="method.name"
            @click="method.execute"
            type="button"
            class="btn btn-primary"
          >{{method.name}}</button>
        </div>
      </template>

      <template v-else>
        No Methods without argument detected.
      </template>
    </collaspable>

    <collaspable
      class="events main-collapsable"
      v-if="showEvents"
      key="events"
    >
      <template v-slot:header>
        <div class="events-header">
          Events
          <span
            v-if="events.length>0"
            class="badge badge-success"
          >{{events.length}}</span>
        </div>
      </template>

      <template v-if="events.length>0">
        <eventDisplayer
          v-for="(event, idx) in events"
          :key="idx"
          :event="event"
        />
      </template>

      <template v-else>
        No events emited.
      </template>

    </collaspable>

  </transition-group>
</template>
<script>
import "bootstrap/dist/css/bootstrap.css";
import attributeEditor from "./internals/AttributeEditor";
import eventDisplayer from "./internals/EventDisplayer";
import collaspable from "./base/Collaspable";

export default {
  components: {
    attributeEditor,
    collaspable,
    eventDisplayer
  },

  props: {
    attributes: {
      required: true,
      type: Object
    },
    componentName: {
      required: false,
      type: String
    },
    propsDefinition: {
      required: true,
      type: Object
    },
    events: {
      required: true,
      type: Array
    },
    methods: {
      required: true,
      type: Array
    },
    showProps: {
      type: Boolean,
      default: true
    },
    showMethods: {
      required: true,
      type: Boolean
    },
    showEvents: {
      required: true,
      type: Boolean
    }
  },

  computed: {
    props() {
      return Object.keys(this.propsDefinition)
        .sort()
        .map(p => ({
          key: p,
          metaData: this.propsDefinition[p]
        }));
    }
  }
};
</script>
<style lang="less" scoped>
.editor {
  font-size: 12px;
  padding: 0px;

  .main-collapsable {
    transition: all 0.5s;
    width: 100%;
  }

  .main-collapsable.flip-list-enter,
  .main-collapsable.flip-list-leave-to {
    opacity: 0;
  }
  .main-collapsable.flip-list-leave-active {
    position: absolute;
  }

  // /deep/ .card {
  //   max-height: 75%;
  // }

  /deep/ .card {
    .collapse {
      overflow-y: auto;
    }
  }

  .methods {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    flex-wrap: wrap;

    .btn {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

  /deep/ input {
    font-size: 12px;
    height: 28px;
  }
}
</style>
