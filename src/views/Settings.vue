<template>
  <div>
    <div class="settingsHighlight" style="margin-left: 50px; margin-right: 50px; margin-top: 25px; margin-bottom: 10px; max-height: 70vh;">
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">APPEARANCE</h3>
      <hr>
      <div style="display: flex; align-items: center;">
        <div class="toggle">
          <input type="checkbox" class="check" v-model="themeToggle">
          <b class="b switch"></b>
          <b class="b track"></b>
        </div>
        <div style="margin-left: 25px;">
          <h2 class="nospacing" style="font-weight: 400;">THEME</h2>
          <p class="nospacing">Toggle between a light or dark theme.</p>
        </div>
      </div>
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">BEHAVIOUR</h3>
      <hr>
      <div style="display: flex; align-items: center;">
        <div class="toggle">
          <input type="checkbox" class="check" v-model="sharedStore.settings.saveLogin">
          <b class="b switch"></b>
          <b class="b track"></b>
        </div>
        <div style="margin-left: 25px;">
          <h2 class="nospacing" style="font-weight: 400;">AUTOMATIC LOGIN</h2>
          <p class="nospacing">Saves your login details and automatically logs you in on any future Endeavor session.</p>
        </div>
      </div>
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">DATA</h3>
      <hr>
      <div style="display: flex; align-items: center;">
        <button @click="purgeLoginData" class="roundButton">⭕</button>
        <div style="margin-left: 25px;">
          <h2 class="nospacing" style="font-weight: 400;">REMOVE LOGIN DATA</h2>
          <p class="nospacing">Endeavor saves your login details for automatic login. To purge this data, click this button.</p>
        </div>
      </div>
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">DEVELOPER</h3>
      <hr>
      <div style="display: flex; align-items: center;">
        <div class="toggle">
          <input type="checkbox" class="check" v-model="sharedStore.settings.showDebugInfo">
          <b class="b switch"></b>
          <b class="b track"></b>
        </div>
        <div style="margin-left: 25px;">
          <h2 class="nospacing" style="font-weight: 400;">DISPLAY DEBUG INFORMATION</h2>
          <p class="nospacing">Display <i>complicated and very ugly</i> debug information such as current route open, route parameters and forum information.<br>Don't turn this on if you don't want ugly things!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path';
import fs from 'fs';

import sharedStore from '../store';

import {remote} from 'electron';
import keytar from 'keytar';

const data = remote.app.getPath("userData");

export default {
  name: "Settings",
  data() {
    return {
      sharedStore,
      themeToggle: true,
    }
  },
  created() {
    switch(this.sharedStore.settings.theme) {
      case "light-theme": this.themeToggle = true; break;
      case "dark-theme": this.themeToggle = false; break;
    }
  },
  beforeRouteLeave(to, from, next) {
    try {
      fs.writeFileSync(path.join(data, "endeavor.json"), JSON.stringify({
        settings: this.sharedStore.settings
      }))
      console.log("✅ Settings autosave success")
    } catch(err) {
      console.warn("❌ Error occured trying to write to the preferences file." + err);
    } finally {
      next();
    }
  },
  methods: {
    async purgeLoginData() {
      try {
        this.sharedStore.settings.saveLogin = false;
        const credentials = await keytar.findCredentials("endeavor");
        credentials.map(async credential => {
          await keytar.deletePassword("endeavor", credential.account);
        })
        remote.dialog.showMessageBox({title: "Complete!", message: "Login data purge complete!"});
      } catch(err) {
        remote.dialog.showErrorBox("Error occured clearing login data.", err);
      }
    }
  },
  watch: {
    themeToggle: function(value) {
      if (value) {
        this.sharedStore.settings.theme = "light-theme";
      } else {
        this.sharedStore.settings.theme = "dark-theme";
      }
    }
  }
}
</script>

<style>

</style>