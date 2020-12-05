<template>
  <div>
    <Loader v-if="!section"/>
    <div v-else>
      <h1 style="margin-left: 50px;">{{section.name}}</h1>
      <div class="cardlist">
        <transition-group name="transition" style="margin-right: 25px; margin-left: 25px;">
          <card v-for="module in section.modules" :key="module.id"
            :title="module.name"
            :subtitle="module.modname"
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
import sharedStore from '../store';

import Card from './Card.vue';
import Loader from './Loader.vue';

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
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getSection();
    })
  },
  methods: {
    async getSection() {
      this.section = await this.sharedStore.eLearn.getSection(this.$route.params.id, this.$route.params.section);
    }
  }
}
</script>

<style>

</style>