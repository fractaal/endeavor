<template>
  <div>
    <loader v-if="!module" :text="`Loading module`"/>
    <div v-else style="margin-left: 50px; margin-top: 25px; margin-bottom: 10px;">
      <h1 class="nospacing">{{module.name}}</h1>
      <div style="display: flex; justify-content: space-  between;">
        <div>
          <p class="nospacing">{{module['modname']}}</p>
        </div>
        <div style="margin-left: 50px; margin-right: 50px;">
          <form :action="module.url" method="post">
            <button type="submit" class="roundButton">🔍</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sharedStore, { addCourseToCache, getCourseFromCache } from '../store';
import {formatDistance, format} from 'date-fns';

import Card from './Card.vue';
import Loader from './Loader.vue';

export default {
  name: "ViewModule",
  components: {
    Loader,
    // Card
  },
  data() {
    return {
      sharedStore,
      module: {},
      isLoading: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getModule()
    })
  },
  methods: {
    async getModule() {
      this.module = await this.sharedStore.eLearn.getModule(this.$route.params.course, this.$route.params.instance);
      console.log(this.module);
    }
  }
}
</script>

<style>

</style>