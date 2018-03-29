<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">大家都在搜</h1>
          <ul>
            <li @click="addQuery(item.k)" class='item' v-for="(item,index) in hotKey" :key="index">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clearAll">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @selectItem="selectItem"></suggest>
    </div>
  </div>
</template>
<script>
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapActions,mapGetters} from 'vuex'
export default {
  data(){
    return{
      hotKey:[],
      query:""
    }
  },
computed:{
  ...mapGetters([
    'searchHistory'
  ])
},  
  created(){
    this._getHotKey()
  },
  methods:{
    onQueryChange(query){//监听searchBox V-model传出来的query
    this.query = query
    },
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey(){
      getHotKey().then((res)=>{
        if(res.code === ERR_OK){
          this.hotKey = res.data.hotkey.slice(0,10)
        }
      })
    },
    blurInput(){
      this.$refs.searchBox.blur()
    },
    selectItem(){
      this.setHistory(this.query)
    },
    ...mapActions([
      'setHistory',
      'clearAll',
      'deleteOne'
    ])
  },
  components:{
    SearchBox,
    Suggest,
    SearchList
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: rgb(49, 194, 124)
            border-bottom :1px solid rgba(8, 136, 74, 0.78)
            padding-bottom: 10px;            
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 102px
            border:1px solid 
            background: #fff
            font-size: $font-size-medium
            color: #000
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: #31c27c
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: #31c27c
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>


