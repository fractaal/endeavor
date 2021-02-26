<template>
  <div>
    <div class="header">
      <EndeavorButton @click="toggleHiddenCoursesView">{{hiddenCoursesView ? '👓 Back to normal' : '🕶 Show hidden'}}</EndeavorButton>
    </div>
    <div :class="sharedStore.settings.numColumnsInCourseView == 1 ? 'content' : 'content-compact'" class="padded">
      <transition-group name="transition">
        <card v-for="course in courses" :key="course.id"
            :title="course.displayname"
            :subtitle="`Last accessed ${course.lastaccessFormatted}`"
            :rightSubtitle="`${course.progress}% complete`"
            :progress="course.progress"
            :id="course.id"
            :buttons="[{name: hideButtonLabel, icon: hideButtonEmoji, event: 'hideToggle'}]"
            :internalLink="'/courses/'+course.id"
            :styling="course.styling"
            />
      </transition-group>
      <Loader v-if="coursesLoading"/>
    </div>
  </div>
</template>

<script>
import { Bus } from '../main';
import sharedStore from '../store';
import {formatDistance} from 'date-fns';

import {toggleCourseVisibility, getCourseVisibility} from '../course-presentation';

import Loader from './Loader.vue';
import Card from './Card.vue';
import EndeavorButton from './EndeavorButton.vue';

export default {
  name: "ViewCourses",
  data() {
    return {
      sharedStore,
      courses: [],
      hiddenCoursesView: false,
      coursesLoading: false,
    }
  },
  computed: {
    hideButtonLabel: function() {
      return this.hiddenCoursesView ? "Unhide" : "Hide"
    },
    hideButtonEmoji: function() {
      return this.hiddenCoursesView ? "✨" : "❌"; 
    },
  },
  components: {
    Loader,
    Card,
    EndeavorButton,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.listCourses();
      next();
    })
  },
  created() {
    Bus.$on("hideToggle", id => {
      toggleCourseVisibility(id); 
      this.listCourses(true);
    })
  },
  methods: {
    async listCourses(usingCache) {
      this.coursesLoading = true;
      let data;
      if (usingCache) {
        data = this.sharedStore.eLearn.cache.coursesMetadata;
      } else {
        data = await this.sharedStore.eLearn.getCourses();
      }
      const courses = [];
      for (const course of data) {
        if ((!this.hiddenCoursesView && getCourseVisibility(course.id)) || (this.hiddenCoursesView && !getCourseVisibility(course.id))) {
          course.lastaccessFormatted = formatDistance(course.lastaccess, new Date(), {addSuffix: true});

          // In the cache, for some reason, the progress property is transformed into a string. Let's fix that!
          if (typeof course.progress == "string") {
            course.progress = Number(course.progress)
          }
          course.progress = course.progress.toFixed(0);
          courses.push(course);
        }
      }
      this.coursesLoading = false;
      this.courses = courses;
    },
    toggleHiddenCoursesView() {
      this.hiddenCoursesView = !this.hiddenCoursesView;
      this.listCourses(true);
    }
  },
}
</script>

<style>

</style>
