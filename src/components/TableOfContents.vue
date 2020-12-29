<template>
  <div class="table-of-contents">
    <h3 class="nospacing" style="font-weight: 300; margin: 10px;">OUTLINE</h3>
    <div style="max-height: 80vh; overflow-y: auto; overflow-x: hidden;">
      <EndeavorButton v-for="(item, index) in list" :key="item" :styling="activeitem == index ? 'active' : ''" @click="emitNavigationEvent(index)">{{index+1}}. {{item}}</EndeavorButton>
    </div>
  </div>
</template>

<script>
import EndeavorButton from './EndeavorButton.vue';

export default {
  name: "TableOfContents",
  props: ['list', 'activeitem'],
  components: {
    EndeavorButton,
  },
  methods: {
    emitNavigationEvent(n) {
      this.$emit("navigation", n);
    }
  },
};
</script>

<style></style>