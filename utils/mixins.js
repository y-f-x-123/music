// 上一首,下一首,随机播放处理逻辑
export const mixin_hm = {
	methods: {
		// 找到将要播放的音乐
		handldFindPlaySong_mixin(type, id, musicList) {
			if (!['random', 'previous', 'next'].includes(type) || !id || musicList.length === 0) return

			// type (previous == 上一首，next == 下一首，random == 随机)
			let musicListLength = musicList.length
			// 找到正在播放的音乐项的下标
			let nowPlayIndex = musicList.findIndex(item => item?.id === id)

			// 设置将要播放的下标
			let willPlayIndex = 0

			if (type === 'random' || nowPlayIndex === -1) {
				// nowPlayIndex === -1 即找不到正在播放的音乐项，那就随机播放

				// 设置将要播放的下标		
				let number = Math.floor(Math.random() * musicListLength)

				// 随机到相同的音乐，即刚播放的音乐，重新设置随机音乐,即随机number
				willPlayIndex = number === nowPlayIndex ? Math.floor(Math.random() * musicListLength) : number

			} else {
				// 上一首，下一首
				let number = type === 'previous' ? --nowPlayIndex : ++nowPlayIndex
				/**
				 * number > musicListLength - 1 说明是 下一首，且超过音乐列表长度，重新赋值给下标为0的第一个
				 * number < 0  说明是上一首，且是下标为0的第一的歌曲的上一首，重新赋值给音乐列表的最后一首，
				 * 
				 */
				// 设置将要播放的下标
				willPlayIndex = number > musicListLength - 1 ? 0 : number < 0 ? musicListLength - 1 : number
			}
			// 找到将要播放的音乐项
			let musicItem = musicList.find((item, index) => index === willPlayIndex)
			return musicItem
		},

		// 存储将要播放音乐信息，并触发自定义事件，完成播放
		handlePlayMusic_mixin(type, id, musicList) {
			let musicItem = this.handldFindPlaySong_mixin(type, id, musicList)
			// 存储 音乐信息 到 vuex
			this.$store.commit('setMusicDetial', {
				id: musicItem?.id || '',
				image: musicItem?.al?.picUrl || '',
				musicName: musicItem?.name || ''
			})

			// 触发自定义事件，让音乐播放页面重新获取歌曲
			uni.$emit('getMusicInfoNew')
		}
	}
}
