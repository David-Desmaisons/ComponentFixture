<template>
  <sandbox :defaults="{url:'https://api.github.com/orgs/vuejs/repos'}">
    <ajax-handler>
      <template #default="{data}">
        <div>{{data.data[0].id}}</div>
      </template>
    </ajax-handler>
  </sandbox>
</template>
<script>
import {Sandbox} from "@/index";
import { ajaxHandler } from "vue-ajax-handler";
import { get } from "axios";

export default {
  name: "vue-ajax-handler",
  meta: {
    display: "Ajax handler"
  },
  provide: {
    get
  },
  components: {
    ajaxHandler,
    Sandbox
  }
};
</script>
