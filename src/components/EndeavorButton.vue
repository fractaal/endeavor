<template>
  <button @click="callback" class="buttonwithlabel" :class="styling"><slot></slot></button>
</template>

<script>
export default {
  name: "EndeavorButton",
  props: ['styling'],
  methods: {
    callback(e) {
      this.$emit("click", e);
    }
  }
}
</script>

<style>

</style>