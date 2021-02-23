<template>
  <div>
    <div class="content padded">
      <div class="level" style="display: block; max-height: 70vh; overflow-y: auto;">
        <pre v-for="(text) in trunctatedLog" :key="text">⚪ {{text}}</pre>
      </div>
    </div>
    
  </div>
</template>

<script>
import sharedStore from '../store';

export default {
  name: "Console",
  data() {
    return {
      sharedStore,
      trunctatedLog: [],
    };
  },
  methods: {
    updateLog() {
      this.trunctatedLog = this.sharedStore.debugLog.slice(this.sharedStore.debugLog.length-101, this.sharedStore.debugLog.length-1);
    }
  },
  created() {
    this.updateLog();
  },
  mounted() {
    this.updateLog();
  },
};
</script>