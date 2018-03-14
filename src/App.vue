<template>
  <div id="app">
    <m-header/>
    <tab/>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-hader/m-hader'
import Tab from 'components/tabs/tab'
export default {
  name: 'App',
  components:{
    MHeader,
    Tab
  }
}
</script>

<style>
#app {
}
</style>
