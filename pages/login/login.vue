<template>
	<view class="container">
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome"> 欢迎回来！ </view>
			<view class="input-content">
				<u-form :model="form" ref="uForm" label-position='top' label-width='100'>
					<u-form-item label="手机号码" prop="phone">
						<u-input v-model="form.phone" border="bottom" />
					</u-form-item>
					<u-form-item label="密码" prop="password" right-icon='woman'>
						<u-input :type='showPassword ? "text" : "password"' v-model="form.password" border="bottom">
							<u-icon slot="suffix" :name="showPassword ? 'eye-fill': 'eye-off'" size="18" @click='showPassword = !showPassword'></u-icon>
						</u-input>
					</u-form-item>
				</u-form>
				<!-- 用于登录账号失败的提示 -->
				<u-toast ref="uToast"></u-toast>
				<!-- <view class="input-item">
					<text class="tit">手机号码</text>
					<input type="tel" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" />
				</view> -->
			</view>
			<button class="confirm-btn" @click="login">登录</button>
			<view class="forget-section"> 忘记密码? </view>
		</view>
		<view class="register-section">
			还没有账号?
			<text>马上注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 登录表单
				form: {
					phone: '',
					password: ''
				},
				// 登录表单校验
				formRules: {
					phone: [{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '请输入正确的手机号',
						required: true,
						trigger: ['blur']
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['blur']
					}]
				},
				// 是否显示密码切换
				showPassword: false
			}
		},
		mounted() {
			// 注入检验规则
			this.$refs.uForm.setRules(this.formRules)
		},
		methods: {
			async login() {
				// 检验账号密码是否通过
				const result = await this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
				if (result) {
					const res = await this.$http({
						url: `/login/cellphone`,
						data: {
							...this.form
						}
					})
					if (res.code === 200) {
						// 存储cookie
						this.$store.commit('setUserCookie', res.cookie)
						uni.setStorageSync('music_cookie', res.cookie)
						// 存储token
						this.$store.commit('setUserToken', res.token)
						// 存储用户信息
						this.$store.commit('setUserInfo', res.profile)
						// 返回个人中心页
						uni.navigateBack({
							delta: 1
						})
					} else {
						this.$refs.uToast.show({
							position: 'top ',
							message: '登录失败，手机号或密码错误',
							type: 'error',
						})
					}
				}
			}
		},
	}
</script>

<style lang="less">
	/* pages/login/login.wxss */
	.wrapper {
		position: relative;
		z-index: 90;
		padding-bottom: 40rpx;
	}

	.left-top-sign {
		font-size: 120rpx;
		color: #f8f8f8;
		position: relative;
		left: -16rpx;
	}

	.welcome {
		position: relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
	}

	.input-content {
		padding: 0 60rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30rpx;
		background: #f8f6fc;
		height: 120rpx;
		border-radius: 4px;
		margin-bottom: 50rpx;
	}

	.input-item:last-child {
		margin-bottom: 0;
	}

	.input-item .tit {
		height: 50rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		color: #606266;
	}

	.input-item input {
		height: 60rpx;
		font-size: 30rpx;
		color: #303133;
		width: 100%;
	}

	.confirm-btn {
		width: 630rpx !important;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50rpx;
		margin-top: 70rpx;
		background: #d43c33;
		color: #fff;
		font-size: 32rpx;
		padding: 0;
	}

	.confirm-btn2:after {
		border-radius: 100px;
	}

	.forget-section {
		font-size: 28rpx;
		color: #4399fc;
		text-align: center;
		margin-top: 40rpx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: 28rpx;
		color: #606266;
		text-align: center;
	}

	.register-section text {
		color: #4399fc;
		margin-left: 10rpx;
	}

	/* uviw 组件样式*/
	// /deep/ .u-form-item__body__right .u-input .u-border {
	// 	border: 0px !important;
	// }
</style>
