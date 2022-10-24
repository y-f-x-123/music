import App from './App'
import { request } from './utils/request'
import uView from 'uview-ui'

// vuex
import store from './store'

// #ifndef VUE3
import Vue from 'vue'
// 挂在全局请求方法
Vue.prototype.$http = request
Vue.prototype.$store = store

Vue.config.productionTip = false
Vue.use(uView)

App.mpType = 'app'
const app = new Vue({
  store,
  ...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
// #endif
