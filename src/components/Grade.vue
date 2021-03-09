<template>
  <div style="display: flex; flex-direction:column">
    <h4 class="nospacing" style="font-weight: 300; margin-bottom: -5px;">GRADE</h4>
    <transition name="transition">
      <div v-if="isLoading" style="display: flex; align-items: flex-end;">
        <h1 class="shimmer nospacing" style="margin: 0px 0px -10px 0px; font-size: 48px;">?</h1>
        <h1 class="shimmer nospacing" style="font-weight: 200;">/?</h1>
      </div>
      <div v-else style="display: flex; align-items: flex-end;">
        <h1 class="nospacing" style="margin: 0px 0px -10px 0px; font-size: 48px;">{{formattedgrade}}</h1>
        <h1 class="nospacing" style="font-weight: 200;">/{{maxGrade}}</h1>
      </div>
    </transition>
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
    isLoading: Boolean,
  },
  computed: {
    formattedgrade: function() {
      return parseInt(this.grade).toFixed(0);
    }
  },
};
</script>

<style>

</style>