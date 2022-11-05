<template>
	<view class="detailsBox">
		<text class="musicName ellipsis">{{musicDetial.musicName || `正在播放音乐`}}</text>
		<!-- 旋转磁盘 -->
		<view class="portrait">
			<!-- 摇杆 -->
			<view class="rocker-box">
				<image :class="{ rockerAnimation }" class="rocker" src="../../static/song/needle.png"></image>
				<view class="rocker-radius"></view>
			</view>
			<!-- 头像磁盘 -->
			<view class="bgImage">
				<image :class="{ diskAnimation }" class="bgImage-photo" :src="musicDetial.image || `../../static/image/nahatenahte.png`" mode=""></image>
			</view>
		</view>
		<!-- 音乐控件 -->
		<view class="music-tool">
			<!-- 进度 -->
			<view class="music-progress">
				<text class="progress-time">{{musicTime.star}}</text>
				<text class="progress-line">
					<text class="progress-line-radius" :style="{width:playMusicWidth + 'px'}"></text>
				</text>
				<text class="progress-time">{{musicTime.end}}</text>
			</view>
			<!-- 控件 -->
			<view class="music-controls">
				<!-- 播放模式 -->
				<text class="controls-same iconfont" :class="[playModelIcon[useModel]]" @click="handleMusicModel(useModel)"></text>
				<!-- 上一首 -->
				<text class="controls-same iconfont icon-shangyishou_huaban" @click="handleMusicSwitch('previous')"></text>
				<!-- 播放/暂停 -->
				<text class="controls-same iconfont" :class="isPlay ? `icon-24gl-pauseCircle`:`icon-24gl-playCircle`" @click="handlePlayMusic(isPlay)"></text>
				<!-- 下一首 -->
				<text class="controls-same iconfont icon-xiayishou_huaban" @click="handleMusicSwitch('next')"></text>
				<!-- 音乐列表 -->
				<text class="controls-same iconfont icon-bofangliebiao"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import cellGroup from 'uview-ui/libs/config/props/cellGroup';
	export default {
		data() {
			return {
				// 摇杆动画
				rockerAnimation: false,
				// 磁盘动画
				diskAnimation: false,

				// 是否播放音乐
				isPlay: false,

				// 音乐播放时长
				musicTime: {
					star: '00:00',
					end: ''
				},

				// 显示音乐进度条长度
				playMusicWidth: 0,

				// 音乐播放模式 icon
				playModelIcon: [
					'icon-xunhuan',
					'icon-24gl-repeatOnce2',
					'icon-24gl-repeat2',
				], //index 值 0 为随机 ； 1为单曲； 2为顺序；
				// 正在使用的播放模式（默认随机）
				useModel: 0,

				// 正在播放的音乐信息(id，头像，名字)
				musicDetial: this.$store.state.music.musicDetial || {},

				// 正在播放的音乐详细信息（调用接口，获取url即播放时长）
				playMusicOtions: '',

				// 音乐播放器（uni.createInnerAudioContext() 手动创建播放器）
				musicAudio: {},

				// 定时器,用来获取音乐播放时长(辣鸡 onTimeUpdate 方法用不了,借用定时器)
				musicInterval: null,

				// 用于用来播放上一首，下一首时命名自定义监听事件
				fromPage: '',
			}
		},
		onLoad(e) {
			// 用于用来播放上一首，下一首时命名自定义监听事件
			this.fromPage = e.page

			// 创建音乐播放器
			this.musicAudio = uni.createInnerAudioContext()

			// 自定义事件，监听音乐信息的更改，用来播放上一首，下一首
			this.handleMusicChange()
		},
		mounted() {
			this.getMusicDetail()
		},
		methods: {
			// 音乐播放模式切换
			handleMusicModel(index) {
				// index 值 0 为随机 ； 1为单曲； 2为顺序；
				this.useModel = index === this.playModelIcon.length - 1 ? 0 : index + 1
			},
			// 获取音乐
			async getMusicDetail() {

				let res = await this.$http({
					url: '/song/url/v1',
					data: {
						id: this.musicDetial.id || '',
						level: 'hires'
					}
				})
				if (res.code == 200) {
					this.playMusicOtions = res.data[0] || {}
					// 有音乐地址才赋值给音乐播放器
					this.musicAudio.src = res.data[0]?.url || ''

					// 音乐地址不可用时，弹出提示框，返回上一页面或下一首
					if (!res.data[0]?.url) {
						uni.showModal({
							title: '歌曲出错',
							content: '该歌曲不可用，自动切换下一首',
							fail() {
								uni.navigateBack()
							},
							success: (res) => {
								if (res.confirm) {
									this.handleMusicSwitch('next')
								} else if (res.cancel) {
									uni.navigateBack()
								}
							},
						})
						return
					}


					// 设置音乐总时长
					this.musicTime.end = dayjs(res.data[0]?.time || 0).format('mm:ss') || '00:00'
					this.musicTime.star = '00:00'
					// 播放音乐
					this.handlePlayMusic(false)
				}
			},
			// 播放/暂停音乐
			handlePlayMusic(flag) {
				// 音乐地址不可用，不给播放
				if (!this.musicAudio.src) return

				// 是否播放
				this.isPlay = !flag
				// 摇杆动画
				this.rockerAnimation = this.isPlay
				// 磁盘动画
				this.diskAnimation = this.isPlay

				// 进度条标签节点 progress-line（用来计算设置音乐进度条）
				let progressWidth = 0
				uni.createSelectorQuery().in(this).select(".progress-line").boundingClientRect((data) => {
					progressWidth = Number(data.width)
				}).exec()
				// 播放/暂停
				if (this.isPlay) {
					// 延迟一秒播放，同磁盘动画同步
					setTimeout(() => {
						this.musicAudio.play() //播放
					}, 1000)
					// 开始时间
					this.musicInterval = setInterval(() => {
						// 设置播放已经播放的时间
						this.musicTime.star = dayjs(this.musicAudio.currentTime * 1000).format('mm:ss')

						// 设置音乐进度条
						this.playMusicWidth = this.musicAudio.currentTime * progressWidth / this.musicAudio.duration || 0
					}, 100)

					// 监听音乐自然播放事件结束
					this.musicAudio.onEnded(this.playMusicEnd)

				} else {
					// 清除定时器
					clearInterval(this.musicInterval)
					//暂停
					this.musicAudio.pause()
					// 取消监听音乐自然播放事件结束
					this.musicAudio.offEnded(this.playMusicEnd)
				}
			},
			// 歌曲切换（播放下一首，上一首）
			handleMusicSwitch(type) {
				// 切换音乐时，暂停音乐，最后获取音乐地址时会自动播放
				this.isPlay = !this.isPlay

				// 切换时先判断播放模式
				type = this.useModel === 0 ? 'random' : type
				/**
				 * this.fromPage是判断从那个页面跳转过来，用于实现播放页面和该页面的自定义监听事件
				 */
				uni.$emit(`playMusic_${this.fromPage || ''}`, {
					type,
					id: this.musicDetial.id
				})
			},

			// 音乐自然播放结束
			playMusicEnd() {
				// 取消监听音乐自然播放事件结束
				this.musicAudio.offEnded(this.playMusicEnd)
				//	this.useMode值 0 为随机 ； 1为单曲； 2为顺序；
				// 随机和顺序调用下一首，单曲不用调用
				let type = this.useModel === 0 ? 'random' : this.useModel === 1 ? 'once' : 'next'

				if (type === 'once') {
					// 重新播放音乐
					this.handlePlayMusic()
				} else {
					this.handleMusicSwitch(type)
				}
			},
			// 自定义事件，监听音乐信息的更改，用来播放上一首，下一首
			handleMusicChange() {
				uni.$on('getMusicInfoNew', () => {
					// 播放实例销毁，在重新创建播放器，不然上一首，下一首会有播放不了
					this.musicAudio.destroy()
					this.musicAudio = uni.createInnerAudioContext()
					// 更新最新要播放的音乐信息
					this.musicDetial = this.$store.state.music.musicDetial || {}
					// 获取音乐播放地址
					this.getMusicDetail()
				})
			}
		},
		onUnload() {
			this.musicAudio.stop()
			// 播放实例销毁，不然重新打开页面会多个播放器 bug
			this.musicAudio.destroy()
			// 清除定时器
			this.musicInterval = null
		}
	}
