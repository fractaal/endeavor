<template>
  <div>
    <transition-group name="transition" mode="out-in">
      <loader v-if="!sharedStore.userDoneTypingOnSearch" :text="`Waiting for you to stop typing...`" :key="`loader`"/>
      <div v-else :key="`content`" >
        <h1 style="margin-left: 50px;">Results for {{sharedStore.search}}</h1>
        <div class="cardlist">
          <transition-group name="transition">
            <card v-for="module in sharedStore.searchResults.moduleResults" :key="module.id"
                :title="module.name"
                :subtitle="`${module.modnameformatted} in ${module.sectionname} - ${module.coursename}`"
                :rightTitle="module.duedateformatted"
                :rightSubtitle="module.duedatedistanceformatted"
                :content="module.description"
                :styling="module.styling"
                :internalLink="`/modules/${module.courseid}/${module.id}`"
              />
          </transition-group>
          <hr>
          <transition-group name="transition">
            <card v-for="section in sharedStore.searchResults.sectionResults" :key="section.id"
              :title="section.name"
              :content="section.summary"
              :internalLink="`/home/courses/${section.courseid}/${section.section}`"
              />
          </transition-group>
        </div>
      </div>
    </transition-group>
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
      sharedStore
    }
  },
}
</script>

<style>

</style>