<template>
  <div>
    <div class="topbar" style="padding: 20px; 10px; 10px; 10px;">
      <div style="display: flex; align-items: center;">
        <img id="logo" :class="sharedStore.theme" src="../assets/icon_bw.png" style="width: 60px; margin-right: 10px;"/>
        <!-- Name -->
        <div style="display: flex; flex-direction: column; margin: 0 50px 0 0;">
          <h3 style="margin: 0;">{{fullNamePascalCased}}</h3>
          <p style="margin: 0;">Endeavor <b class="attention">BETA</b> {{require('electron').remote.app.getVersion()}}</p>
        </div>
        <!-- Buttons --> 
        <button class="roundButton transparent" @click="$router.go(-1)"><fai icon="backward"/></button>
        <button style="margin-left: 10px; margin-right: 20px;" class="roundButton transparent" @click="$router.go(1)"><fai icon="forward"/></button>
        <!-- Search bar -->
        <form @submit="startSearch">
          <input type="text" v-model="search" placeholder="Search..." class="transparent" style="width: 30vw;"/>
        </form>
        <!-- -->
        <p v-if="sharedStore.settings.showDebugInfo">{{$route.path}}, {{$route.params}}</p>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 8fr; min-height: calc(100vh - 100px); max-height: calc(100vh - 100px);">
      <div class="sidebar">
        <h1>{{codeEmoji}} {{codeName}} </h1>
        <h3 @click="navTo('/home')">🕐 Timeline</h3>
        <h3 @click="navTo('/home/courses')">📚 Courses </h3>
        <h3 @click="navTo('/settings')">⚙  Settings </h3>
        <hr>
        <br>
      </div>  
      <div style="overflow: scroll; overflow-x: hidden; flex: 1 1 auto;">
        <transition name="transition" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import sharedStore from '../store';

import { remote } from 'electron';
import capitalize from '../util/capitalize';

export default {
  name: 'Home',
  data() {
    return {
      sharedStore,
      fullNamePascalCased: "",
      codeEmoji: "⚡",
      codeName: "Performant",
      search: "",
    };
  },
  async created() {
    this.sharedStore.session = await sharedStore.eLearn.getSession();
    this.fullNamePascalCased = capitalize(this.sharedStore.session.fullname);
  },
  watch: {
    search: function(value) {
      this.sharedStore.search = value;
      if (this.$route.name == "Search") {
        if (this.sharedStore.searchTimer) {
          clearTimeout(this.sharedStore.searchTimer);
          this.sharedStore.userDoneTypingOnSearch = false;
          this.sharedStore.searchTimer = null;
        }
        this.sharedStore.searchTimer = setTimeout(() => {
          this.sharedStore.userDoneTypingOnSearch = true;
          this.sharedStore.searchResults = this.sharedStore.searchFunction(this.sharedStore.search); 
        }, 500);
      }
    },
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
      this.sharedStore.searchResults = [];
      this.sharedStore.searchResults = this.sharedStore.searchFunction(this.sharedStore.search);
      this.navTo("/search");
    }
  }
};
</script>
