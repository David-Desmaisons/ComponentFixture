<template>
  <div>
    <prism
      :id="'attribute-'+attribute"
      :class="{'is-invalid':!valid}"
      :code="textValue"
      language="javascript"
      inline
      class="prism-control form-control"
    />
    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
</template>
<script>
import { parseFunction } from "@/utils/TypeHelper";
import "prismjs";
import "prismjs/themes/prism.css";
import prism from "vue-prism-component";

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
    prism
  },

  data() {
    const textValue = String(this.object[this.attribute]);
    return {
      textValue,
      error: null,
      functionValue: this.object[this.attribute]
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
</style>
