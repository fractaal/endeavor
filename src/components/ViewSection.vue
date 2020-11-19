<template>
  <div>
    <h1 style="margin-left: 50px;">{{section.name}}</h1>
    <div style="overflow-y: auto; max-height: 80vh;">
      <transition-group name="transition">
        <div v-for="module in filteredSection" :key="module.id">
          <div class="card" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <p style="font-weight: 800; margin: 0;">{{module.name}}</p>
              </div>
              <div style="display: flex;">
                <p style="margin:0; font-weight: 400;">{{module.duedateFormatted}}</p>
              </div>
            </div>
          </div>
          <div class="card cardDarker" style="border-radius: 0px 0px 10px 10px; margin-top: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <p style="margin: 0;" v-html="module.intro"></p>
              </div>
              <div style="display: flex;">
                <button @click="$router.push(`/modules/${course.id}/${module.instance}`)" class="roundButton">🔍</button>
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
import {formatDistance, format} from 'date-fns';

import Loader from './Loader';

export default {
  name: "ViewSection",
  components: {
    Loader
  },
  data() {
    return {
      sharedStore,
      course: {},
      section: {},
      isLoading: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getSectionData();
    })
  },
  methods: {
    async getSectionData() {
      this.isLoading = true;
      this.course = {};
      /**
       * Add the course to the cache.
       */
      const course = getCourseFromCache(this.$route.params.id);
      for (const section of course.info) {
        console.log(section);
        if (section.section == this.$route.params.section) {
          this.section = section;
        }
      }

      this.format();
      this.isLoading = false;
    },

    format() {
      for (const module of this.section.modules) {
        try {
          module.duedateFormatted = "Due " + formatDistance(module.duedate, new Date(), {addSuffix: true}) + " - " + format(module.duedate, 'MMMM dd, yyyy');
        } catch(e) {
          console.warn("Error formatting - " + e);
          module.duedateFormatted = "No due date";
        }

        if (!module.intro) {
          module.intro = "<i>No summary</i>";
        }
      }
    }
  },
}
</script>

<style>

</style>