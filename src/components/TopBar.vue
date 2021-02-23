<template>
  <div class="topbar">
    <div class="navbuttons">
      <div class="navbar-item">
        <button class="navbar-button" @click="$router.go(-1)">
          <fai icon="arrow-left"/>
        </button>
      </div>
      <div class="navbar-item">
        <button class="navbar-button" @click="$router.go(1)">
          <fai icon="arrow-right"/>
        </button>
      </div>
    </div>
    <div class="path-button" style="pointer-events: none;">
      {{$route.name.toUpperCase()}}
    </div>
    <h2 style="margin: auto 5px auto 5px; font-weight: 400; opacity: 0.5;">|</h2>
    <div style="display: flex;" v-for="pathData in sharedStore.pathData" :key="pathData.path">
      <div class="path-button no-overflow" @click="$router.push(pathData.path)">
        {{pathData.name.toUpperCase()}}
      </div>
      <h2 style="margin: auto 5px auto 5px; font-weight: 400; opacity: 0.5;">></h2>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: "TopBar",
  data() {
    return {
      sharedStore: store
    }
  }
}
</script>

<style>

</style>