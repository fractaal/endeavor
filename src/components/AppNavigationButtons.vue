<template>
  <div class="flex-row">
    <button class="navbar-button navbar-button-darkened" @click="$router.go(-1)">
      <fai icon="arrow-left"/>
    </button>
    <button class="navbar-button navbar-button-darkened" @click="$router.go(1)">
      <fai icon="arrow-right"/>
    </button>
  </div>
</template>

<script>
export default {
  name: "AppNavigationButtons",
  data() {
    return {};
  },
  props: {},
  methods: {},
};
</script>
