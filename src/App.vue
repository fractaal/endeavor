<template>
  <div id="app" :class="sharedStore.settings.theme" class="fullPage loginBackground">
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
import keytar from 'keytar';
import {remote} from 'electron';

const data = remote.app.getPath("userData");
let endeavor;

console.log("Data path: " + data);

export default Vue.extend({
  data() {
    return {
      sharedStore,
    };
  },
  async created () {
    // Creating new eLearn object in store...
    this.sharedStore.eLearn = new ELearn();
    this.$router.push('/load');

    this.sharedStore.fullPageLoadText = "Checking for existing config file..."
    
    // Checking if endeavor.json file exists
    if (fs.existsSync(path.join(data, "endeavor.json"))) {
      endeavor = JSON.parse(fs.readFileSync(path.join(data, "endeavor.json"), {encoding: "utf8"}));

      // Filling any missing data on endeavor 
      for (const key in this.sharedStore.settings) {
        if (!endeavor[key]) {
          console.log(`${key} does not exist in pre-existing configuration file, falling back to default`);
          endeavor[key] = this.sharedStore.settings[key];
        }
      }

      this.sharedStore.settings = endeavor.settings;

      // Remove any insecure plaintext login information.
      if (endeavor.username) delete endeavor.username;
      if (endeavor.password) delete endeavor.password;
      fs.writeFileSync(path.join(data, "endeavor.json"), JSON.stringify(endeavor), {encoding: "utf8"});

      // Attempting an automatic login
      try {
        
        let credentials; let credential; let loginResult;
        if (this.sharedStore.settings.saveLogin) {
          try {
            this.sharedStore.fullPageLoadText = "Logging you in..."
            credentials = await keytar.findCredentials("endeavor");
            credential = credentials[0];
            loginResult = await this.sharedStore.eLearn.login(credential.account, credential.password, log => {
              this.sharedStore.fullPageLoadLog.push(log);
            });
          } catch(err) {
            this.sharedStore.fullPageLoadText = "❌ Login failed!"
            console.warn("An error occured trying to retrieve login credentials: " + err);
            this.$router.push('/login');
          }
          
          if (loginResult) {
            this.sharedStore.fullPageLoadText = "Welcome!"
            console.log("Autologin success");
            this.$router.push("/home");
          } else {
            this.sharedStore.fullPageLoadText = "❌ Login failed!"
            console.warn("Automatic login failed!");
            this.$router.push('/login');
          }
        } else {
          console.log("❕ Not automatically logging in. saveLogin flag is false in preferences.")
          this.$router.push('/login');
        }
      } catch(err) {
        this.sharedStore.fullPageLoadText = "❌ App preference load error!"
        console.warn("An error occurred trying to initialize app preferences." + err);
        this.$router.push('/login');
      }
    } else {
      // If an existing preferences file doesn't exist, just push to login.
      this.$router.push('/login');
    }
  }
});

</script>

<style>
  @import './assets/styles.css';
</style>
