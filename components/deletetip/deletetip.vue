<template>
	<view class="popup" v-if="deleteShow">
		<view class="mb"></view>
		<view class="tipslogin">
			<image src="https://sq.wenlinapp.com/upload/mini/nopost.png" class="networkico"></image>
			<view class="tips">
				啊呀，帖子可能被删除了~
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			deleteShow:false
		}
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
.popup {
	position: fixed;
	overflow: hidden;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 90000;
	.mb {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 2001;
		background: rgba(0, 0, 0, 0.6);
	}
	// 提示登陆
	.tipslogin {
		position: fixed;
		left: 0%;
		top: 0%;
		width: 100%;
		height:100%;
		// height: 224upx;
		background: rgba(255, 255, 255, 1);
		// border-radius: 16upx;
		z-index: 3002;
		display: flex;
		flex-direction: column;
		.networkico{
			width:654upx;
			height:550upx;
			position: fixed;
			left:50%;
			top:40%;
			transform: translate(-50%,-40%);
		}
		.tips{
			position: fixed;
			left:50%;
			top:65%;
			transform: translate(-50%,-65%);
			font-size: 28rpx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #333333;
			line-height: 40rpx;
			text{
				color:#FF9C00;
			}
		}

	}
}
</style>
