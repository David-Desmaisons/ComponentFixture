<template>
  <div class="form-group row">

    <div
      v-tooltip="{content:type, placement: 'left', offset: -5}"
      class="col-md-auto"
    >
      <span class="badge badge-secondary type-decriptor">
        <template v-if="types.length === 1">
          <span>
            {{convert(type)}}
          </span>
        </template>

        <template v-else>
          <select
            class="form-control form-control-sm"
            v-model="type"
          >
            <option
              v-for="typeDescription in avalaibleTypes"
              :value="typeDescription.value"
              :key="typeDescription.value"
            >{{typeDescription.display}}</option>
          </select>
        </template>
      </span>

    </div>

    <label
      :for="'attribute-'+attribute"
      class="col-sm-4 col-form-label"
    >{{attribute}}</label>

    <div class="col-sm-6">
      <component
        :is="componentType"
        v-bind="{object, attribute, metaData, types, value:object[attribute]}"
      />
    </div>

  </div>
</template> 
<script>
import jsonAttributeEditor from "./JsonAttributeEditor";
import functionAttributeEditor from "./FunctionAttributeEditor";
import numberAttributeEditor from "./NumberAttributeEditor";
import stringAttributeEditor from "./StringAttributeEditor";
import booleanAttributeEditor from "./BooleanAttributeEditor";

import { VTooltip } from "v-tooltip";
import { getTypeFromValue } from "@/utils/TypeHelper";
import typesDescription from "./typesDescription";

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
    stringAttributeEditor,
    booleanAttributeEditor
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
      return Object.keys(typesDescription)
        .filter(t => this.types.indexOf(t) !== -1)
        .map(key => ({
          display: typesDescription[key].display,
          value: key
        }));
    },
    componentType() {
      return typesDescription[this.type].component;
    }
  },

  methods: {
    convert(type) {
      return typesDescription[type].display;
    }
  }
};
</script>
<style lang="less">
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

.type-decriptor {
  width: 50px;
  height: 26px;
  padding-top: 6px;

  select {
    background: transparent;
    color: white;
    border: transparent;
    padding: 0;
    margin-left: 12px;
    margin-top: -10px;

    option {
      background: transparent;
      color: white;
      border: transparent;
      padding: 0;
      margin-left: 12px;
      margin-top: -5px;
    }
  }
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
