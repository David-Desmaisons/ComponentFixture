<template>
  <div
    class="type-symbol"
    :class="classValue"
  >
    {{symbol}}
  </div>
</template>
<script>
const symbols = {
  String: "T",
  Number: "#"
};
export default {
  name: "type-symbol",
  props: {
    value: {
      required: true,
      type: String
    }
  },
  computed: {
    symbol() {
      return symbols[this.value];
    },
    classValue() {
      return [this.value.replace(/^\w/, c => c.toLowerCase())];
    }
  }
};
</script>
<style lang="less" scoped>
.type-symbol {
  //height: 30px;
  width: 26px;
  //font-weight: bold;
  display: inline-block;
  padding: 6px 0px;
  font-size: 16px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 13px;
  color: #fff;
  //background-color: #28a745;

  &.number {
    background-color: blue;
  }

  &.string {
    background-color: #28a745;
  }
}
</style>
