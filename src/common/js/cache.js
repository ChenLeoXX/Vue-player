import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15
const PLAY_KEY = "__play__"
const PLAY_MAX_LEN = 100
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200
 function insertArray(arr,val,compareFunc,maxlen){//一个搜索历史保存函数,比较函数对比结果返回索引做对应处理
    const index = arr.findIndex(compareFunc) 
    if(index === 0) return 
    if(index > 0){
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(maxlen && arr.length > maxlen ){
        arr.pop()
    }
}

export function saveSearch(query){
   let searchHistory =  storage.get(SEARCH_KEY,[])//从localstorage获取搜索历史,如果没有就默认为空数组
   insertArray(searchHistory,query,(item)=>{
       return item === query
   },SEARCH_MAX_LEN);
   storage.set(SEARCH_KEY,searchHistory)
   return searchHistory
}
export function loadSearch() {//自动加载 localstorage 
    return storage.get(SEARCH_KEY, [])
  }
export function deleteHistory(query){//删除历史逻辑
let searchHistory = storage.get(SEARCH_KEY)
 let index = searchHistory.indexOf(query)
 if(index > -1){
     searchHistory.splice(index,1)
 }
 storage.set(SEARCH_KEY,searchHistory)
 return searchHistory
}
export function clearAllHistory(){//删除全部历史
   storage.remove(SEARCH_KEY)
   return [] 
}

export function savePlay(song){//保存搜索历史
    let historyArr = storage.get(PLAY_KEY,[])
    insertArray(historyArr,song,(item)=>{
        return item.id === song.id
    },PLAY_MAX_LEN)
    storage.set(PLAY_KEY,historyArr)
    return historyArr
}

export function loadPlay(){
    return storage.get(PLAY_KEY,[])
}

export function saveFavorite(song){//收藏储存
    let favoriteArr = storage.get(FAVORITE_KEY,[])
    insertArray(favoriteArr,song,(item)=>{
        return item.id === song.id
    },FAVORITE_KEY)
    storage.set(FAVORITE_KEY,favoriteArr)
    return favoriteArr
}
function deleteFormArray (arr,compareFunc){
 let index = arr.findIndex(compareFunc)
 if(index > -1){
     arr.splice(index,1)
 }
}
export function deleteFavorite(song){//取消收藏
   let favoriteArr = storage.get(FAVORITE_KEY,[])  
    deleteFormArray(favoriteArr,(item)=>{
        return item.id === song.id
    })
    storage.set(FAVORITE_KEY,favoriteArr)
    return favoriteArr
}

export function loadFavorite(){
    return storage.get(FAVORITE_KEY,[])
}
