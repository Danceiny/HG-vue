var language = (navigator.browserLanguage || navigator.language).toLowerCase()

if(language == "zh-cn"){
  language = "zh_Hans"
}else if(language == "zh-tw"){
  language = "zh_Hant"
}else{
  language = language.replace("-", "_")
}

var textMap = {
  "zh_Hans" : require('./text/zh_Hans.js')
}
if(!textMap[language]){
  language = "zh_Hans"
}
var textMap = textMap[language]

function getText(key){
  var text = key;
  if(textMap[key]){
    text = textMap[key];
  }
  if(arguments.length > 1){
    for(var i = 1; i < arguments.length; i++){
      var regExp = new RegExp("#p"+i+"#", "g"); 
      text = text.replace(regExp, arguments[i]);
    }
  }
  return text;
}

export default {
  install (vue, option){
    if (!vue.prototype.$AT_L) {
      vue.prototype.$AT_L = getText;  //获取文案
    }
  }
}
