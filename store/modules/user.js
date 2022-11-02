export default {
	state: {
		userCookie: '',
		userToken: '',
		userInfo: {
			userName: '',
			userId: '',
			userPic: '',
			avatarUrl: ''
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
