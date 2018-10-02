<template>
  <div class="form-group row">
    <label :for="'attribute-'+attribute" class="col-sm-4 col-form-label">{{attribute}}</label>

    <div v-tooltip="{content:type, placement: 'top', offset: -5}" class="col-sm-2 col-form-label">
      <select class="form-control form-control-sm" :disabled="types.length === 1" v-model="type">
        <option v-for="typeDescription in avalaibleTypes" :value="typeDescription.value" :key="typeDescription.value">{{typeDescription.display}}</option>
      </select>
    </div>

    <div class="col-sm-6">
      <input v-if="type === 'Boolean'" :id="'attribute-'+attribute" v-model="object[attribute]" type="checkbox" class="checkbox control-input" />
      <numberAttributeEditor v-else-if="type === 'Number'" v-bind="{object, attribute, metaData, value:object[attribute]}"></numberAttributeEditor>
      <stringAttributeEditor v-else-if="type === 'String'" v-bind="{object, attribute, metaData, value:object[attribute]}" />
      <functionAttributeEditor v-else-if="type === 'Function'" v-bind="{object, attribute, metaData}"></functionAttributeEditor>
      <jsonAttributeEditor v-else v-bind="{object, attribute, metaData, types, value:object[attribute]}"></jsonAttributeEditor>
    </div>

  </div>
</template> 
<script>
import { VTooltip } from "v-tooltip";
import jsonAttributeEditor from "./JsonAttributeEditor";
import functionAttributeEditor from "./FunctionAttributeEditor";
import numberAttributeEditor from "./NumberAttributeEditor";
import stringAttributeEditor from "./StringAttributeEditor";
import { getTypeFromValue } from "@/utils/TypeHelper";

const typesDescription = [
  { display: "{}", value: "Object" },
  { display: "[]", value: "Array" },
  { display: "Π", value: "Number" },
  { display: '""', value: "String" },
  { display: "&&", value: "Boolean" },
  { display: "=>", value: "Function" }
];

function getDefaultType(types, defaultValue) {
  if (types.length === 1) {
    return types[0];
  }
  const fromDefault = getTypeFromValue(defaultValue);
  return types.find(type => fromDefault.indexOf(type) !== -1);
}

export default {
  directives: {
    tooltip: VTooltip
  },

  components: {
    jsonAttributeEditor,
    functionAttributeEditor,
    numberAttributeEditor,
    stringAttributeEditor
  },

  props: {
    object: {
      required: true,
      type: Object
    },
    metaData: {
      required: true,
      type: Object
    },
    attribute: {
      required: true,
      type: String
    }
  },

  data() {
    const { types } = this.metaData;
    const type = getDefaultType(types, this.object[this.attribute]);
    return {
      type
    };
  },

  computed: {
    types() {
      return this.metaData.types;
    },
    avalaibleTypes() {
      return typesDescription.filter(t => this.types.indexOf(t.value) !== -1);
    }
  }
};
</script>
<style lang="less">
body {
  font-family: sans-serif;
  margin: 42px;
}

.type-select {
  width: 80px;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 6px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
