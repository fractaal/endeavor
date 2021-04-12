<template>
  <div>
    <div class="flex-row" style="justify-content: space-between;">
      <h3 style="font-weight: 400;">DISCUSSIONS</h3>
      <endeavor-button v-if="canPost" style="padding: 15px; margin: 0;">✨ New post</endeavor-button>
    </div>
    <transition-group name="transition" mode="out-in">
      <div v-if="!loading && discussions && discussions.length == 0" key="1">
          <div class="nospacing emptylistplaceholder">
            <fai size="10x" icon="check-circle" />
            <h1 style="font-weight: 400;">No discussions yet</h1>
            <p>Nobody has posted anything here yet.</p>
          </div>
      </div>
      <Loader v-if="loading" key="2"/>
      <div v-else style="overflow-y: auto;" key="3">
        <div v-for="discussion in discussions" :key="discussion.id">
          <discussion-post :discussion="discussion"/>
          <hr style="margin: 30px 0px"/>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { canPost, getDiscussions } from '@/elearn/forums';
import EndeavorButton from './EndeavorButton.vue';
import DiscussionPost from './DiscussionPost.vue';
import Loader from './Loader.vue';

export default {
  name: 'Discussions',
  props: [
    "module"
  ],
  async mounted() {
    this.loading = true;
    this.canPost = await canPost(this.module);
    this.discussions = await getDiscussions(this.module);
    this.loading = false;
  },
  components: {
    DiscussionPost, EndeavorButton, Loader
  },
  data() {
    return {
      loading: false,
      canPost: false,
      discussions: [],
    }
  }
}
</script>

<style>

</style>