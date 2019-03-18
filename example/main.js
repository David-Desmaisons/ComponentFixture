import Vue from "vue";
import App from "./App.vue";
require("bootstrap");
import VueSvgGauge from 'vue-svg-gauge'

Vue.use(VueSvgGauge);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
