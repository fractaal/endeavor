<template>
  <div style="display: flex; flex-direction:column">
    <h4 class="nospacing" style="font-weight: 300; margin-bottom: -10px;">GRADE</h4>
    <div style="display: flex; align-items: flex-end;">
      <h1 class="nospacing" style="margin: 0px 0px -10px 0px; font-size: 48px;">{{formattedgrade}}</h1>
      <h1 class="nospacing" style="font-weight: 200;">/{{maxGrade}}</h1>
    </div>
  </div>
</template>

<script>

export default {
  name: "Grade",
  props: {
    maxGrade: Number,
    grade: Number,
    modname: String,
    id: Number,
  },
  computed: {
    formattedgrade: function() {
      return Number(this.grade).toFixed(0);
    }
  },
}
</script>

<style>

</style>