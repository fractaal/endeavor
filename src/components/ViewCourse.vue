<template>
  <div>
    <h1 style="margin-left: 50px;">{{course.displayname}}</h1>
    <div class="cardlist">
      <transition-group name="transition">
        <card v-for="section in sections" :key="section.section"
          :title="section.name"
          :content="section.summary"
          :internalLink="`${course.id}/${section.section}`"
        />
      </transition-group>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore, { getCourseFromCache } from '../store';
import {addCourseToCache} from '../store';

import Loader from './Loader.vue';
import Card from './Card.vue';

export default {
  name: "ViewCourse",
  components: {
    Loader,
    Card,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getCourse();
    })
  },
  data() {
    return {
      sharedStore,
      sections: [],
      course: {},
      isLoading: false,
    }
  },
  methods: {
    async getCourse() {
      const [course, sections] = await Promise.all([
        this.sharedStore.eLearn.getCourse(this.$route.params.id),
        this.sharedStore.eLearn.getCourseInfo(this.$route.params.id)
      ])
      this.course = course;
      this.sections = sections;
    }
  }
}
</script>

<style>

</style>