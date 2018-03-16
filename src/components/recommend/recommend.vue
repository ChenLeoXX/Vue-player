<template>
    <div class="recommend" ref="recommend" :data="disclist">
          <scroll ref="scroll" class="recommend-content" :data="disclist">
          <div>
        <!-- 这里的v-if为了等数据到来后才去渲染slider组件 ,否则会直接渲染slider,这时候数据可能还没到来,不能正确渲染-->
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单</h1>
          <ul>
            <li  @click='selectItem(item)' v-for="(item,index) in disclist" :key="index" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="" @load="loadImg">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        </div>
        <div class="loadding-ct" v-show="!disclist.length">
          <loadding></loadding>
        </div>
        </scroll>
      <router-view></router-view>
    </div>
</template>
<script>
import {getRecommend} from 'api/recommend'
import {getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loadding from 'base/loadding/loadding'
import {mapMutations} from 'vuex'
export default {
  name:"recommend",
  components:{
    Slider,
    Scroll,
    Loadding
  },
  data(){
    return{
      recommends:[],
      disclist:[]
    }
  },
  created(){
    this._getRecommend() //异步获取真实数据
    this._getRecommendDiscList()
  },
  methods:{
    _getRecommend(){
      getRecommend().then((res)=>{
        if(res.code === ERR_OK){
          this.recommends = res.data.slider
        }
      })
    },
    _getRecommendDiscList(){
      getDiscList().then((res)=>{
        if(res.code === ERR_OK){
          this.disclist = res.data.list
        }
      })
    },
    loadImg(){
      //因为热门歌单组件获取数据是异步获取,当数据还未到来的时候出发BScroll的
      // 重新计算子元素高度方法,可能会造成计算错误,没有把轮播组件高度算进去
      // 所以使用图片加载事件,当图片被加载完毕后撑起了轮播容器高度,那么再去计算就不会发生无法滚动到底部的BUG
      // 如果单单去监听一个 data的change事件,因为网络的原因,渲染顺序不一定会按顺序,所以这样是最保险的做法.
      if(!this.isLoaded){//节流,避免每一次加载图片就触发一次refresh 造成 浪费
        this.$refs.scroll.refresh(
          this.isLoaded =true
        )
      }
    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc:'SET_DISC'
    })
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loadding-ct
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>


