<template>
  <collaspable
    :initialShow="false"
    :headerStyle="event.name | background"
    class="event"
  >
    <template v-slot:header>
      <div class="event-header">
        <span>{{event.name}}</span>
        <span class="badge badge-light">{{event.instant | date}}</span>
      </div>
    </template>
    <ul class="list-group list-group-flush">
      <li
        v-for="(arg,idx) in event.args"
        :key="idx"
      >
        <ObjectDisplayer :data="arg" />
      </li>
    </ul>
  </collaspable>
</template>
<script>
import collaspable from "../base/Collaspable";
import { getColor } from "@/utils/colorHelper";
import ObjectDisplayer from "@/components/base/ObjectDisplayer";

export default {
  components: {
    collaspable,
    ObjectDisplayer
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

/deep/ pre[class*="language-"] {
  margin: 0;
}

ul.list-group-flush {
  li:nth-child(1) {
    margin: 0;
  }

  li {
    margin-top: 5px;
  }
}

.event {
  /deep/ .card-body {
    padding: 0;
  }

  /deep/ button.btn {
    font-size: 12px;

    span.badge {
      font-size: 10px;
    }
  }
}
</style>
