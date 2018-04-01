<template>
  <div class="music-list">
      <div class="back" @click='back'>
          <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
          <div class="play-wrapper" v-show="this.songs.length">
              <div class="play" ref='playBtn'>
                  <i class="icon-play" v-show="songs.length>0"></i>
                  <span class="text" @click="randomPlayAll">随机播放全部</span>
              </div>
          </div>
          <div class="filter" ref='filter'></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <!-- 监听scroll事件给bg-layer赋值,让它在Y方向偏移处于list上方的位置形成向上滑动的效果 -->
      <scroll :data="songs" class="list" @scroll="scroll" 
      ref="list" :listenScorll="listenScroll" :probe-type="probeType"> 
          <div class="song-list-wrapper">
          <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
          </div>
          <div class="loading-container" v-show="!songs.length">
              <loadding></loadding>
          </div>
      </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import Loadding from 'base/loadding/loadding'
import {prefix} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'
const transform = prefix('transform')
const backdrop = prefix('backdrop-filter')
const RESERVED_HEIGHT = 40//保留高度
export default {
  name:"music-list",
  mixins:[playListMixin],
  components:{
      Scroll,
      SongList,
      Loadding
  },
  props:{
      title:{
          type:String,
          default:''
      },
      songs:{
          type:Array,
          default:[]
      },
      bgImage:{
          type:String,
          default:''
      },
      rank:{
          type:Boolean,
          default:false
      }
  },
  data() {
      return {
        scrollY: 0
      }
  },
  computed:{
      bgStyle(){
          return `background-image:url(${this.bgImage})`          
      },
  },
  mounted(){//refs.list 是一个组件所以要丶el获取元素.
      this.imageHeight =  this.$refs.bgImage.clientHeight //记录图片高
      this.miniTranslateY =   -this.imageHeight + RESERVED_HEIGHT 
      console.log(this.miniTranslateY)
      //Y正方向上最小的偏移值
      this.$refs.list.$el.style.top = this.imageHeight + 'px'
      //让滚动组件距离和图片错开
  },
  created(){
      this.listenScroll = true
      this.probeType = 3 
  },
  methods:{
      scroll(pos){//监听了scroll的值
        this.scrollY = pos.y
      },
      back(){//路由回退
          this.$router.back()
      },
      selectItem(song,index){
          this.selectPlay({
              list:this.songs,
              index:index
          })
      },
      randomPlayAll(){
       this.randomPlay({
           list:this.songs
       })
      },
      handlePlayList(){//利用mixin方法,复用一些组件方法,适配播放器底部距离
       const bottom= this.playList.length > 0 ? '60px' :''
       this.$refs.list.$el.style.bottom = bottom
       this.$refs.list.refresh()
      },
      ...mapActions([
          'selectPlay',
          'randomPlay'
      ])
  },
watch:{
      scrollY(newVal){ //watch实时监听scrollY方向的新值
        let translateY = Math.max(this.miniTranslateY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / this.imageHeight)
          //因为下拉时newVal 增加.要形成无缝放大的效果需要除以图片高度,算出比例
          if(newVal >0){
              scale = 1+percent
              zIndex = 10
          }else{
             blur = Math.min(20 * percent*20)
          }
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
          if (newVal < this.miniTranslateY) {
        //如果Scroll元素 Y正方向的偏移量 达到图片位置,(越向上越小)
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
      }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: rgb(49, 194, 124)
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: #fff
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid rgb(49, 194, 124)
          color: rgb(49, 194, 124)
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
    .bg-layer
      position: relative
      height: 100%
      background: #fff
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: #fff
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

