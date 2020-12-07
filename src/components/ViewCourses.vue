<template>
  <div>
    <h1 style="margin-left: 50px;">Your courses</h1>
    <div>
      <transition-group name="transition" class="compactcardlist">
        <card v-for="course in courses" :key="course.id"
            :title="course.displayname"
            :subtitle="`Last accessed ${course.lastaccessFormatted}`"
            :rightSubtitle="`${course.progress}% complete`"
            :progress="course.progress"
            :id="course.id"
            :buttons="[{name: 'Hide', icon: '❌', event: 'hideToggle'}]"
            :internalLink="'/home/courses/'+course.id"
            :styling="course.styling"
            />
      </transition-group>
    </div>
    <Loader v-if="coursesLoading"/>
  </div>

</template>

<script>
import { Bus } from '../main';
import sharedStore from '../store';
import {formatDistance} from 'date-fns';

import {toggleCourseVisibility, getCourseVisibility} from '../course-presentation';

import Loader from './Loader';
import Card from './Card.vue';

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
  components: {
    Loader,
    Card
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
    })
  },
  methods: {
    async listCourses() {
      this.coursesLoading = true;
      const courses = [];
      for (const course of await this.sharedStore.eLearn.getCourses()) {
        if ((!this.hiddenCoursesView && getCourseVisibility(course.id)) || (this.hiddenCoursesView && !getCourseVisibility(course.id))) {
          course.lastaccessFormatted = formatDistance(course.lastaccess, new Date(), {addSuffix: true});
          course.progress = course.progress.toFixed(0);
          courses.push(course);
        }
      }
      this.coursesLoading = false;
      this.courses = courses;
    }
  },
}
</script>

<style>

</style>
