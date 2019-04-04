<template>
  <div class="editor">
    <collaspable title="Props">
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
          v-for="(event, idx) in events"
          :key="idx"
        >
          {{event.name}}
          <pre>{{event.args}}</pre>
        </div>
      </template>
      <template v-else>
        No events emmited.
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
