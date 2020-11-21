<template>
  <div>
    <h1 style="margin-left: 50px; margin-bottom: 0;">Timeline</h1>
    <p :class="dayOfTheWeekStyling" style="margin-left: 50px; margin-top: 0; font-weight: 200;">Today is {{dayOfTheWeek}}.</p>
    <div style="overflow-y: auto; max-height: 80vh;">
      <transition-group name="transition" mode="out-in" style="min-height: 80vh;">
        <div v-for="event in filteredTimeline" :key="event.name" style="margin-left: 25px; margin-right: 25px;">
          <div :class="event.style1" class="card" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex; flex-direction: column;">
                <p style="font-weight: 800; margin: 0;">{{event.name}}</p>
                <p style="font-weight: 400; margin: 0;">{{event.course.fullnamedisplay}}</p>
              </div>
              <div style="display: flex;">
                <p style="margin:0; font-weight: 400;">{{event.timesortFormatted}}</p>
              </div>
            </div>
          </div>
          <div class="card" :class="event.style2" style="border-radius: 0px 0px 10px 10px; margin-top: 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;">
                <p style="margin: 0;" v-html="event.description"></p>
              </div>
              <div style="display: flex;">
                <button @click="$router.push(`/modules/${event.course.id}/${event.instance}`)" class="roundButton">🔍</button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <Loader v-if="isLoading"/>
    </div>
  </div>
</template>

<script>
import sharedStore from '../store';
import {format, formatDistance} from 'date-fns';

import Loader from './Loader';

export default {
  name: "Timeline",
  components: {
    Loader
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
  computed: {
    filteredTimeline: function() {
      const term = this.sharedStore.search.toLowerCase();
      return this.timeline.filter(element => {
        try {
          if (
            // Rules to change
            element.name.toLowerCase().includes(term) ||
            element.description.toLowerCase().includes(term) ||
            element.course.fullnamedisplay.toLowerCase().includes(term)
          ) return element;
        } catch(err) {
          console.warn("!!!");
        }
      })
    }
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
      const timeline = await this.sharedStore.eLearn.getTimeline();

      for (const event of timeline) {
        event.timesortFormatted = formatDistance(event.timesort, new Date(), {addSuffix: true});
      }

      for (const event of timeline) {
        const timeDiff = (Date.now() - event.timesort)/1000
        if (timeDiff > 0) {
          // If it's greater than 0, it means it's passed by now
          event.style1 = "cardReallyDanger";
          event.style2 = "cardReallyDanger2";
        } else if (timeDiff < 0 && timeDiff > (-60*60*24)) {
          event.style1 = "cardWarn";
          event.style2 = "cardWarn2";
        } else {
          event.style1 = "";
          event.style2 = "cardDarker";
        }
      }

      this.timeline = timeline;
      this.isLoading = false;
    },
  }
}
</script>

<style>

</style>