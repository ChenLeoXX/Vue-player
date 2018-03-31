import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload  from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false
fastclick.attach(document.body)
/* eslint-disable no-new */
import 'common/stylus/index.styl'
Vue.use(VueLazyload,{
  loading: require('common/image/default.png')
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data(){
    return{
      once:0
    }
  },
  mounted(){
    document.onclick = () => {
      this.once++
      if(this.once<=1){            
          let audioPlay = document.getElementById('audio')
          audioPlay.play()
      }else{
          document.onclick = null
      }      
  }
  }
})
