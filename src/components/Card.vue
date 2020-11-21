<template>
  <div>
    <div class="card" style="border-radius: 10px 10px 0px 0px; margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex;">
          <p style="font-weight: 800; margin: 0;">{{title}}</p>
        </div>
        <div style="display: flex;">
          <p style="margin:0; font-weight: 400;">{{subtitle}}</p>
        </div>
      </div>
    </div>
    <div class="card cardDarker" style="border-radius: 0px 0px 10px 10px; margin-top: 0;">
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex;">
          <p style="margin: 0;" v-html="content"></p>
        </div>
        <div style="display: flex;">
          <!--
          <button @click="$router.push(link)" class="roundButton">🔍</button>-->
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "Card",
  props: {
    title: String,
    subtitle: String,
    content: String,
    link: String
  }
}
</script>

<style>

</style>