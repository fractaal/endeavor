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
    <div v-if="sharedStore.settings.showDebugInfo" class="debug-info">
      <p style="font-weight: 200;"><b>{{debugData.buildtime}}MS</b> : <b>{{debugData.loadedcourses}} </b>CRS | <b>{{debugData.loadedsections}} </b>SEC | <b>{{debugData.loadedmodules}} </b>MOD</p>
      <p style="font-weight: 200;"><b>{{debugData.loadedmoduleswithdata}} </b>MOD DATA | <b>{{debugData.loadedmodules - debugData.loadedmoduleswithdata}} </b>MOD NO DATA</p>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: "TopBar",
  data() {
    return {
      sharedStore: store,
      debugData: store.eLearn.debugData(),
    }
  }
}
</script>

<style>

</style>