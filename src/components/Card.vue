<template>
  <div :class="styling">
    <div class="cardUpper" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex; flex-direction: column;">
          <p style="font-weight: 800; margin: 0;">{{title}}</p>
          <p style="margin:0; font-weight: 400;">{{subtitle}}</p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <div style="display: flex; flex-direction: column;">
            <p style="font-weight: 800; margin: 0;">{{rightTitle}}</p>
            <p style="margin:0; font-weight: 400;">{{rightSubtitle}}</p>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end;">
        <div style="display: flex;">
          <div v-for="button in buttons" :key="button.name" class="buttonwithlabel">
            <button @click="Bus.$emit(button.event, id)" class="roundButton">{{button.icon}}</button>
            <p class="nospacing">{{button.name}}</p>
          </div>
          <div v-if="externalLink" class="buttonwithlabel">
            <button @click="openExternalLink" class="roundButton">🔬</button>
            <p class="nospacing">Open in eLearn...</p>
          </div>
          <div v-if="internalLink" class="buttonwithlabel">
            <button @click="$router.push(internalLink)" class="roundButton">🔍</button>
            <p class="nospacing">Open...</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bar" v-if="progress">
      <div class="load" :style="'width:'+progress+'%;'"></div>
    </div>
    <div class="cardLower" style="border-radius: 0px 0px 10px 10px; margin-top: 0;">
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex;">
          <p style="margin: 0;" v-html="content"></p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { Bus } from '../main';
import { shell } from 'electron';

export default {
  name: "Card",
  data() {
    return {
      Bus,
    }
  },
  props: {
    title: String,
    subtitle: String,
    rightTitle: String,
    rightSubtitle: String,
    buttons: Array,
    id: [String, Number],
    content: String,
    externalLink: String,
    internalLink: String,
    styling: String,
    progress: {
      validator: function(value) {
        return !!(typeof value == "number" || typeof value == "string");
      }
    },
  },
  methods: {
    openExternalLink(e) {
      e.preventDefault(); 
      shell.openExternal(this.externalLink);
    }
  }
}
</script>

<style>

</style>