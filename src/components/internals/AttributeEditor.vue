<template>
  <div
    class="main"
    :class="{'is-invalid':!valid}"
  >

    <div class="main-info-block">
      <div
        class="badge type-descriptor"
        v-tooltip="{content:type,placement:'bottom'}"
        :class="badge"
      >
        <template v-if="types.length === 1">{{convert(type)}}</template>

        <template v-else>
          <select v-model="type">
            <option
              v-for="typeDescription in avalaibleTypes"
              :value="typeDescription.value"
              :key="typeDescription.value"
            >{{typeDescription.value}}</option>
          </select>
        </template>
      </div>

      <div>
        <h1 class="label">{{attribute}}</h1>
      </div>
    </div>

    <div class="editor-flag">

      <div class="btn-group actions">

        <button
          v-if="metaData.definition.default !== undefined"
          type="button"
          class="btn prop-info btn-outline-info"
          v-tooltip.bottom="'Reset to default'"
          :disabled="!canBeDefaulted"
          @click="toDefault"
        >
          <i class="fa fa-home" />
        </button>

        <div
          class="prop-info"
          v-if="metaData.definition.required"
        >
          <i
            class="fa fa-exclamation-triangle"
            v-tooltip.bottom="'required'"
          />
        </div>

        <div
          class="prop-info"
          v-show="metaData.isModel"
        >
          <i
            class="fa fa-refresh"
            v-tooltip.bottom="'v-model'"
          />
        </div>

        <div
          class="prop-info"
          v-show="metaData.definition.validator"
        >
          <i
            class="fa fa-lock"
            v-tooltip.bottom="'has validator'"
          />
        </div>

      </div>
      <div class="component-editor">
        <component
          ref="editor"
          :is="componentType"
          class="component-input"
          @error="onError"
          @changed="changed"
          v-bind="{attribute, metaData, types, value}"
        />
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
import selectedValuesEditor from "./SelectedValuesEditor";

import { VTooltip } from "v-tooltip";
import { getTypeFromValue, getDefaultForType } from "@/utils/TypeHelper";
import typesDescription from "./typesDescription";
import compare from "@/utils/compare";
import { delegateEvents } from "@/utils/delegateEvents";

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
    booleanAttributeEditor,
    selectedValuesEditor
  },

  props: {
    value: {
      required: false
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
        this.type = getDefaultType(types, this.value);
      },
      immediate: true
    },
    type(newValue) {
      const currentTypes = getTypeFromValue(this.value);
      if (currentTypes.includes(newValue)) {
        return;
      }
      this.changed({ key: this.attribute, value: getDefaultForType(newValue) });
    }
  },

  created() {
    const { defaultValue: _default } = this.metaData;
    this.$default = _default;
    this.$defaultType = getTypeFromValue(_default)[0];
  },

  computed: {
    canBeDefaulted() {
      return (
        this.error !== null ||
        (this.metaData.definition.default !== undefined && this.isNotDefaulted)
      );
    },
    isNotDefaulted() {
      return (
        this.$defaultType !== this.type || !compare(this.value, this.$default)
      );
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
      if (this.metaData.possibleValues !== undefined) {
        return "selectedValuesEditor";
      }
      return typesDescription[this.type].component;
    },
    badge() {
      return typesDescription[this.type].badge;
    },
    valid() {
      return this.error === null;
    }
  },

  methods: {
    ...delegateEvents(["changed"]),
    convert(type) {
      return typesDescription[type].display;
    },
    onError(arg) {
      if (this.error === arg) {
        return;
      }
      this.error = arg;
      if (arg === null) {
        this.$emit("success", `Update property ${this.attribute}`);
        return;
      }
      this.$emit("error", arg);
    },
    toDefault() {
      const { $defaultType, $default, attribute } = this;
      this.type = $defaultType;
      this.$refs.editor.clear();
      this.error = null;
      this.changed({ key: attribute, value: $default });
      this.$emit(
        "success",
        `Update property "${attribute}" to default value: ${JSON.stringify(
          $default,
          null,
          2
        )}`
      );
    }
  }
};
</script>
<style lang="less" scoped>
@badge-size: 24px;
.main {
  padding: 5px 10px;
  border-bottom: 1px solid #ced4da;
  border-radius: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 3px;

  .main-info-block {
    display: flex;
    flex-direction: row;
    width: 130px;
    min-width: 130px;
  }

  .editor-flag {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    /deep/ input {
      font-size: 12px;
      height: 18px;
    }

    .btn-group.actions {
      margin: 0 5px;
      width: 80px;
      height: 28px;
      display: flex;
      flex-direction: row-reverse;
      color: gray;

      .prop-info {
        font-size: @icon-size;
        padding: 0 5px;
        display: flex;
        align-items: center;

        .fa-unlock-alt {
          opacity: 0.7;
        }
      }
    }

    .component-editor {
      flex-grow: 1;
    }
  }

  .is-invalid {
    box-shadow: 0 0 0 0.2rem red;
  }

  .badge.type-descriptor {
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: @badge-size;
    max-width: @badge-size;
    height: @badge-size;
    border-radius: 50%;
    width: @badge-size;

    select {
      background: transparent;
      color: white;
      border: transparent;
      padding: 0;
      outline: transparent;
      text-transform: uppercase;
      width: @badge-size;

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

.label {
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: bold;
  max-width: 150px;
  width: 99%;
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
