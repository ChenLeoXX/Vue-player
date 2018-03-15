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
        state.playlist = list
      },
      [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
      },
      [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
      }    
    
}
export default mutations