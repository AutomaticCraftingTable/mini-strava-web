import { createRouter, createWebHistory } from 'vue-router'
import Activities from '$src/pages/Activities.vue'
import Login from '$src/pages/Login.vue'
import MyAbout from '$src/pages/MyAbout.vue'
import MyHome from '$src/pages/MyHome.vue'
import NotFound from '$src/pages/NotFound.vue'
import Users from '$src/pages/Users.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MyHome,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
  },
  {
    path: '/about',
    name: 'About',
    component: MyAbout,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


export default router
