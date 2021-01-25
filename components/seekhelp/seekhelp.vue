<template>
	<!-- 帮推 -->
	<view class="popup" v-if="isShow">
		<view class="mb" @click="close"></view>
		<view class="findFault">
			<image :src="imgUrl +'helpicol2.png'" class="helpico" ></image>
			<view class="title">帮助本帖上推榜，让更多人看到</view>
			<view class="inputwarp">
				<text class="source-text">帮推积分：</text>
				<input type="number" class="source" v-model="inputValue" @input="sourceinput">
				<text class="source-text">(当前积分: {{score}})</text>
			</view>
			<view class="btns">
				<view class="cancel" @click="close">
					取消
				</view>
				<view class="confrim" @click="ok">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				inputValue:0,
				imgUrl:this.Config.minUrl
			}
		},
		props:{
			isShow:{
				type:Boolean,
				default:false
			},
			score:{
				type:[Number,String]
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
			}
		},
		methods:{
			sourceinput(e){
				this.inputValue = e.detail.value 
			},
			close(){
				this.$emit('close')
			},
			ok(){
				this.$emit('ok')
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
	z-index: 600000;
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
		left: 50%;
		top:50%;
		transform: translate(-50%,-50%);
		z-index: 4002;
		width: 620upx;
		// height: 320upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		.helpico{
			width:333upx;
			height:312upx;
			margin:24upx auto;
		}
		.title{
			height:44upx;
			font-size:32upx;
			font-family:PingFang-SC-Bold,PingFang-SC;
			font-weight:bold;
			color:#FF9C00;
			line-height:44upx;
			text-align: center;
		}
		.inputwarp{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-top:32upx;
			margin-bottom: 32upx;
			.source{
				border-bottom: 1px solid #000;
				width:106upx;
				height:56upx;
				font-size:48upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,156,0,1);
				line-height:66upx;
				margin-right:16upx;
				text-align: center;
			}
			.source-text{
				font-size:24upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:#000;
			}
		}
		.btns{
			margin-top:auto;
			width:100%;
			height:104upx;
			border-top:1px solid #DEDEDE;
			display: flex;
			flex-direction: row;
			.cancel,.confrim{
				height:100%;
				width:50%;
				border-right: 1px solid #DEDEDE;
				font-size:30upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				text-align: center;
				line-height: 104upx;
			}
			.cancel{
				color:#333333;
			}
			.confrim{
				color:#FF9C00;
				border-right: none;
			}
		}
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

