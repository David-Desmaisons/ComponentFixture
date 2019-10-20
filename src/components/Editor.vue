<template>
  <div class="main-editor-component-fixture">
    <div class="card card-options">
      <div class="card-body show-options">

        <button
          type="button"
          class="segment"
          :class="{'active': segmentActive === 'props'}"
          @click="toggleSegment('props')"
        >
          <span>Props</span>
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

        <button
          v-for="name in ['methods','state']"
          :key="name"
          type="button"
          class="segment"
          :class="{'active': segmentActive === name}"
          @click="toggleSegment(name)"
        >
          <span>{{name}}</span>
        </button>

      </div>
    </div>

    <transition-group
      type="transition"
      name="flip-list"
      tag="div"
      class="editor"
    >
      <component
        :is="`${segmentActive}-editor`"
        :key="segmentActive"
        v-bind="{props, events, methods, attributes, data, computed, clearEvents}"
        @success="success"
        @error="error"
        @changed="changed"
      />
    </transition-group>
  </div>
</template>
<script>
import { delegateEvents } from "@/utils/delegateEvents";

const requireContext = require.context("./editors/", false, /\.vue$/);
const components = requireContext.keys().reduce((acc, key) => {
  const component = requireContext(key).default;
  acc[`${component.key}-editor`] = component;
  return acc;
}, {});

export default {
  name: "editor",

  components,

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
    data: {
      required: false,
      type: Object
    },
    computed: {
      required: false,
      type: Object
    },
    events: {
      required: true,
      type: Array
    },
    clearEvents: {
      required: true,
      type: Function
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
    ...delegateEvents(["changed", "success", "error"])
  }
};
</script>
<style lang="less" scoped>
.main-editor-component-fixture {
  font-size: 12px;
  padding: 0px;
  margin-left: 16px;

  /deep/ .no-info {
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
      padding: 0;
      height: calc(100vh - 130px);
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
      text-transform: capitalize;
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
<style lang="less" src="@/styles/bootstrap-ligth.less"/>
