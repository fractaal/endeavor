<template>
  <div>
    <Loader v-if="!section"/>
    <div v-else>
      <div class="header">
        <div>
          <EndeavorButton @click="openExternalLink">🔍 Open in eLearn</EndeavorButton>
          <EndeavorButton @click="$router.push('/courses/'+section.courseid)">📚 See course</EndeavorButton>
        </div>

      </div>
      <div :class="sharedStore.settings.numColumnsInCourseView == 1 ? 'content' : 'content-compact'" class="padded">
        <transition-group name="transition" style="margin-right: 25px; margin-left: 25px;">
          <div v-for="module in section.modules" :key="module.id">
            <card v-if="module.modnameformatted !== 'Label'"
              :title="module.name"
              :subtitle="module.modnameformatted"
              :rightTitle="module.duedate"
              :rightSubtitle="module.duedateformatted"
              :content="sharedStore.settings.showActivityDescriptionsOnCards ? module.intro : ''"
              :internalLink="`/courses/${$route.params.id}/${$route.params.section}/${module.instance}`"
              :externalLink="module.url"
              :styling="module.styling"
              />
            <h3 style="margin: 25px 0px 0px 10px;" v-else v-html="module.description">
              
            </h3>
            <!--
            <div v-else class="separator" style="margin: -50px 0px;"><h2 class="light" v-html="module.description"></h2></div>-->
          </div>

        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron';
import sharedStore from '../store';

import Card from './Card.vue';
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
    Card,
    EndeavorButton,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getSection();
    })
  },
  methods: {
    async getSection() {
      this.section = await this.sharedStore.eLearn.getSection(this.$route.params.id, this.$route.params.section);
    },
    async openExternalLink() {
      shell.openExternal(this.section.url);
    }
  }
}
</script>

<style>

</style>