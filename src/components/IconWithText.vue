<template>
  <div class="nospacing emptylistplaceholder">
    <fai size="10x" :icon="icon" />
    <h1 style="font-weight: 400;"><slot name="title"/></h1>
    <p><slot name="subtitle"/></p>
  </div>
</template>

<script>
export default {
  name: "IconWithText",
  props: {
    icon: {
      type: String,
      required: true,
    }
  },
};
</script>
