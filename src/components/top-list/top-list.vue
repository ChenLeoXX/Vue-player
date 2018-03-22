<template>
    <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
import {createSong, isValidMusic, processSongsUrl} from 'common/js/song'
import {getMusicList} from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import musicList from 'components/music-list/music-list'
export default {    
 data(){
     return{
         songs:[],
         rank:true
     }
 },
 created(){
     this._getMusicList()
 },
 computed:{
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },     
    ...mapGetters([
        'topList'
    ]) 
 },
 methods:{
     _getMusicList(){
         if(!this.topList.id){
             this.$router.push({
                 path:'/rank'
             })
             return
         }
         getMusicList(this.topList.id).then((res)=>{
             if(res.code ===ERR_OK){
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
            })                    
             }
         })
     },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }     
 },
 components:{
     musicList
 }
}
</script>
<style lang="stylus" scoped>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
</style>


