<template>
  <div>
    <div class="header">
      <div style="display: flex; width: 100%">
        <input
          ref="search"
          v-model="search"
          type="text"
          placeholder="TYPE HERE..."
          class="seamless"
        />
      </div>
    </div>
    <div class="content padded">
      <transition-group name="transition" mode="out-in">
        <div v-if="sharedStore.userDoneTypingOnSearch" :key="`content`">
          <div class="cardlist">
            <transition-group name="transition">
              <module-card
                v-for="module in sharedStore.searchResults.moduleResults"
                :module="module"
                :key="module.instance"
              >
                <template v-slot:extra>
                  <div class="flex-row">
                    <p style="margin-right: 10px">In</p>
                    <span
                      style="display: flex; align-items: center; margin: 0; padding: 0"
                      v-for="PathData in resolve(
                        `/courses/${module.courseid}/${module.section}/${module.instance}`
                      )"
                      :key="PathData.name"
                    >
                      <router-link :to="PathData.path" style="padding: 0; margin: 0">
                        {{ PathData.name }}
                      </router-link>
                      <p style="padding: 0; margin: 0 10px 0 10px; opacity: 0.5">></p>
                    </span>
                  </div>
                </template>
              </module-card>
            </transition-group>
            <hr />
            <transition-group name="transition">
              <section-card
                v-for="section in sharedStore.searchResults.sectionResults"
                :key="section.id"
                :section="section"
                :course="{ id: section.courseid }"
                :internalLink="`/courses/${section.courseid}/${section.section}`"
              >
                <template v-slot:extra>
                  <div class="flex-row">
                    <p style="margin-right: 10px">In</p>
                    <span
                      style="display: flex; align-items: center; margin: 0; padding: 0"
                      v-for="PathData in resolve(
                        `/courses/${section.courseid}/${section.section}`
                      )"
                      :key="PathData.name"
                    >
                      <router-link :to="PathData.path" style="padding: 0; margin: 0">
                        {{ PathData.name }}
                      </router-link>
                      <p style="padding: 0; margin: 0 10px 0 10px; opacity: 0.5">></p>
                    </span>
                  </div>
                </template>
              </section-card>
            </transition-group>
          </div>
        </div>
        <loader v-else :text="`WAITING FOR YOU...`" :key="`loader`" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { resolve } from "@/elearn/path-resolution";
import sharedStore from "@/store";
import SectionCard from "@/components/SectionCard.vue";
import ModuleCard from "@/components/ModuleCard.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "Search",
  components: {
    SectionCard,
    Loader,
    ModuleCard,
  },
  data() {
    return {
      sharedStore,
      search: "",
      resolve,
    };
  },
  watch: {
    search: function (value) {
      this.sharedStore.search = value;
      if (this.$route.name == "Search") {
        if (this.sharedStore.searchTimer) {
          clearTimeout(this.sharedStore.searchTimer);
          this.sharedStore.userDoneTypingOnSearch = false;
          this.sharedStore.searchTimer = null;
        }
        this.sharedStore.searchTimer = setTimeout(() => {
          this.sharedStore.userDoneTypingOnSearch = true;
          this.sharedStore.searchResults = this.sharedStore.searchFunction(
            this.sharedStore.search
          );
        }, 500);
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        vm.$refs.search.focus();
      });
    });
  },
};
</script>

<style></style>
