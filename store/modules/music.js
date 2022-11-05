export default {
	state: {
		// 播放音乐页面的歌曲详细信息
		musicDetial: {
			id: '',
			image: '',
			musicName: ''
		},
	},
	getters: {
		musicDetial: (state) => state.musicDetial,
	},
	mutations: {
		setMusicDetial: (state, option) => state.musicDetial = {
			...option,
			id: option.id || '',
			image: option.image || option.img || option.url || '',
			musicName: option.name || option.musicName || ''
		},
	},
	actions: {
		setMusicDetialAction: (context, option) => context.commit('setMusicDetial', option),
	}
}
