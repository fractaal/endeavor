<template>
  <div class="loginBackground">
    <div class="center">
      <img src="../assets/icon.png" style="display: block; width: 50%; margin-left: auto; margin-right: auto;">
      <h2>Endeavor</h2>
      <p style="margin-top: -25px;">Log in with your eLearn information</p>
      <form @submit.prevent="submit">
        <input v-model="username" type="text" placeholder="Username"/>
        <br>
        <input v-model="password" type="password" placeholder="Password"/>
        <div style="display: flex; align-items: flex-end;">
          <button type="button" style="margin-right: 5px; margin-left: auto;" class="roundButton">?</button>
          <button type="submit" class="roundButton">✔</button>
        </div>
      </form>
      <transition name="transition">
        <p v-if="message">{{message}}</p>
      </transition>
    </div>
    <div class="footer" style="display: flex; align-items: flex-end;">
      <p style="font-size: 10px; margin-right: 10px; margin-left: auto;">Endeavor {{require('electron').remote.app.getVersion()}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import sharedStore from '../store';

export default Vue.extend({
  data() {
    return {
      sharedStore,
      message: "",
      username: "",
      password: "",
    };
  },
  name: 'Login',
  methods: {
    async submit() {
      if (this.sharedStore.eLearn) {
        this.message = "";
        const response = await this.sharedStore.eLearn.login(this.username, this.password);
        if (response) {
          this.$router.push('/home');
        } else {
          this.message = "Login failed, try again.";
        }
      }
    }
  }
});
</script>
