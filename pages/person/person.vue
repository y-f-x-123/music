<template>
	<view class="personalContainer">
		<view class="user-section">
			<image class="bg" src="/static/image/personal/bgImg2.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box" @click="goLogin">
					<image class="portrait" :src="userInfo.avatarUrl ? userInfo.avatarUrl : '/static/image/personal/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text class="username">{{`${userInfo.userName || '游客'}`}}</text>
				</view>
			</view>

			<view class="vip-card-box">
				<image class="card-bg" src="/static/image/personal/vip-card-bg.png"></image>
				<view class="b-btn"> 立即开通 </view>
				<view class="tit">
					<!-- 会员图标-->
					<text class="iconfont icon-huiyuan-"></text>
					云音乐会员
				</view>
				<text class="e-m">Cloud music Union</text>
				<text class="e-b">开通会员听歌, 享受好心情</text>
			</view>
		</view>

		<view class="cover-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" :style="{
        transform: moveAnimation.translateY,
        transition: moveAnimation.transition
      }">
			<image class="arc" src="/static/image/personal/arc.png"></image>
			<!-- 个人中心导航 -->
			<view class="nav-section">
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-xiaoxi"></text>
					<text>我的消息</text>
				</view>
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-myRecommender"></text>
					<text>我的好友</text>
				</view>
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-gerenzhuye"></text>
					<text>个人主页</text>
				</view>
				<view class="nav-item" hover-class="common-hover" hover-stay-time="50">
					<text class="iconfont icon-gexingzhuangban"></text>
					<text>个性装扮</text>
				</view>
			</view>

			<!-- 个人中心列表 -->
			<view class="personalContent">
				<view class="recentPlayContainer">
					<text class="title">最近播放</text>
					<!-- 最近播放记录 -->
					<scroll-view v-if="playRecord.length > 0" scroll-x class="recentScroll" enable-flex>
						<view class="recentItem" v-for="item in playRecord" :key="item.song.al.id">
							<image :src="item.song.al.picUrl" mode="aspectFit"></image>
						</view>
					</scroll-view>
					<view v-else>暂无播放记录</view>
				</view>

				<view class="cardList">
					<view class="card-item">
						<text class="title">我的音乐</text>
						<text class="more"> > </text>
					</view>
					<view class="card-item">
						<text class="title">我的收藏</text>
						<text class="more"> > </text>
					</view>
					<view class="card-item">
						<text class="title">我的电台</text>
						<text class="more"> > </text>
					</view>
				</view>
			</view>
			<view class="signout" v-if="userInfo.userId && userInfo.userName">
				<text @click="signoutModal=true">退出账号</text>
			</view>
			<!-- 退出账号模态框 -->
			<u-modal :show="signoutModal" @cancel="signoutModal = false" @confirm="signOut" title="是否退出该账号？" showCancelButton confirmColor="#E14B30" width="300px"></u-modal>
		</view>
	</view>
</template>

<script>
	import cellGroup from 'uview-ui/libs/config/props/cellGroup'
	export default {
		data() {
			return {
				// 登录用户信息、
				userInfo: {
					userId: '',
					userName: '',
					avatarUrl: '',
				},
				// 播放记录
				playRecord: [],
				// 个人中心列表下拉动画
				moveAnimation: {
					startY: 0,
					//移动的距离
					moveY: 0,
					// 过渡动画
					translateY: 'translateY(0)',
					transition: ''
				},
				// 退出账号模态框
				signoutModal: false
			}
		},
		onShow() {
			// 用户信息
			this.getUserInfo()
			// 播放记录
			this.getPlayRecord()
		},
		methods: {
			// 手机触摸
			handleTouchStart(e) {
				this.moveAnimation.transition = ''
				this.moveAnimation.startY = e.touches[0].pageY
			},
			// 手指移动
			handleTouchMove(e) {
				let move = e.touches[0].pageY - this.moveAnimation.startY
				if (move <= 0) {
					this.moveAnimation.translateY = 'translateY(0)'
				} else if (move >= 80) {
					this.moveAnimation.translateY = 'translateY(80rpx)'
				} else {
					this.moveAnimation.translateY = `translateY(${move}rpx)`
				}
			},
			// 手指离开
			handleTouchEnd(e) {
				this.moveAnimation.translateY = 'translateY(0)'
				this.moveAnimation.transition = 'all 0.6s linear'
			},

			// 去往登录页面
			goLogin() {
				const {
					userId,
					userName
				} = this.userInfo
				// 如果已经登录，不能跳转去登录页面
				if (userId && userName) return
				uni.navigateTo({
					url: `/pages/login/login`
				})
			},
			// 获取登录用户信息
			getUserInfo() {
				const {
					userId,
					userName,
					avatarUrl,
				} = this.$store.getters.userInfo
				this.userInfo = {
					userId,
					userName,
					avatarUrl
				}
			},

			//获取播放记录
			getPlayRecord() {
				this.$http({
					url: `/user/record`,
					data: {
						uid: this.userInfo.userId,
						type: 0
					}
				}).then(res => {
					if (res.code === 200) {
						this.playRecord = res.allData.slice(0, 20)
					}
				})
			},
			// 退出登录账号
			signOut() {
				// 清除用户信息
				this.$store.commit('setUserInfo', {
					userId: '',
					userName: '',
					avatarUrl: '',
				})
				// 关闭模态框
				this.signoutModal = false
				// 获取登录用户信息（实际已经清除信息）
				this.getUserInfo()
				// 最近播放列表清除
				this.playRecord = []
			}
		}
	}
