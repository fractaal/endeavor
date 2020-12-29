<template>
  <div>
    <div class="header">
      <h1 class="light">TIMELINE</h1>
    </div>
    <div class="content">
      <transition name="transition">
        <div class="nospacing emptylistplaceholder" v-if="timeline.length == 0 && !isLoading">
          <fai size="10x" icon="check-circle" />
          <h1 style="font-weight: 400;">You're all good!</h1>
          <p>Time to sit back and relax.</p>
        </div>
      </transition>
      <transition-group name="transition" mode="out-in">
        <card v-for="event in timeline" :key="event.instance"
        :title="event.name" 
        :subtitle="event.course.fullnamedisplay" 
        :rightTitle="event.formatteddistance" 
        :rightSubtitle="event.formattedtime"
        :content="event.description"
        :internalLink="`/modules/${event.course.id}/${event.instance}`"
        :externalLink="event.url"
        :styling="event.styling"
        />
      </transition-group>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore from '../store';
import {format, formatDistance} from 'date-fns';

import Loader from './Loader.vue';
import Card from './Card.vue';

export default {
  name: "Timeline",
  components: {
    Loader,
    Card,
  },
  data() {
    return {
      sharedStore,
      timeline: [],
      isLoading: false,
      dayOfTheWeek: "",
      dayOfTheWeekStyling: "",
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getTimeline();
      vm.getDayOfTheWeek();
    })
  },
  methods: {
    async getDayOfTheWeek() {
      this.dayOfTheWeek = format(new Date(), 'EEEE');
      if (this.dayOfTheWeek === "Sunday") {
        this.dayOfTheWeekStyling = "attention";
      }
    },
    async getTimeline() {
      this.isLoading = true;
      this.timeline = await this.sharedStore.eLearn.getTimeline()
      this.isLoading = false;
    }
  }
}
</script>

<style>

</style>