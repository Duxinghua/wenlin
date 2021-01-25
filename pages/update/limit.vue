<template>
	<view class="network">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<image src="https://sq.wenlinapp.com/upload/mini/nopost.png" class="networkico"></image>
		<view class="tips">
			您的行为已违规，问邻管理员已将您拉入小黑屋
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '小黑屋', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:4, //type 1，3胶囊 2，4无胶囊模式
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
			width:calc(444upx * 0.7);
			height:calc(626upx * 0.7);
			position: fixed;
			left:50%;
			top:40%;
			transform: translate(-50%,-40%);
		}
		.tips{
			position: fixed;
			left:50%;
			top:60%;
			width:fit-content;
			margin:0 auto;
			transform: translate(-50%,-60%);
			font-size: 28rpx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #666666;
			line-height: 40rpx;
			text{
				color:#FF9C00;
			}
		}
	}
</style>
