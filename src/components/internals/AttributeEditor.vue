<template>
  <div class="main">
    <div class="attribute-row attribute-component">
      <div class="label">{{attribute}}</div>

      <component
        ref="editor"
        :is="componentType"
        class="component-input"
        :class="{'is-invalid':!valid}"
        @onError="error = $event"
        v-bind="{object, attribute, metaData, types, value}"
      />
    </div>

    <div class="attribute-row">

      <div class="prop-info">
        <i
          class="fa"
          :class="requiredIcon"
          v-tooltip.bottom="metaData.definition.required ? 'required': 'not required'"
        />
      </div>

      <div class="prop-info">
        <i
          class="fa"
          :class="validatorIcon"
          v-tooltip.bottom="metaData.definition.validator ? 'has validator' :'no validator'"
        />
      </div>

      <div
        class="badge type-decriptor"
        v-tooltip="{content:type,placement:'bottom'}"
        :class="badge"
      >
        <template v-if="types.length === 1">
          {{convert(type)}}
        </template>

        <template v-else>
          <select v-model="type">
            <option
              v-for="typeDescription in avalaibleTypes"
              :value="typeDescription.value"
              :key="typeDescription.value"
            >{{typeDescription.display}}</option>
          </select>
        </template>
      </div>

      <div class="btn-group actions">
        <button
          v-if="metaData.definition.default !== undefined"
          type="button"
          class="btn prop-info btn-outline-info"
          v-tooltip.bottom="'Reset to default'"
          @click="toDefault"
        > <i class="fa fa-home" />
        </button>
        <button
          v-if="metaData.definition.default !== undefined"
          type="button"
          class="btn prop-info btn-outline-info"
          v-tooltip.bottom="'Alternative input'"
        > <i class="fa fa-exchange" />
        </button>
      </div>

      <div
        class="error-feedback"
        v-if="!valid"
      >
        {{error}}
      </div>

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
    return {
      type: null,
      focused: false,
      error: null
    };
  },

  watch: {
    "metaData.types": {
      handler(types) {
        if (types.includes(this.type)) {
          return;
        }
        this.type = getDefaultType(types, this.object[this.attribute]);
      },
      immediate: true
    }
  },

  created() {
    this.$default = this.object[this.attribute];
    this.$defaultType = this.type;
  },

  computed: {
    value() {
      return this.object[this.attribute];
    },
    canBeDefaulted() {
      return this.value !== this.$default || this.$defaultType !== this.type;
    },
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
    },
    badge() {
      return typesDescription[this.type].badge;
    },
    valid() {
      return this.error === null;
    },
    requiredIcon() {
      return this.metaData.definition.required
        ? "fa-exclamation-triangle"
        : "fa-question-circle";
    },
    validatorIcon() {
      return !!this.metaData.definition.validator ? "fa-lock" : "fa-unlock-alt";
    }
  },

  methods: {
    convert(type) {
      return typesDescription[type].display;
    },
    toDefault() {
      this.type = this.$defaultType;
      this.object[this.attribute] = this.$default;
      this.$refs.editor.reset(this.$default);
    }
  }
};
</script>
<style lang="less" scoped>
@type-decriptor-width: 50px;
@icon-color: #474747;

.main {
  padding: 5px 5px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;

  .error-feedback {
    color: red;
    font-weight: bold;
    display: inline;
    font-size: 100%;
    margin-left: auto;
  }

  .badge.type-decriptor {
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: @type-decriptor-width;
    max-width: @type-decriptor-width;
    height: 20px;
    text-transform: uppercase;

    select {
      background: transparent;
      color: white;
      border: transparent;
      padding: 0;
      outline: transparent;
      text-transform: uppercase;
      width: @type-decriptor-width;

      option {
        background: #555;
        color: white;
        text-align: center;
        font-size: 12px;
      }

      option:hover {
        background: black;
        color: white;
      }
    }
  }
}

.attribute-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 32px;
  color: @icon-color;

  .prop-info {
    font-size: 22px;
    padding: 0 5px;

    .fa-unlock-alt {
      opacity: 0.7;
    }
  }

  .actions {
    padding: 0 5px;
    border-color: #ced4da;
    font-size: 20px;

    .btn-outline-info {
      color: @icon-color;
      :disabled {
        color: #17a2b8;
      }
    }
  }
}

.attribute-component {
  div {
    margin-left: 5px;
    margin-right: 5px;
  }

  /deep/ div.component-input {
    flex-grow: 2;
  }

  /deep/ .is-invalid {
    box-shadow: 0 0 0 0.2rem red;
  }
}

.type-select {
  width: 80px;
}

.label {
  margin-left: 10px;
  min-width: 100px;
  width: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: normal;
}
.custom-control.custom-switch {
  .custom-control-label {
    right: calc(100% - 32px);
  }
}
</style>
<style lang="less">
.tooltip {
  display: block !important;
  z-index: 10000;
  font-size: 12px;
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
