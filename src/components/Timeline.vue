<template>
  <div>
    <div class="content">
      <br>
      <transition name="transition">
        <div class="nospacing emptylistplaceholder" v-if="timeline.length == 0 && !isLoading">
          <fai size="10x" icon="check-circle" />
          <h1 style="font-weight: 400;">You're all good!</h1>
          <p>Time to sit back and relax.</p>
        </div>
      </transition>
      <transition-group name="transition">
        <div v-for="event in timeline" :key="event.instance">
          <card
          :title="event.name" 
          :subtitle="event.course.fullnamedisplay" 
          :rightTitle="event.date" 
          :rightSubtitle="event.formattedtime"
          :content="event.description"
          :internalLink="`/courses/${event.course.id}/${event.section}/${event.instance}`"
          :externalLink="event.url"
          :styling="event.styling"
          >
          <template v-slot:header>
            <div style="display: flex; justify-content: space-between;">
              <div class="flex-row">
                <fai size="2x" icon="clock"/>
                <div>
                  <p style="font-weight: 800; margin: 0;">{{event.name}}</p>
                  <p style="margin: 0;">{{event.course.fullnamedisplay}}</p>
                </div>
              </div>
              <div class="flex-row">
                <div style="display: flex; flex-direction: column; justify-content: flex-end;">
                  <timeago :datetime="event.date" style="font-weight: 800; margin: 0;" :auto-update="60"/>
                  <p style="margin: 0;">{{event.formattedtime}}</p>
                </div>
              </div>
            </div>
          </template>
          </card>
        </div>
        <Loader v-if="isLoading" key="loader"/>
      </transition-group>
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
    })
  },
  methods: {
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