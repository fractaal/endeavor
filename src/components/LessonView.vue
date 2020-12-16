<template>
  <div>
    <div v-if="failedToLoad" class="nospacing emptylistplaceholder">
      <fai size="10x" icon="exclamation-circle" />
      <h1 style="font-weight: 400;">FAILED TO LOAD</h1>
      <p>There's nothing in this lesson yet, or you might not have the permissions to do so.</p>
    </div>
    <Loader v-else-if="pages.length == 0" text="LOADING LESSON..."/>
    <div v-else>
      <h2 style="font-weight: 400;">{{activePage.page.title.toUpperCase()}} ({{activePageNum+1}}/{{pages.length}})</h2>
        <transition-group name="transition" mode="out-in">
          <div class="level" :key="activePage.page.title" style="max-height: 60vh; overflow-y: auto;">
            <p v-html="activePage.page.contents"></p>
          </div>
        </transition-group>
      <br>
      <div style="position: fixed; bottom: 0;">
      <div style="display: flex;">
        <div style="padding: 20px;">
          <button class="roundButton" @click="navigate(-1)"><fai icon="arrow-left"/></button>
          <button style="margin-left: 10px;" class="roundButton" @click="navigate(1)"><fai icon="arrow-right"/></button>
        </div>
      </div>
      </div>

    </div>
  </div>
</template>

<script>
import sharedStore from '../store';
import Loader from './Loader.vue';

export default {
  name: "LessonView",
  created() {
    this.getLesson();
  },
  data() {
    return {
      sharedStore,
      activePage: {},
      activePageNum: -1,
      pages: [],
      failedToLoad: false,
    };
  },
  components: {
    Loader
  },
  props: ['lessonid'],
  methods: {
    async getLesson() {
      this.pages = await this.sharedStore.eLearn.getLessonPages(this.lessonid);
      if (this.pages) {
        this.activePage = this.pages[0];
        this.activePageNum = 0;
        this.updateActivePage();
      } else {
        this.failedToLoad = true;
      }
    },
    navigate(n) {
      this.activePageNum = Math.abs((this.activePageNum+n)%this.pages.length);
      this.updateActivePage();
    },
    updateActivePage() {
      this.activePage = this.pages[this.activePageNum];
    }
  },
};
</script>

<style>

</style>