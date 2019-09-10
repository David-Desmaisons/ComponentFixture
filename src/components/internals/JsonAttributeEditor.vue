<template>
  <vue-json-editor v-model="jsonValue" @json-change="onJsonChange" />
</template>
<script>
import {
  getTypeFromValue,
  parseObject,
  stringifyObject
} from "@/utils/TypeHelper";

import vueJsonEditor from "vue-json-editor";

export default {
  components: {
    vueJsonEditor
  },
  props: {
    attribute: {
      required: false,
      type: String
    },
    metaData: {
      required: true,
      type: Object
    },
    object: {
      required: true,
      type: Object
    },
    types: {
      required: true,
      type: Array
    },
    value: {
      type: [Object, Array]
    }
  },

  created() {
    this.parseTextToJson();
  },

  data() {
    return {
      textValue: "",
      jsonValue: ""
    };
  },

  watch: {
    textValue(value) {
      try {
        const newObject = parseObject(value);
        const types = getTypeFromValue(newObject);
        const valid = types.find(t => this.types.find(st => st === t));
        if (!valid) {
          this.$emit(
            "onError",
            `types: ${types} not compatible with ${this.types}`
          );
          return;
        }
        const validated = this.metaData.validate(newObject);
        if (!validated.ok) {
          this.$emit("onError", validated.message);
          return;
        }
        this.object[this.attribute] = newObject;
        this.$emit("onError", null);
      } catch (e) {
        this.$emit("onError", "Unable to convert JSON data");
      }
    },
    value: {
      handler(value) {
        this.textValue = stringifyObject(value);
        this.$emit("onError", null);
      },
      immediate: true
    }
  },

  methods: {
    reset() {
      this.textValue = this.value;
    },
    parseTextToJson() {
      this.jsonValue = JSON.parse(this.textValue);
    },
    parseJsonToText() {
      this.textValue = JSON.stringify(this.jsonValue);
    },
    onJsonChange($event) {
      this.parseJsonToText();
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .jsoneditor {
  &,
  .jsoneditor-menu {
    border-color: #ccc;
  }

  .jsoneditor-menu {
    background: #ccc;
  }
}
</style>
