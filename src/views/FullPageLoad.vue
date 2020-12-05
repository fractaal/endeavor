<template>
  <div style="margin: 0; padding: 0; width: 100vw; height: 100vh;">
    <loader :text="sharedStore.fullPageLoadText"/>
    <div style="width: 100vw; display: flex; justify-content: center;">
      <div style="max-height: 200px; overflow: hidden;">
        <transition-group name="transition" mode="out-in">
          <p v-for="logItem in reverseLog" :key="logItem" style="text-align: center;">{{logItem}}</p>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import sharedStore from '../store';

export default {
  name: "FullPageLoad",
  components: {
    Loader,
  },
  data() {
    return {
      sharedStore,
    }
  },
  computed: {
    reverseLog: function() {
      return [...this.sharedStore.fullPageLoadLog].reverse();
    }
  }
}
</script>

<style>

</style>