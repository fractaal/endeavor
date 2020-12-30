<template>
  <div style="margin: 20px; padding: 20px; background-color: rgba(0,0,0,0.1); border-radius: 20px; min-width: 30vw; max-width: 30vw;">
    <h3 class="nospacing" style="font-weight: 200;">COOL CHANGES ({{count+1}} of {{changelog.length}})</h3>
    <br>
    <transition name="ticker" mode="out-in">
      <div :key="title">
        <h2 class="nospacing attention">{{title.toUpperCase()}}</h2>
        <p class="nospacing">{{text}}</p>
      </div>

    </transition>
  </div>
</template>

<script>
import ChangeLog from "../changelog";

export default {
  name: "ChangeLogTicker",
  data() {
    return {
      changelog: ChangeLog,
      title: "",
      text: "",
      count: 0
    }
  },
  created() {
    this.count = 0;
    this.title = ChangeLog[this.count].title;
    this.text = ChangeLog[this.count].text;
    setInterval(() => {
      this.count++;
      if (this.count > ChangeLog.length-1) {this.count = 0}
      this.title = ChangeLog[this.count].title;
      this.text = ChangeLog[this.count].text;
    }, 7500)
  }
}
</script>

<style>

</style>