<template>
  <div>
    <h1 style="margin-left: 50px; margin-bottom: 0;">Timeline</h1>
    <p :class="dayOfTheWeekStyling" style="margin-left: 50px; margin-top: 0; font-weight: 200;">Today is {{dayOfTheWeek}}.</p>
    <div class="cardlist">
      <transition-group name="transition" mode="out-in" style="min-height: 80vh;">
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