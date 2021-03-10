<template>
  <div class="theme app">
    <!--
    <transition name="modal">
      <Modal v-if="this.showModal" :show="this.showModal" :body="this.modalBody" :header="this.modalTitle" @close="showModal = false"/>
    </transition>
    -->
    <toast-provider/>
    <transition name="transition" mode="out-in">
      <keep-alive>
        <router-view name="default"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import sharedStore from './store';
import {ELearn} from './elearn';
import {initZoom} from './interface-scale';
import {initFont} from './fonts';
import keytar from 'keytar';
import {remote, ipcRenderer} from 'electron';

import ToastProvider from './components/ToastProvider.vue';

const data = remote.app.getPath("userData");

console.log("Data path: " + data);

export default {
  name: "Endeavor",
  data() {
    return {
      sharedStore,
      showModal: false,
    };
  },
  components: {
    ToastProvider,
  },
  async created () {
    // Initialize zoom level to the saved setting
    initZoom();

    // Set font to the saved setting
    initFont();
    
    // Show modal if ipcRenderer gets update-available event. 
    ipcRenderer.on("update-downloaded", (e, info) => {
      this.$toast.success(`New update downloaded! ${info.releaseName} 💖`, {timeout: 7500});
      this.$toast(`Update will be installed once you exit Endeavor.`, {timeout: 7500});
      this.sharedStore.updateAvailable = true;
    });
    

    // Creating new eLearn object in store...
    this.sharedStore.eLearn = new ELearn();
    this.sharedStore.fullPageLoadText = "Checking for existing config file..."

    // Automatic login functionality
    let credentials; let credential; let loginResult;
    if (this.sharedStore.settings.saveLogin) {
      credentials = await keytar.findCredentials("endeavor");
      credential = credentials[0];

      loginResult = await this.login(credential.account, credential.password);

      if (loginResult) {
        this.$router.push('/timeline');
      } else {
        this.$router.push('/login');
      }
    } else {
      this.$router.push('/login');
    }
    
    /*
    // Checking if endeavor.json file exists
    if (fs.existsSync(path.join(data, "endeavor.json"))) {
      endeavor = JSON.parse(fs.readFileSync(path.join(data, "endeavor.json"), {encoding: "utf8"}));

      // Filling any missing data on endeavor 
      for (const key in this.sharedStore.settings) {
        if (!endeavor[key]) {
          console.log(`${key} does not exist in pre-existing configuration file, falling back to default`);
          endeavor[key] = this.sharedStore.settings[key];
        }
      }

      this.sharedStore.settings = endeavor.settings;

      // Remove any insecure plaintext login information.
      if (endeavor.username) delete endeavor.username;
      if (endeavor.password) delete endeavor.password;
      fs.writeFileSync(path.join(data, "endeavor.json"), JSON.stringify(endeavor), {encoding: "utf8"});

      // Attempting an automatic login
      try {
        
        let credentials; let credential; let loginResult;
        if (this.sharedStore.settings.saveLogin) {
          credentials = await keytar.findCredentials("endeavor");
          credential = credentials[0];

          loginResult = await this.login(credential.account, credential.password);

          if (loginResult) {
            this.$router.push('/timeline');
          } else {
            this.$router.push('/login');
          }

        } else {
          console.log("❕ Not automatically logging in. saveLogin flag is false in preferences.")
          this.$router.push('/login');
        }
      } catch(err) {
        this.sharedStore.fullPageLoadText = "❌ App preference load error!"
        console.warn("An error occurred trying to initialize app preferences." + err);
        this.$router.push('/login');
      }
    } else {
      // If an existing preferences file doesn't exist, just push to login.
      this.$router.push('/login');
    }
    */

    this.sharedStore.fullPageLoadText = ""

    // If the login component wants to log in
    this.$on("login", async (username, password) => {
      if (await this.login(username, password)) {
        this.$router.push('/timeline');
      } else {
        this.$router.push('/login');
      }
    })
  },
  methods: {
    async login(username, password) {
      this.$router.push('/load');
      this.sharedStore.fullPageLoadLog = [];
      let loginResult;
      try {
        this.sharedStore.fullPageLoadText = "LOGGING YOU IN"

        loginResult = await this.sharedStore.eLearn.login(username, password, log => {
          this.sharedStore.fullPageLoadLog.push({text: log, time: Date.now()});
        });
      } catch(err) {
        this.sharedStore.fullPageLoadText = "❌ Login failed!"
        console.warn("An error occured trying to retrieve login credentials: " + err);
        return false;
      }
      
      if (loginResult) {
        this.sharedStore.fullPageLoadText = "WELCOME!"
        await keytar.setPassword("endeavor", username, password);
        console.log("Login success");
        await new Promise(r => setTimeout(r, 1500));
        return true;
      } else {
        this.sharedStore.fullPageLoadText = "❌ Login failed!"
        console.warn("Automatic login failed!");
        return false;
      }
    }
  }

};

</script>

<style>
  @import './assets/styles.css';
</style>
