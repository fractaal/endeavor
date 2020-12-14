<template>
  <div :class="styling">
    <div class="cardUpper" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex; justify-content: center; align-items: center;">
          <div v-if="pictureurl" style="margin-right: 10px;">
            <img :src="pictureurl" style="min-width: 60px; border-radius: 50%;"/>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="font-weight: 800; margin: 0;">{{title}}</p>
            <p style="margin:0; font-weight: 400;">{{subtitle}}</p>
          </div>
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
          <div v-for="button in buttons" :key="button.name">
            <EndeavorButton @click="Bus.$emit(button.event, id)">{{button.icon + ' ' + button.name}}</EndeavorButton>
          </div>
          <div v-if="externalLink" class="">
            <EndeavorButton @click="openExternalLink">🔬 Open in eLearn</EndeavorButton>
          </div>
          <div v-if="internalLink">
            <EndeavorButton @click="$router.push(internalLink)">🔍 Open</EndeavorButton>
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

import EndeavorButton from './EndeavorButton.vue';

export default {
  name: "Card",
  data() {
    return {
      Bus,
    }
  },
  components: {
    EndeavorButton
  },
  props: {
    title: String,
    subtitle: String,
    rightTitle: String,
    rightSubtitle: String,
    buttons: Array,
    pictureurl: String,
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