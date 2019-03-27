<template>
  <div>
    <component-fixture :defaults="{data: {size:220, children:[{size:45}]}}">
      <!-- Use the default slot to create the component under test -->
        <VueSvgGauge></VueSvgGauge>

      <!-- Use this slot to enable edition of props values -->
      <Editor
        v-show="showEditor"
        slot="control"
        slot-scope="scope"
        v-bind="scope"
      ></Editor>
    </component-fixture>
  </div>
</template>
<script>
import ComponentFixture from "@/components/ComponentFixture";
import Editor from "@/components/Editor";
import HelloWorld from "../components/HelloWorld";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "vue=svg-gauge-example",
  meta: {
    display: "Vue Svg Gauge"
  },
  components: {
    ComponentFixture,
    Editor,
    HelloWorld
  }
};
</script>

