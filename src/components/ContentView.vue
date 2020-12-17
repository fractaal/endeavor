<template>
  <div>
    <div class="level">
      <transition-group name="transition" mode="out-in">
        <Loader v-if="isLoading" text="LOADING CONTENT" key="loader"/>
        <div v-if="!isLoading" key="content">
          <img v-if="extension == '.png' || extension == '.jpg' || extension == '.jpeg' || extension == '.gif'" :src="modifiedLink" style="max-width: 100% !important; height: auto; border-radius: 5px; margin: 5px;">
          <p v-else-if="extension == '.html'" v-html="content"></p>
          <div v-else><a :href="modifiedLink">{{link}}</a></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import path from 'path'; 
import { transformUrlWithoutChangingBaseURL } from '@/elearn/content-presentation';
import {getPageHtml} from '../elearn/page-module'
import Loader from './Loader.vue';

export default {
  name: "ContentView",
  props: ['link', 'token', 'filename'],
  components: {
    Loader
  },
  data() {
    return {
      isLoading: false,
      content: '',
      modifiedLink: '',
      extension: '',
    }
  },
  async created() {
    this.extension = path.extname(this.filename);
    this.isLoading = true;
    this.modifiedLink = await transformUrlWithoutChangingBaseURL(this.link, this.token);
    if (this.extension == ".html") {
      this.content = await getPageHtml(this.link, this.token);
    }
    this.isLoading = false; 
  }
}
</script>

<style>

</style>