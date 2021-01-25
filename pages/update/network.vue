<template>
	<view class="network">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<image :src="imgUrl +'404.png'" class="networkico"></image>
		<view class="tips">
			网络连接不可用，请稍后重试
		</view>
		<view class="btns" @click="getLoad">
			重新加载
		</view>
	</view>
</template>

<script>
	import Config from '../../utils/config.js'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				imgUrl:this.Config.minUrl,
				config: {
					title: '', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			getLoad(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
						url: Config.baseURL+'api/community/ucenter/myScoreTask',
						data: {community_id:uni.getStorageSync('community_id')},
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'XX-Wxapp-AppId': Config.appid,
							'XX-Device-Type': Config.type,
							'XX-Token':  uni.getStorageSync("token"),
				
						},
						success: res => {
							uni.navigateBack({})
							uni.hideLoading();
							uni.stopPullDownRefresh();
							uni.hideNavigationBarLoading();
						},
						fail: (err) => {
							console.log(err)
							uni.hideLoading();
							uni.stopPullDownRefresh();
							uni.hideNavigationBarLoading();
							setTimeout(()=>{
								uni.hideLoading()
								uni.getNetworkType({
									success: function(res) {
									
										const networkType = res.networkType;
										if ('none' != networkType) {
											uni.onNetworkStatusChange(function(res) {
												if (res.isConnected) {
													uni.navigateBack({})
													uni.setStorageSync('network', 1);
												} else {
													uni.showToast({
														icon:'none',
														title:'暂无网络，请检查网络是否正常'
													})
													uni.setStorageSync('network', 0);
												}
											});
										} else {
											uni.showToast({
												icon:'none',
												title:'暂无网络，请检查网络是否正常'
											})
											uni.onNetworkStatusChange(function(res) {
												console.log(res,'none')
												if (res.isConnected) {
													uni.navigateBack({})
													uni.setStorageSync('network', 1);
												}
											});
										}
									},
									fail: err => {
										uni.showToast({
											icon:'none',
											title:'暂无网络，请检查网络是否正常'
										})
										console.log(err, 'err');
									},
									complete: result => {
										console.log(result, 'result');
									}
								});
								
							},300)

						},
						complete: (res) => {
							
						}
				})

			}
		},
		components: {
			navigationCustom
		}
	};
</script>

<style lang="scss" scoped>
	.network{
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: white;
		.networkico{
			width:calc(404upx * 0.7);
			height:calc(650upx * 0.7);
			position: fixed;
			left:50%;
			top:40%;
			transform: translate(-50%,-40%);
		}
		.tips{
			position: fixed;
			left:50%;
			top:60%;
			transform: translate(-50%,-60%);
			font-size: 28rpx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #333333;
			line-height: 40rpx;
			text{
				color:#FF9C00;
			}
		}
		.btns{
				position: fixed;
				left:50%;
				top:70%;
				transform: translate(-50%,-70%);
				width:250upx;
				height:80upx;
				background:#FF9C00;
				box-shadow:0px 8px 16px 0px rgba(225,138,0,0.1);
				border-radius:40upx;
				position: fixed;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:white;
				line-height: 80upx;
				text-align: center;
		}
	}
</style>
