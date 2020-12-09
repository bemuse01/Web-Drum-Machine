import Vue from 'vue'
import VueRouter from 'vue-router'
import account from '../views/account_page.vue'
import main from '../views/main_page.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'account',
    component: account
  },
  {
    path: '/main',
    name: 'main',
    component: main
  }
  /* {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  } */
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
