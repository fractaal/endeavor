<template>
  <div>
    <h1 style="margin-left: 50px;">Your courses</h1>
    <div style="overflow-y: auto; max-height: 80vh;">
      <transition-group name="transition" style="margin-left: 25px; margin-right: 25px; display: grid; grid-template-columns: 1fr 1fr; min-height: 80vh;">
        <div v-for="course in filteredCourses" :key="course.id">
          <div class="card" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <p style="font-weight: 800; margin: 0;">{{course.displayname}}</p>
              </div>
              <div style="display: flex;">
                <p style="margin:0; font-weight: 200;">Last accessed {{course.lastaccessFormatted}}</p>
              </div>
            </div>
          </div>
          <div class="bar">
            <div class="load" :style="'width:'+course.progress+'%;'"></div>
          </div>
          <div class="card cardDarker" style="border-radius: 0px 0px 10px 10px; margin-top: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <p style="margin: 0;">{{course.progress}}% complete</p>
              </div>
              <div style="display: flex;">
                <button @click="$router.push('courses/'+course.id)" class="roundButton">🔍</button>
              </div>
            </div>
            
          </div>
        </div>
      </transition-group>
    </div>
    <Loader v-if="coursesLoading"/>
  </div>

</template>

<script>
import sharedStore from '../store';
import {formatDistance} from 'date-fns';

import Loader from './Loader';

export default {
  name: "Courses",
  data() {
    return {
      sharedStore,
      courses: [],
      coursesLoading: false,
    }
  },
  components: {
    Loader
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
  computed: {
    filteredCourses: function() {
      const term = this.sharedStore.search.toLowerCase();
      return this.courses.filter(element => {
        try {
          if (
            // Rules to change
            element.displayname.toLowerCase().includes(term)
          ) return element;
        } catch(err) {
          console.warn("!!!");
        }
      })
    }
  },
}
</script>

<style>

</style>
