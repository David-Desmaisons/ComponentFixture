<template>
  <div class="main-editor">

    <div class="card card-options">
      <div class="card-body show-options">
        <button
          type="button"
          class="segment segment-props"
          :class="{'active': segmentActive === 'props'}"
          @click="toggleSegment('props')"
        >
          <span>Props</span>
        </button>
        <button
          type="button"
          class="segment segment-methods"
          :class="{'active': segmentActive === 'methods'}"
          @click="toggleSegment('methods')"
        >
          <span>Methods</span>
        </button>
        <button
          type="button"
          class="segment segment-events"
          :class="{'active': segmentActive === 'events'}"
          @click="toggleSegment('events')"
        >
          <span>Events</span>
          <span
            class="badge"
            v-if="events.length>0"
          >{{ events.length }}</span>
        </button>
      </div>
    </div>

    <transition-group
      type="transition"
      name="flip-list"
      tag="div"
      class="editor"
    >
      <div
        v-if="segmentActive === 'props'"
        key="props"
      >
        <template v-if="props.length>0">
          <attributeEditor
            v-for="prop in props"
            :key="prop.key"
            :object="attributes"
            :attribute="prop.key"
            :metaData="prop.metaData"
            @success="success"
          />
        </template>

        <template v-else><span class="no-info">No Props detected.</span></template>
      </div>
      <div
        v-if="segmentActive === 'methods'"
        key="methods"
      >
        <template v-if="methods.length>0">
          <div
            class="methods"
            role="group"
            aria-label="methods"
          >

            <div
              v-for="method in methods"
              :key="method.name"
              class="methods-button"
            >
              <button
                @click="executeMethod(method)"
                type="button"
                class="btn btn-primary"
              >{{method.name}}
              </button>
            </div>

          </div>
        </template>

        <template v-else><span class="no-info">No methods without argument detected.</span></template>
      </div>

      <div
        v-if="segmentActive === 'events'"
        key="events"
      >
        <template v-if="events.length>0">
          <eventDisplayer
            class="event"
            v-for="(event, idx) in events"
            :key="idx"
            :event="event"
          />
        </template>

        <template v-else><span class="no-info">No events emited.</span></template>
      </div>
    </transition-group>

  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.css";
import attributeEditor from "./internals/AttributeEditor";
import eventDisplayer from "./internals/EventDisplayer";
import collaspable from "./base/Collaspable";
import switchComponent from "./base/Switch";

export default {
  components: {
    attributeEditor,
    collaspable,
    eventDisplayer,
    switchComponent
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
    }
  },

  data() {
    return {
      segmentActive: "props"
    };
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
    toggleSegment(segment) {
      this.segmentActive = segment;
    },

    async executeMethod({ execute, name }) {
      try {
        const res = await execute();
        this.showResult(name, res);
      } catch (error) {
        this.$emit("error", `"${name}" executed with error: ${error}`);
      }
    },

    success(message) {
      this.$emit("success", message);
    },

    showResult(name, res) {
      const message =
        res === undefined
          ? `"${name}" executed without error`
          : `"${name}" returned: ${JSON.stringify(res, null, 2)}`;
      this.success(message);
    }
  }
};
</script>
<style lang="less" scoped>
.main-editor {
  font-size: 12px;
  padding: 0px;
  min-width: 325px;
  margin-left: 16px;

  .no-info {
    margin: 1em;
  }

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

  .card-options {
    position: sticky;
    top: 0;
    z-index: 1;

    & + div {
      padding: 8px 0;
      height: calc(100vh - 110px);
      overflow: auto;
    }
  }

  /deep/ .contol.main {
    margin-left: 16px;
  }

  .card-body.show-options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0;

    button {
      align-items: center;
      display: flex;
      justify-content: center;
      background: #f4f4f4;
      border: 0;
      border-bottom: 2px solid white;
      font-weight: normal;
      padding: 5px;
      outline: none;
      cursor: pointer;

      &:hover {
        background: #eee;
      }

      &.active {
        border-color: #46ba86;
        font-weight: bold;
      }
    }

    .segment {
      background: white;
    }

    .segment-events {
      .badge {
        background: red;
        color: #fff;
        border-radius: 2px;
        margin-left: 5px;
      }
    }
  }

  /deep/ .card {
    border: 0;

    .collapse {
      overflow-y: auto;
    }
  }

  .methods {
    width: 100%;

    .methods-button {
      margin-top: 5px;
      margin-bottom: 5px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  /deep/ input {
    font-size: 12px;
    height: 28px;
  }

  /deep/ .event {
    z-index: 0;
  }

  .collapsable-props {
    .card-body > .main {
      border-radius: 0;

      & + .main {
        border-top: 0;
      }
      &:first-child {
        border-radius: 4px 4px 0 0;
      }
      &:last-child {
        border-radius: 0 0 4px 4px;
      }
      &:first-child:last-child {
        border-radius: 4px;
      }
    }
  }
}
</style>
