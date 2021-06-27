<template>
	<!-- 挑错，收藏处理 -->
	<view :class="['popup',pos == 'home' ? 'popup-pos' : '']" v-if="isShow">
		<view class="mb" @click="close"></view>
		<view class="findFault" >
			<view class="collect sharewarp" @click="onshare">
				 <button class="share" open-type="share">分享给好友或微信群</button>
			</view>
			<view class="collect" @click="collect">{{isCollect? '取消收藏':'收藏'}}</view>
			<view class="collect" @click="find" v-if="autoFd">挑错</view>
		    <view class="collect" @click="report" v-if="pitem.is_my == 0">举报</view>
			 <view class="collect" @click="del" v-if="pitem.is_my == 1">删除</view>
			<view class="collect cancel" @click="close">取消</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		props:{
			pitem:{
				type:Object
			},
			isCollect:{
				type:Boolean,
				default:false
			},
			isShow:{
				type:Boolean,
				default:false
			},
			isType:{
				type:Number
			},
			pos:{
				type:String,
				default:'nohome'
			}
		},
		computed:{
			autoFix(){
				return true
				// if(this.isType  == 7 || this.isType == 6 || this.isType == 4 || this.isType == 3 || this.isType == 2 || this.isType == 1){
				// 	return true
				// }else if(this.isType == 5){
				// 	return true
				// }
			},
			autoFd () {
				if(this.isType == 5 || this.isType == 7){
					return true
				}else{
					return false
				}
			},
			autoShow(){
				if(this.isType == 5 || this.isType == 7){
					return false
				}else{
					return true
				}
			}
		},
		methods:{
			close(){
				this.$emit('close')
			},
			collect(){
				this.$emit('collect',this.isCollect)
			},
			del(){
				this.$emit('del',this.pitem)
			},
			find(){
				this.$emit('find')
			},
			report(){
				this.$emit('report')
			},
			onshare(){
				this.$emit('onshare')
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
	z-index: 20000;
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
		.sharewarp{
			display: flex;
			justify-content: center;
			align-items: center;
			.share{
				font-size: 32upx;
				width:100%;
				height:100%;
				line-height: 126upx;
			}
		}
		.collect {
			width: 100%;
			font-size: 32upx;
			height: 136upx;
			line-height: 136upx;
			text-align: center;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
		}
		.collect:nth-last-child(2){
			border-bottom: 5px solid rgba(222, 222, 222, 0.5);
		}
		.cancel {
			border-bottom: 1px solid transparent;
		}
	}
	.findFault-fix {
		height: 448upx;
	}
}
.popup-pos{
	.findFault{
		bottom:calc(100rpx + env(safe-area-inset-bottom) / 2);
	}
}
</style>
