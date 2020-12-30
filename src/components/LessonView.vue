<template>
  <div>
    <div v-if="failedToLoad" class="nospacing emptylistplaceholder">
      <fai size="10x" icon="exclamation-circle" />
      <h1 style="font-weight: 400;">FAILED TO LOAD</h1>
      <p>There's nothing in this {{type.toLowerCase()}} yet, or you might not have the permissions to do so.</p>
    </div>
    <Loader v-else-if="pageData.length == 0" :text="loadText"/>
    <div v-else class="lesson-or-book-view">
      <div>
        <div style="display: flex; align-items: center;">
          <div class="nospacing" style="font-size: 1.2em; margin-right: 20px;">
            <h1 style="display: inline-block;">{{activePageNum+1}}</h1>
            <h3 style="font-weight: 300; display: inline-block;">/{{pageData.length}}</h3>
          </div>
          <h2 style="display: inline-block; font-weight: 400;">{{activePage.title.toUpperCase()}}</h2> 
        </div>
        <div :key="activePage.title">
          <p v-html="activePage.content"></p>
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
import { Bus } from '../main';

import sharedStore from '../store';
import Loader from './Loader.vue';
import TableOfContents from './TableOfContents.vue';

export default {
  name: "LessonView",
  created() {
    Bus.$on("get-book-or-lesson", () => {
      this.bootstrap()
    });
  },
  data() {
    return {
      sharedStore,
      loadText: "",
      pageData: [],
      activePage: {},
      activePageNum: -1,
      failedToLoad: false,
      navigationList: [],
    };
  },
  components: {
    Loader,
    TableOfContents,
  },
  props: ['course', 'id', 'type'],
  methods: {
    bootstrap() {
      console.log(`Getting data (${this.type})`);

      switch(this.type) {
        case "LESSON":
          this.get("LESSON", (msg) => {
            this.loadText = msg;
          });
          break;
        case "BOOK":
          this.get("BOOK", (msg) => {
            this.loadText = msg;
          });
          break;
        default:
          console.warn(`[LessonView] - type is neither lesson or book, this shouldn't happen`);
          break;
      }
    },
    async get(type, updateFunction) {
      // Reset
      this.pageData = [];
      this.activePage = {};
      this.activePageNum = -1;
      this.failedToLoad = false;
      this.navigationList = [];

      try {
        switch(type) {
          case "LESSON":
            this.pageData = await this.sharedStore.eLearn.getLessonPages(this.id, updateFunction);
            break;
          case "BOOK":
            this.pageData = await this.sharedStore.eLearn.getBookPages(this.course, this.id, updateFunction);
            break;
          default:
            console.warn(`[LessonView] - This should never happen! Type is neither lesson or book,\nbut this should have been checked earlier by beforeUpdate!`);
            return;
        }
      } catch(err) {
        console.warn(`[LessonView] failed to load data for ${this.type} ${this.id} - error ${err}`)
        this.failedToLoad = true;
        return;
      }

      if (!this.pageData) {
        console.warn(`[LessonView] failed to load data for ${this.type} ${this.id} - pageData does not exist ${this.pageData}`)
        this.failedToLoad = true;
        return;
      }

      // Pushing titles to the outline component
      this.pageData.map(page => this.navigationList.push(page.title));

      this.activePageNum = 0;
      this.updateActivePage();

      /*
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
      */
    },
    navigate(n, isRelative) {
      if (isRelative) {
        this.activePageNum = Math.abs((this.activePageNum+n)%this.pageData.length);
        this.updateActivePage();
      } else {
        this.activePageNum = n;
        this.updateActivePage();
      }
    },
    updateActivePage() {
      this.activePage = this.pageData[this.activePageNum];
    }
  },
};
</script>

<style>

</style>