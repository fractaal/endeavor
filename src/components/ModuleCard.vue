<template>
  <card v-if="module.modnameformatted !== 'Label'"
  :title="module.name"
  :subtitle="module.modnameformatted"
  :rightTitle="module.duedate"
  :rightSubtitle="module.duedateformatted"
  :content="store.settings.showActivityDescriptionsOnCards ? module.intro : ''"
  :internalLink="`/courses/${module.courseid}/${module.section}/${module.instance}`"
  :externalLink="module.url"
  :styling="module.styling"
  >
    <template v-slot:header>
      <div style="display: flex; justify-content: space-between;">
        <div class="flex-row">
          <fai v-if="module.modnameformatted == `Forum`" size="2x" icon="comments"/>
          <fai v-else-if="module.modnameformatted == `Page`" size="2x" icon="file"/>
          <fai v-else-if="module.modnameformatted == `Assignment`" size="2x" icon="pencil-alt"/>
          <fai v-else-if="module.modnameformatted == `Quiz`" size="2x" icon="scroll"/>
          <fai v-else-if="module.modnameformatted == `Lesson`" size="2x" icon="chalkboard"/>
          <fai v-else-if="module.modnameformatted == `Book`" size="2x" icon="book"/>
          <fai v-else size="2x" icon="bars"/>
          <div>
            <p style="font-weight: 800; margin: 0;">{{module.name}}</p>
            <p style="margin: 0;">{{module.modnameformatted}}</p>
          </div>
        </div>
        <div class="flex-row">
          <div style="text-align: right;">
            <timeago v-if="module.duedate" :datetime="module.duedate" style="font-weight: 800; margin: 0;" :auto-update="60"/>
            <p style="margin: 0;">{{module.duedateformatted}}</p>
          </div>
          <completion-checkbox :mod="module"/>
        </div>
      </div>
      <slot name="extra"/>
    </template>
  </card>
</template>

<script>
import store from '../store';
import Card from './Card.vue';
import CompletionCheckbox from './CompletionCheckbox.vue';

export default {
  name: 'ModuleCard',
  data() {
    return {
      store,
    }
  },
  components: { Card, CompletionCheckbox },
  props: {
    module: {
      type: Object,
      required: true,
    }
  }
}
</script>