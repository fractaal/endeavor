<template>
  <div>
    <div class="header">
      <EndeavorButton @click="openExternalLink">🔍 Open in eLearn...</EndeavorButton>
    </div>
    <div class="content padded">
      <transition-group name="transition">
        <card v-for="section in sections" :key="section.section"
          :title="section.name"
          :content="section.summary"
          :internalLink="`/courses/${course.id}/${section.section}`"
        />
      </transition-group>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore from '../store';

import Loader from './Loader.vue';
import Card from './Card.vue';
import EndeavorButton from './EndeavorButton.vue';

import { shell } from 'electron';

export default {
  name: "ViewCourse",
  components: {
    Loader,
    Card,
    EndeavorButton,
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
    },
    openExternalLink() {
      shell.openExternal(this.course.url);
    },
  }
}
</script>

<style>

</style>