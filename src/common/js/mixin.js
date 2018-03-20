import {mapGetters} from 'vuex'
export const playListMixin = {//recommend 和 musiclist 底部播放器适配方法
   computed:{
    ...mapGetters([
        'playList'
    ])
   },
   watch:{
    playList(newList){
        this.handlePlayList(newList)
    }
   },
   mounted(){
    this.handlePlayList(this.playList)
   },
   activated(){
    this.handlePlayList(this.playList)
   },
   methods:{
       handlePlayList(playList){
           throw new Error('component must implement with handlePlaylist method')
       }
   }
}