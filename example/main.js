import Vue from "vue";
import App from "./App.vue";
require("bootstrap");

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
