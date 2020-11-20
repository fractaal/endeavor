<template>
  <div id="app" class="fullPage loginBackground">
    <transition name="transition" mode="out-in">
      <keep-alive>
        <router-view name="default"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script lang="ts">
import path from 'path';
import fs from 'fs';

import Vue from 'vue';
import sharedStore from './store';

import {ELearn} from './elearn';
import {remote} from 'electron';

const data = remote.app.getPath("appData");
let endeavor;

console.log("Data path: " + data);

export default Vue.extend({
  data() {
    return {
      sharedStore
    };
  },
  async created () {
    // Creating new eLearn object in store...
    this.sharedStore.eLearn = new ELearn();
    this.$router.push('/login');
    
    // Checking if endeavor.json file exists
    if (fs.existsSync(path.join(data, "endeavor.json"))) {
      endeavor = JSON.parse(fs.readFileSync(path.join(data, "endeavor.json"), {encoding: "utf8"}));
      try {
        this.sharedStore.settings = endeavor.settings;
        if (this.sharedStore.settings.saveLogin) {
          const loginResult = await this.sharedStore.eLearn.login(endeavor.username, endeavor.password);
          if (loginResult) {
            console.log("Autologin success");
            this.$router.push("/home");
          } else {
            console.warn("Automatic login failed!");
          }
        }
      } catch(err) {
        console.warn("An error occurred trying to initialize app preferences." + err);
      }
    }
  }
});

</script>

<style>
  @import './assets/styles.css';
</style>
