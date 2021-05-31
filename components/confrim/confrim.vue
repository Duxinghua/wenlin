<template>
	<view class="popup" v-if="guestShow">
		<view class="mb" @click="guestShow = !guestShow"></view>
		<view class="tipslogin">
			<view class="logintop">{{text}}</view>
			<view class="loginbottom">
				<text class="textitem" @click="guestShow = !guestShow">取消</text>
				<text class="textitem textitem-fix" @click="del" :data-id="id">确认</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			guestShow: false,
			id:'',
			type:'',
			obj:{},
			text:'删除我的评论'
		}
	},
	methods: {
		del() {
			this.$emit('del',this.obj);
		}
	}
};
</script>

<style lang="scss" scoped>
.popup {
	position: fixed;
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
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 560upx;
		// height: 224upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16upx;
		z-index: 3002;
		display: flex;
		flex-direction: column;
		.logintop {
			font-size: 32upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			line-height: 44upx;
			height: 180upx;
			line-height: 180upx;
			text-align: center;
			border-bottom: 2upx solid #dedede;
		}
		.loginbottom {
			height: 126upx;
			display: flex;
			flex-direction: row;
			.textitem {
				width: calc(50% - 1upx);
				display: flex;
				justify-content: center;
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 126upx;
				border-right: 2upx solid #dedede;
			}
			.textitem-fix {
				border-right: 2upx solid #dedede;
				color: #ff9c00;
			}
		}
	}
}
</style>
