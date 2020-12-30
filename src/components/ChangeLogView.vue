<template>
  <div>
    <div class="header">
      <div>
        <h1 class="nospacing light">✨ WHAT'S NEW?</h1>
        <p class="nospacing" style="margin-top: -7px;">A couple of changes happened to Endeavor!</p>
      </div>
    </div>
    <br>
    <div class="content">
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