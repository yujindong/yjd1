import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Util from "@yjd/perpetual-calendar";

console.log(JSON.stringify(Util.Lunar.lunarDateInfo(new Date(1901, 1, 18))));
console.log(Util.Lunar.lunarDateInfo(new Date(2020, 4, 23)));
console.log(Util.Lunar.lunarDateInfo(new Date(1901, 1, 19)));
// console.log(Util.Lunar.getLunarYearDays(1900));
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
