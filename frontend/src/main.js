import Vue from 'vue'
import index from './index.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(index)
}).$mount('#app')
