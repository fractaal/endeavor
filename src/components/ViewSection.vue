<template>
  <div>
    <h1 style="margin-left: 50px;">{{section.name}}</h1>
    <div style="overflow-y: auto; max-height: 80vh; margin-left: 25px; margin-right: 25px;">
      <transition-group name="transition">
        <div v-for="module in filteredModules" :key="module.id">
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
import {formatDistance, format, formatDistanceStrict} from 'date-fns';

import Loader from './Loader';
import { formatDuration } from 'date-fns/fp';

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
  computed: {
    filteredModules: function() {
      const term = this.sharedStore.search.toLowerCase();
      if (!this.section.modules) return; // Prevent from running if the object doesn't exist yet
      return this.section.modules.filter(element => {
        try {
          if (
            // Rules to change
            element.name.toLowerCase().includes(term) ||
            element.intro.toLowerCase().includes(term)
          ) return element;
        } catch(err) {
          console.warn("!!!");
        }
      })
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
      this.course = course;
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
        // Time formatting for forums
        try {
          module.duedateFormatted = "Due " + formatDistance(module.duedate, new Date(), {addSuffix: true}) + " - " + format(module.duedate, 'MMMM dd, yyyy');
        } catch(e) {
          console.warn("Error formatting due date data. This module might not have a due date." + e);
        }

        if (!module.intro) {
          module.intro = "<i>No summary</i>";
        }

        // Time formatting for quizzes
        try {
          module.timeopenFormatted = `🟢 Opens ${format(module.timeopen, "hh:mmaaa, MMMM d, yyyy")}`
          module.timecloseFormatted = `❌ Closes ${format(module.timeclose, "hh:mmaaa, MMMM d, yyyy")}`
          module.timelimitFormatted = `⌛ Good for ${formatDistanceStrict(Date.now(), (Date.now()-(module.timelimit*1000)))}`
        } catch(e) {
          console.warn("Failed formatting quiz time data. This module might not be a quiz." + e);
        }

        // Checking if overdue
        try {
          if ((new Date() - module.duedate) > 0) {
            module.isOverdue = true;
            module.classOverride = "cardReallyDanger";
          } else {
            module.isOverude = false;
          }
        } catch(err) {
          console.warn("Failed to check if date was overdue");
        }

        try {
          if ((new Date() - module.timeclose) > 0) {
            module.isOverdue = true;
            module.classOverride = "cardReallyDanger";
          } else {
            module.isOverude = false;
          }
        } catch(err) {
          console.warn("Failed to check if date was overdue");
        }
      }
    }
  },
}
</script>

<style>

</style>