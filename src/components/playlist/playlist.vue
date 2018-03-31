<template>
  <transition name="list-fade">
      <div class="playlist" v-show="showFlag" @click="hide">
          <div class="list-wrapper" @click.stop>
              <div class="list-header">
                  <h1 class="title">
                      <i class="icon" :class="playMode" @click="changeMode" style="color: rgba(104,204,155,0.88);"></i>
                      <span class="text">{{msgType}}</span>
                      <span class="clear" @click="showConfirm">
                          <i class="icon-clear"></i>
                      </span>
                  </h1>
              </div>
              <scroll class="list-content" ref="scroll">
                  <transition-group name="list" ref='list' tag="ul">
                      <li class="item" v-for="(item,index) in sequenceList" :key="item.id"
                          @click="selectItem(item,index)"
                      >
                          <i class="current" :class="getCurrentItem(item)"></i>
                          <span class="text">{{item.name}}</span>
                          <span class="like">
                              <i class="icon-not-favorite"></i>
                          </span>
                          <span class="delte" @click.stop="deleteOne(item)">
                              <i class="icon-delete"></i>
                          </span>
                      </li>
                  </transition-group>
              </scroll>
              <!-- <div class="list-operate">
                  <div class="add">
                      <i class="icon-add"></i>
                      <span class="text">添加歌曲到队列</span>
                  </div>
              </div> -->
              <div class="list-close" @click="hide">
                  <span>关闭</span>
              </div>
          </div>
          <confirm text="是否要清除播放列表歌曲" @confirm="confirmClear" confirmBtn="清除" ref="confirm"></confirm>
      </div>
  </transition>
</template>
<script>
import {playerMixin} from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import {playMode} from 'common/js/config'
import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  mixins:[playerMixin],
  data(){
      return{
          showFlag:false
      }
  },
  components:{
        Scroll,
        Confirm
  },
  computed:{
      ...mapGetters([
          'playList',
          'sequenceList',
          'currentSong',
          'mode'
      ])
  },
  watch:{
      currentSong(newSong,oldSong){
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }          
          this.scrollToCurrent(newSong)
      },
  },
  methods:{
      show(){
          //因为v-show控制DOM结构,display会导致获取不到滚动的高度信息,所以,进去的时候调用刷新方法
          this.showFlag = true
          this.$nextTick(()=>{
              this.$refs.scroll.refresh()
              this.scrollToCurrent(this.currentSong)
          },)
      },
      hide(){
          this.showFlag = false
      },
      getCurrentItem(item){//播放图标切换
          if(item.id === this.currentSong.id){
              return 'icon-play'
          }
      },
      selectItem(item,index){//点击播放逻辑
          if(this.mode === playMode.random){
             index = this.playList.findIndex((song)=>{
                 return song.id === item.id
             })
          }
         this.setCurrentSong(index)
         this.setPlayingState(true)
      },
      scrollToCurrent(current){//自动滚动到正在播放的歌曲
          let index = this.sequenceList.findIndex((song)=>{
              return song.id === current.id
          })
          this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index],300)
      },
      deleteOne(song){
          this.deleteSong(song)
          if(!this.playList.length){
              this.hide()
          }
      },
      showConfirm(){
          this.$refs.confirm.show()
      },
      confirmClear(){
        this.clearList()
        this.hide()
      },
      ...mapMutations({
          setCurrentSong:'SET_CURRENT_INDEX',
          setPlayingState:'SET_PLAYING_STATE'
      }),
      ...mapActions([
          'deleteSong',
          'clearList'
      ])
  },
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: rgba(104, 204, 155, 0.87)
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>


