import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Other from '../views/Other.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/child',
    name: 'home',
    component: Home
  },
  {
    path: '/child/about',
    name: 'about',
    component: About
  },
  {
    path: '/child/other',
    name: 'other',
    component: Other
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
