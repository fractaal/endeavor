<template>
  <div class="go-module" style="margin-bottom: 5px;">
    <div class="go-highlight-hover" style="border-radius: 10px; padding: 2px 10px;">
      <div class="flex-row " style="justify-content: space-between; margin: 0;" @click="$router.push(module.link)">
        <li style="font-weight: 600;">{{module.name.toUpperCase()}}</li>
        <span class="flex-row nospacing">
          <p class="nospacing">{{module.grade}}/{{module.maxGrade}}</p>
        </span>
      </div>
      <i v-if="module.feedback" v-html="module.feedback" style="margin: 0; padding: 0;">
      </i>
    </div>
  </div>
</template>

<script>
export default {
  name: "GradeOverviewModule",
  props: ['module']
}
</script>

<style>

</style>