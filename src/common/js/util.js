function randomIndex(min,max){ //返回一定范围的随机数
    return Math.floor(Math.random() * (max-min +1) +min)
}
export const shuffle = function(arr){//洗牌算法,随机交换数组中两个位置的值
    let _arr = arr.slice()
    for( let i=0;i<_arr.length;i++){
        let j = randomIndex(0,i)
        let bus = _arr[i]
         _arr[i] = _arr[j]
         _arr[j] = bus
    }
    return _arr
}