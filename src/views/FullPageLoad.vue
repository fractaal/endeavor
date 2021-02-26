<template>
  <div style="margin: 0; padding: 0; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center;">
    <video loop autoplay :class="classToApply">
        <source src="@/assets/loadanim.webm"/>
    </video>
    <div style="width: 100vw; display: flex; justify-content: center; flex-direction: column; align-items: center;">
      <h1 class="light shimmer">{{sharedStore.fullPageLoadText}}</h1>
      <div style="max-height: 125px; overflow: hidden;">
        <transition-group name="transition" mode="out-in">
          <p v-for="logItem in reverseLog" :key="logItem.time" style="text-align: center;">{{logItem.text}}</p>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
// import Loader from '@/components/Loader.vue';
import sharedStore from '../store';

export default {
  name: "FullPageLoad",
  data() {
    return {
      sharedStore,
      classToApply: "",
    }
  },
  computed: {
    reverseLog: function() {
      return [...this.sharedStore.fullPageLoadLog].reverse();
    }
  },
  mounted() {
    this.classToApply = "settle";
    setTimeout(() => {
      this.classToApply = "splash-logo";
    }, 2000)
  }
}
</script>

<style>

</style>