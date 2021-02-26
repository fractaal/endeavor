<template>
  <div>
    <scratchpads/>
    <div class="windowbuttons">
      <div style="display: flex;">
        <!-- Nav buttons were supposed to be here. They look horrible. -->
      </div>
      <div style="display: flex;">
        <div @click="minimizeWindow" class="windowbutton"><fai icon="window-minimize"/></div>
        <div @click="maximizeWindow" class="windowbutton"><fai icon="window-restore"/></div>
        <div @click="closeWindow" class="windowbutton"><fai size="lg" icon="times"/></div>
      </div>
    </div>

    <nav class="navbar">
      <div class="navbar-picture" v-if="sharedStore.session">
        <img class="userpicture" :src="sharedStore.session.userpictureurl"/>
      </div>

      <div class="navbar-item navbar-name">
        <h3 class="light link-text" style="margin: 0; position: absolute; top: 215px;">{{fullNamePascalCased.toUpperCase()}}</h3>
      </div>

      <div class="navbar-item">
        <button :class="!navigatedToNotifications && sharedStore.eLearn.notifications.length !== 0 ? 'notify' : ''" class="navbar-button" @click="navTo('/notifications')">
          <fai icon="bell"/>
        </button>
        <h3 class="light link-text">NOTIFICATIONS</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/search')">
          <fai icon="search"/>
        </button>
        <h3 class="light link-text">SEARCH</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/timeline')">
          <fai icon="stream"/>
        </button>
        <h3 class="light link-text">TIMELINE</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/courses')">
          <fai icon="graduation-cap"/>
        </button>
        <h3 class="light link-text">COURSES</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="toggleGlobalScratchpad()">
          <fai icon="scroll"/>
        </button>
        <h3 class="light link-text">SCRATCHPAD</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/changelog')">
          <fai icon="flag"/>
        </button>
        <h3 class="light link-text">CHANGELOG</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/settings')">
          <fai icon="cog"/>
        </button>
        <h3 class="light link-text">SETTINGS</h3>
      </div>
    </nav>

    <top-bar/>

    <transition name="transition" mode="out-in">
      <keep-alive>
        <router-view class="view"></router-view>
      </keep-alive>
    </transition>

  </div>
</template>

<script>
import { Bus } from '../main';
import fs from 'fs';
import path from 'path';
import sharedStore from '../store';
import Scratchpads from '../components/Scratchpads.vue';
import TopBar from '../components/TopBar.vue';

import capitalize from '../util/capitalize';
import { remote } from 'electron';
import Mousetrap from 'mousetrap';
import { FindInPage } from 'electron-find';

const findInPage = new FindInPage(remote.getCurrentWebContents(), {
  offsetTop: 100,
  offsetRight: 30,
});

const { BrowserWindow } = remote;
const data = remote.app.getPath("userData");

export default {
  name: 'Home',
  data() {
    return {
      sharedStore,
      fullNamePascalCased: "",
      codeEmoji: "⚡",
      codeName: "Performant",
      search: "",
      debugData: {},
      navigatedToNotifications: false,
    };
  },
  components: {
    Scratchpads,
    TopBar
  },
  async created() {
    // Get changes for notifications
    if (this.sharedStore.settings.autoUpdateData) {
      this.sharedStore.eLearn.updateCacheAndNotify();
    } else {
      console.log(`Not auto-updating, setting is false`);
    }
    
    // Bind to Ctrl+F
    Mousetrap.bind("ctrl+f", () => {
      findInPage.openFindWindow();
    })

    // Check if version in settings is the same as current version. If not, display changelog
    if (!(this.sharedStore.settings.version == remote.app.getVersion())) {
      console.log("!!!")
      this.navTo('/changelog');
      this.sharedStore.settings.version = remote.app.getVersion();  
    }
    
    this.sharedStore.session = await sharedStore.eLearn.getSession();
    this.fullNamePascalCased = capitalize(this.sharedStore.session.fullname);
    this.debugData = sharedStore.eLearn.debugData();

  },
  methods: {
    navTo(location) {
      const resolve = this.$router.resolve(location);
      console.log(resolve)
      if (resolve.route.name) {
        if (resolve.route.name == "Notifications") {
          this.navigatedToNotifications = true;
        }
        this.$router.push(location);
      } else {
        remote.dialog.showMessageBox({message: "This route hasn't been created yet. 😢"})
      }
    },
    startSearch(e) {
      e.preventDefault();
      this.sharedStore.searchResults = {};
      this.sharedStore.searchResults = this.sharedStore.searchFunction(this.sharedStore.search);
      this.navTo("/search");
    },
    minimizeWindow() {
      BrowserWindow.getFocusedWindow().minimize();
    },
    maximizeWindow() {
      BrowserWindow.getFocusedWindow().maximize();
    },
    closeWindow() {
      BrowserWindow.getFocusedWindow().close();
    },
    toggleGlobalScratchpad() {
      Bus.$emit("toggle-scratchpad", 0, "MAIN");
    }
  }
};
</script>
