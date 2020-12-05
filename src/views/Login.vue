<template>
  <div class="loginBackground">
    <div class="windowbuttons">
      <div @click="minimizeWindow" class="windowbutton"><fai icon="window-minimize"/></div>
      <div @click="maximizeWindow" class="windowbutton"><fai icon="window-restore"/></div>
      <div @click="closeWindow" class="windowbutton"><fai size="lg" icon="times"/></div>
    </div>
    <div style="height: 10vh;"></div> <!-- To knock the entire form downards. -->
    <div style="display: flex; justify-content: center; align-items: center;">
      <div>
        <img src="../assets/icon.png" style="display: block; width: 300px; margin-left: auto; margin-right: auto;">
        <h1>Endeavor</h1>
        <h3 style="margin-top: -25px;">Log in with your eLearn information</h3>
        <form @submit.prevent="submit">
          <input v-model="username" type="text" placeholder="Username"/>
          <br>
          <input v-model="password" type="password" placeholder="Password"/>
          <div style="display: flex; align-items: flex-end;">
            <button type="submit" style="margin-right: 0px; margin-left: auto;" class="roundButton">✔</button>
          </div>
        </form>
      </div>
      <ChangeLogTicker/>
    </div>
    <div style="display: flex; justify-content: center;">
      <transition-group name="transition" mode="out-in">
        <Loader v-if="isLoading" key="load"/>
        <p v-if="message" :class="messageClass" key="msg">{{message}}</p>
      </transition-group>
    </div>
    <div class="footer" style="display: flex; align-items: flex-end;">
      <p style="font-size: 14px; margin-right: 10px; margin-left: auto;">Endeavor {{require('electron').remote.app.getVersion()}}</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {remote} from 'electron';
import keytar from 'keytar';
import sharedStore from '../store';
import Loader from '../components/Loader.vue';
import ChangeLogTicker from '../components/ChangeLogTicker.vue';

const {BrowserWindow} = remote;

export default {
  data() {
    return {
      sharedStore,
      message: "",
      messageClass: "",
      username: "",
      password: "",
      isLoading: false,
    };
  },
  name: 'Login',
  components: {
    Loader,
    ChangeLogTicker,
  },
  methods: {
    async submit() {
      this.$parent.$emit("login", this.username, this.password);
    },
    minimizeWindow() {
      BrowserWindow.getFocusedWindow().minimize();
    },
    maximizeWindow() {
      BrowserWindow.getFocusedWindow().maximize();
    },
    closeWindow() {
      BrowserWindow.getFocusedWindow().close();
    }
  }
}
</script>
