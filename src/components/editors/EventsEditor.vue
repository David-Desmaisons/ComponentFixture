<template>
  <div>

    <div class="no-info-events">
      <button
        type="button"
        :disabled="events.length===0"
        @click.prevent="clear"
        v-tooltip.bottom="'Clear'"
      >
        <i class="fa fa-times-circle"></i>
      </button>
      <div
        v-if="events.length===0"
      >No
        events to display.
      </div>
    </div>

    <div
      class="events"
      v-if="events.length>0"
    >
      <eventDisplayer
        v-for="(event, idx) in events"
        :key="idx"
        :event="event"
      />
    </div>

  </div>
</template>
<script>
import { VTooltip } from "v-tooltip";
import eventDisplayer from "../internals/EventDisplayer";
const props = {
  events: {
    required: true,
    type: Array
  },
  clearEvents: {
    required: true,
    type: Function
  }
};
export default {
  name: "events-editor",
  key: "events",
  display: "Events",
  inheritAttrs: false,
  components: {
    eventDisplayer
  },
  directives: {
    tooltip: VTooltip
  },
  props,
  methods: {
    clear() {
      this.clearEvents();
    }
  }
};
</script>
<style lang="less" scoped>
.events {
  margin-top: 10px;
}
button {
  background: white;
  border: 0;
}
.no-info-events {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 1em;
}
</style>
