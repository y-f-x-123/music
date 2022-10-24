<template>
	<view>
		<!-- <video v-if="true"
			src="http://vodkgeyttp9.vod.126.net/vodkgeyttp8/68sKFbGS_1328070069_hd.mp4?ts=1665398632&rid=08E7FF345FA3037A8C59FE1A82470067&rl=3&rs=TBWVwjkTcOUwKGkMgmDgRUylqCeDVzRR&sign=6071bc49f915e9b4f8aee3eed6d46b68&ext=5DkdJhyaRc342TW6wAHYyTuW%2FuwTchJHsFXqj83iWZb9TUN3c08XnFG7HA4ARct5hqOT7Jgtcq8q2nt%2Fs1eqquvdB6wK5z%2ByAiW2LVh33g43FYPg6ReltoOVfigg5Aq6nIb%2FH%2BYv7xMQaOMTd%2BZNtFePvF2MIqmBAcI7SH0yW%2FwdTVrkPJRAzsxdwL6BV%2FDFcB3EJpcHLWWrTHh6SZb%2BNPpXC9Z3ufYhVaHJW96mbKSH0omKbICLNz51Q9tPmga1"
			controls class="video-scroll-box-item-video"></video> -->
		<!-- 头部导航栏 -->
		<view class="video-nav">
			<u-tabs :list="videoTabsList" @click="handleTabs" :activeStyle="{
				color:'#E14B30' 
			}" lineWidth="0"></u-tabs>
		</view>
		<view class="video-scroll">
			<scroll-view scroll-y class="video-scroll-box">
				<view id="demo1" class="video-scroll-box-item" v-for="item in videoList" :key="item.data.vid">
					<video v-if="playVideoId === item.data.vid" :src="playVideoUrl" controls class="video-scroll-box-item-video" autoplay></video>
					<image v-else :src="item.data.coverUrl" style="height: 400rpx;width: 100%;" mode="aspectFit" @click="handlePlayVideo(item.data.vid)"></image>
					<view class="video-scroll-box-item-text">
						<view class="text">{{item.data.title}}</view>
						<view class="bottom">
							<view class="left">
								<image :src="item.data.creator.avatarUrl" mode="aspectFit"></image>
								<text class="left-text">{{item.data.creator.signature}}</text>
							</view>
							<view class="right">
								<view class="iconfont icon-aixin">
									<text>99999</text>
								</view>
								<view class="iconfont icon-pinglun">
									<text>11</text>
								</view>
								<view class="iconfont icon-xianxingtubiaozhizuomoban-25"></view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import cellGroup from 'uview-ui/libs/config/props/cellGroup';
	export default {
		data() {
			return {
				// 视频标签列表
				videoTabsList: [],
				// 当前选中视频的标签
				videoTabsCurrent: '',
				// 视频列表
				videoList: [],
				// 播放视频id
				playVideoId: '',
				// 播放视频地址
				playVideoUrl: ''
			}
		},
		onShow() {
			// 获取视频标签
			this.getVideoTabsList()
		},
		methods: {
			// 点击视频标签,获取标签下的视频
			handleTabs(option) {
				// 设置当前视频标签的id
				this.videoTabsCurrent = option ? option.id : this.videoTabsCurrent
				this.$http({
					url: `/video/group`,
					data: {
						id: this.videoTabsCurrent,
						offset: 0,
						timestamp: Date.now()
					},
				}).then(res => {
					console.log(res);
					if (res.code === 200) {
						this.videoList = res.datas.slice(0, 10)
					}
				}).catch(e => console.log(e))
			},
			// 获取视频分类列表
			getVideoTabsList() {
				this.$http({
					url: `/video/group/list`
				}).then(res => {
					if (res.code === 200) {
						this.videoTabsList = res.data.slice(0, 10)
						// 设置当前视频标签的id
						this.videoTabsCurrent = res.data[0].id || ''
						// 获取视频标签下的视频
						this.handleTabs()
					} else {
						this.videoTabsList = []
					}
				})
			},
			// 播放视频
			async handlePlayVideo(id) {
				this.$http({
					url: `/video/url`,
					data: {
						id
					}
				}).then(res => {
					if (res.code === 200) {
						this.playVideoId = id
						this.playVideoUrl = res.urls[0].url
						console.log(this.playVideoUrl);
					}
				})
			}
		}
	}
</script>

<style lang="less">
	// 视频滚动区域
	.video-scroll {
		.video-scroll-box {
			height: calc(100vh - 88rpx);

			.video-scroll-box-item {
				margin-bottom: 20rpx;
				padding: 0 20rpx;

				.video-scroll-box-item-video {
					border-radius: 10rpx;
					height: 400rpx;
					width: 100%;
				}

				.video-scroll-box-item-text {
					.text {
						margin: 20rpx 0;
						height: 80rpx;
						width: 50%;
						line-height: 80rpx;
						border-bottom: 1px solid #eee;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.left {
							display: flex;
							align-items: center;

							.left-text {
								display: block;
								width: 400rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							image {
								margin-right: 20rpx;
								width: 60rpx;
								height: 60rpx;
							}
						}

						.right {
							display: flex;

							view {
								margin-left: 40rpx;
								position: relative;
								font-size: 38rpx;

								text {
									font-size: 20rpx;
									position: absolute;
									top: -30rpx;
									right: -20rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
