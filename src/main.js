import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
fastclick.attach(document.body)
/* eslint-disable no-new */
import 'common/stylus/index.styl'
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
