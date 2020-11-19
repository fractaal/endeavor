<template>
  <div>
    <div style="margin-left: 50px; margin-top: 10px; margin-bottom: 10px;">
      <h1 class="nospacing">{{module.name}}</h1>
      <p class="nospacing">{{module.duedateFormatted}}</p>
      <p class="nospacing">{{module.timeopenFormatted}}</p>
      <p class="nospacing">{{module.timecloseFormatted}}</p>
      <p class="nospacing">{{module.timelimitFormatted}}</p>
      <p class="nospacing">{{module['modname']}}</p>
    </div>
    <div style="overflow-y: auto; max-height: 80vh;">
      <transition name="transition">
        <div style="margin-left: 50px;">
          <p v-html="module.description"></p>
          {{module}}  
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
       try {
         module.duedateFormatted = formatDistance(module.duedate, new Date(), {addSuffix: true});
       } catch(e) {
         console.warn("Formatting data for this module failed: " + e);
         console.log(module.duedate);
       }
    }
  }
}
</script>

<style>

</style>