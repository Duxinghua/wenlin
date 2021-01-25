<template>
	<view class="integral" v-if="isShow">
		积分 {{types}}{{score}}
	</view>
</template>

<script>
	export default{
		data(){
			return {
				isShow:false
			}
		},
		props:{
			types:{
				type:[Number,String]
			},
			score:{
				type:[Number,String]
			}
		},
		methods:{
			close(){
				this.isShow = false
			},
			show(){
				this.isShow = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.integral{
		display: flex;
		justify-content: center;
		align-items: center;
		width:240upx;
		height:60upx;
		font-size:28upx;
		line-height:60upx;
		color:white;
		border-radius: 30upx;
		background:#FF9C00;
		position: fixed;
		left:50%;
		transform: translateX(-50%);
		bottom: 300upx;
		z-index: 70000;
	}
</style>
