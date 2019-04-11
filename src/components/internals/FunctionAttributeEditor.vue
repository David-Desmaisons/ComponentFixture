<template>
  <div
    data-toggle="collapse"
    :data-target="`#attribute-collapse-${attribute}`"
    aria-expanded="false"
    :aria-controls="`attribute-collapse-${attribute}`"
  >

    <!-- <div>
      <prism
        :id="`attribute-${attribute}`"
        :class="{'is-invalid':!valid}"
        :code="textValue"
        language="javascript"
        inline
        class="prism-control form-control"
      />
    </div> -->

    <!-- <div> -->
    <codemirror
      :class="{'is-invalid':!valid}"
      class="component-input"
      v-model="textValue"
      :options="options"
    >

    </codemirror>
    <!-- </div> -->

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

// import "prismjs";
// import "prismjs/themes/prism.css";
// import prism from "vue-prism-component";

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
    //    prism,
    codemirror
  },

  data() {
    const textValue = String(this.object[this.attribute]);
    return {
      textValue,
      error: null,
      functionValue: this.object[this.attribute],
      options: {
        tabSize: 4,
        mode: "text/javascript",
        theme: "3024-day",
        lineNumbers: false,
        line: true
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

/deep/ .CodeMirror {
  height: auto;
}

/deep/ pre.CodeMirror-line {
  margin: 0;
}

/deep/ .CodeMirror div {
  margin: 0;
}

/deep/ div.CodeMirror-scroll  {
  padding-bottom: 0;
}

// /deep/ .CodeMirror pre {
//     white-space: pre-wrap;
//     word-break: break-all;
//     word-wrap: break-word;
// }
</style>
