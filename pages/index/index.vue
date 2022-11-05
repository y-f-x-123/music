<template>
	<view>
		<!-- 轮播图 -->
		<u-swiper :list="swiperList" keyName="pic" circular :radius="0" indicator indicatorActiveColor="#E14B30" indicatorMode="dot">
		</u-swiper>
		<view class="content">
			<!-- 导航栏 -->
			<view class="content-navbar">
				<view class="content-navbar-item" v-for="(item,index) in navBarList" :key="index" @click="handleNavMusic(item)">
					<view class="item-iconfont">
						<text class="iconfont" :class="item.icon"></text>
					</view>
					<text>{{item.title}}</text>
				</view>
			</view>
			<!-- 推荐歌曲 -->
			<view class="recommend">
				<!-- 推荐歌曲头部 -->
				<ContentTop :info="{
            type: '推荐歌曲',
            content: '为你精心推荐',
						isMore:true
          }"></ContentTop>
				<!-- 歌曲 -->
				<scroll-view class="recommend-scroll" scroll-x enable-flex>
					<view class="recommend-scroll-item" v-for="item in recommendList" :key="item.id" @click="handleRecommendList(item)">
						<image :src="item.picUrl" mode="aspectFill"></image>
						<text class="recommend-scroll-item-text">{{ item.name }}</text>
					</view>
				</scroll-view>
			</view>
			<!-- 排行榜 -->
			<view class="rank">
				<!-- 排行榜头部 -->
				<ContentTop @click.native="showHotSongList" :info="{
				type: '排行榜',
				content: '热歌风向标'}">
				</ContentTop>
				<swiper class="rank-swiper" circular skip-hidden-item-layout previous-margin="30rpx" next-margin="50rpx" @change="handleswiper">
					<swiper-item v-for="(item, index) in hotSongList" :key="index">
						<view class="rank-swiper-title">{{ `${item.title}` }}</view>
						<view class="rank-swiper-item" @click="goSongDetails(item.list[0])">
							<image :src="item.list[0].al.picUrl"></image>
							<text class="rank-swiper-item-text">{{
                `1、${item.list[0].name}`
              }}</text>
						</view>
						<view class="rank-swiper-item" @click="goSongDetails(item.list[1])">
							<image :src="item.list[1].al.picUrl"></image>
							<text class="rank-swiper-item-text">{{
                `2、${item.list[1].name}`
              }}</text>
						</view>
						<view class="rank-swiper-item" @click="goSongDetails(item.list[2])">
							<image :src="item.list[2].al.picUrl"></image>
							<text class="rank-swiper-item-text">{{
                `3、${item.list[2].name}`
              }}</text>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	// compoent
	import ContentTop from './ContentTop'

	// mixin
	import {
		mixin_hm
	} from '../../utils/mixins.js'

	export default {
		mixins: [mixin_hm],
		components: {
			ContentTop,
		},
		data() {
			return {
				// 轮播图数据
				swiperList: [],
				// 头部导航栏(每日推荐,歌单,排行榜)
				navBarList: [{
						title: '每日推荐',
						icon: 'icon-shouye',
						// 获取相关歌曲列表地址
						url: `/recommend/songs`
					},
					{
						title: '歌单',
						icon: 'icon-yinle'
					},
					{
						title: '排行榜',
						icon: 'icon-paihangbanggequ'
					},
					{
						title: '电台',
						icon: 'icon-diantai',
						url: `/dj/program/toplist`
					},
					{
						title: '直播',
						icon: 'icon-zhibo'
					},
				],
				// 推荐歌曲数据
				recommendList: [],
				// 排行榜
				hotSongList: [],
				// 排行榜查看更多时展示的榜单的下标
				swiperIndex: 0
			}
		},
		created() {
			// 自定义事件，用来监听下一首，上一首，随机播放
			this.handleCustom()
		},
		mounted() {
			this.getSwiperList()
			this.getRecommendList()
			this.getHotSongList()
		},
		methods: {

			//   获取轮播图数据
			async getSwiperList() {
				const res = await this.$http({
					url: '/banner?type=2',
				})
				if (res.code === 200) {
					this.swiperList = res.banners || []
				}
			},

			// 导航栏跳转到歌曲列表
			async handleNavMusic(option) {
				try {
					let res = await this.$http({
						url: option.url
					})
					console.log(res);
					if (res.code === 200) {
						// 存储音乐列表到 vuex
						this.$store.commit('setSongListInfo', {
							songList: res.data.dailySongs,
							title: option.title,
							imgUrl: ''
						})
						// 跳转
						uni.navigateTo({
							url: `/pages/song-list/song-list`
						});
					}
				} catch (e) {
					console.log(e);
				}
			},

			// 获取推荐歌曲数据
			async getRecommendList() {
				const res = await this.$http({
					url: '/personalized?limit=20',
				})
				if (res.code === 200) {
					this.recommendList = res.result || []
				}
			},


			// 获取排行榜数据
			async getHotSongList() {
				const res = await this.$http({
					url: '/toplist',
				})
				if (res.code === 200) {
					// /playlist/detail?id=19723756
					let topNameList = res.list.slice(0, 10)
					let index = 0
					while (index < topNameList.length) {
						let topList = await this.$http({
							url: `/playlist/detail?id=${topNameList[index].id}`,
						})
						if (topList.code === 200) {
							let list = topList.playlist.tracks.slice(0, 3)
							this.hotSongList.push({
								title: topNameList[index].name,
								list,
								imgUrl: topNameList[index].coverImgUrl,
								songList: topList?.playlist?.tracks.slice(0, 30) || []
							})
						}
						index++
					}
				}
			},

			// 排行榜 swiper 展示榜单滑动
			handleswiper(e) {
				this.swiperIndex = e.target.current
			},

			// 热歌风向标查看更多
			showHotSongList() {
				this.goSongList(this.hotSongList[this.swiperIndex])
			},

			// 排行榜，热歌风向标歌曲跳转
			goSongDetails(options) {
				// 存储 音乐信息 到 vuex
				this.$store.commit('setMusicDetial', {
					id: options.id,
					image: options.al.picUrl,
					musicName: options.name
				})
				uni.navigateTo({
					url: `/pages/songDetails/songDetails?page=index`,
				});
			},

			// 跳转到音乐列表
			goSongList(option) {
				// 存储音乐列表到 vuex
				this.$store.commit('setSongListInfo', option)
				// 跳转
				uni.navigateTo({
					url: `/pages/song-list/song-list`
				});
			},
			// 推荐歌单详情，获取歌曲列表
			async handleRecommendList(option) {
				try {
					let res = await this.$http({
						url: `/playlist/detail`,
						data: {
							id: option.id
						}
					})
					if (res.code === 200) {
						const {
							name,
							coverImgUrl,
							tracks
						} = res?.playlist
						// 跳转到音乐列表
						this.goSongList({
							name,
							coverImgUrl,
							songList: tracks
						})
					}
				} catch (e) {
					console.log(e);
				}
			},
			//  自定义事件，用来监听下一首，上一首，随机播放
			handleCustom() {
				uni.$on('playMusic_index', ({
					type,
					id
				}) => {
					this.handlePlayMusic_mixin(type, id, this.hotSongList[this.swiperIndex].songList)
				})
			},

		},
	}
