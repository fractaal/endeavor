<template>
  <div>
    <div class="topbar" style="padding: 20px; 10px; 10px; 10px;">
      <div style="display: flex; align-items: center;">
        <img src="../assets/icon_bw.png" style="width: 60px; margin-right: 10px;"/>
        <!-- Name -->
        <div style="display: flex; flex-direction: column; margin: 0 50px 0 0;">
          <h3 style="margin: 0;">{{fullNamePascalCased}}</h3>
          <p style="margin: 0;">Endeavor {{require('electron').remote.app.getVersion()}}</p>
        </div>
        <!-- Buttons --> 
        <button class="roundButton transparent" @click="$router.go(-1)"><fai icon="backward"/></button>
        <button style="margin-left: 10px; margin-right: 20px;" class="roundButton transparent" @click="$router.go(1)"><fai icon="forward"/></button>
        <!-- Search bar -->
        <input type="text" v-model="sharedStore.search" placeholder="Search..." class="transparent" style="width: 30vw;"/>
        <!-- -->
        <p>{{$route.path}}, {{$route.params}}</p>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 8fr; min-height: calc(100vh - 100px); max-height: calc(100vh - 100px);">
      <div class="sidebar">
        <h1>{{codeEmoji}} Menu </h1>
        <h3 @click="navTo('/home')">🕐 Timeline</h3>
        <h3 @click="navTo('/home/courses')">📚 Courses </h3>
        <h3 @click="navTo('/settings')">⚙  Settings </h3>
        <hr>
        <br>
        <h3 @click="navTo('/help')">❓ Help</h3>
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

<script lang="ts">
import Vue from 'vue';
import sharedStore from '../store';

import { remote } from 'electron';

export default Vue.extend({
  data() {
    return {
      sharedStore,
      fullNamePascalCased: "",
      codeEmoji: "👑",
      codeName: "Monarch",
      userpictureB64: "",
    };
  },
  name: 'Home',
  async created() {
    this.sharedStore.session = await sharedStore.eLearn.getSession();
    this.fullNamePascalCased = this.sharedStore.session.fullname.replace(/\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
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
  }
});
</script>
