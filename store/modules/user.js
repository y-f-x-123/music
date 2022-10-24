export default {
	state: {
		userCookie: '',
		userToken: '',
		userInfo: {
			userName: '任性的小狼人',
			userId: '1740054038',
			userPic: '',
			avatarUrl: 'https://p3.music.126.net/I4gVOrwWSp8FAq_C_AvT7Q==/109951165902034902.jpg'
		}
	},
	getters: {
		userCookie: (state) => state.userCookie,
		userToken: (state) => state.userToken,
		userInfo: (state) => state.userInfo,
	},
	mutations: {
		setUserCookie: (state, option) => state.userCookie = option,
		setUserToken: (state, option) => state.userToken = option,
		setUserInfo: (state, option) => state.userInfo = {
			...state.userInfo,
			userName: option.nickname || '',
			...option
		},
	},
	actions: {
		userCookieAction: (context, option) => context.commit('setUserCookie', option),
		userTokenAction: (context, option) => context.commit('setUserToken', option),
		userInfoAction: (context, option) => context.commit('setUserInfo', option),
	}
}
