<template>
  <div style="position: absolute;"></div>
</template>

<script>
import {Bus} from '../main';

export default {
  name: "ToastProvider",
  created() {
    Bus.$on('toast', (content, options, type) => {
      if (type) this.$toast[type](content, options);
      else this.$toast(content, options);
    })
  }
}
</script>