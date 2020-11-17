<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {ELearn} from './elearn';

export default Vue.extend({
  created() {
    (async () => {
      const client = new ELearn();
      // Put login here...
      console.log(await client.getSession());
    })();
  }
})

</script>

<style>
  @import './assets/styles.css';
</style>
