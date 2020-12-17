<template>
  <div style="margin: 50px 50px;">
    <h2 style="font-weight: 300;">INTERNAL DEBUG CONSOLE</h2>
    <div class="level" style="display: block; max-height: 70vh; overflow-y: auto;">
      <pre v-for="(text) in trunctatedLog" :key="text">⚪ {{text}}</pre>
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
    };
  },
  computed: {
    trunctatedLog: function() {
      return this.sharedStore.debugLog.slice(this.sharedStore.debugLog.length-101, this.sharedStore.debugLog.length-1);
    }
  }
};
</script>