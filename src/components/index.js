/**
 * Created by dmy on 2017/5/11.
 */
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css';    // 使用 CSS
import axios from '../components/plugins/axios-api'
import localize from '../components/plugins/localize'

require('../components/common/request/cc_request.js')
require('../components/common/config/config.js')
require('../components/common/config/utils.js')
require('../components/common/config/city.min.js')

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(iView)
Vue.use(axios)
Vue.use(localize)


export default Vue