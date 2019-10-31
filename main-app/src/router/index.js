import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../views/Layout.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'main/home',
        alias: '',
        name: 'main-home',
        component: Home,
      },
      {
        path: 'main/about',
        name: 'main-about',
        component: About,
      }
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
