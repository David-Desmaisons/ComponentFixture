<template>
  <div>
    <component-fixture :defaults="{value: 45}">
      <!-- Use the default slot to create the component under test -->
      <vue-slider>
        <div
          class="diy-tooltip"
          slot="tooltip"
          slot-scope="{ value }"
        >{{ value }}</div>
      </vue-slider>

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
import vueSlider from "vue-slider-component";

export default {
  props: {
    showEditor: {
      type: Boolean,
      default: true
    }
  },
  name: "slider-example",
  meta: {
    display: "Vue slider"
  },
  components: {
    ComponentFixture,
    Editor,
    vueSlider
  }
};
</script>

