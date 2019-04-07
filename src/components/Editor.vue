<template>
  <div class="editor">
    <collaspable
      title="Props"
      v-if="showEditor"
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

    <collaspable class="events">
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

  </div>
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
    showEditor: {
      type: Boolean,
      default: true
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

  // /deep/ .card {
  //   max-height: 75%;
  // }

  /deep/ .card {
    .collapse {
      overflow-y: auto;
    }
  }

  /deep/ input {
    font-size: 12px;
    height: 28px;
  }
}
</style>
