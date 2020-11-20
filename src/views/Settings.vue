<template>
  <div>
    <div style="margin-left: 50px; margin-right: 50px; margin-top: 25px; margin-bottom: 10px;">
      <div class="settingsHighlight" style="display: flex; align-items: center;">
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
      <hr style="margin: 20px; 0px; 20px; 0px;">
      <div class="settingsHighlight" style="display: flex; align-items: center;">
        <div class="toggle">
          <input type="checkbox" class="check" v-model="sharedStore.settings.saveLogin">
          <b class="b switch"></b>
          <b class="b track"></b>
        </div>
        <div style="margin-left: 25px;">
          <h2 class="nospacing" style="font-weight: 400;">AUTOMATIC LOGIN</h2>
          <p class="nospacing">⚠ This feature is very insecure. It saves your login info on your computer as <i>Plain Text.</i> Don't use this if you're paranoid.<br><br>Saves your login details and automatically logs you in on any future Endeavor session.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path';
import fs from 'fs';

import sharedStore, { addCourseToCache, getCourseFromCache } from '../store';
import {formatDistance, format} from 'date-fns';

import {remote} from 'electron';

const data = remote.app.getPath("appData");

export default {
  name: "Settings",
  data() {
    return {
      sharedStore,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.getModuleData();
    })
  },
  beforeRouteLeave(to, from, next) {
    try {
      fs.writeFileSync(path.join(data, "endeavor.json"), JSON.stringify({
        settings: this.sharedStore.settings,
        username: this.sharedStore.username,
        password: this.sharedStore.password,
      }))
      console.log("✅ Settings autosave success")
    } catch(err) {
      console.warn("❌ Error occured trying to write to the preferences file." + err);
    } finally {
      next();
    }
  }
}
</script>

<style>

</style>