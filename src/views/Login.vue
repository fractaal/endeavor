<template>
  <div class="loginBackground">
    <div class="center">
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
      <transition-group name="transition" mode="out-in">
        <Loader v-if="isLoading" key="load"/>
        <p v-if="message" :class="messageClass" key="msg">{{message}}</p>
      </transition-group>
    </div>
    <div class="footer" style="display: flex; align-items: flex-end;">
      <p style="font-size: 10px; margin-right: 10px; margin-left: auto;">Endeavor {{require('electron').remote.app.getVersion()}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import sharedStore from '../store';
import Loader from '../components/Loader.vue';

export default Vue.extend({
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
    Loader
  },
  methods: {
    async submit() {
      if (this.sharedStore.eLearn) {
        this.isLoading = true;
        this.message = "";
        const response = await this.sharedStore.eLearn.login(this.username, this.password);
        if (response) {
          this.$router.push('/home');
        } else {
          this.isLoading = false;
          this.message = "Login failed, try again.";
          this.messageClass = "";
        }
      }
    }
  }
});
</script>
