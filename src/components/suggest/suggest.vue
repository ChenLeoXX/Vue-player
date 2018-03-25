<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullUp"
          @scrollToEnd="searchMore"
          ref="suggest"
  >
      <ul class="suggest-list">
          <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
              <div class="icon">
                  <i class="icon-music"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getSongName(item)"></p>
              </div>
          </li>         
      <loadding v-show="hasMore"></loadding>
      </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>      
  </scroll>
</template>
<script>
import noResult from 'base/no-result/no-result'
import Scroll from 'base/scroll/scroll'
import Loadding from 'base/loadding/loadding'
import {mapActions} from 'vuex'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
const perpage = 20//每一页的搜索结果
export default {
data(){
    return{
        page:1,
        result:[],
        hasMore:true,
        pullUp:true
    }
},
components:{
    Scroll,
    Loadding,
    noResult
},
  props:{
      query:{
          type:String,
          default:''
      },
      showSinger:{
          type:Boolean,
          default:false,
      },
  },
  watch:{
      query(){//监听query变化,重新获取数据
          this._search()
      }
  },
  methods:{
      _search(){//调用接口获取数据
            this.page=1//当query变化时候重置搜索条件
            this.hasMore= true//当query变化时候重置搜索条件
            this.$refs.suggest.scrollTo(0,0) //当query变化时候重置搜索条件
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
              if(res.code === ERR_OK){
                  this.getResult(res.data).then((result)=>{
                      this.result = result
                  })
              }
              this.checkMore(res.data.song)//确认是否还有更多数据
          })
      },
      getResult(data){//初始化歌曲
          let ret = []
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })          
      },
      getSongName(item){//初始化歌曲
          return `${item.name}-${item.singer}`
      },
      _normalizeSongs(list) {//初始化歌曲
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      checkMore(data){
        let song = data
        if(song.list.length === 0 || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum){
            this.hasMore = false
        }
      },
      searchMore(){//上拉加载,根据scroll组件派发的pullup事件
          if(!this.hasMore) return
          this.page++
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
              if(res.code === ERR_OK){
                  this.getResult(res.data).then((result)=>{
                      this.result = this.result.concat(result)//合并新的结果
                  })
              }
              this.checkMore(res.data.song)//确认是否还有更多数据              
          })
      },
      //搜索结果中播放歌曲,多次mutation应调用action
      selectItem(song){
          this.insertSong(song)
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

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>


