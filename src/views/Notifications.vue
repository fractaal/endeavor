<template>
  <div>
    <div class="header">
      <endeavor-button @click="sharedStore.eLearn.updateCacheAndNotify()"><fai icon="redo-alt" style="margin-right: 10px;"/>Refresh</endeavor-button>
    </div>
    <div class="content padded">
      <div class="cardlist">
        <div style="margin-bottom: 250px;">
          <div class="separator"><h2 class="light">JUST IN</h2></div>
          <loader text="GETTING IN TOUCH..." v-if="sharedStore.eLearn.notificationsStatus.isLoading"/>
          <icon-with-text :icon="'exclamation-circle'" v-if="sharedStore.eLearn.notificationsStatus.isFailed">
            <template v-slot:title>
              WHOOPS
            </template>
            <template v-slot:subtitle>
              Something happened and notifications failed to load.<br>
              Perhaps you could try again?
            </template>
          </icon-with-text>
          <icon-with-text 
          :icon="'check-circle'" 
          v-if="!sharedStore.eLearn.notificationsStatus.isLoading && !sharedStore.eLearn.notificationsStatus.isFailed && sharedStore.eLearn.notifications.length == 0">
            <template v-slot:title>
              NOTHING FOR TODAY
            </template>
            <template v-slot:subtitle>
              No new stuff today!
            </template>
          </icon-with-text>
          <h2 class="centered" ></h2>
          <card v-for="notif in sharedStore.eLearn.notifications" 
          :key="notif.title" 
          >
            <template v-slot:header>
              <div class="flex-row">
                <fai icon="plus-circle" size="2x" v-if="notif.type == 'ADD'"/>
                <fai icon="dot-circle" size="2x" v-else-if="notif.type == 'UPDATE'"/>
                <fai icon="minus-circle" size="2x" v-else/>
                <p class="nospacing" style="font-weight: 800;">{{notif.title}}</p>
              </div>
              <p class="light nospacing">{{notif.text}}</p>
            </template>
            <template v-slot:buttons>
              <endeavor-button v-if="notif.courseId && notif.sectionId && notif.moduleId" @click="$router.push(`/courses/${notif.courseId}/${notif.sectionId}/${notif.moduleId}`)">
                🔍 Open Module 
              </endeavor-button>
              <endeavor-button v-else-if="notif.courseId && notif.sectionId" @click="$router.push(`/courses/${notif.courseId}/${notif.sectionId}`)">
                🔍 Open Section 
              </endeavor-button>
              <endeavor-button v-else-if="notif.courseId" @click="$router.push(`/courses/${notif.courseId}`)">
                🔍 Open Course
              </endeavor-button>
            </template>
          </card>
        </div>

        <div class="separator"><h2 class="light">ARCHIVE</h2></div>
        <card v-for="notif in sharedStore.eLearn.notificationsArchive" 
        :key="notif.title" 
        >
          <template v-slot:header>
            <div class="flex-row">
              <fai icon="plus-circle" size="lg" v-if="notif.type == 'ADD'"/>
              <fai icon="dot-circle" size="lg" v-else-if="notif.type == 'UPDATE'"/>
              <fai icon="minus-circle" size="lg" v-else/>
              <p class="nospacing" style="font-weight: 800;">{{notif.title}}</p>
            </div>
            <p class="light nospacing">{{notif.text}}</p>
          </template>
          <template v-slot:buttons>
            <endeavor-button v-if="notif.courseId && notif.sectionId && notif.moduleId" @click="$router.push(`/courses/${notif.courseId}/${notif.sectionId}/${notif.moduleId}`)">
              🔍 Open Module 
            </endeavor-button>
            <endeavor-button v-else-if="notif.courseId && notif.sectionId" @click="$router.push(`/courses/${notif.courseId}/${notif.sectionId}`)">
              🔍 Open Section 
            </endeavor-button>
            <endeavor-button v-else-if="notif.courseId" @click="$router.push(`/courses/${notif.courseId}`)">
              🔍 Open Course
            </endeavor-button>
          </template>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import sharedStore from '../store';

import Card from '@/components/Card.vue';
import EndeavorButton from '@/components/EndeavorButton.vue';
import Loader from '@/components/Loader.vue';
import IconWithText from '@/components/IconWithText.vue';

export default {
  components: { Card, EndeavorButton, Loader, IconWithText },
  name: "Notifications",
  data() {
    return {
      sharedStore,
    };
  },
  props: {},
  methods: {},
};
</script>