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
            :internalLink="'/home/courses/'+course.id"
            :styling="course.styling"
            />
      </transition-group>
    </div>
    <Loader v-if="coursesLoading"/>
  </div>

</template>

<script>
import sharedStore from '../store';
import {formatDistance} from 'date-fns';

import Loader from './Loader';
import Card from './Card.vue';

export default {
  name: "ViewCourses",
  data() {
    return {
      sharedStore,
      courses: [],
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
  methods: {
    async listCourses() {
      this.coursesLoading = true;
      const courses = await this.sharedStore.eLearn.getCourses();
      for (const course of courses) {
        course.lastaccessFormatted = formatDistance(course.lastaccess, new Date(), {addSuffix: true});
        course.progress = course.progress.toFixed(0);
      }
      this.coursesLoading = false;
      this.courses = courses;
    }
  },
}
</script>

<style>

</style>
