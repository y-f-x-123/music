export default {
	state: {
		songListInfo: {
			// 背景图片
			bgImg: '',
			// 列表名称
			name: '',
			// 歌曲列表
			songList: []
		}
	},
	mutations: {
		setSongListInfo: (state, option) => state.songListInfo = {
			...option,
			bgImg: option.bgImg || option.coverImgUrl || option.imgUrl || '',
			name: option.name || option.title || '',
			songList: option.songList || option.list || option.musicList || []
		},
	},
	actions: {
		setSongListInfoAction: (context, option) => context.commit('setSongListInfo', option),
	}
}
