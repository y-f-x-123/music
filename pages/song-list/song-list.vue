<template>
	<view class="listBox">
		<text class="listBox-title">每日推荐</text>
		<view class="listBox-musicList">
			<view class="music-item" v-for="(item,index) in musicList" :key="item.id">
				<view class="music-item-left">
					<text class="music-item-num">{{index + 1}}</text>
					<view class="music-item-info">
						<image :src="item.al.picUrl || `../../static/logo.png`" class="music-item-info-image"></image>
						<view class="music-item-info-right">
							<text>{{item.name}}</text>
							<text>{{item.ar[0].name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 歌曲列表
				musicList: []
			};
		},
		mounted() {
			this.getMusicList()
		},
		methods: {
			// 获取歌曲列表
			async getMusicList() {
				try {
					const res = await this.$http({
						url: `/recommend/songs`
					})
					if (res.code === 200) {
						this.musicList = res.data.dailySongs || []
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	}
</script>

<style lang="less">
	.listBox {
		padding: 0 20rpx;

		& .listBox-title {
			display: block;
			padding: 20rpx 0;
			font-size: 32rpx;
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
