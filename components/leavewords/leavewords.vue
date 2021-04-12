<template>
	<!-- 留言组件 -->
	<view class="popup" v-if="messageShow">
		<view class="mb" @click="closeMessage"></view>
		<view class="message" :style="{ bottom: autoBottom + 'px' }">
			<view class="openheader">
				<text>{{typeFlag ? '留言' : '挑错有礼' }}</text>
				<image src="../../static/close.png" class="opencolse" @click="closeMessage" />
			</view>
			<view class="textwrap">
				<view class="tip">
					<text class="t1">{{message.length}}</text>
					<text class="t2">/200</text>
				</view>
				<textarea  @focus="InputFocus"	bindkeyboardheightchange="keyboardHandler" v-if="typeFlag" class="textarea" placeholder="想对TA说点什么，不超过200字" v-model="message" @blur="textareaBlur"></textarea>
				<textarea  @focus="InputFocus"		bindkeyboardheightchange="keyboardHandler" v-if="!typeFlag" class="textarea" placeholder="请输入错误内容，不超过200字" v-model="message" @blur="textareaBlur"></textarea>
				
			</view>
			<view hover-class="hoverclass" @click="submitHandler">提交</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			autoBottom:0,
			message:this.messageValue
		};
	},
	props: {
		messageShow: {
			type: Boolean,
			default: false
		},
		messageValue:{
			type: String,
			default:''
		},
		typeFlag:{
			type: Boolean,
			default: true
		}
	},
	mounted() {
		console.log(this.messageValue,this.message,'ss')
		if(this.messageValue.length == 0){
			this.message = ''
		}
	},
	methods: {
		InputFocus(e){
			this.autoBottom = e.detail.height;
		},
		keyboardHandler(e) {
			var height = e.detail.height;
			if (this.autoBottom == height) {
				return;
			} else {
				this.autoBottom = height;
			}
		},
		textareaBlur(){
			this.$emit('textareaBlur',this.message)
		},
		closeMessage() {
			this.message = ''
			this.$forceUpdate()
			this.$emit('closeMessage');
		},
		submitHandler(){
			this.$emit('submitTodo',this.message)
		}
	},
	watch:{
		messageShow (n,o){
			if(n){
				this.message = ''
			}
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
	// 留言
	.message {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 760upx;
		z-index: 4001;
		width: 750upx;
		height: 760upx;
		padding-left: 24upx;
		padding-right: 24upx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		border-radius: 16upx 16upx 0px 0px;
		.openheader {
			height: 108upx;
			line-height: 108upx;
			font-size: 32upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			display: flex;
			align-items: center;
			text {
				flex: 1;
				display: flex;
				justify-content: center;
			}
			.opencolse {
				width: 31upx;
				height: 31upx;
			}
			.selectback {
				position: absolute;
				left: 48upx;
				top: 50upx;
				margin-top: -16upx;
				width: 23upx;
				height: 32upx;
			}
		}
		.textwrap {
			width: 100%;
			height: 400upx;
			background: rgba(222, 222, 222, 0.3);
			border-radius: 8upx;
			position: relative;
			.textarea {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				padding: 20upx;
				font-size: 26upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 36upx;
				text-align: left;
			}
			.tip {
				position: absolute;
				right: 20upx;
				bottom: 20upx;
				font-size: 26upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: u36px;
				display: flex;
				flex-direction: row;
				.t2 {
					color: rgba(153, 153, 153, 1);
				}
			}
		}
		hoverclass {
			background: rgba(255, 156, 0, 1);
		}
	}
	.message view:last-child {
		width: 702upx;
		height: 80upx;
		background: rgba(255, 156, 0, 0.5);
		box-shadowss: 0px 8upx 16upx 0px rgba(225, 138, 0, 0.1);
		border-radius: 40upx;
		margin-top: 64upx;
		font-size: 36upx;
		font-family: PingFang-SC-Bold, PingFang-SC;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		line-height: 80upx;
		text-align: center;
	}
}
</style>
