import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

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

