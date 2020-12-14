<template>
  <div>
    <h3>Discussions</h3>
    <div v-if="discussions.length == 0">
        <div class="nospacing emptylistplaceholder">
          <fai size="10x" icon="check-circle" />
          <h1 style="font-weight: 400;">No discussions yet</h1>
          <p>Nobody has posted anything here yet.</p>
        </div>
    </div>
    <Card v-for="discussion in discussions" :key="discussion.id"
      :content="discussion.message"
      :title="discussion.userfullname"
      :pictureurl="discussion.userpictureurl"
    /> 
  </div>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'Discussions',
  props: [
    "discussions"
  ],
  components: {
    Card
  },
}
</script>

<style>

</style>