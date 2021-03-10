<template>
  <div>
    <transition name="transition" mode="out-in">
      <Loader style="padding-top: 120px;" v-if="loading"/>
      <div v-else>
        <div>
          <p style="margin-bottom: -8px;">
            GRADE OVERVIEW OF
          </p>
          <h1 class="nospacing" style="font-weight: 300;">
            {{overviewData.title}}
          </h1>
        </div>
        <br>
        <icon-with-text :icon="'exclamation-circle'" v-if="overviewData.maxGrade == 0">
          <template v-slot:title>
            NO GRADE DATA
          </template>
          <template v-slot:subtitle>
            There were no grades found in this course (yet).<br>Check back soon!
          </template>
        </icon-with-text>
        <div class="content-compact" v-else>
          <div class="go-columns" style="margin-bottom: 10px;">
            <div>
              <div class="go-row go-highlight">
                <h1>{{overviewData.grade}}</h1>
                /
                <h2>{{overviewData.maxGrade}}</h2>
                <p style="margin-left: 6px;">POINTS</p>
              </div>
            </div>
            <div>
              <div class="go-row go-highlight">
                <h1>{{((overviewData.grade / overviewData.maxGrade) * 100).toFixed(0)}}</h1>
                <p style="margin-left: 6px;">PERCENT</p>
              </div>
            </div>
          </div>
          <span>
            <grade-overview-section v-for="section in overviewData.sections" :key="section.name" :section="section"/>
          </span>
        </div>
        <br/>
        <!--
        <card v-if="store.settings.showDebugInfo">
          <template v-slot:header>
            <div class="flex-row">
              <fai size="3x" icon="question-circle"/>
              <h2 style="font-weight: 400;">DEBUGGER</h2>
            </div>
          </template>
          <template v-slot:content>
            <pre>
              {{JSON.stringify(overviewData, null, 2)}}
            </pre>
          </template>
        </card>
        -->
      </div>
    </transition>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import GradeOverviewSection from '@/components/GradeOverviewSection.vue';
import IconWithText from '@/components/IconWithText.vue';
import store from '../store';
import processOverview from '../elearn/grade-overview';

export default {
  name: "GradeOverview",
  data() {
    return {
      store,
      loading: false,
      overviewData: {},
    }
  },
  components: { GradeOverviewSection, Loader, IconWithText },
  async activated() {
    if ((this.$route.params.section && this.$route.params.section == this.overviewData.id) || (this.$route.params.id == this.overviewData.id)) {
      console.log('same! dont reload...');
      return;
    }
    this.loading = true;
    this.overviewData = Object.assign(
      {}, 
      this.overviewData, 
      this.$route.params.section ? 
        await processOverview(this.$route.params.id, this.$route.params.section) :
        await processOverview(this.$route.params.id)
    )

    this.loading = false;
  }
}
</script>