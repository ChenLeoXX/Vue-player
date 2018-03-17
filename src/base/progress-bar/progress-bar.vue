<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend="progressTouchEnd"
        >
        <div class="progress-btn">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {prefix} from 'common/js/dom'
const transfrom = prefix('transform')
const ProgressBtn = 16 
export default {
  name:'progress-bar',
  props:{
      percent:{
          type:Number,
          default:0
      }
  },
  created(){
      this.touch={}//记录touch的变化
  },
  watch:{//percent是变化的所以用watch
      percent(newPercent){//依赖父元素当前歌曲播放时间和总时间百分比
        if(newPercent > 0 && this.touch.inited){//设置权限,在touch时不应该计算percent值,解决进度条跳动
            let progressWidth =  this.$refs.progressBar.clientWidth - ProgressBtn
            let offsetPercent = progressWidth * newPercent
            this.countOffset(offsetPercent)            
        }
      }
  },
  methods:{
      progressTouchStart(e){
        this.touch.inited =false//加锁标记
        this.touch.startX = e.touches[0].pageX//记录点击位置X坐标
        this.touch.left = this.$refs.progress.clientWidth //记录内部进度条目前长度
      },
      progressTouchMove(e){
        if(this.touch.inited){
            return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX  
        //移动时记录点击相对滑动开始时的偏移量
        const offsetWidth = Math.min( this.$refs.progressBar.clientWidth - ProgressBtn,Math.max(0,this.touch.left + deltaX))
        //计算拖动后的偏移量,设置最大值,最小值.
        this.countOffset(offsetWidth)
        let percent = this.onTouch()//实现拖动改变播放时间
        this.$emit('changeTime',percent)
      },
      progressTouchEnd(){
          this.touch.inited = true
          this.onTouch()
      },
      countOffset(offsetPercent){
        this.$refs.progress.style.width = offsetPercent + 'px'
        this.$refs.progressBtn.style[transfrom] = `translate3d(${offsetPercent}px,0,0)`         
      },
      onTouch(){//滑动后,计算进度条位置,通知player改变歌曲进度或者歌曲时间.
          let progressBarWidth = this.$refs.progressBar.clientWidth - ProgressBtn
          let progressInnerWidth = this.$refs.progress.clientWidth
          let percent = progressInnerWidth / progressBarWidth
          this.$emit('touchEnd',percent)
          return percent
      },
      progressClick(e){
          this.countOffset(e.offsetX)
          this.onTouch()//实现点击改变播放时间
      }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>

