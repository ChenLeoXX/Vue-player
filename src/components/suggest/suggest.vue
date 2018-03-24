<template>
  <div class="suggest">
      <ul class="suggest-list">
          <li class="suggest-item" v-for="(item,index) in result" :key="index">
              <div class="icon">
                  <i class="icon-music"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getSongName(item)"></p>
              </div>
          </li>
      </ul>
  </div>
</template>
<script>
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
 const perpage = 20
export default {
data(){
    return{
        page:1,
        result:[]
    }
},
  props:{
      query:{
          type:String,
          default:''
      },
      showSinger:{
          type:Boolean,
          default:false,
      }
  },
  watch:{
      query(){//监听query变化,重新获取数据
          this._search()
      }
  },
  methods:{
      _search(){//调用接口获取数据
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
              if(res.code === ERR_OK){
                  this.getResult(res.data).then((result)=>{
                      this.result = this.result.concat(result)
                  })
              }
          })
      },
      getResult(data){//初始化歌曲
          let ret = []
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })          
      },
      getSongName(item){
          return `${item.name}-${item.singer}`
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },      
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


