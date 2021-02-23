<template>
  <div>
    <div class="header">
      <div style="display: flex; width: 100%;">
        <input ref="search" v-model="search" type="text" placeholder="TYPE HERE..." class="seamless"/>
      </div>
    </div>
    <div class="content padded">
      <transition-group name="transition" mode="out-in">
        <div v-if="sharedStore.userDoneTypingOnSearch" :key="`content`" >
          <div class="cardlist">
            <transition-group name="transition">
              <card v-for="module in sharedStore.searchResults.moduleResults" :key="module.id"
                  :title="module.name"
                  :subtitle="module.modnameformatted"
                  :rightTitle="module.duedateformatted"
                  :rightSubtitle="module.duedatedistanceformatted"
                  :content="module.description"
                  :styling="module.styling"
                  :internalLink="`/courses/${module.courseid}/${module.section}/${module.id}`"
                />
            </transition-group>
            <hr>
            <transition-group name="transition">
              <card v-for="section in sharedStore.searchResults.sectionResults" :key="section.id"
                :title="section.name"
                :content="section.summary"
                :internalLink="`/courses/${section.courseid}/${section.section}`"
                />
            </transition-group>
          </div>
        </div>
        <loader v-else :text="`WAITING FOR YOU...`" :key="`loader`"/>
      </transition-group>
    </div>

  </div>
</template>

<script>
import sharedStore from '@/store';
import Card from '@/components/Card.vue';
import Loader from '@/components/Loader.vue';

export default {
  name: "Search",
  components: {
    Card,
    Loader
  },
  data() {
    return {
      sharedStore,
      search: ""
    }
  },
  watch: {
    search: function(value) {
      this.sharedStore.search = value;
      if (this.$route.name == "Search") {
        if (this.sharedStore.searchTimer) {
          clearTimeout(this.sharedStore.searchTimer);
          this.sharedStore.userDoneTypingOnSearch = false;
          this.sharedStore.searchTimer = null;
        }
        this.sharedStore.searchTimer = setTimeout(() => {
          this.sharedStore.userDoneTypingOnSearch = true;
          this.sharedStore.searchResults = this.sharedStore.searchFunction(this.sharedStore.search); 
        }, 500);
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {vm.$refs.search.focus()})
    })
  }
}
</script>

<style>

</style>