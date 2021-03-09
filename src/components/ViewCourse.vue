<template>
  <div>
    <div class="header">
      <EndeavorButton @click="openExternalLink">🔍 Open in eLearn...</EndeavorButton>
    </div>
    <div :class="sharedStore.settings.numColumnsInCourseView == 1 ? 'content' : 'content-compact'" class="padded">
      <transition-group name="transition">
        <section-card v-for="section in sections" :key="section.section" :section="section" :course="course"/>
      </transition-group>
    </div>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import sharedStore from '../store';

import Loader from './Loader.vue';
import SectionCard from './SectionCard.vue';
import EndeavorButton from './EndeavorButton.vue';

import { shell } from 'electron';

export default {
  name: "ViewCourse",
  components: {
    Loader,
    SectionCard,
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
      this.course = {};
      this.sections = [];
      this.isLoading = true;
      const [course, sections] = await Promise.all([
        this.sharedStore.eLearn.getCourse(this.$route.params.id),
        this.sharedStore.eLearn.getCourseInfo(this.$route.params.id)
      ])
      this.isLoading = false;
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