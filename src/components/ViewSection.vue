<template>
  <div>
    <Loader v-if="isLoading"/>
    <div v-else>
      <div class="header">
        <div>
          <EndeavorButton @click="openExternalLink">🔍 Open in eLearn</EndeavorButton>
          <EndeavorButton @click="$router.push('/courses/'+section.courseid)">📚 See course</EndeavorButton>
        </div>

      </div>
      <div :class="sharedStore.settings.numColumnsInCourseView == 1 ? 'content' : 'content-compact'" class="padded">
        <transition-group name="transition">
          <module-card v-for="module in section.modules" :key="module.id" :module="module"/>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron';
import sharedStore from '../store';

import ModuleCard from './ModuleCard.vue';
import Loader from './Loader.vue';
import EndeavorButton from './EndeavorButton.vue';

export default {
  name: "ViewSection",
  data() {
    return {
      sharedStore,
      section: {},
      isLoading: false,
    }
  },
  components: {
    Loader,
    ModuleCard,
    EndeavorButton,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getSection();
    })
  },
  methods: {
    async getSection() {
      this.section = {};
      this.isLoading = true;
      this.section = await this.sharedStore.eLearn.getSection(this.$route.params.id, this.$route.params.section);
      this.isLoading = false;
    },
    async openExternalLink() {
      shell.openExternal(this.section.url);
    }
  }
}
</script>

<style>

</style>