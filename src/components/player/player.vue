<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <totas :msgType="msgType" v-if="this.modeChange"></totas>       
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
              @touchstart.prevent="lyricTouchStart"
              @touchmove.prevent="lyricTouchMove"
              @touchend="lyricTouchEnd"
        >
          <div class="middle-l" ref='cd'>
           <div class="cd-wrapper">
              <div class="cd">
              <img class="image" :src="currentSong.image" :class="cdRotate">
            </div>
           </div>
           <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
           </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   :style="{fontSize:fontSize+'px',lineHeight:lineHeight+'px'}"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
              <div class="pure-music" v-show="isPureMusic">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>          
        </div>
        <div class="bottom">
          <div class="font">
            <div @click="fontUp" :class="{fontActive:fontShow}" class="plus">
              <i class="iconfont add"></i>              
            </div>
            <div @click="fontDown" :class="{fontActive:fontShow}" class="reduce">
               <i class="iconfont cut"></i>
            </div>
           <div id="font-control" @click.prevent="fontControl">
              <i class="iconfont ziti"></i>
           </div>            
          </div>                    
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>          
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @touchEnd="onTouchEnd"
                                               @changeTime="changeCurrentTime" 
              ></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="playMode" @click="changeMode" style="color:#fff"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite" ></i>
            </div>
          </div>
        </div>
      </div>
      </transition>
      <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
         <div class="imgWrapper">
            <img width="40" height="40" :src="currentSong.image" :class="cdRotate">
         </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlay">
          <progress-circle :radius='radius' :percent="percent">
          <i :class="miniIcon" class='icon-mini'></i>     
          </progress-circle>     
        </div>
      </div>
      </transition>
        <audio @playing="readyPlay" @error="songError" ref="audio"
               @timeupdate="updateTime"
               @ended="songEnd"
       ></audio>      
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {mapMutations} from 'vuex'
import  ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Totas from 'base/totas/totas'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import {prefix} from 'common/js/dom'
const transform = prefix('transform')
const transitionDuration = prefix('transitionDuration')
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
export default {
  name:"player",
  data(){
    return{
      isSongReady:false,
      currentTime:'0',
      currentLyric: null,
      currentLineNum: 0,
      currentShow:'cd',      
      radius:32,
      playingLyric:"",
      isPureMusic:false,
      pureMusicLyric: '',
      fontShow:false,
      fontSize:16,
      lineHeight:34
    }
  },
  created(){
    this.touch={}//记录触摸信息
  },
  computed:{
      cdRotate(){return this.playing? `play` : `pause`},
      playIcon(){ return this.playing ? 'icon-pause' : 'icon-play'},
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls(){
        return this.isSongReady ? '' : 'disable'
      },
      percent(){
        return this.currentTime / this.currentSong.duration
      },
      playMode(){
        return this.mode === playMode.sequence? 'icon-sequence' : this.mode === playMode.random ? 'icon-random': this.mode === playMode.loop ? 'icon-loop' : false
      },
      msgType(){
        return this.mode === playMode.sequence? '顺序播放' : this.mode === playMode.loop? '单曲循环' : this.mode === playMode.random ? '随机播放' : false
      },     
      ...mapGetters([
          'fullScreen',
          'playList',
          'currentSong',
          'playing',
          'currentIndex',
          'mode',
          'sequenceList',
          'modeChange'
      ])
  },  
  watch:{
    currentSong:{//点击后监听currentSong实现自动播放
      handler(newSong, oldSong) {
      if (!newSong.id) return
      if (newSong.id === oldSong.id) return
      if (this.currentLyric) {
        this.currentLyric.stop()
        // 重置为null
        this.currentLyric = null
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
       }
      clearTimeout(this.timer)
      this.$refs.audio.src = newSong.url
      this.timer = setTimeout(() => {
      this.$refs.audio.play()
      this.getLyric()
     }, 800)
  },
    sync: true      
    },
    playing(newPlaying){//播放暂停切换
    if(!this.isSongReady) return
      let audio =this.$refs.audio
      this.$nextTick(()=>{
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  mounted(){
    this.setModeTotas(true)
  },
  methods:{
    fontDown(){
      if(this.fontSize === 14) return 
      this.fontSize=this.fontSize - 2
      this.lineHeight=this.lineHeight - 4         
    },
    fontUp(){
      if(this.fontSize === 34) return
      this.fontSize=this.fontSize + 2
      this.lineHeight=this.lineHeight + 4         
    },
    fontControl(){        
      if(!this.fontShow){
        this.fontShow= true
      }else{
        this.fontShow=false
      }
    },
    back(){//退出全屏
      this.setFullScreen(false)
    },
    open(){//全屏
      this.setFullScreen(true)
    },
    prev(){//顺序播放上一首
    
      if(!this.isSongReady){
        return 
      }
      if(this.playList.length === 1) {
        this.loop()
        return
      }       
      let currentIndex = this.currentIndex -1 
      if(currentIndex === -1 ){
         currentIndex = this.playList.length - 1
      }
      this.setPlayingState(true)
      this.setCurrentIndex(currentIndex)
      this.isSongReady = false
      if(!this.playing){
        this.togglePlay()
      }
    },
    next(){//顺序播放下一首
      if(!this.isSongReady){
        return 
      }
      if(this.playList.length === 1) {//如果列表只有一首歌那么就循环播放
        this.loop()
        return
      }   
      let currentIndex = this.currentIndex + 1 
      if(currentIndex === this.playList.length){
         currentIndex = 0
      }
      this.setPlayingState(true)
      this.setCurrentIndex(currentIndex)
      this.isSongReady = false
      if(!this.playing){
        this.togglePlay()
      }      
    },
    togglePlay(){//播放和暂停状态切换
    if(!this.isSongReady) return
      if(!this.playing){
        this.setPlayingState(true)
      }else{
        this.setPlayingState(false)
      }
      if(this.currentLyric){//歌曲暂停歌词停止滚动
        this.currentLyric.togglePlay()  
      }
    },
    readyPlay(){    
      this.isSongReady =true
        if (this.currentLyric && !this.isPureMusic) {
          this.currentLyric.seek(this.currentTime * 1000)
        }      
    },
    songError(){
      this.isSongReady = true
    },
    updateTime(e){
      this.currentTime = e.target.currentTime
    },
    format(songTime){//初始化歌曲时间
      let time = songTime | 0 // 这个运算符用于去除小数和Math.floor差不多
      let minute = time / 60 | 0
      let second = time % 60
      second =  second.toString().length === 2 ? second : '0' +second
      return `${minute}:${second}`
    },
    onTouchEnd(percent){//根据拖动计算进度
     const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if(!this.playing){
        this.togglePlay()
      }
      if(this.currentLyric){
        this.currentLyric.seek(currentTime *1000) //实现拖动进度,歌词对应相对进度
      }
    },
    changeCurrentTime(percent){//根据拖动返回百分比改变当前时间
       this.togglePlay()
      this.$refs.audio.currentTime =  this.currentSong.duration * percent
    },
    changeMode(){//播放模式切换
      this.setModeTotas(true)
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
    loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        } 
    },
    songEnd(){//歌曲播放结束判断逻辑
      if(this.mode === playMode.loop){
        this.loop()
      }else{
        this.next()
      }
    },
    getLyric(){
      this.currentSong.getLyric().then(lyric=>{
        if(this.currentSong.lyric !== lyric) return //确保在快速切歌时保证歌词正确
        this.currentLyric = new Lyric(lyric,this.handlerLyric)//翻入lyric-parser解析
        this.isPureMusic = !this.currentLyric.lines.length
        if (this.isPureMusic) {
          this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
        this.currentLyric.lrc.replace(timeExp, '').trim()
          this.playingLyric = this.pureMusicLyric
        }        
        if(this.playing){
          this.currentLyric.play()//当播放的时候调用,Lyric构造函数的回调handlerLyric
        }
      }).catch(()=>{
        this.currentLyric = null
        this.currentTime  = 0
        this.playingLyric = ''
      })
    },
    handlerLyric({lineNum,txt}){//操作歌词滚动,保持歌词在中间部分
        this.currentLineNum = lineNum
        if(lineNum > 5){
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl,1000)
        } else{
          this.$refs.lyricList.scrollTo(0,0,1000)
        }     
        this.playingLyric = txt
    },
    lyricTouchStart(e){//歌词滑动记录一开始点击滑动信息
      this.touch.inited = true
      this.touch.moved = false
      const touch  = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    lyricTouchMove(e){//歌词滑动记录与开始滑动时X,Y轴增量
      if(!this.touch.inited){
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX 
      const deltaY = touch.pageY - this.touch.startY 
      if(Math.abs(deltaY) > Math.abs(deltaX)) return //取消向下滑动            
      if(!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd'? 0 : -window.innerWidth//确定歌词页的位置
      const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX))//确定滑动的最值,不超过屏幕宽度,但可以出现滑动
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.cd.style.opacity = 1 - this.touch.percent
    },
    lyricTouchEnd(){//滑动结束判断滑动增量切换歌词和cd页面
        if (!this.touch.moved) {
          return
        }    
      let time = 300
      let offsetWidth 
      if(this.currentShow === 'cd'){
        if(this.touch.percent >= 0.1){
            offsetWidth = -window.innerWidth
             this.$refs.cd.style.opacity = 0   
             this.currentShow = 'lyric' 
        }else{
          offsetWidth = 0
          this.$refs.cd.style.opacity = 1       
        }
      }else{
            if(this.touch.percent < 0.9){
                 offsetWidth = 0
                 this.$refs.cd.style.opacity = 1
                 this.currentShow = 'cd'
            }else{
                 offsetWidth = -window.innerWidth
                 this.$refs.cd.style.opacity = 0
            }
      }
          this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
          this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
          this.$refs.cd.style[transitionDuration] = `${time}ms`
    }, 
    ...mapMutations({
      setFullScreen:'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setCurrentMode :'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST',
      setModeTotas: 'SET_MODE_TOTAS'
    }),
  },
  components:{
    ProgressBar,
    ProgressCircle,
    Totas,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .fontActive.plus,.fontActive.reduce
     animation: show .5s linear
     opacity:1
  .font 
      display:flex
      justify-content :flex-end
      flex-direction: column
      align-items: flex-end
      margin-right:20px
      position: absolute
      right: 0px
      top: -160px
      z-index:99
      div
       margin-bottom:25px
       font-size:20px
       padding:10px
       opacity:0
       transition-duration:.3s
  #font-control
      opacity:1
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: rgba(104, 204, 155, 0.87)
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: 16px
              &.current
                color: rgba(104, 204, 155, 0.87)
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-medium
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: rgba(104, 204, 155, 0.87)
            &.disable
              color: gray
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: #fff
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: #fff
      border-top: 1px solid rgb(49, 194, 124);
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: #000
        .desc
          no-wrap()
          font-size: $font-size-small
          color: rgba(104, 204, 155, 0.87)
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: rgba(8, 136, 74, 0.78)
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

      
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
  @keyframes show
    0%
      opacity: 0
    100%
      opacity:1  
</style>


