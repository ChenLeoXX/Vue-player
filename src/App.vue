<template>
  <div id="app">
    <m-header/>
    <tab/>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-hader/m-hader'
import Tab from 'components/tabs/tab'
import Player from 'components/player/player'
export default {
  name: 'App',
  components:{
    MHeader,
    Tab,
    Player
  }
}
</script>

<style>
#app {
}
</style>
