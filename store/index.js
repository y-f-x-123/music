import Vue from 'vue'
import Vuex from 'vuex'

// 导入模块
import user from '@/store/modules/user'
import music from '@/store/modules/music'
import songList from '@/store/modules/song-list'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
export default
new Vuex.Store({
	modules: {
		user,
		music,
		songList
	}
})
