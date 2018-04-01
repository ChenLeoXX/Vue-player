<template>
  <transition name="slide">
      <div class="add-song" v-show="showFlag" @click.stop>
          <div class="header">
              <h1 class="title">添加歌曲到列表</h1>
              <div class="close" @click="hide">
                  <i class="icon-close"></i>
              </div>
          </div>
          <div class="search-box-wrapper">
            <searchBox @query="onQueryChange" placeholder="搜索歌曲" ref="searchBox"></searchBox>
          </div>
          <div class="shortcut" v-show="!query">
              <switches :switches="switches" :currentIndex="currentIndex"
                         @switch="Switch"    
              >
             </switches>
              <div class="list-wrapper">
                <scroll ref="playList" class="list-scroll" :data="playHistory" v-if="currentIndex === 0">
                    <div class="list-inner">
                        <song-list :songs="playHistory" @select="selectSong"></song-list>
                    </div>
                </scroll>
                <scroll ref="searchList" class="list-scroll" :data="searchHistory" v-if="currentIndex === 1">
                       <div class="list-inner">
                        <search-list :searches="searchHistory"
                                      @delete="deleteOne"
                                      @select="addQuery"
                        ></search-list>
                       </div>
                </scroll>    
              </div>              
          </div>
          <div class="search-result" v-show="query">
              <suggest :query="query" @selectItem="selectSuggset" @listScroll="blurInput"></suggest>              
          </div>
      </div>
  </transition>
</template>
<script>
import {searchMixin} from 'common/js/mixin'
import SearchBox from 'base/search-box/search-box'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import Song from 'common/js/song'
import {mapActions,mapGetters} from 'vuex'
export default {
  mixins:[searchMixin],
  data(){
      return{
          showFlag: false,
          switches:[
             {name:"最近播放"},
             {name:"搜索历史"}
          ],
          currentIndex:0
      }
  },
  computed:{
      ...mapGetters([
          'playHistory',
      ])
  },
  components:{
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList
  },
  methods:{
      show(){
        this.showFlag = true
        setTimeout(()=>{//display:block,重新渲染计算高度
            this.refresh()
        },50)
      },
      hide(){
          this.showFlag = false
      },
      Switch(index){
          this.currentIndex = index
      },
      selectSuggset(){
          this.selectItem()
      },
       //这里new是因为,playHistory是从缓存中取到的,并不是song实例,需要调用Song构造函数生成
      selectSong(song,index){
          if(index !==0){
          this.insertSong(new Song(song),index)
          }
      },
      refresh(){
          if(currentIndex === 0 ){
              this.$refs.playList.refresh()
          }else{
              this.$refs.searchList.refresh()
          }
      },
      ...mapActions([
          'insertSong'
      ])
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background:#f7f8f8
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: #000
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>


