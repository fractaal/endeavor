<template>
  <div>
    <Loader v-if="!section"/>
    <div v-else>
      <div style="margin: 25px 50px 10px 50px; display: flex; justify-content: space-between;">
        <div style="max-width: 50%;">
          <h1 class="nospacing">{{section.name}}</h1> 
        </div>
        <div style="display: flex;">
          <EndeavorButton @click="openExternalLink">🔍 Open in eLearn</EndeavorButton>
          <EndeavorButton @click="$router.push('/home/courses/'+section.courseid)">📚 See course</EndeavorButton>
        </div>
      </div>
      <div class="cardlist">
        <transition-group name="transition" style="margin-right: 25px; margin-left: 25px;">
          <card v-for="module in section.modules" :key="module.id"
            :title="module.name"
            :subtitle="module.modnameformatted"
            :rightTitle="module.duedateformatted"
            :rightSubtitle="module.duedatedistanceformatted"
            :content="module.intro"
            :internalLink="`/modules/${$route.params.id}/${module.instance}`"
            :externalLink="module.url"
            :styling="module.styling"
            />
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