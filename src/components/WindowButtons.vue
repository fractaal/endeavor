<template>
  <div class="windowbuttons">
    <div style="display: flex;">
      <!-- Nav buttons were supposed to be here. They look horrible. -->
    </div>
    <div style="display: flex;">
      <div @click="minimizeWindow" class="windowbutton"><img class="windowbutton-img" src="@/assets/min.png"/></div>
      <div v-if="maximized" @click="maximizeWindow" class="windowbutton"><img class="windowbutton-img" src="@/assets/max.png"/></div>
      <div v-else @click="maximizeWindow" class="windowbutton"><img class="windowbutton-img" src="@/assets/max2.png"/></div>
      <div @click="closeWindow" class="windowbutton"><img class="windowbutton-img windowbutton-close" src="@/assets/close.png"/></div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';

export default {
  name: "WindowButtons",
  data() {
    return {
      maximized: false,
    }
  },
  methods: {
    minimizeWindow() {
      remote.BrowserWindow.getFocusedWindow().minimize();
    },
    maximizeWindow() {
      if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
        this.maximized = false;
        remote.BrowserWindow.getFocusedWindow().unmaximize();
      } else {
        this.maximized = true;
        remote.BrowserWindow.getFocusedWindow().maximize();
      }
    },
    closeWindow() {
      remote.BrowserWindow.getFocusedWindow().close();
    },
  }
}

</script>