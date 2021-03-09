<template>
  <button style="margin-right: 10px;" class="roundButton" :class="disabled ? 'disabled' : ''" @click.prevent="updateValue">
    <fai v-if="value" size="lg" icon="check"/>
    <fai v-else size="lg" icon="times"/>
  </button>
</template>

<script>
export default {
  name: "Checkbox",
  props: {
    value: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    }
  },
  methods: {
    updateValue: function() {
      if (!this.disabled) {
        console.log(this.value + " to " + !this.value)
        this.$emit("input", !this.value)
      }
    }
  }
}
</script>

<style>

</style>