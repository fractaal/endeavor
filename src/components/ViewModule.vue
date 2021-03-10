<template>
  <div>
    <loader v-if="isLoading"/>
    <div v-else>
      <div class="header">
          <!--
          <h1 v-if="module.name" class="light nospacing no-overflow">{{module.name.toUpperCase()}}</h1> 
          <p v-if="module.modnameformatted" class="light nospacing">{{module.modnameformatted.toUpperCase()}}</p>
          -->
        <div style="display: flex;">
          <EndeavorButton @click="openExternalLink">🔎 Open in eLearn</EndeavorButton>
          <EndeavorButton @click="$router.push('/courses/'+module.courseid)">📚 See course</EndeavorButton>
          <EndeavorButton @click="$router.push('/courses/'+module.courseid+'/'+module.section)">📄 See section</EndeavorButton>
          <EndeavorButton @click="openScratchpad">📒 Open scratchpad</EndeavorButton>
        </div>
      </div>
      <div class="content padded">
        <div>
          <div :class="module.styling" class="badge" v-if="module.duedateformatted">Due by {{module.duedateformatted}}</div>
          <div class="badge" v-if="module.timelimitformatted">{{module.timelimitformatted}}</div>
          <div class="badge" v-if="module.timeopenformatted">{{module.timeopenformatted}}</div>
          <div class="badge" v-if="module.timecloseformatted">{{module.timecloseformatted}}</div>
        </div>
        <grade v-if="module.grade" :isLoading="feedbackIsLoading" :grade="feedback.grade" :maxGrade="module.grade" :id="module.instance" :modname="module.modname"/>
      </div>
    </div>
    <hr>
    <div>
      <!-- Display feedback if it exists. The user wants to see this first. -->
      <card styling="warn" v-if="feedback.feedbackComments">
        <template v-slot:header>
          <div class="flex-row">
            <fai size="3x" icon="exclamation-circle"/>
            <h2 style="font-weight: 400;">FEEDBACK</h2>
          </div>
        </template>
        <template v-slot:content>
          <p v-html="feedback.feedbackComments"></p>
        </template>
      </card>
      <hr v-if="feedback.feedbackComments">

      <card v-if="module.intro">
        <template v-slot:header>
          <div class="flex-row">
            <fai size="3x" icon="question-circle"/>
            <h2 style="font-weight: 400;">DESCRIPTION</h2>
          </div>
        </template>
        <template v-slot:content>
          <p v-html="module.intro"/>
        </template>
      </card>
      <hr v-if="module.intro">
      
      <!-- If the module is a lesson... -->
      <LessonView v-if="module.modname =='lesson'" :course="$route.params.course" :type="'LESSON'" :id="module.instance"/>

      <!-- If the module is a book... -->
      <LessonView v-if="module.modname =='book'" :course="$route.params.id" :type="'BOOK'" :id="module.instance"/>

      <!-- If the module is a page... --> 
      <div v-if="module.modname == 'page'" >
        <div v-for="file in module.contents" :key="file.filename">
          <ContentView :filename="file.filename" :link="file.fileurl" :token="sharedStore.session.token"/>
          <br>
        </div>
      </div>

      <!-- If the module is a forum... -->
      <!-- Disable forum component for now 
      <div v-if="module.modname == 'forum'" style="margin: 20px;">
        <Discussions :discussions="discussions"/>
      </div>
      -->
      
      <div v-if="module.introattachments && module.introattachments.length > 0">
        <h3>Attachments</h3>
        <card v-for="content in module.introattachments" :key="content.filename" >
          <template v-slot:header>
            <div>
              <p style="font-weight: 800; margin: 10px 0 0 0;">{{content.filename}}</p>
              <p style="margin: 0;">{{content.mimetype}}</p>
            </div>
          </template>
          <template v-slot:buttons>
            <endeavor-button @click="openLink(content.fileurl)">🔻 Download</endeavor-button>
          </template>
        </card>
      </div>

      <card v-if="sharedStore.settings.showDebugInfo">
        <template v-slot:header>
          <div class="flex-row">
            <fai size="3x" icon="question-circle"/>
            <h2 style="font-weight: 400;">DEBUGGER</h2>
          </div>
        </template>
        <template v-slot:content>
          <pre>
            {{JSON.stringify(module, null, 2)}}
          </pre>
        </template>
      </card>

    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import sharedStore from '../store';

// import Discussions from './Discussions.vue';
import ContentView from './ContentView.vue';
import LessonView from './LessonView.vue';
import Card from './Card.vue';
import Loader from './Loader.vue';
import EndeavorButton from './EndeavorButton.vue';
import Grade from './Grade.vue'; 

import { shell } from 'electron';
import { Bus } from '@/main';


export default {
  name: "ViewModule",
  components: {
    Loader,
    Grade,
    Card,
    EndeavorButton,
    // Discussions,
    ContentView,
    LessonView,
  },
  data() {
    return {
      sharedStore,
      module: {},
      isLoading: false,
      feedbackIsLoading: false,
      feedback: {
        grade: 0,
      },
      discussions: [],
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getModule()
    })
  },
  methods: {
    async getModule() {
      // Waiting for module
      this.module = {};
      this.isLoading = true;
      this.module = await this.sharedStore.eLearn.getModule(this.$route.params.id, this.$route.params.instance);
      this.isLoading = false;

      // Grades
      this.feedbackIsLoading = true;
      this.feedback = Object.assign({}, this.feedback, await this.sharedStore.eLearn.getFeedback(this.module.modname, this.module.id));
      this.feedbackIsLoading = false;

      // Get forum discussions if this specific module is of type forum.
      if (this.module.modname == "forum") {
        this.discussions = await this.sharedStore.eLearn.getForumDiscussions(this.module.id);
      }

      // Tell LessonView / BookView to get lesson/book data if this specific module is of type lesson/book. 
      if (this.module.modname == "book" || this.module.modname == "lesson") {
        Bus.$emit('get-book-or-lesson');
      }
    },
    openExternalLink() {
      shell.openExternal(this.module.url);
    },
    openLink(url) {
      console.log(`Opening ${url}`);
      shell.openExternal(url);
    },
    openScratchpad() {
      Bus.$emit("open-scratchpad", this.module.id, this.module.name);
    }
  }
}
</script>

<style>

</style>