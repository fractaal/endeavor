<template>
  <div>
    <div class="centered">
      <br />
      <img src="@/assets/icon_bw.png" class="logo" />
      <h1 class="light">
        ENDEAVOR
        {{
          require("@electron/remote").app.getVersion() == "4.2.0"
            ? "420 🌱"
            : require("@electron/remote").app.getVersion()
        }}
      </h1>
      <h3 class="light" style="margin-top: -20px;">
        Made with 💖 from
        <a href="https://twitter.com/benjuuude">benjuuude</a> — Problems? Open
        an
        <a href="https://github.com/fractaal/endeavor/issues"
          >issue on GitHub</a
        >
      </h3>
    </div>
    <div class="content">
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">
        APPEARANCE
      </h3>
      <hr />
      <div class="settings-section">
        <div>
          <div>
            <h2 class="nospacing" style="font-weight: 400;">THEME</h2>
            <p class="nospacing">Choose from a variety of themes!</p>
          </div>
          <div class="theme-select">
            <ul>
              <li
                v-for="theme in sharedStore.themes"
                :key="theme.displayName"
                @click="theme.setActive()"
                :class="
                  theme.displayName == sharedStore.settings.theme
                    ? 'active'
                    : ''
                "
              >
                <div>
                  <div style="display: flex;">
                    <h2>{{ theme.displayName }}</h2>
                    <h2
                      style="font-weight: 200; opacity: 0.5; padding-left: 7px;"
                    >
                      — {{ theme.author }}
                    </h2>
                  </div>
                  <span>
                    <p style="font-weight: 200; opacity: 0.5;">
                      VERSION {{ theme.version.toUpperCase() }}
                    </p>
                    <p style="font-weight: 200;">
                      {{ theme.type.toUpperCase() }} THEME
                    </p>
                    <p
                      style="font-weight: 200;"
                      v-if="sharedStore.settings.theme == theme.displayName"
                    >
                      ACTIVE THEME
                    </p>
                  </span>
                  <p
                    style="font-weight: 700; opacity: 0.5;"
                    v-if="
                      version != theme.endeavorVersion &&
                        theme.isDefault !== 'yes'
                    "
                  >
                    MAY BE INCOMPATIBLE ({{ version }} ≠
                    {{ theme.endeavorVersion }})
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <a href="#" @click="openThemeFolder">Open theme folder</a>
        </div>
        <div>
          <div>
            <h2 class="nospacing" style="font-weight: 400;">FONT</h2>
            <p class="nospacing">
              Change the current font face. This feature may require an internet
              connection <i>(If you're using Google Fonts.)</i>
            </p>
          </div>
          <br />
          <div style="display: flex; align-items: center;">
            <form @submit.prevent="setFont">
              <input type="text" v-model="font" />
            </form>
            <button class="roundButton" @click="resetFont">
              <fai icon="redo" />
            </button>
          </div>
        </div>
        <div>
          <div>
            <h2 class="nospacing" style="font-weight: 400;">INTERFACE SCALE</h2>
            <p class="nospacing">
              Change interface scaling.
            </p>
          </div>
          <br />
          <div style="display: flex; align-items: center;">
            <button @click="decreaseZoom" class="roundButton">
              <fai icon="minus" />
            </button>
            <h2 style="margin: 0px 15px 0px 15px;">
              {{ (sharedStore.settings.zoomLevel * 100).toFixed(0) }}%
            </h2>
            <button
              style="margin-right: 5px;"
              @click="increaseZoom"
              class="roundButton"
            >
              <fai icon="plus" />
            </button>
            <button
              style="margin-right: 20px;"
              class="roundButton"
              @click="resetZoom"
            >
              <fai icon="redo" />
            </button>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <div class="toggle">
            <input
              type="checkbox"
              class="check"
              v-model="sharedStore.settings.showActivityDescriptionsOnCards"
            />
            <b class="b switch"></b>
            <b class="b track"></b>
          </div>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">
              SHOW ACTIVITY DESCRIPTIONS
            </h2>
            <p class="nospacing">
              Show activity descriptions in their preview cards.
              <br /><br />
              If you have many long activities, turning this off may reduce the
              time spent scrolling.
            </p>
          </div>
        </div>
        <div>
          <div>
            <h2 class="nospacing" style="font-weight: 400;">ACTIVITY VIEW</h2>
            <p class="nospacing">
              Choose between 1-column view or 2-column view for courses.
              <br /><br />
              If you have many long activities, switching to 2-column view may
              help.
            </p>
          </div>
          <br />
          <div style="display: flex; align-items: center;">
            <endeavor-button
              :styling="
                sharedStore.settings.numColumnsInCourseView == 1 ? 'active' : ''
              "
              @click="setToOneColumn"
              >1 column</endeavor-button
            >
            <endeavor-button
              :styling="
                sharedStore.settings.numColumnsInCourseView == 2 ? 'active' : ''
              "
              @click="setToTwoColumns"
              >2 columns</endeavor-button
            >
          </div>
        </div>
      </div>
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">
        BEHAVIOUR
      </h3>
      <hr />
      <div class="settings-section">
        <div style="display: flex; align-items: center;">
          <div class="toggle">
            <input
              type="checkbox"
              class="check"
              v-model="sharedStore.settings.autoUpdateData"
            />
            <b class="b switch"></b>
            <b class="b track"></b>
          </div>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">
              AUTOMAGICALLY UPDATE COURSE DATA
            </h2>
            <p class="nospacing">
              Automatically update eLearn data every time Endeavor starts.<br /><br />
              <i
                >If you disable this, new courses or modules will not pop up in
                eLearn unless you manually click "<b>Refresh</b>" in
                <router-link to="/notifications">Notifications.</router-link></i
              >
            </p>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <div class="toggle">
            <input
              type="checkbox"
              class="check"
              v-model="sharedStore.settings.saveLogin"
            />
            <b class="b switch"></b>
            <b class="b track"></b>
          </div>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">AUTOMAGIC LOGIN</h2>
            <p class="nospacing">
              Saves your login details and automatically logs you in on any
              future Endeavor session.
            </p>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <div class="toggle">
            <input
              type="checkbox"
              class="check"
              v-model="sharedStore.settings.loadHiddenCourseData"
            />
            <b class="b switch"></b>
            <b class="b track"></b>
          </div>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">
              LOAD DATA FOR HIDDEN COURSES
            </h2>
            <p class="nospacing">
              To improve load time, Endeavor (by default) won't load data for
              courses you've hidden.<br />If you don't like this behavior, turn
              this on.<br /><br /><i
                >This option will prolong your load time.</i
              >
            </p>
          </div>
        </div>
      </div>
      <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">
        DATA
      </h3>
      <hr />
      <div class="settings-section">
        <div style="display: flex; align-items: center;">
          <button @click="purgeLoginData" class="roundButton">
            <fai icon="broom" />
          </button>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">
              REMOVE LOGIN DATA
            </h2>
            <p class="nospacing">
              Endeavor saves your login details for automatic login. To purge
              this data, click this button.
            </p>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <button @click="resetEndeavor" class="roundButton">
            <fai icon="power-off" />
          </button>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">RESET ENDEAVOR</h2>
            <p class="nospacing">
              Endeavor, due to its nature of being a Beta program
              <i>(and also because it's developed by a dumbass)</i> can
              break.<br />A quick and easy fix for most issues is a
              configuration reset.
            </p>
          </div>
        </div>
        <br />
        <h3 class="nospacing" style="margin-left: 10px; font-weight: 200;">
          DEVELOPER
        </h3>
        <hr />
        <div style="display: flex; align-items: center;">
          <div class="toggle">
            <input
              type="checkbox"
              class="check"
              v-model="sharedStore.settings.showDebugInfo"
            />
            <b class="b switch"></b>
            <b class="b track"></b>
          </div>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">
              DISPLAY DEBUG INFORMATION
            </h2>
            <p class="nospacing">
              Display <i>complicated and very ugly</i> debug information such as
              current route open, route parameters and forum information.<br />Don't
              turn this on if you don't want ugly things!
            </p>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <button @click="$router.push('/console')" class="roundButton">
            <fai icon="terminal" />
          </button>
          <div style="margin-left: 25px;">
            <h2 class="nospacing" style="font-weight: 400;">
              DISPLAY DEBUG CONSOLE
            </h2>
            <p class="nospacing">
              Display the internal debug console that reports any errors that
              might have happened.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import keytar from "keytar";
import { shell } from "electron";
import path from "path";
import fs from "fs";

import EndeavorButton from "../components/EndeavorButton.vue";

import { reset as resetHiddenCourses } from "../course-presentation";
import { increaseZoom, decreaseZoom, resetZoom } from "../interface-scale";
import { save as saveSettings } from "../settings";
import { setFont, resetFont, getFont } from "../fonts";
import { setToOneColumn, setToTwoColumns } from "../columns";

import sharedStore from "../store";

import * as remote from "@electron/remote";

const data = remote.app.getPath("userData");

export default {
  name: "Settings",
  components: {
    EndeavorButton,
  },
  data() {
    return {
      sharedStore,
      font: "",
      version: remote.app.getVersion(),
    };
  },
  beforeRouteLeave(to, from, next) {
    try {
      saveSettings(sharedStore.settings);
      console.log("✅ Settings autosave success");
    } catch (err) {
      console.warn(
        "❌ Error occured trying to write to the preferences file." + err
      );
    } finally {
      next();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getFont();
    });
  },
  methods: {
    openThemeFolder() {
      shell.openItem(path.join(data, "/themes"));
    },
    setToOneColumn() {
      setToOneColumn();
    },
    setToTwoColumns() {
      setToTwoColumns();
    },
    getFont() {
      this.font = getFont();
    },
    setFont() {
      setFont(this.font);
      this.font = getFont();
    },
    resetFont() {
      resetFont();
      this.font = getFont();
    },
    increaseZoom() {
      increaseZoom();
    },
    decreaseZoom() {
      decreaseZoom();
    },
    resetZoom() {
      resetZoom();
    },
    async purgeLoginData() {
      const response = remote.dialog.showMessageBoxSync({
        message:
          "Do you really want to clear login data? Endeavor will forget your username and password.",
        buttons: ["Yes", "No"],
      });
      if (response == 0) {
        resetHiddenCourses();
        try {
          this.sharedStore.settings.saveLogin = false;
          const credentials = await keytar.findCredentials("endeavor");
          credentials.map(async (credential) => {
            await keytar.deletePassword("endeavor", credential.account);
          });
          remote.dialog.showMessageBox({
            title: "Complete!",
            message: "Login data purge complete!",
          });
        } catch (err) {
          remote.dialog.showErrorBox("Error occured clearing login data.", err);
        }
      } else {
        remote.dialog.showMessageBox({
          title: "Cancelled",
          message: "Login data purge cancelled.",
        });
      }
    },
    resetEndeavor() {
      const response = remote.dialog.showMessageBoxSync({
        message:
          "Do you really want to reset Endeavor? You won't lose any important data, just how Endeavor is set up, such as theming and hidden courses.",
        buttons: ["Yes", "No"],
      });
      if (response == 0) {
        if (fs.existsSync(path.join(data, "endeavor.json"))) {
          try {
            fs.unlinkSync(path.join(data, "endeavor.json"));
            remote.dialog.showMessageBox({
              title: "Complete!",
              message: "Endeavor configuration reset complete!",
            });
          } catch (error) {
            remote.dialog.showErrorBox(
              "Error occured resetting Endeavor!",
              error
            );
          }
        } else {
          remote.dialog.showErrorBox(
            "Error occured resetting Endeavor! The configuration file does not exist."
          );
        }
      } else {
        remote.dialog.showMessageBox({
          title: "Cancelled",
          message: "Endeavor reset cancelled.",
        });
      }
    },
  },
};
</script>

<style></style>
