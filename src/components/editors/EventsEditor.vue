<template>
  <div>
    <div class="events" v-if="events.length>0">
      <eventDisplayer
        v-for="(event, idx) in events"
        :key="idx"
        :event="event"
      />
    </div>

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
<style lang="less" scoped>
.events{
  margin-top: 10px;
}
</style>
