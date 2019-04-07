<template>
  <collaspable
    :initialShow="false"
    :headerStyle="event.name | background"
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
        <pre class="card-text">{{arg | stringify}}</pre>
      </li>
    </ul>

  </collaspable>
</template>
<script>
import collaspable from "../base/Collaspable";
import { getColor } from "@/utils/colorHelper";
import CircularJSON from "circular-json";
import Vue from "vue";

export default {
  components: {
    collaspable
  },
  props: {
    event: {
      required: true,
      type: Object
    }
  },
  filters: {
    date(d) {
      return d.toLocaleString("en-GB");
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
    },
    background(value) {
      const background = getColor(value, { saturation: 30, lightness: 50 });
      return { background };
    }
  }
};
</script>
<style lang="less" scoped>
 /deep/ .event-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.event {
  /deep/ .card-body {
    padding: 0;
    background: blue;
  }
}
</style>
