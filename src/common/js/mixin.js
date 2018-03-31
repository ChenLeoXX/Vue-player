import {mapGetters,mapMutations,mapActions} from 'vuex'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

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

export const playerMixin ={//player组件和playList组件共享逻辑
 computed:{
    playMode(){
        return this.mode === playMode.random ? 'icon-random' : this.mode === playMode.loop ? 'icon-loop':
        'icon-sequence'
    },
    msgType(){
      return this.mode === playMode.sequence? '顺序播放' : this.mode === playMode.loop? '单曲循环' : this.mode === playMode.random ? '随机播放' : false
    },     
    ...mapGetters([
        'mode',
        'playList',
        'sequenceList',
        'currentSong',
        'fullScreen'
    ])
 },
 methods:{
    changeMode(){//播放模式切换
        if(this.fullScreen){
            this.setModeTotas(true)            
        }
        let newMode = (this.mode + 1) % 3
        this.setCurrentMode(newMode)
        let list = null
        if(this.mode === playMode.random){//随机播放逻辑 
           list = shuffle(this.sequenceList)
        }else{
          list = this.sequenceList//切换回正常列表播放
        }      
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){//ES6 语法找到数组中符合函数条件的元素索引
        let index = list.findIndex((item)=>{
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      }, 
      ...mapMutations({
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayList:'SET_PLAYLIST',
        setCurrentMode :'SET_PLAY_MODE',      
        setModeTotas: 'SET_MODE_TOTAS'          
    })    
 }
}