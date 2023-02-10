<template>
  <div class="loginBackground">
    <window-buttons />
    <div style="height: 10vh;"></div>
    <!-- To knock the entire form downards. -->
    <div style="display: flex; justify-content: center; align-items: center;">
      <div>
        <img
          src="../assets/icon.png"
          style="display: block; width: 300px; margin-left: auto; margin-right: auto;"
        />
        <h1 class="light">ENDEAVOR</h1>
        <h3 style="margin-top: -25px; font-weight: 300;">
          Log in with your eLearn information
        </h3>
        <form @submit.prevent="submit">
          <input v-model="username" type="text" placeholder="Username" />
          <br />
          <input v-model="password" type="password" placeholder="Password" />
          <br /><br />
          <div style="display: flex; align-items: center;">
            <checkbox v-model="sharedStore.settings.saveLogin" />
            <p>Remember me</p>
          </div>
          <div style="display: flex; align-items: flex-end;">
            <button
              type="submit"
              style="margin-right: 0px; margin-left: auto;"
              class="roundButton"
            >
              <fai size="lg" icon="check" />
            </button>
          </div>
        </form>
      </div>
      <div style="display: flex; flex-direction: column;">
        <ChangeLogTicker />
        <h3
          style="margin: 20px;"
          v-if="sharedStore.fullPageLoadText"
          :class="messageClass"
          key="msg"
        >
          {{ sharedStore.fullPageLoadText }}
        </h3>
      </div>
    </div>
    <div class="footer" style="display: flex; align-items: flex-end;">
      <p style="font-size: 14px; margin-right: 10px; margin-left: auto;">
        Endeavor {{ require("@electron/remote").app.getVersion() }}
      </p>
    </div>
  </div>
</template>

<script>
import sharedStore from "../store";

import Checkbox from "@/components/Checkbox.vue";
import ChangeLogTicker from "@/components/ChangeLogTicker.vue";
import WindowButtons from "@/components/WindowButtons.vue";

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
  name: "Login",
  components: {
    ChangeLogTicker,
    Checkbox,
    WindowButtons,
  },
  methods: {
    async submit() {
      this.$parent.$emit("login", this.username, this.password);
    },
  },
};
</script>
