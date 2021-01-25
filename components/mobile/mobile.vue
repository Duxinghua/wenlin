<template>
	<!-- 展示联系方式 -->
	<view class="popup" v-if="wxsj">
		<view class="mb" @click="closewxsj"></view>
		<view class="wxsjcontent">
			<view class="mobile" @click="copy(item.num)" v-for="(item,index) in list" :key="index">
				<text>{{item.text}}</text>
				<text>{{ item.num}}</text>
				<text>拔打</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		wxsj: {
			type: Boolean,
			default: false
		},
		list:{
			type:Array
		}
	},
	mounted() {},
	methods: {
		closewxsj() {
			this.$emit('closewxsj');
		},
		copy(e){
			uni.makePhoneCall({
				phoneNumber:e
			})
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
	z-index: 30000;
	.mb {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 3001;
		background: rgba(0, 0, 0, 0.6);
	}
	.wxsjcontent {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 3002;
		width: 702upx;
		min-height: 120upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		.mobile:nth-of-type(2) {
			border-bottom: 1px solid transparent;
		}
		.mobile {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			height: 120upx;
			line-height: 120upx;
			border-bottom: 1px solid #dedede;
			text:nth-of-type(1) {
				font-size: 28upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
			text:nth-of-type(2) {
				font-size: 28upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				margin-left: 24upx;
				margin-right: 68upx;
			}
			text:nth-of-type(3) {
				width: 100upx;
				height: 56upx;
				background: rgba(255, 156, 0, 1);
				border-radius: 8upx;
				font-size: 26upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				line-height: 56upx;
				text-align: center;
			}
		}
		.mobile:last-child{
			border-bottom: none;
		}
	}
}
</style>