</script>

<style lang="less" scope>
	.content {
		padding: 0rpx 10rpx;

		/* 导航栏 */
		.content-navbar {
			display: flex;
			justify-content: space-around;
			padding: 20rpx 0rpx;

			.content-navbar-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.item-iconfont {
					margin-bottom: 15rpx;
					height: 80rpx;
					width: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #e14b30;
					border-radius: 50%;

					& .iconfont {
						font-size: 45rpx;
						color: #fff;
					}
				}

				& text {
					font-size: 24rpx;
				}
			}
		}

		/* 推荐歌曲 */
		.recommend {
			.recommend-scroll {
				white-space: nowrap;
				height: 250rpx;

				.recommend-scroll-item {
					display: inline-block;
					width: 200rpx;
					height: 100%;
					margin-right: 20rpx;

					& image {
						width: 200rpx;
						height: 200rpx;
					}

					.recommend-scroll-item-text {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
				}
			}
		}

		/* 排行榜 */
		.rank {
			.rank-swiper {
				height: 400rpx;

				.rank-swiper-title {
					font-size: 30rpx;
					margin-bottom: 20rpx;
				}

				.rank-swiper-item {
					display: flex;
					align-items: center;
					padding: 6rpx;
					height: 100rpx;
					width: 96%;
					background: #fbfbfb;

					& image {
						width: 100rpx;
						height: 100%;
					}

					.rank-swiper-item-text {
						margin-left: 30rpx;
					}
				}
			}
		}
	}
</style>
