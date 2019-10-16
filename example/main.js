import Vue from "vue";
import App from "./App.vue";
import VueSvgGauge from 'vue-svg-gauge';
import VueRouter from "vue-router";
import Vuex from 'vuex'
import routes from "./routes";
import "font-awesome/less/font-awesome.less";

Vue.use(VueSvgGauge);
Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true
});

Vue.config.productionTip = false;

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount("#app");
