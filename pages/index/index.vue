<template>
	<view>
		<!-- 轮播图 -->
		<u-swiper :list="swiperList" keyName="pic" circular :radius="0" indicator indicatorActiveColor="#E14B30" indicatorMode="dot">
		</u-swiper>
		<view class="content">
			<!-- 导航栏 -->
			<view class="content-navbar">
				<view class="content-navbar-item" v-for="(item,index) in navBarList" :key="index" @click="goSongDetails">
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
            more: '查看更多',
          }"></ContentTop>
				<!-- 歌曲 -->
				<scroll-view class="recommend-scroll" scroll-x enable-flex>
					<view class="recommend-scroll-item" v-for="item in recommendList" :key="item.id">
						<image :src="item.picUrl" mode="aspectFill"></image>
						<text class="recommend-scroll-item-text">{{ item.name }}</text>
					</view>
				</scroll-view>
			</view>
			<!-- 排行榜 -->
			<view class="rank">
				<!-- 排行榜头部 -->
				<ContentTop :info="{
            type: '排行榜',
            content: '热歌风向标',
            more: '查看更多',
          }"></ContentTop>
				<swiper class="rank-swiper" circular skip-hidden-item-layout previous-margin="30rpx" next-margin="50rpx">
					<swiper-item v-for="(item, index) in hotSongList" :key="index">
						<view class="rank-swiper-title">{{ `云音乐${item.title}` }}</view>
						<view class="rank-swiper-item">
							<image :src="item.list[0].al.picUrl"></image>
							<text class="rank-swiper-item-text">{{
                `1、${item.list[0].name}`
              }}</text>
						</view>
						<view class="rank-swiper-item">
							<image :src="item.list[1].al.picUrl"></image>
							<text class="rank-swiper-item-text">{{
                `2、${item.list[1].name}`
              }}</text>
						</view>
						<view class="rank-swiper-item">
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
	import ContentTop from './ContentTop'
	export default {
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
						icon: 'icon-shouye'
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
						icon: 'icon-diantai'
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
			}
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
			// 获取推荐歌曲数据
			async getRecommendList() {
				const res = await this.$http({
					url: '/personalized?limit=10',
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
					let topNameList = res.list.slice(0, 4)
					let index = 0
					while (index < 4) {
						let topList = await this.$http({
							url: `/playlist/detail?id=${topNameList[index].id}`,
						})
						if (topList.code === 200) {
							let list = topList.playlist.tracks.slice(0, 3)
							this.hotSongList.push({
								title: topNameList[index].name,
								list,
							})
						}
						index++
					}
				}
			},
			goSongDetails() {
				uni.navigateTo({
					url: `/pages/song-list/song-list`
				});
			}
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
