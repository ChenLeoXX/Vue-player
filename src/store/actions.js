import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

function findIndex(list,song){
    let index= list.findIndex((item)=>{
        return item.id === song.id
    })
    return index
}
export const selectPlay = function({commit,state},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list)
    if(state.mode === playMode.random){//判断是否是随机播放模式
       let randomList = shuffle(list)
       index= findIndex(randomList,list[index]) 
       commit(types.SET_PLAYLIST,randomList)
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

export const randomPlay = function({commit,state},{list}){//全部随机播放
    commit(types.SET_SEQUENCE_LIST,list)//设置顺序播放列表
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_MODE_TOTAS,true)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}