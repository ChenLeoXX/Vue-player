<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
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
  watch:{//percent是变化的所以用watch
      percent(newPercent){//依赖父元素当前歌曲播放时间和总时间百分比
        let progressWidth =  this.$refs.progressBar.clientWidth - ProgressBtn
        let offsetPercent = progressWidth * newPercent
        this.$refs.progress.style.width = offsetPercent + 'px'
        this.$refs.progressBtn.style[transfrom] = `translate3d(${offsetPercent}px,0,0)`
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

