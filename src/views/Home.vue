<template>
  <div>
    <scratchpads/>
    <div class="windowbuttons">
      <div @click="minimizeWindow" class="windowbutton"><fai icon="window-minimize"/></div>
      <div @click="maximizeWindow" class="windowbutton"><fai icon="window-restore"/></div>
      <div @click="closeWindow" class="windowbutton"><fai size="lg" icon="times"/></div>
    </div>
    <!--
    <div class="topbar">

      <div class="topbarelements">


        <div style="display: flex; flex-direction: column; margin: 0 50px 0 0;">
          <h3 style="margin: 0;">{{fullNamePascalCased}}</h3>
          <p style="margin: 0;">Endeavor <b class="attention">BETA</b> {{require('electron').remote.app.getVersion()}}</p>
        </div>

        <button class="roundButton" @click="$router.go(-1)"><fai icon="arrow-left"/></button>
        <button style="margin-left: 10px; margin-right: 20px;" class="roundButton" @click="$router.go(1)"><fai icon="arrow-right"/></button>

        <form @submit="startSearch" class="searchbar">
          <input type="text" v-model="search" placeholder="Search your courses..." style="width: 30vw;"/>
          <fai class="searchicon" icon="search"/>
        </form>
      </div>
    </div>

    -->
    <nav class="navbar">
      <div class="navbar-picture" v-if="sharedStore.session">
        <img class="userpicture" :src="sharedStore.session.userpictureurl"/>
      </div>
      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/search')">
          <fai icon="search"/>
        </button>
        <h3 class="light link-text">SEARCH</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/home')">
          <fai icon="stream"/>
        </button>
        <h3 class="light link-text">TIMELINE</h3>
      </div>

      <div class="navbar-item">
        <button class="navbar-button" @click="navTo('/home/courses')">
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
        <button class="navbar-button" @click="navTo('/settings')">
          <fai icon="cog"/>
        </button>
        <h3 class="light link-text">SETTINGS</h3>
      </div>
    </nav>
    <transition name="transition" mode="out-in">
      <keep-alive>
        <router-view class="view"></router-view>
      </keep-alive>
    </transition>
    <!--
    <div style="display: grid; grid-template-columns: 2fr 10fr; min-height: calc(100vh - 100px); max-height: calc(100vh - 100px);">
      <div class="sidebar">

        
        <hr>
        <h3 @click="navTo('/changelog')">✨ What's New? </h3>
        <div class="nospacing" style="padding: 0px 20px 0px 20px;" v-if="sharedStore.settings.showDebugInfo">
          <p style="font-weight: 200;">ROUTE PATH</p>
          <h4>{{$route.path}}</h4>
          <br>
          <p style="font-weight: 200;">ROUTE PARAMETERS</p>
          <h4>{{$route.params}}</h4>
          <br>
          <p style="font-weight: 200;">UNIVERSAL SEARCH CACHE</p>
          <hr>
          <p style="font-weight: 200;">BUILD TIME <b>{{debugData.buildtime}}ms</b></p>
          <p style="font-weight: 200;"><b>{{debugData.loadedcourses}} </b>COURSES</p>
          <p style="font-weight: 200;"><b>{{debugData.loadedsections}} </b>SECTIONS</p>
          <p style="font-weight: 200;"><b>{{debugData.loadedmodules}} </b>MODULES</p>
          <hr>
          <p style="font-weight: 200;"><b>{{debugData.loadedmoduleswithdata}} </b>MODULES W/ DATA</p>
          <p style="font-weight: 200;"><b>{{debugData.loadedmodules - debugData.loadedmoduleswithdata}} </b>MODULES W/O DATA</p>
        </div>
        <div class="sidebarfooter nospacing" style="padding: 0px 20px 0px 20px;">
          <p v-if="sharedStore.updateAvailable" style="font-size: 14px; font-weight: 200;" class="attention">UPDATE AVAILABLE</p>
        </div>
      </div>  
      <div style="overflow: scroll; overflow-x: hidden; flex: 1 1 auto;">
      </div>
      
    </div>
    -->
  </div>
</template>

<script>
import { Bus } from '../main';
import fs from 'fs';
import path from 'path';
import sharedStore from '../store';

import Scratchpads from '../components/Scratchpads.vue';

import { remote } from 'electron';
import capitalize from '../util/capitalize';

const {BrowserWindow} = remote;
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
    };
  },
  components: {
    Scratchpads
  },
  async created() {
    // Check if version in settings is the same as current version. If not, display changelog
    if (!(this.sharedStore.settings.version == remote.app.getVersion())) {
      console.log("!!!")
      this.navTo('/changelog');
      this.sharedStore.settings.version = remote.app.getVersion();
      fs.writeFileSync(path.join(data, "endeavor.json"), JSON.stringify({
        settings: this.sharedStore.settings
      }))
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
