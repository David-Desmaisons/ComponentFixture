<template>
  <div>
    <template v-if="events.length>0">
      <eventDisplayer
        class="event"
        v-for="(event, idx) in events"
        :key="idx"
        :event="event"
      />
    </template>

    <div
      class="no-info"
      v-else
    >No events emited.</div>
  </div>
</template>
<script>
import eventDisplayer from "../internals/EventDisplayer";
const props = {
  events: {
    required: true,
    type: Array
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
  props
};
</script>
