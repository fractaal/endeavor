<template>
  <div>
    <div class="header">
      <div>
        <h2 class="nospacing light">✨ A couple of changes happened to Endeavor!</h2>
      </div>
    </div>
    <br>
    <div class="content padded">
      <div v-for="changelog in changelogs" :key="changelog.title">
        <div class="level" style="display: flex; flex-direction: column; padding: 40px 60px;">
          <h2 class="nospacing" style="font-weight: 300;">{{changelog.title.toUpperCase()}}</h2>
          <p class="nospacing">{{changelog.text}}</p>
        </div>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import changelogs from '../changelog.ts';

export default {
  name: "ChangeLogView", 
  data() {
    return {
      changelogs
    }
  }
}
</script>

<style>

</style>