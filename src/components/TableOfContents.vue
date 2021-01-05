<template>
  <div class="table-of-contents">
    <h3 class="nospacing" style="font-weight: 300; margin: 0 0 10px 0;">OUTLINE</h3>
    <div style="max-height: 75vh; overflow-y: auto; overflow-x: hidden;">
      <EndeavorButton style="margin: 5px 0; text-align: left;" class="fill-row" v-for="(item, index) in list" :key="item" :styling="activeitem == index ? 'active' : ''" @click="emitNavigationEvent(index)">
          {{index+1}}. {{item}}
      </EndeavorButton>
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