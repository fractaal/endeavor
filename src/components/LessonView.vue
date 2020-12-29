<template>
  <div>
    <div v-if="failedToLoad" class="nospacing emptylistplaceholder">
      <fai size="10x" icon="exclamation-circle" />
      <h1 style="font-weight: 400;">FAILED TO LOAD</h1>
      <p>There's nothing in this lesson yet, or you might not have the permissions to do so.</p>
    </div>
    <Loader v-else-if="pages.length == 0" text="LOADING LESSON..."/>
    <div v-else class="lesson-or-book-view">
      <div>
        <div style="display: flex; align-items: center;">
          <div class="nospacing" style="font-size: 1.2em; margin-right: 20px;">
            <h1 style="display: inline-block;">{{activePageNum+1}}</h1>
            <h3 style="font-weight: 300; display: inline-block;">/{{pages.length}}</h3>
          </div>
          <h2 style="display: inline-block; font-weight: 400;">{{activePage.page.title.toUpperCase()}}</h2> 
        </div>
        <div :key="activePage.page.title">
          <p v-html="activePage.page.contents"></p>
        </div>
        <br>
        <div style="position: fixed; bottom: 0;">
          <div style="display: flex;">
            <div style="padding: 20px;">
              <button class="roundButton floating" @click="navigate(-1, true)"><fai icon="arrow-left"/></button>
              <button style="margin-left: 10px;" class="roundButton floating" @click="navigate(1, true)"><fai icon="arrow-right"/></button>
            </div>
          </div>
        </div>
      </div>
      <TableOfContents :list="navigationList" :activeitem="activePageNum" @navigation="navigate"/>
    </div>
  </div>
</template>

<script>
import sharedStore from '../store';
import Loader from './Loader.vue';
import TableOfContents from './TableOfContents.vue';

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
      navigationList: [],
    };
  },
  components: {
    Loader,
    TableOfContents,
  },
  props: ['lessonid'],
  methods: {
    async getLesson() {
      this.pages = await this.sharedStore.eLearn.getLessonPages(this.lessonid);
      if (this.pages) {
        for (const page of this.pages) {
          this.navigationList.push(page.page.title);
        }
        this.activePage = this.pages[0];
        this.activePageNum = 0;
        this.updateActivePage();
      } else {
        this.failedToLoad = true;
      }
    },
    navigate(n, isRelative) {
      if (isRelative) {
        this.activePageNum = Math.abs((this.activePageNum+n)%this.pages.length);
        this.updateActivePage();
      } else {
        this.activePageNum = n;
        this.updateActivePage();
      }
    },
    updateActivePage() {
      this.activePage = this.pages[this.activePageNum];
    }
  },
};
</script>

<style>

</style>