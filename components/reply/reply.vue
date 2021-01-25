<template>
	<!-- 回复框 -->
	<view class="reply" v-if="replyShow">
		<view class="inputrow">
			<view class="inputwrap" :class="{'inputwrap-fix':!replyFlag}">
				<image src="../../static/face.png" class="face" @click="faceClick"></image>
				<input type="text" :placeholder="parent_text" v-model="inputValue" @focus="InputFocus" @blur="InputBlur" @confirm="inputValueHander" />
			</view>
			<view class="inputbtn" @click="inputValueHander" v-if="!replyFlag">
				发送
			</view>
		</view>
		<view class="emowrap" v-if="isShowEmj">
			<!-- 表情插件 -->
			<emotion @emotion="handleEmj" :height="200" ></emotion>
		</view>
	</view>
</template>

<script>
import emotion from '@/components/bkhumor-emoji/index.vue';
export default {
	components: {
		emotion
	},
	props: {
		parent_text: {
			type: String
		},
		isShowEmj:{
			type:Boolean
		},
		inputValues:{
			type:String
		},
		replyShow:{
			type:Boolean,
			default:true
		}
	},
	data() {
		return {
			inputValue:this.inputValues,
			replyFlag:true
		};
	},
	methods: {
		clearInput(){
			this.inputValue = ''
		},
		faceClick() {
			this.$emit('faceClick');
		},
		InputFocus() {
			this.replyFlag = false
			this.$emit('InputFocus');
		},
		InputBlur() {
			this.$emit('InputBlur');
		},
		inputValueHander() {
			this.$emit('inputValueHander',this.inputValue);
		},
		handleEmj(i) {
			if (i == '[em_98]') {
				//匹配最后一个表情符号并删除。
				this.inputValue = this.inputValue.replace(/(\[[^\]]+\]|[\s\S])$/, '');
			} else {
				this.inputValue += i;
			}
		},
		showEmj() {
			let bool = !this.isShowEmj;
			if (bool) {
				this.emojiIcon = 'cuIcon-keyboard';
			} else {
				this.emojiIcon = 'cuIcon-emoji';
			}

			this.isShowEmj = bool;
			this.$emit('show');
		}
	}
};
</script>

<style lang="scss" scoped>
.reply {
	display: flex;
	flex-direction: column;
	position: fixed;
	padding: 20upx 24upx 20upx 24upx;
	left: 0;
	bottom: 0;
	width: 100%;
	min-height: 100upx;
	background: white;
	box-shadow: 0upx 12upx 20upx 0upx rgba(0, 0, 0, 0.4);
	.inputrow {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
				.inputbtn{
					width:100upx;
					text-align: right;
					margin-left:auto;
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,1);
				}
		.inputwrap {
			width: 100%; //420upx
			height: 100upx;
			background: rgba(234, 234, 234, 0.3);
			border-radius: 50upx;
			position: relative;
			.face {
				width: 45upx;
				height: 45upx;
				position: absolute;
				right: 22upx;
				top: 50%;
				transform: translateY(-50%);
			}
			
			input {
				padding-left: 30upx;
				width: 80%;
				height: 100%;
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: #333333;
				line-height: 100%;
			}
		}
		.inputwrap-fix {
			width: 85%;
		}
		.pushwrap {
			font-size: 22upx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(255, 156, 0, 1);
			line-height: 32upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin: 0 auto;
			.pushico {
				width: 36upx;
				height: 38upx;
				margin-right: 8upx;
			}
		}
		.sharewrap {
			font-size: 22upx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			line-height: 32upx;
			display: flex;
			align-items: center;
			.shareico {
				width: 36upx;
				height: 36upx;
				margin-right: 8upx;
			}
		}
	}
	.emowrap {
		padding-top: 24upx;
		// display: flex;
	}
}
</style>
