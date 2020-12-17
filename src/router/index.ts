import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import sharedStore from '../store';

// Views
import Login from '../views/Login.vue'

import FullPageLoad from '../views/FullPageLoad.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/load',
    name: 'Loading',
    component: FullPageLoad,
  },
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
        component: () => import('../components/ViewCourses.vue'),
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
      },
      {
        path: '/settings',
        name: "Settings",
        component: () => import('../views/Settings.vue'),
      },
      {
        path: "/search",
        name: "Search",
        component: () => import('../views/Search.vue'),
      },
      {
        path: "/changelog",
        name: "What's New",
        component: () => import('../components/ChangeLogView.vue'),
      },
      {
        path: "/console",
        name: "Console",
        component: () => import("../views/Console.vue"),
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

/*
router.beforeEach(async (to, from, next) => {
  if (to.name == "Login" && await sharedStore.eLearn.getSession()) {
    console.warn("Preventing unwanted navigation back to login screen");
    next('/home');
  } else {
    sharedStore.search = "";
    next();
  }
})
*/

export default router
