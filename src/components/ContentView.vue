<template>
  <div>
    <div class="level">
      <transition-group name="transition" mode="out-in">
        <Loader v-if="isLoading" text="Loading page data..." key="loader"/>
        <div v-if="!isLoading" key="content">
          <img v-if="type == 'image/png'" :src="modifiedLink" style="max-width: 100% !important; height: auto; border-radius: 5px; margin: 5px;">
          <embed v-else-if="type == 'application/pdf'" :src="modifiedLink" style="max-width: 100% !important; height: auto;"/> 
          <p v-else v-html="content"></p>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { transformUrlWithoutChangingBaseURL } from '@/elearn/content-presentation';
import {getPageHtml} from '../elearn/page-module'
import Loader from './Loader.vue';

export default {
  name: "ContentView",
  props: ['link', 'token', 'type'],
  components: {
    Loader
  },
  data() {
    return {
      isLoading: false,
      content: '',
      modifiedLink: '',
    }
  },
  async created() {
    this.isLoading = true;
    this.modifiedLink = await transformUrlWithoutChangingBaseURL(this.link, this.token);
    this.content = await getPageHtml(this.link, this.token);
    this.isLoading = false; 
  }
}
</script>

<style>

</style>