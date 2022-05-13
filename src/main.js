import Vue from 'vue'
import VueCookie from 'vue-cookie'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
Vue.use(VueCookie);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export const eventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')