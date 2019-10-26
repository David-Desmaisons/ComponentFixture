<template>
  <div>
    <b>{{text}}: </b>
    {{value| decimal}}
    <i
      v-if="isWarning"
      class="fa fa-exclamation-triangle"
      aria-hidden="true"
    ></i>
  </div>
</template>
<script>
export default {
  name: "fps-feedback",
  filters: {
    decimal(value) {
      return Math.round(value * 100) / 100;
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      required: true
    }
  },
  computed: {
    isWarning() {
      return this.value < this.min;
    }
  }
};
</script>
