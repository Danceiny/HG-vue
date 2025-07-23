/**
 * Created by dmy on 2017/4/21.
 */
import axios from 'axios'

let options = {}
if (process.env.NODE_ENV == 'development') {
    options.baseURL = `http://hack.cannot.cc/`
}

let $axios

export default {
  install (vue) {
    if (!vue.$axios) {
      vue.$axios = axios.create(options)
        
      // 跨域请求时需要
      vue.$axios.defaults.headers['Content-Type'] = 'text/plain' 
      // vue.$axios.defaults.withCredentials=true // 开启全局请求带cookies
    }

    vue.mixin({
      created: function () {
        this.$axios = vue.$axios
      }
    })
  }
}

