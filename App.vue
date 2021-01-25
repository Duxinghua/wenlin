<script>
import Vue from 'vue';
export default {
	onLaunch: function(e) {
		console.log(e.scene)
		uni.getNetworkType({
			success: function(res) {
				console.log(res, 'res');
				const networkType = res.networkType;
				if ('none' != networkType) {
					uni.onNetworkStatusChange(function(res) {
						if (res.isConnected) {
							uni.setStorageSync('network', 1);
						} else {
							uni.navigateTo({
								url: '/pages/update/network'
							});
							uni.setStorageSync('network', 0);
						}
					});
				} else {
					uni.navigateTo({
						url: '/pages/update/network'
					});
					uni.onNetworkStatusChange(function(res) {
						if (res.isConnected) {
							uni.setStorageSync('network', 1);
						} else {
							uni.setStorageSync('network', 0);
						}
					});
				}
			},
			fail: err => {
				console.log(err, 'err');
			},
			complete: result => {
				console.log(result, 'result');
			}
		});

		if (e.scene != 1154) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate);
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});
			uni.setStorageSync('singPage', 0);
		} else {
			uni.setStorageSync('singPage', 1);
		}

		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP

				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif
				// #ifdef MP-WEIXIN
				if (e.platform == 'android' || e.platform == 'devtools') {
					uni.setStorageSync('platform', 'android');
				} else {
					uni.setStorageSync('platform', 'ios');
				}
				uni.setStorageSync('windowHeight', e.windowHeight);
				uni.setStorageSync('width', e.screenWidth);
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/theme.scss';
@import "uview-ui/index.scss";
@import 'colorui/main.css';
@import 'colorui/icon.css';
::-webkit-scrollbar {
	display: block;
	width: 5upx;
	height: 5upx;
	color: red;
}
/*每个页面公共css 放app.vue页面的 */
/*每个页面公共css 放app.vue页面的 */
@font-face {
	font-family: 'font_family'; /* project id 1065286 */
	src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot');
	src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2') format('woff2'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff') format('woff'), url('//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family') format('svg');
}
.font_family {
	font-family: 'font_family' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
}
/* 按钮去掉边框 */
button::after {
	border: none;
}
button {
	margin-left: 0;
	margin-right: 0;
	padding-left: 0;
	padding-right: 0;
	line-height: 1;
	color: #1c1c1c;
	font-size: 28rpx;
	background: none;
}
.button-hover {
	color: #1c1c1c;
	background: none;
}
/*每个页面公共css */
.content {
	text-align: left;
	height: 100%;
}
.share-btn {
	padding: 30upx 60upx;
	background-color: $uni-btn-color;
	color: $uni-text-color-inverse;
}
.share-pro {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-direction: column;
	z-index: 5;
	line-height: 1;
	box-sizing: border-box;
	.share-pro-mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
	}
	.share-pro-dialog {
		width: 750rpx;
		height: 310rpx;
		overflow: hidden;
		background-color: #fff;
		border-radius: 24rpx 24rpx 0px 0px;
		position: relative;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		.close-btn {
			padding: 20rpx 15rpx;
			position: absolute;
			top: 0rpx;
			right: 29rpx;
		}
		.share-pro-title {
			font-size: 28rpx;
			color: #1c1c1c;
			padding: 28rpx 41rpx;
			background-color: #f7f7f7;
		}

		.share-pro-body {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			font-size: 28rpx;
			color: #1c1c1c;
			.share-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				justify-content: space-around;
				.share-icon {
					text-align: center;
					font-size: 70rpx;
					margin-top: 39rpx;
					margin-bottom: 16rpx;
					color: #42ae3c;
				}
				&:nth-child(2) {
					.share-icon {
						color: #ff5f33;
					}
				}
			}
		}
	}

	/* 显示或关闭内容时动画 */

	.open {
		transition: all 0.3s ease-out;
		transform: translateY(0);
	}

	.close {
		transition: all 0.3s ease-out;
		transform: translateY(310rpx);
	}
}
.canvas {
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	display: block !important;
	width: 100% !important;
	height: 100% !important;
	z-index: 50000;
}
</style>
