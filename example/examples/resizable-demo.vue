<template>
  <sandbox>
    <resizable>
      <div>
        resizable content
      </div>
    </resizable>
  </sandbox>
</template>
<script>
import resizable from "@/components/base/resizable";
import {Sandbox} from "@/index";

export default {
  name: "resizable-demo",
  meta: {
    display: "resizable"
  },
  components: {
    Sandbox,
    resizable
  }
};
</script>