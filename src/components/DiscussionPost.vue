<template>
  <div>
    <card>
      <template v-slot:header>
        <div class="flex-row">
          <img :src="discussion.author.urls.profileimage" style="border-radius: 50%; margin-right: 10px; width: 50px;">
          <div>
            <p class="nospacing" style="font-weight: 800;">{{discussion.author.fullname}}</p>
            <p class="nospacing">{{discussion.subject}}</p>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div style="margin: 5px 20px;" v-html="discussion.message"></div>
      </template>
    </card> 
    <div style="margin-left: 20px;">
      <discussion-post v-for="discussion in discussion.children" :key="discussion.id" :discussion="discussion"/>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';

export default {
  name: "DiscussionPost",
  props: ['discussion'],
  components: { Card }
}
</script>

<style>

</style>