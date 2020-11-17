<template>
  <div class="loginBackground">
    <div class="center">
      <img src="icon.png" style="display: block; width: 50%; margin-left: auto; margin-right: auto;">
      <h2>Endeavor</h2>
      <p style="margin-top: -25px;">Log in with your eLearn information</p>
      <form>
        <input type="text" placeholder="Username"/>
        <br>
        <input type="password" placeholder="Password"/>
        <div style="display: flex; align-items: flex-end;">
          <button style="margin-right: 5px; margin-left: auto;" class="roundButton">?</button>
          <button class="roundButton">✔</button>
        </div>
      </form>
    </div>
    <div class="footer" style="display: flex; align-items: flex-end;">
      <p style="font-size: 10px; margin-right: 10px; margin-left: auto;">Endeavor 1.2.1</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',
  components: {
  },
});
</script>
