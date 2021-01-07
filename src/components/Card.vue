<template>
  <div :class="styling">
    <div class="cardUpper" style="border-radius: 2px 2px 0px 0px; margin-bottom: 0;">
      <slot name="header">
      </slot>
      
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
          <slot name="buttons">
          </slot>
        </div>
      </div>
    </div>
    <div class="bar" v-if="progress">
      <div class="load" :style="'width:'+progress+'%;'"></div>
    </div>
    <div class="cardLower" style="border-radius: 0px 0px 2px 2px; margin-top: 0;">
      <div style="display: flex; justify-content: space-between;">
        <slot name="content"/>
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
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    rightTitle: {
      type: String,
      required: false,
    },
    rightSubtitle: {
      type: String,
      required: false,
    },
    buttons: {
      type: Array,
      required: false,
    },
    pictureurl: {
      type: String,
      required: false,
    },
    id: {
      type: [String, Number],
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    externalLink: {
      type: String,
      required: false,
    },
    internalLink: {
      type: String,
      required: false,
    },
    styling: {
      type: String,
      required: false,
    },
    progress: {
      required: false,
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