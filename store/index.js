import Vue from 'vue'
import Vuex from 'vuex'

// 导入模块
import user from '@/store/modules/user'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
export default
new Vuex.Store({
	modules: {
		user
	}
})
