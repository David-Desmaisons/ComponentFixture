<template>
  <div class="editor">

    <div>
      <div class="card">
        <div class="card-header expander">
          <h2 class="mb-0">
            <button
              class="btn expander-button"
              type="button"
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >Props</button>
          </h2>
        </div>

        <div
          id="collapseOne"
          class="collapse show"
        >
          <div class="card-body">
            <attributeEditor
              v-for="prop in props"
              :key="prop.key"
              :object="attributes"
              :attribute="prop.key"
              :metaData="prop.metaData"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.css";
import attributeEditor from "./internals/AttributeEditor";

export default {
  components: {
    attributeEditor
  },

  props: {
    attributes: {
      required: true,
      type: Object
    },
    componentName: {
      required: false,
      type: String
    },
    propsDefinition: {
      required: true,
      type: Object
    }
  },

  computed: {
    props() {
      return Object.keys(this.propsDefinition)
        .sort()
        .map(p => ({
          key: p,
          metaData: this.propsDefinition[p]
        }));
    }
  }
};
</script>
<style lang="less" scoped>
.card-header.expander {
  padding: 0;
  padding-left: 1.25em;
}

.expander-button {
  background-color: transparent;
  outline-color: transparent;
  box-shadow: none;
  width: 100%;
  text-align: left;
  padding-top: 0;
  padding-bottom: 0;
}

.editor {
  font-size: 12px;
  padding: 0px;

  /deep/ input {
    font-size: 12px;
    height: 28px;
  }
}
</style>
