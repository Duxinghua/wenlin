<template>
	<!-- 设置小区 -->
	<view class="popup" v-if="isShow">
		<view class="mb" @click="close"></view>
		<view class="findFault" >
			<view>请选择要进入的小区</view>
			<view class="collect" @click="setC(item)" v-for="(item,index) in list" :key="index" :inde="index">{{item.title}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				isShow:false,
				list:[]
			}
		},
		computed:{
	
		},
		methods:{
			setC(obj){
				uni.setStorageSync('community_id',obj.community_id)
				uni.setStorageSync('committee_id',obj.committee_id)
				this.isShow = false
			},
			show(){
				this.isShow = true
			},
			close(){
				this.isShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
.popup {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 40000;
	.mb {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 4001;
		background: rgba(0, 0, 0, 0.6);
	}
	.findFault {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 4002;
		width: 100%;
		// height: 316upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16px 16px 0 0;
		display: flex;
		flex-direction: column;
		.collect {
			width: 100%;
			font-size: 32upx;
			height: 126upx;
			line-height: 126upx;
			text-align: center;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
		}
		.cancel {
			border-bottom: 1px solid transparent;
		}
	}
	.findFault-fix {
		height: 448upx;
	}
}
</style>
