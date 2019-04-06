<template>
  <div class="editor">
    <collaspable
      title="Props"
      v-if="showEditor"
    >
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
        <collaspable
          :initialShow="false"
          v-for="(event, idx) in events"
          :key="idx"
          :headerStyle="{background: getColor(event.name)}"
          class="event"
        >
          <template v-slot:header>
            <div class="event-header">
              <span> {{event.name}}</span>
              <span class="badge badge-light">{{event.instant | date}}</span>
            </div>
          </template>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="(arg,idx) in event.args"
              :key="idx"
            >
              <pre class="card-text">{{stringify(arg)}}</pre>
            </li>
          </ul>

        </collaspable>

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
import { getColor } from "@/utils/colorHelper";
import CircularJSON from "circular-json";
import Vue from "vue";

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
    showEditor: {
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
  },

  methods: {
    getColor(value) {
      return getColor(value, { saturation: 30, lightness: 50 });
    },
    stringify(value) {
      return CircularJSON.stringify(
        value,
        (key, value) => {
          if (value instanceof Vue && value._isVue) {
            return { name: value.name, type: "VueComponent" };
          }
          return value;
        },
        "  "
      );
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

  .event-header {
    display: flex;
    justify-content: space-between;
  }

  /deep/ .card {
    .collapse {
      overflow-y: auto;
    }
  }

  .event {
    /deep/ .card-body {
      padding: 0;
      background: blue;
    }
  }

  /deep/ input {
    font-size: 12px;
    height: 28px;
  }
}
</style>
