<template>
	<view class="root">
		<view class="bgImg" v-show="musicListInfo.bgImg">
			<image class="bgImg-image" mode="aspectFill" :src="musicListInfo.bgImg || ''"></image>
		</view>
		<view class="listBox">
			<text class="listBox-title" v-if="!musicListInfo.bgImg">{{musicListInfo.name || ''}}</text>
			<view class="listBox-musicList">
				<view class="music-item" v-for="(item,index) in musicList" :key="item.id" @click="goMusicPlay({id:item.id,image:item.al.picUrl,musicName:item.name},index)">
					<view class="music-item-left">
						<text class="music-item-num">{{index + 1}}</text>
						<view class="music-item-info">
							<image :src="item.al.picUrl || `../../static/logo.png`" class="music-item-info-image"></image>
							<view class="music-item-info-right">
								<text class="ellipsis" style="max-width: 500rpx;">{{item.name}}</text>
								<text class="ellipsis" style="max-width: 300rpx;">{{item.ar[0].name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mixin_hm
	} from '../../utils/mixins.js'
	export default {
		mixins: [mixin_hm],
		data() {
			return {
				// 歌曲列表信息
				musicListInfo: {},
				// 歌曲列表
				musicList: [],
				// 正在播放的音乐对应的 歌曲列表的下标，用来查找下一首，上一首，随机等
				playIndex: 0
			};
		},
		created() {
			// 自定义事件，用来监听下一首，上一首，随机播放
			this.handleCustom()
		},
		mounted() {
			this.getMusicInfo()
		},
		methods: {
			// 获取歌曲列表信息
			async getMusicInfo() {
				try {
					let info = this.$store.state.songList || {}
					// 设置音乐列表信息
					this.musicList = info?.songListInfo?.songList || []
					this.musicListInfo = info?.songListInfo
				} catch (e) {
					console.log(e);
				}
			},

			//  自定义事件，用来监听下一首，上一首，随机播放
			handleCustom() {
				uni.$on('playMusic_songList', ({
					type,
					id
				}) => {
					this.handlePlayMusic_mixin(type, id, this.musicList)
				})
			},


			// 跳转到音乐播放页面
			goMusicPlay(objValue, index) {
				// 存储 音乐信息 到 vuex
				this.$store.commit('setMusicDetial', objValue)
				this.playIndex = index
				uni.navigateTo({
					url: `/pages/songDetails/songDetails?page=songList`,
				});
			}
		},
		onUnload() {
			uni.$off('playMusic')
		}
	}
</script>

<style lang="less" scoped>
	// 背景图片
	.bgImg {
		width: 100%;
		height: 300rpx;
		margin-bottom: 20rpx;

		.bgImg-image {
			width: 100%;
			height: 100%;
		}
	}

	.listBox {
		padding: 0 20rpx;

		& .listBox-title {
			display: block;
			margin: 20rpx 0;
			padding: 20rpx 0rpx;
			text-align: center;
			font-size: 36rpx;
			color: #6d6d6d;
		}

		& .listBox-musicList {
			& .music-item:first-child {
				margin-top: 0rpx !important;
			}

			// 前三歌曲排序数字为红，后面变成灰色，字体正常
			& .music-item:nth-child(n+4) {
				.music-item-left {
					& .music-item-num {
						font-size: 36rpx !important;
						color: #000 !important;
					}
				}
			}

			.music-item {
				margin-top: 40rpx;
				height: 100rpx;
				width: 100%;

				.music-item-left {
					display: flex;

					& .music-item-num {
						display: block;
						width: 40rpx;
						height: 100%;
						font-size: 48rpx;
						text-align: center;
						line-height: 100rpx;
						color: #ec4141;
					}

					& .music-item-info {
						display: flex;

						.music-item-info-image {
							width: 100rpx;
							height: 100rpx;
							margin: 0 20rpx;
						}

						.music-item-info-right {
							display: flex;
							flex: 1;
							flex-direction: column;
							justify-content: space-between;
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}
</style>
