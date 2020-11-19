<template>
  <div>
    <h1 style="margin-left: 50px;">{{module.name}}</h1>
    <div style="overflow-y: auto; max-height: 80vh;">
      <transition name="transition">
        <div style="margin-left: 50px;">
          <p v-html="module.description"></p>
        </div>
      </transition>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore, { addCourseToCache, getCourseFromCache } from '../store';
import {formatDistance, format} from 'date-fns';

import Loader from './Loader';

export default {
  name: "ViewModule",
  components: {
    Loader
  },
  data() {
    return {
      sharedStore,
      module: {},
      isLoading: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getModuleData();
    })
  },
  methods: {
    async getModuleData() {
      this.isLoading = true;
      this.module = {};
      /**
       * Add the course to the cache.
       */
      let course = getCourseFromCache(this.$route.params.course);
      let courseMeta;
      if (!course) {
        const courseMetas = await sharedStore.eLearn.getCourses();
        for (const course of courseMetas) {
          if (course.id == this.$route.params.course) {
            courseMeta = course;
            courseMeta.info = await sharedStore.eLearn.getCourseInfo(this.$route.params.course);
            break;
          }
        }
        course = courseMeta;
        addCourseToCache(courseMeta);
      }

      for (const section of course.info) {
        for (const module of section.modules) {
          if (module.instance == this.$route.params.instance || module.cmid == this.$route.params.instance || module.id == this.$route.params.instance || module.coursemodule == this.$route.params.instance) {
            this.module = module;
          }
        }
      }

      this.format();
      this.isLoading = false;
    },

    format() {
      console.log('format');
    }
  }
}
</script>

<style>

</style>