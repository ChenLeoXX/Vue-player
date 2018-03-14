import originJSONP from 'jsonp'

export default function jsonp(url,data,opt){
    url += (url.includes('?')? '&' : '?') + param(data)
    return new Promise((resolve,reject)=>{
            originJSONP(url,opt,(err,data)=>{
                if(!err){
                    resolve(data)
                }else{
                    reject(err)
                }
            })
    })
}
function param(data){
    let url =''
    for (var key in data){
        let value = data[key]? data[key] :""
        url += `&${key}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) :''
}