<template>
  <div>
    <h1 style="margin-left: 50px;">{{course.displayname}}</h1>
    <div style="overflow-y: auto; max-height: 80vh;">
      <transition-group name="transition">
        <div v-for="section in filteredCourse" :key="section.section" style="margin-left: 25px; margin-right: 25px;">
          <div class="card" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <h3 style="font-weight: 800; margin: 0;">{{section.name}}</h3>
              </div>
              <div style="display: flex;">
                <p class="nospacing">{{section.modules.length}} modules</p>
              </div>
            </div>
          </div>
          <div class="card cardDarker" style="border-radius: 0px 0px 10px 10px; margin-top: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <p style="margin: 0;" v-html="section.summary"></p>
              </div>
              <div style="display: flex;">
                <button @click="$router.push(`${course.id}/${section.section}`)" class="roundButton">🔍</button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore, { getCourseFromCache } from '../store';
import {addCourseToCache} from '../store';

import Loader from './Loader';

export default {
  name: "ViewCourse",
  components: {
    Loader,
  },
  data() {
    return {
      sharedStore,
      course: {},
      isLoading: false,
    }
  },
  computed: {
    filteredCourse: function() {
      const term = this.sharedStore.search.toLowerCase();
      if (!this.course.info) return; // Prevent from running if the object doesn't exist yet
      return this.course.info.filter(element => {
        try {
          if (
            // Rules to change
            element.name.toLowerCase().includes(term) ||
            element.summary.toLowerCase().includes(term)
          ) return element;
        } catch(err) {
          console.warn("!!!");
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getCourseInfo();
    })
  },
  methods: {
    async getCourseInfo() {
      this.isLoading = true;
      this.course = {};
      /**
       * Add the course to the cache.
       */
      const course = getCourseFromCache(this.$route.params.id);
      let courseMeta;
      if (!course) {
        const courseMetas = await sharedStore.eLearn.getCourses();
        for (const course of courseMetas) {
          if (course.id == this.$route.params.id) {
            courseMeta = course;
            courseMeta.info = await sharedStore.eLearn.getCourseInfo(this.$route.params.id);
            break;
          }
        }
        addCourseToCache(courseMeta);
      }
      

      this.course = getCourseFromCache(this.$route.params.id);
      this.isLoading = false;
    }
  },
}
</script>

<style>

</style>