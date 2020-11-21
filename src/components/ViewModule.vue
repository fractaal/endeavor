<template>
  <div>
    <div style="margin-left: 50px; margin-top: 25px; margin-bottom: 10px;">
      <h1 class="nospacing">{{module.name}}</h1>
      <div style="display: flex; justify-content: space-  between;">
        <div>
          <div :class="module.classOverride" class="badge" v-if="module.duedateFormatted">
            <p class="nospacing">Due {{module.duedateFormatted}}</p>
          </div>
          <div class="badge" v-if="module.timeopenFormatted">
            <p class="nospacing">{{module.timeopenFormatted}}</p>
          </div>
          <div class="badge" v-if="module.timecloseFormatted">
            <p class="nospacing">{{module.timecloseFormatted}}</p>
          </div>
          <div class="badge" v-if="module.timelimitFormatted">
            <p class="nospacing">Due {{module.timelimitFormatted}}</p>
          </div>
          <p class="nospacing">{{module['modname']}}</p>
        </div>
        <div style="margin-left: 50px; margin-right: 50px;">
          <form :action="module.url" method="post">
            <button type="submit" class="roundButton">🔍</button>
          </form>
        </div>
      </div>
    </div>
    <br>
    <hr>
    <div style="overflow-y: auto; max-height: 69vh;">
      <transition name="transition">
        <div style="margin-left: 50px; margin-right: 50px;">
          <p v-html="module.description"></p>
          <div v-if="module.contents || module.introattachments">
            <div v-for="item in module.introattachments" :key="item.filename">
              <Card :title="item.filename"/>
            </div>
            <div v-for="item in module.contents" :key="item.filename">
              <Card :title="item.filename"/>
            </div>
          </div>
          <pre v-if="sharedStore.settings.showDebugInfo" style="background-color: black; padding: 10px;">
            <h2 class="nospacing">COMPLICATED DEBUG INFORMATION</h2>
            {{JSON.stringify(module, 0, 2)}}  
          </pre>
        </div>
      </transition>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore, { addCourseToCache, getCourseFromCache } from '../store';
import {formatDistance, format} from 'date-fns';

import Card from './Card';
import Loader from './Loader';

export default {
  name: "ViewModule",
  components: {
    Loader,
    Card,
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
         console.log(this.module)
         this.module.duedateFormatted = formatDistance(this.module.duedate, new Date(), {addSuffix: true});
       } catch(e) {
         console.warn("Formatting data for this module failed: " + e);
         console.log(this.module.duedate);
       }
    }
  }
}
</script>

<style>

</style>