<template>
	<view class="content">
		<view class="content-title" v-if="!info.isType">{{info.type || '推荐歌曲'}}</view>
		<view class="content-content">
			<text v-if="!info.isContent">{{info.content || '为你精心推荐'}}</text></text class='content-content-title'>
			<text class="content-content-more" v-if="!info.isMore">{{info.more || '查看更多'}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {}
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style lang="less" scope>
	.content {
		margin: 20rpx 0;

		.content-title {
			font-size: 24rpx;
			color: #747D82;
		}

		.content-content {
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;
			text-align: center;

			.content-content-more {
				padding: 0rpx 25rpx;
				height: 60rpx;
				border-radius: 30rpx;
				border: 2rpx solid #979797;
			}

			& text {
				line-height: 60rpx;
			}
		}
	}
</style>
