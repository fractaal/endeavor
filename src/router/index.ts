import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import sharedStore from '../store';

// Views
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        name: "Timeline",
        component: () => import('../components/Timeline.vue'),
      },
      {
        // Courses will be rendered inside home router view if /courses is matched
        path: 'courses',
        name: 'Courses',
        component: () => import('../components/Courses.vue'),
      },
      {
        path: 'courses/:id',
        name: "Course",
        component: () => import('../components/ViewCourse.vue'),
      },
      {
        path: 'courses/:id/:section',
        name: "Section",
        component: () => import('../components/ViewSection.vue'),
      },
      {
        path: '/modules/:course/:instance',
        name: "Module",
        component: () => import('../components/ViewModule.vue'),
      }
    ]
  },
  /*
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about"  '../views/About.vue')
  }*/
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.name == "Login" && await sharedStore.eLearn.getSession()) {
    console.warn("Preventing unwanted navigation back to login screen");
    next('/home');
  } else {
    next();
  }
})

export default router
