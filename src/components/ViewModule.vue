<template>
  <div>
    <loader v-if="!module" :text="`Loading module`"/>
    <div v-else style="margin-left: 50px; margin-top: 25px; margin-bottom: 10px; margin-right: 50px;">
      <div style="display: flex; justify-content: space-between;">
        <div style="max-width: 50%;">
          <h1 class="nospacing">{{module.name}}</h1> 
          <p class="nospacing">{{module['modnameformatted']}}</p>
        </div>
        <div style="display: flex;">
          <EndeavorButton @click="openExternalLink">🔎 Open in eLearn</EndeavorButton>
          <EndeavorButton @click="$router.push('/home/courses/'+module.courseid)">📚 See course</EndeavorButton>
          <EndeavorButton @click="$router.push('/home/courses/'+module.courseid+'/'+module.section)">📄 See section</EndeavorButton>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <div :class="module.styling" class="badge" v-if="module.duedateformatted">Due by {{module.duedateformatted}}</div>
          <div class="badge" v-if="module.timelimitformatted">{{module.timelimitformatted}}</div>
          <div class="badge" v-if="module.timeopenformatted">{{module.timeopenformatted}}</div>
          <div class="badge" v-if="module.timecloseformatted">{{module.timecloseformatted}}</div>
        </div>
        <grade v-if="module.grade" :grade="actualGrade" :maxGrade="module.grade" :id="module.instance" :modname="module.modname"/>
      </div>
      <hr>
    </div>
    <div style="margin-left: 50px; margin-right: 50px; overflow-y: scroll; max-height: 70vh;">
      <div class="level" v-if="module.intro">
        <p v-html="module.intro"/>
      </div>
      <br>
      <!-- If the module is a page... --> 
      <div v-if="module.modname == 'page'" >
        <div v-for="file in module.contents" :key="file.filename">
          <ContentView :type="file.mimetype" :link="file.fileurl" :token="sharedStore.session.token"/>
          <br>
        </div>
      </div>
      <br>

      <!-- If the module is a forum... -->
      <Discussions v-if="module.modname == 'forum'" :discussions="discussions"/>
      <br>
      <div v-if="module.introattachments && module.introattachments.length > 0">
        <h3>Attachments</h3>
        <card v-for="content in module.introattachments" :key="content.filename" 
        :title="content.filename"
        :subtitle="content.type"
        />
      </div>
      <br>
      <div class="level" v-if="sharedStore.settings.showDebugInfo">
        <div>
          <h3>Debug Data</h3>
          <pre>
            {{JSON.stringify(module, null, 2)}}
          </pre>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import sharedStore from '../store';

import Discussions from './Discussions.vue';
import ContentView from './ContentView.vue';
import Card from './Card.vue';
import Loader from './Loader.vue';
import EndeavorButton from './EndeavorButton.vue';

import Grade from './Grade.vue'; 
import { shell } from 'electron';


export default {
  name: "ViewModule",
  components: {
    Loader,
    Grade,
    Card,
    EndeavorButton,
    Discussions,
    ContentView,
  },
  data() {
    return {
      sharedStore,
      module: {},
      isLoading: false,
      actualGrade: 0,
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
      this.module = {};
      this.module = await this.sharedStore.eLearn.getModule(this.$route.params.course, this.$route.params.instance);
      this.actualGrade = Number((await this.sharedStore.eLearn.getActualGrade(this.module.modname, this.module.id)));

      // Get forum discussions if this specific module is of type forum.
      if (this.module.modname == "forum") {
        this.discussions = await this.sharedStore.eLearn.getForumDiscussions(this.module.id);
      }
    },
    openExternalLink() {
      shell.openExternal(this.module.url);
    }
  }
}
</script>

<style>

</style>