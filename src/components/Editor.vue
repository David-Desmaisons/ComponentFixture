<template>
  <div class="editor">
    <collaspable title="Props" v-if="showEditor"> 
      <attributeEditor
        v-for="prop in props"
        :key="prop.key"
        :object="attributes"
        :attribute="prop.key"
        :metaData="prop.metaData"
      />
    </collaspable>

    <collaspable
      title="Events"
      :leftTitle="`(${events.length})`"
      class="events"
    >
      <template v-if="events.length>0">
        <div
          class="card event"
          v-for="(event, idx) in events"
          :key="idx"
        >
          <div class="event-header">
            <span> {{event.name}}</span>
            <span class="badge badge-info">{{event.instant | date}}</span>
          </div>

          <pre>{{event.args}}</pre>

        </div>
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
import collaspable from "./base/Collaspable";

export default {
  components: {
    attributeEditor,
    collaspable
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
    showEditor:{
      type: Boolean,
      default: true
    }
  },

  filters: {
    date(d) {
      return d.toLocaleString("en-GB");
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

  /deep/ .card {
    max-height: 75%;
  }

  .event {
    padding-left: 10px;
    padding-right: 10px;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
  }

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
