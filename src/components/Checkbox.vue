<template>
  <button style="margin-right: 10px;" class="roundButton" @click.prevent="updateValue">{{value ? '✔' : '❌'}}</button>
</template>

<script>
export default {
  name: "Checkbox",
  props: {
    value: {
      type: Boolean,
      required: false,
    }
  },
  methods: {
    updateValue: function() {
      console.log(this.value + " to " + !this.value)
      this.$emit("input", !this.value)
    }
  }
}
</script>

<style>

</style>