</script>

<style lang="less">
	/* pages/personal/personal.wxss */
	.personalContainer {
		width: 100%;
		height: 100%;
	}

	.personalContainer .user-section {
		height: 520rpx;
		position: relative;
		padding: 100rpx 30rpx 0;
	}

	.user-section .bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0.7;
		filter: blur(1px);
	}

	.user-info-box {
		height: 180rpx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.user-info-box .portrait {
		width: 130rpx;
		height: 130rpx;
		border: 5rpx solid #fff;
		border-radius: 50%;
	}

	.user-info-box .username {
		font-size: 24;
		color: #303133;
		margin-left: 20rpx;
	}

	/* vip-box */
	.vip-card-box {
		position: relative;
		display: flex;
		flex-direction: column;
		// background: linear-gradient(left, red, black);
		background: rgba(0, 0, 0, 0.7);
		height: 240rpx;
		color: #f7d680;
		border-radius: 16rpx 16rpx 0 0;
		padding: 20rpx 24rpx;
	}

	.vip-card-box .card-bg {
		position: absolute;
		top: 20rpx;
		right: 0;
		width: 380rpx;
		height: 260rpx;
	}

	.vip-card-box .b-btn {
		position: absolute;
		right: 20rpx;
		top: 16rpx;
		width: 132rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 22rpx;
		color: #36343c;
		border-radius: 20px;
		background: #f9e6af;
		z-index: 1;
	}

	.vip-card-box .b-btn {
		position: absolute;
		right: 20rpx;
		top: 16rpx;
		width: 132rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 22rpx;
		color: #36343c;
		border-radius: 20px;
		/*background: linear-gradient(left, #f9e6af, #ffd465);*/
		/*渐变不生效*/
		background: #f9e6af;
		z-index: 1;
	}

	.vip-card-box .tit {
		font-size: 22rpx;
		color: #f7d680;
		margin-bottom: 28rpx;
	}

	.vip-card-box .tit .iconfont {
		color: #f6e5a3;
		margin-right: 16rpx;
	}

	.vip-card-box .e-m {
		font-size: 34rpx;
		margin-top: 10rpx;
	}

	.vip-card-box .e-b {
		font-size: 24rpx;
		color: #d8cba9;
		margin-top: 10rpx;
	}

	.cover-container {
		margin-top: -150rpx;
		padding: 0 30rpx;
		position: relative;
		background: #f5f5f5;
		padding-bottom: 20rpx;
	}

	.cover-container .arc {
		position: absolute;
		left: 0;
		top: -34rpx;
		width: 100%;
		height: 36rpx;
	}

	/* 导航部分 */
	.cover-container .nav-section {
		display: flex;
		background: #fff;
		padding: 20rpx 0;
		border-radius: 15rpx;
	}

	.nav-section .nav-item {
		width: 25%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.nav-section .nav-item .iconfont {
		font-size: 50rpx;
		color: #d43c33;
		line-height: 70rpx;
	}

	.nav-section .nav-item text:last-child {
		font-size: 22rpx;
	}

	/* 个人中心列表 */
	.personalContent {
		background: #fff;
		margin-top: 20rpx;
	}

	/* 最近播放 */
	.personalContent .scrollView {
		display: flex;
		height: 160rpx;
	}

	.personalContent .recentPlay {
		display: flex;
	}

	.recentPlayContainer .title {
		padding-left: 20rpx;
		font-size: 26rpx;
		color: #333;
		line-height: 80rpx;
	}

	.personalContent .recentPlay image {
		width: 160rpx;
		height: 160rpx;
		margin-left: 20rpx;
		border-radius: 20rpx;
	}

	.cardList {
		margin-top: 20rpx;
	}

	.cardList .card-item {
		border-top: 1rpx solid #eee;
		height: 80rpx;
		line-height: 80rpx;
		padding: 10rpx;
		font-size: 26rpx;
		color: #333;
	}

	.cardList .card-item .more {
		float: right;
	}

	/* 最近播放记录 */
	.recentScroll {
		display: flex;
		height: 200rpx;
	}

	.recentItem {
		margin-right: 20rpx;

	}

	.recentItem image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
	}

	// 退出账号
	.signout {
		margin-top: 20rpx;
		border-radius: 40rpx;
		background: #fff;
		height: 80rpx;
		color: #E14B30;
		text-align: center;
		line-height: 80rpx;
	}
</style>
