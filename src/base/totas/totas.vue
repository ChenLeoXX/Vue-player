<template>
<transition name="totas">
  <div class="totas-wrapper">
      <div class="totas">{{msgType}}</div>
  </div>
</transition>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
  props:{
      msgType:{
          type:String,
          default:0
      }
  },
  mounted(){
  setTimeout(()=>{
       this.setModeTotas(false)
    },2000)      
  },
  methods:{
      ...mapMutations({
          setModeTotas:'SET_MODE_TOTAS'
      })
  }
}
</script>
<style lang="stylus" scoped>
 .totas-wrapper
    position:absolute
    bottom:30px
    left:50%
    bottom:25%
    transform:translate(-50%)
    .totas
      text-align :center
      line-height :40px
      width :140px
      height :40px
      border-radius:45px
      color:#fff
      font-weight :bold
      background :rgba(29,29,29,.4)
.totas-enter-active, .totas-leave-active 
  transition: opacity .5s;

.totas-enter, .totas-leave-to 
  opacity: 0;
     
</style>

