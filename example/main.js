import Vue from "vue";
import App from "./App.vue";
require("bootstrap");
import VueSvgGauge from 'vue-svg-gauge'
import VueRouter from "vue-router"
import routes from "./routes"
import 'font-awesome/less/font-awesome.less'

Vue.use(VueSvgGauge);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
