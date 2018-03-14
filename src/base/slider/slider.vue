<template>
    <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  name:"slider",
  data(){
      return{
          dots:[],
          currentPageIndex: 0
      }
  },
  props:{
        loop:{
            type:Boolean,
            default:true,
        },
        autoPlay:{
            type:Boolean,
            default:true,
        },
        interval:{
            type:Number,
            default:3000,
        }        
    },
    mounted(){
        setTimeout(()=>{//setTimout在这里为了和浏览器刷新率差不多,在mounted周期里确保能取到元素
            this._setSliderWidth()
            this._initDots() //初始化轮播下标,再初始化轮之前,为了确保轮播下的子元素长度还是5
            this._initSlider()//初始化轮播,无限轮播会改动子元素长度

            if (this.autoPlay) {
            this._play()//自动轮播
        }        
        },20) //设置20毫秒延时.
        window.addEventListener('resize',()=>{//监听窗口的 变化,来重新计算轮播容器宽度
        if (!this.slider || !this.slider.enabled) {//如果轮播还未初始化,或者无法使用return掉
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this._refresh()//重新计算轮播容器宽度
        }, 60)
        })
    },
    activated() {//生命周期钩子
      this.slider.enable()
      let pageIndex = this.slider.getCurrentPage().pageX
      this.slider.goToPage(pageIndex, 0, 0)
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {//生命周期钩子
      this.slider.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy() {//生命周期钩子
      this.slider.disable()
      clearTimeout(this.timer)
    },    
  methods:{
      _setSliderWidth(isResize){ //传递一个isResize 确保每一次resize不会再触发2 * width的计算,但在第一次时会计算
          this.children = this.$refs.sliderGroup.children
          let width=0  //全部宽度
          let sliderWidth = this.$refs.slider.clientWidth //轮播容器宽度
          for(let i = 0;i<this.children.length;i++){
              let child = this.children[i]
              addClass(child,'slider-item')
              child.style.width = sliderWidth +'px'
              width += sliderWidth
          }
          if(this.loop && !isResize){//如果是无限轮播那么首尾应增加两个子元素的长度
              width += sliderWidth *2
          }
          this.$refs.sliderGroup.style.width = width +'px'
      },
      _initSlider(){
          this.slider = new BScroll(this.$refs.slider,{
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
          })
          this.slider.on('scrollEnd',this._onScrollEnd) //beter-scroll初始化的轮播带有一个scrollEnd事件监听器       
          this.slider.on('touchend', () => {
          if (this.autoPlay) {
            this._play()
          }
        })        
          this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })        
      },
      _play(){
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next()//自动触发scrollEnd 事件
        }, this.interval)          
      },
      _initDots(){
          this.dots = new Array(this.children.length)
      },
      
      _onScrollEnd(){
        let pageInx = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageInx
        if (this.autoPlay) {
          this._play()
        }                  
      },      
        _refresh() {//重新计算轮播宽度
        if (this.slider) {
          this._setSliderWidth(true)
          this.slider.refresh()
        }
      }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
