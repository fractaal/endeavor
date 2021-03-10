<template>
  <div class="go-grade-item go-highlight">
    <div class="flex-row go-highlight-hover" style="justify-content: space-between; padding: 10px; border-radius: 5px;" @click="$router.push(section.link)">
      <h2 class="nospacing" style="font-weight: 400;">{{section.title.toUpperCase()}}</h2>
      <span style='text-align: right;'>
        <h3 class="nospacing" style="font-weight: 800; margin: 0; padding: 0;">{{((section.grade / section.maxGrade) * 100).toFixed(0)}}%</h3>
        <span class="flex-row" style="margin: 0; padding: 0;">
          <h3 class="nospacing" style="padding: 0; opacity: 0.5; font-weight: 400;">{{section.grade}}</h3>
          <h3 class="nospacing" style="padding: 0; opacity: 0.5; font-weight: 400;">/{{section.maxGrade}}</h3>
        </span>
      </span>
    </div>
    <hr>
    <grade-overview-module v-for="module in section.modules" :key="module.name" :module="module"/>
  </div>
</template>

<script>
import GradeOverviewModule from './GradeOverviewModule.vue';

export default {
  name: "GradeOverviewSection",
  components: { GradeOverviewModule },
  props: ['section'],
}
</script>
