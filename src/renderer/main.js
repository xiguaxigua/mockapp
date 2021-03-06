import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import ElementUI from 'element-ui'

import './style.scss'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, { size: 'small' })

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.config.silent = true

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
