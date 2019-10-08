<template>
  <div>
    <div
      v-if="orderedMethods.length>0"
      class="methods"
      role="group"
      aria-label="methods"
    >
      <div
        v-for="method in orderedMethods"
        :key="method.name"
        class="methods-button"
      >
        <button
          @click="executeMethod(method)"
          type="button"
          class="btn btn-primary"
        >{{method.name}}</button>
      </div>
    </div>
    <div
      class="no-info"
      v-else
    >No methods without argument detected.</div>
  </div>
</template>
<script>
import { stringify } from "@/utils/stringify";
import { log } from "@/utils/logger";

const props = {
  methods: {
    required: true,
    type: Array
  }
};
function buildMessageAndLog(name, res) {
  if (res === undefined) {
    const message = `"${name}" executed without error`;
    log(message);
    return message;
  }

  const intro = `"${name}" returned: `;
  log(intro, res);
  return `${intro}${stringify(res)}`;
}

export default {
  name: "methods-editor",
  key: "methods",
  display: "Methods",
  props,
  inheritAttrs: false,
  methods: {
    async executeMethod({ execute, name }) {
      try {
        const res = await execute();
        this.showResult(name, res);
      } catch (error) {
        this.$emit("error", `"${name}" executed with error: ${error}`);
      }
    },

    showResult(name, res) {
      const message = buildMessageAndLog(name, res);
      this.$emit("success", message);
    }
  },
  computed: {
    orderedMethods() {
      const ordered = [...this.methods];
      ordered.sort((a, b) => a.name.localeCompare(b.name));
      return ordered;
    }
  }
};
</script>
<style lang="less">
.methods {
  width: 100%;
  margin-top: 10px;

  .methods-button {
    margin-top: 5px;
    margin-bottom: 5px;
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      font-size: 12px;
    }
  }
}
</style>
