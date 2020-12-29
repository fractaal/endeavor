<template>
  <div>
    <div v-if="failedToLoad" class="nospacing emptylistplaceholder">
      <fai size="10x" icon="exclamation-circle" />
      <h1 style="font-weight: 400;">FAILED TO LOAD</h1>
      <p>Something scary happened while trying to load this book.<br>Trying again might help!</p>
    </div>
    <Loader v-else-if="pages.length == 0" text="LOADING BOOK..."/>
    <div v-else class="lesson-or-book-view">
      <div>
        <div style="display: flex; align-items: center;">
          <div class="nospacing" style="font-size: 1.2em; margin-right: 20px;">
            <h1 style="display: inline-block;">{{activePageNum+1}}</h1>
            <h3 style="font-weight: 300; display: inline-block;">/{{pages.length}}</h3>
          </div>
          <h2 style="display: inline-block; font-weight: 400;">{{activePage.title.toUpperCase()}}</h2> 
        </div>
        <div :key="activePage.title">
          <p v-html="activePage.content"></p>
          <span style="min-height: 25px;"></span>
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
  name: "BookView",
  created() {
    this.getBook();
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
  props: ['bookid', 'courseid'],
  methods: {
    async getBook() {
      this.pages = await this.sharedStore.eLearn.getBookPages(this.courseid, this.bookid);
      if (this.pages) {
        for (const page of this.pages) {
          this.navigationList.push(page.title);
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