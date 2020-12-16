<template>
  <div style="width: 100%;">
    <br>
    <br>
    <br>
    <div style="margin-left: 50%; margin-right: 50%; display: flex; flex-direction: column; align-items: center;">
      <div class="lds-ripple"><div></div><div></div></div>
      <h2 class="shimmer" style="width: 250px; text-align: center; font-weight: 200;" v-if="text">{{text}}</h2>
      <h2 class="shimmer" style="width: 250px; text-align: center; font-weight: 200;" v-if="!text">LOADING...</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    text: String,
  }
}
</script>

<style>
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 160px;
  height: 160px;
}
.lds-ripple div {
  position: absolute;
  border: 8px solid var(--foreground);
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 72px;
    left: 72px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 144px;
    height: 144px;
    opacity: 0;
  }
}
</style>