</script>

<style lang="less" scoped>
	.detailsBox {
		display: flex;
		flex-direction: column;
		padding: 0 40rpx;
		height: 100%;
		background: #ddd;

		.musicName {
			margin: 20rpx auto;
			text-align: center;
			height: 100rpx;
			width: 80%;
			line-height: 100rpx;
			font-size: 40rpx;
		}

		.portrait {
			margin: 40rpx auto 0 auto;
			position: relative;

			.rocker-box {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-20%);

				.rocker {
					width: 170rpx;
					height: 300rpx;
					transform-origin: 0rpx 0rpx;
					transform: rotate(-12deg);
					transition: all 1s;
				}

				// 摇杆动画实现
				.rockerAnimation {
					transform: rotate(0deg);
					// animation: rockerAnimation 1s forwards;
				}

				.rocker-radius {
					width: 66rpx;
					height: 66rpx;
					background-color: #fff;
					border-radius: 33rpx;
					position: absolute;
					top: -30rpx;
					left: 5rpx;
				}
			}

			.bgImage {
				margin-top: 180rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 500rpx;
				height: 500rpx;
				background: url('/static/song/disc.png');
				background-size: cover;
				transition: all 1s;

				.bgImage-photo {
					width: 300rpx;
					height: 300rpx;
					border-radius: 150rpx;
				}
			}

			// 磁盘动画，旋转实现
			.diskAnimation {
				animation: diskAnimation 3s linear 1s infinite;
			}
		}

		.music-tool {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			padding: 100rpx 0;

			.music-progress {
				display: flex;
				justify-content: center;
				align-items: center;

				.progress-line {
					position: relative;
					top: 0;
					left: 0;
					width: 480rpx;
					margin: 0 10rpx;
					height: 4rpx;
					background-color: #999;

					.progress-line-radius {
						position: absolute;
						height: 4rpx;
						width: 200rpx;
						background: red;

						::after {
							position: absolute;
							top: -50%;
							right: 0;
							content: '';
							width: 10rpx;
							height: 10rpx;
							border-radius: 5rpx;
							background: #fff;
						}
					}
				}
			}
		}

		// 播放控件
		.music-controls {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 200rpx;

			.controls-same {
				font-size: 70rpx;
				color: #333;
			}

			// 播放/暂停
			.controls-play {
				width: 120rpx;
				height: 120rpx;
			}
		}
	}

	// 磁盘动画，旋转
	@keyframes diskAnimation {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
