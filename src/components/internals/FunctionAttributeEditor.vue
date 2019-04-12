<template>
  <div>

    <codemirror
      :class="{'is-invalid':!valid}"
      class="component-input"
      v-model="textValue"
      :options="options"
    />

    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
</template>
<script>
import { parseFunction } from "@/utils/TypeHelper";
import { codemirror } from "vue-codemirror";
import "codemirror/theme/3024-day.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";

import "codemirror/addon/selection/active-line.js";

export default {
  props: {
    attribute: {
      required: true,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
    object: {
      required: true,
      type: Object
    }
  },

  components: {
    codemirror
  },

  data() {
    const textValue = String(this.object[this.attribute]);
    return {
      textValue,
      error: null,
      functionValue: this.object[this.attribute],
      options: {
        mode: "text/javascript",
        theme: "3024-day",
        viewportMargin: Infinity,
        lineWrapping: true,
        connect: 'align',
      }
    };
  },

  watch: {
    textValue(value) {
      try {
        const functionValue = parseFunction(value);
        const validated = this.metaData.validate(functionValue);
        if (!validated.ok) {
          this.error = validated.message;
          return;
        }
        this.functionValue = functionValue;
        this.object[this.attribute] = functionValue;
        this.error = null;
      } catch (e) {
        this.error = "Provide a valid function";
      }
    }
  },

  computed: {
    valid() {
      return this.error === null;
    }
  }
};
</script>
<style lang="less" scoped>
.prism-control {
  height: 28px;
  overflow: hidden;
  padding: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

/deep/ pre.CodeMirror-line {
  margin: 0;
}

/deep/ .CodeMirror div {
  margin: 0;
}

/deep/ div.CodeMirror-scroll {
  padding-bottom: 0;
}

/deep/ .CodeMirror {
  border: 1px solid #eee;
  height: auto;
}
</style>
