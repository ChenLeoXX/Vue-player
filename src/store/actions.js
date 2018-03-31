import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import storage from 'good-storage'
import {saveSearch,clearAllHistory,deleteHistory} from 'common/js/cache'

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

export const insertSong = function({commit,state},song){
    let playList = state.playList.slice(0) //播放列表,复制副本不直接引用.
    let sequenceList = state.sequenceList.slice(0)//歌曲列表
    let currentIndex = state.currentIndex
    //记录当前歌曲,用作歌曲列表插入
    let currentSong = playList[currentIndex]
    //记录当前播放列表中是否有要插入歌曲
    let fpIndex= findIndex(playList,song)
    //插入歌曲所以索引+1
    currentIndex++
    //插入歌曲
    playList.splice(currentIndex,0,song)
    //如果歌曲已经存在,判断之前歌曲位置,分两种情况,删除之前歌曲
    if(fpIndex > -1){
        if(currentIndex > fpindex){//当前相同歌曲索引在之前相同歌曲后面
            playList.splice(fpindex,1)//
            currentIndex--
        }else{
            playList.splice(fpIndex+1,1)
        }
    }
    let currentInsertIndex = findIndex(sequenceList,currentSong) + 1 //歌曲列表要插入的位置
    let fpindex = findIndex(sequenceList,song) //是否有相同歌曲
    sequenceList.splice(currentInsertIndex,0,song)
    if(fpindex > -1){//存在分情况,操作歌曲列表
        if(currentInsertIndex > fpindex){
            sequenceList.splice(fpIndex,1)
        }else{
            sequenceList.splice(fpIndex +1 ,1)
        }
    }
    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

export const setHistory = function({commit},query){
   commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteOne = function ({commit},query){
    commit(types.SET_SEARCH_HISTORY,deleteHistory(query))
}
export const clearAll = function ({commit}){
    commit(types.SET_SEARCH_HISTORY,clearAllHistory())
}

export const deleteSong = function({commit,state},song){
    let _playList = state.playList.slice()
    let _sequenceList = state.sequenceList.slice()
    let cIndex = state.currentIndex//目前播放歌曲的索引
    let pIndex = findIndex(_playList,song)//找出播放列表中将要删除歌曲索引
    _playList.splice(pIndex,1)
    let sIndex = findIndex(_sequenceList,song)
    _sequenceList.splice(sIndex,1)
    //判断要删除的歌曲在列表中是否小于正在播放的索引,或者是列表中最后一首歌
    if(pIndex < cIndex || cIndex === _playList.length){
        cIndex--
    }
    console.log(song)
    console.log(pIndex,cIndex)
    commit(types.SET_PLAYLIST,_playList)
    commit(types.SET_SEQUENCE_LIST,_sequenceList)
    commit(types.SET_CURRENT_INDEX,cIndex) //改变当前歌曲
    
    //如果是列表最后剩下一首歌被删除,改变状态,并在watcher中return掉播放逻辑
    let playingState = _sequenceList.length >0
    commit(types.SET_PLAYING_STATE,playingState)
  
}

export const clearList = function({commit}){//如果列表删除到最后一首歌,执行初始化逻辑,不然播放列表为空数组,索引-1,报错
    commit(types.SET_PLAYING_STATE,false)
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_PLAY_MODE,0)
}