<template>
  <button @click="callback" class="buttonwithlabel"><slot></slot></button>
</template>

<script>
export default {
  name: "EndeavorButton",
  methods: {
    callback(e) {
      this.$emit("click", e);
    }
  }
}
</script>

<style>

</style>