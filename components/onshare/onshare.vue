<template>
	<!-- 挑错，收藏处理 -->
	<view :class="['popup', pos == 'home' ? 'popup-pos' : '']" v-if="isShow">
		<view class="mb" @click="close"></view>
		<view class="findFault" :class="{'findFault-fix':autoFix}">
			<view class="collect" @click="onsend" v-if="autoShare">转发朋友圈</view>
			<view class="collect sharewarp" @click="onshare">
				 <button class="share" open-type="share">分享给好友或微信群</button>
			</view>
			<view class="collect" @click="ontodo">生成海报</view>
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
		mounted() {
			
		},
		props:{
			isCollect:{
				type:Boolean,
				default:false
			},
			isShow:{
				type:Boolean,
				default:false
			},
			pos:{
				type:String,
				default:'nohome'
			},
			isHome:{
				type:Boolean,
				default:false
			},
			ng:{
				type:Boolean,
				default:false
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
			autoShare(){
				if(uni.getStorageSync('platform') == 'android'){
					if(this.isHome){
						return true
					}else{
						return false
					}
				}else{
					return false
				}
			}
		},
		methods:{
			close(){
				this.$emit('close')
			},
			onshare(){
				this.$emit('onshare')
			},
			ontodo(){
				this.$emit('ontodo')
			},
			onsend(){
				this.$emit('onsend')
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
		.collect:nth-last-child(2){
			border-bottom: 5px solid rgba(222, 222, 222, 0.5);
		}
		.cancel {
			border-bottom: 1px solid transparent;
		}
	}
	.findFault-fix {
		// height: 448upx;
	}
}
.popup-pos{
	.findFault{
		bottom:calc(100rpx + env(safe-area-inset-bottom) / 2);
	}
}
</style>
