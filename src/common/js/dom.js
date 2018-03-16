export function addClass(el,className){
    if(hasClassName(el,className)){
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className= newClass.join(' ')
}
function hasClassName(el,className){
  let reg = new RegExp('(^|\\s)'+ className+ '(\\s|$)')
  return reg.test(el.className)
}
//JS方法添加前缀
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefix(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
