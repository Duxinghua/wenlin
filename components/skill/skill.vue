<template>
	<!-- 添加技能 -->
	<view class="popup" v-if="isShow">
		<view class="mb" @click="close"></view>
		<view class="findFault">
			<view class="title">请输入您的技能标签</view>
			<view class="inputwarp">
				<input type="text" maxlength="8" class="source" v-model="inputValue" @input="sourceinput">
				<text class="source-text">({{inputValue.length}}/8字)</text>
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
				inputValue:''
			}
		},
		props:{
			isShow:{
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
		left: 50%;
		top:50%;
		transform: translate(-50%,-50%);
		z-index: 4002;
		width: 620upx;
		height: 320upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		.title{
			height:44upx;
			font-size:32upx;
			font-family:PingFang-SC-Bold,PingFang-SC;
			font-weight:bold;
			color:rgba(51,51,51,1);
			line-height:44upx;
			text-align: center;
			margin-top:32upx;
		}
		.inputwarp{
			display: flex;
			justify-content: center;
			align-items: center;
			margin:0 auto;
			margin-top:32upx;
			width:320upx;
			height:66upx;
			position: relative;
			.source{
				border-bottom: 1px solid #000;
				width:320upx;
				height:66upx;
				margin-right: 26upx;
				font-size:32upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:#000;
				line-height:66upx;
				position: absolute;
				left:0;
				top:0;
			}
			.source-text{
				font-size:24upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:#000;
				position: absolute;
				right:0;
				top:50%;
				transform: translateY(-50%);
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
				border-right:none;
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

