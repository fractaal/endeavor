<template>
  <div id="app" class="fullPage loginBackground">
    <transition name="transition" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import sharedStore from './store';
import {ELearn} from './elearn';

export default Vue.extend({
  data() {
    return {
      sharedStore
    };
  },
  created () {
    // Creating new eLearn object in store...
    this.sharedStore.eLearn = new ELearn();
    this.$router.push('/login');
  }
})

</script>

<style>
  @import './assets/styles.css';
</style>
