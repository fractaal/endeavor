<template>
  <button class="roundButton" :class="style" @click="updateCompletion">
    <fai v-if="this.mod.completiondata.state == 1 || this.mod.completiondata.state == 2" icon="check" size="lg"/>
    <fai v-else-if="this.mod.completiondata.state == 3" icon="times" size="lg"/>
    <p v-else/>
  </button>
</template>

<script>
import store from '../store';

export default {
  name: 'CompletionCheckbox',
  props: {
    mod: {
      required: true,
      type: Object,
    },
  },
  created() {
    this.check()
  },
  updated() {
    this.check();
  },
  data() {
    return {
      store,
      isLoading: false,
      disabled: false,
    }
  },
  computed: {
    style: function() {
      let result = "";
      if (this.isLoading) {
        result += " shimmer";
      }
      if (this.disabled) {
        result += " disabled";
      }
      return result;
    }
  },
  methods: {
    async updateCompletion() {
      this.isLoading = true;
      await store.eLearn.toggleModuleCompletion(this.mod);
      this.isLoading = false;
    },
    check() {
      if (this.mod.completion == 1) {
        this.disabled = false;
      } else if (this.mod.completion == 2) {
        this.disabled = true;
      }
    }
  }
};
</script>