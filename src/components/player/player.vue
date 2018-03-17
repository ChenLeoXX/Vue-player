<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
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
        <div class="middle">
          <div class="middle-l">
           <div class="cd-wrapper">
              <div class="cd">
              <img class="image" :src="currentSong.image" :class="cdRotate">
            </div>
           </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="disableCls">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="disableCls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
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
          <i :class="miniIcon"></i>     
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
      </transition>
        <audio @canplay="readyPlay" @error="songError" ref="audio"
               @timeupdate="updateTime" 
        :src="currentSong.url"></audio>      
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {mapMutations} from 'vuex'
import  ProgressBar from 'base/progress-bar/progress-bar'
export default {
  name:"player",
  data(){
    return{
      isSongReady:false,
      currentTime:'0'
    }
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
      ...mapGetters([
          'fullScreen',
          'playList',
          'currentSong',
          'playing',
          'currentIndex'
      ])
  },  
  watch:{
    currentSong(){//点击后监听currentSong实现自动播放
      this.$nextTick(()=>{ //这里也会触发mutation,把playing变成true
        //这里调用$nextTick因为当currentSong改变时,audio的DOM,SRC请求还没load,如果
        // 直接调用它的play方法,是冲突的,应该放在nextTick里当dom发生变化后立即调用.
        this.$refs.audio.play()
      })
    },
    playing(newPlaying){//播放暂停切换
      let audio =this.$refs.audio
      this.$nextTick(()=>{
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  methods:{
    back(){//退出全屏
      this.setFullScreen(false)
    },
    open(){//全屏
      this.setFullScreen(true)
    },
    prev(){//顺序播放下一首
      if(!this.isSongReady){
        return 
      }
      let currentIndex = this.currentIndex -1 
      if(currentIndex === -1 ){
         currentIndex = this.playList.length + 1
      }
      this.setCurrentIndex(currentIndex)
      this.isSongReady = false
      if(!this.playing){
        this.togglePlay()
      }
    },
    next(){//顺序播放上一首
      if(!this.isSongReady){
        return 
      }    
      let currentIndex = this.currentIndex + 1 
      if(currentIndex === this.playList.length +1){
         currentIndex = 0
      }
      this.setCurrentIndex(currentIndex)
      this.isSongReady = false
      if(!this.playing){
        this.togglePlay()
      }      
    },
    togglePlay(){//播放和暂停状态切换
      if(!this.playing){
        this.setPlayingState(true)
      }else{
        this.setPlayingState(false)
      }
    },
    readyPlay(){
      this.isSongReady =true
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
    ...mapMutations({
      setFullScreen:'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX'
    })
  },
  components:{
    ProgressBar
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

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
            color: $color-theme
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
              font-size: $font-size-medium
              &.current
                color: $color-text
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
            color: $color-theme
            &.disable
              color: $color-theme-d
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
            color: $color-sub-theme
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
      background: $color-highlight-background
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
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
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
</style>


