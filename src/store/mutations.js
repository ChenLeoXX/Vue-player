import * as types from './mutation-types'
//ES6的模块语法,*代表改文件里的所有export出来的对象集合
const mutations = {
    //第一个参数为vuex里的管理数据的state对象,第二个参数为荷载可以理解为额外的参数,它可以是一个对象,或者基本类型.
    [types.SET_PLAYING_STATE](state,flag){
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
      },
      [types.SET_PLAYLIST](state, list) {
        state.playList = list
      },
      [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
      },
      [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
      },
      [types.SET_DISC](state,disc){
        state.disc=disc
      },
      [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex=index
      },
      [types.SET_MODE_TOTAS](state,boolean){
        state.modeChange = boolean
      },
      [types.SET_TOP_LIST](state,toplist){
        state.topList = toplist
      },
      [types.SET_SEARCH_HISTORY](state,history){
        state.searchHistory = history
      },
      [types.SET_PLAY_HISYORY](state,history){
        state.playHistory = history
      },
      [types.SET_FAVORITE_HISTORY](state,history){
        state.favoriteHistory = history
      }   
}
export default mutations