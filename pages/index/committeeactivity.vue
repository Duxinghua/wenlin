<template>
	<!-- 活动报名-->
	<view class="personalcard">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="pcontent">
			<view class="reportlist">
				<view class="reportitem">
					<text class="label">姓名</text>
					<input type="text"  v-model="name" class="value"/>
				</view>
				<view class="reportitem" @click="openPicker">
					<text class="label">姓别</text>
					<view  class="value">{{sexText}}</view>
				</view>
				<view class="reportitem">
					<text class="label">人数</text>
					<input type="text" v-model="number" class="value"/>
				</view>
				<view class="reportitem">
					<text class="label">电话</text>
					<input type="text" v-model="phone" class="value"/>
				</view>
				<view class="reportitem">
					<text class="label" >微信</text>
					<input type="text"  @blur="weixinHandler" v-model="weixin" class="value"/>
				</view>
			</view>

			<view class="textareawrap">
				<textarea v-model="content" @input="textareaInput" maxlength="200" class="textarea" placeholder="欢迎提供意见建议，让我们把活动办的更好"></textarea>
				<text class="textareanum">{{content.length}}/200</text>
			</view>
			<view class="lybtn" @click="submitJoin">
			提交
			</view>
			<!-- 留言组件 -->
			<view class="popup" style="display: none;" >
				<view class="mb" ></view>
				<view class="message">
					<view class="openheader">
						<text>留言</text>
						<image src="../../static/close.png" class="opencolse" @click="closePicker"/>
					</view>
					<view class="textwrap">
						<view class="tip">
							<text class="t1">0</text>
							<text class="t2">/200</text>
						</view>
						<textarea  class="textarea" placeholder="想对TA说点什么，不超过200字"></textarea>
					</view>
					<view hover-class="hoverclass">提交</view>
				</view>
			</view>

		</view>
		<!-- 选择业主身份 -->
		<view class="popup" v-if="pickerId">
			<view class="mb" @click="closePicker"></view>
			<view class="openarea chooseid">
				<view class="openheader">
					<text>选择性别</text>
					<image src="../../static/close.png" class="opencolse" @click="closePicker"/>
				</view>
				<picker-view  :value="pickerValue" @change="pickerChange" class="pickerview" indicator-style="height:50px;" >
					<picker-view-column>
						<view class="item" style="line-height:50px" v-for="(item,index) in picker" :key="index">{{item.label}}</view>
					</picker-view-column>
				</picker-view>
			
				<view class="openbutton" hover-class="hover-openbutton" @click="pickerClick">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data () {
			return {
				config: {
					title: '活动报名', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				reportList:[
					{	
						id:1,
						text:'不是本小区用户',
						check:true
					},
					{
						id:2,
						text:'发布虚假、发动、不道德、违法信息',
						check:false
					},
					{
						id:3,
						text:'恶意灌水重复发贴',
						check:false
					},
					{
						id:4,
						text:'其他原因',
						check:false
					}

				],
				id:'',
				sexText:'男',
				sex:1,
				number:'',
				name:'',
				weixin:'',
				phone:'',
				content:'',
				picker: [{
					value:1,
					label:'男'},
					{
					value:2,
					label:'女'
					}
				],
				pickerValue:0,
				pickerId:false,

			}
		},
		mounted() {
			if(this.$mp.query.id){
				this.id = this.$mp.query.id
			}
			this.sex = uni.getStorageSync('user').sex
			if(this.sex == 1){
				this.sexText = '男'
			}else if(this.sex == 0){
				this.sexText = '保密'
			}else{
				this.sexText = '女'
			}
			this.phone = uni.getStorageSync('mobile')
			this.weixin = uni.getStorageSync('weixin')
			
		},
		methods:{
			openPicker(e){
				this.pickerId = true
			},
			closePicker(){
				this.pickerId = false
			},
			pickerChange(e){
				var target = e.detail.value[0]
				this.pickerValue = target
			},
			pickerClick(e){
				this.sex = this.picker[this.pickerValue].value
				this.sexText = this.picker[this.pickerValue].label
				this.pickerId = false
			},
			weixinHandler(e){
				this.weixin = e.detail.value
				uni.setStorageSync('weixin',this.weixin)
			},
			//统计处理
			textareaInput(e){
				this.content = e.detail.value
			},
			itemClick(obj){
				this.reportList.map((item) => {
					if(item.id == obj.id){
						item.check = !item.check
					}
				})
			},
			submitJoin(){
				
				var data = {
					number:this.number,
					name:this.name,
					sex:this.sex,
					weixin:this.weixin,
					phone:this.phone,
					activity_id:this.id,
					content:this.content,
					community_id:uni.getStorageSync('community_id')
				}
				if(this.sexText == '男'){
					data.sex = 1
				}else{
					data.sex = 2
				}
				if(!data.name){
					uni.showToast({
					    title: '请输入姓名',
						icon:'none',
					    duration: 2000
					});
					return
				}
				if(!data.number){
					uni.showToast({
					    title: '请输入参数人数',
						icon:'none',
					    duration: 2000
					});
					return
				}
				if(!data.phone){
					uni.showToast({
					    title: '请输入参手机号',
						icon:'none',
					    duration: 2000
					});
					return
				}
				// if(!data.weixin){
				// 	uni.showToast({
				// 	    title: '请输入微信号',
				// 		icon:'none',
				// 	    duration: 2000
				// 	});
				// 	return
				// }
				this.subMessageTodo(this.activeIds,6,(ss) => {
					this.Api.activityjoin(data).then((result) => {
						if(result.code == 1){
							uni.showToast({
								icon:'success',
								title:result.msg,
								success: () => {
									uni.redirectTo({
										url:'/pages/index/cdetail?id='+this.id+'&type='+this.type
									})
								}
							})
						}
					})
				})
			}
		},
		components:{
			navigationCustom
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: white!important;
	}
	.personalcard{
		display: flex;
		flex-direction: column;
		background: whtie!important;
		height:100vh;
		.pcontent{
			padding:24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.reportheader{
				height:42upx;
				font-size:30upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:42upx;
			}
			.reportlist{
				display: flex;
				flex-direction: column;
				.reportitem{
					display: flex;
					flex-direction: row;
					height:90upx;
					align-items: center;
					border-bottom: 1px solid rgba(222, 222, 222, 0.5);
					.label{
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						margin-right:24upx;
						height: 90upx;
						line-height: 90upx;
					}
					.value{
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height: 90upx;
						height:90upx;
						width:calc(100% - 160upx);
					}
					image{
						margin-left:auto;
						width:60upx;
						height:60upx;
					}
				}
			}
			.reportother{
				height:42upx;
				margin-top:72upx;
				font-size:30upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:42upx;
			}
			.textareawrap{
				position: relative;
				height:400upx;
				background:rgba(222,222,222,0.3);
				border-radius:8px;
				margin-top:30upx;
				.textarea{
					position: absolute;
					left:0;
					top:0;
					width:100%;
					height:100%;
					padding:24upx;
					box-sizing: border-box;
				}
				.textareanum{
					position: absolute;
					right:20px;
					bottom: 20px;
					height:36upx;
					font-size:26upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:36upx;
				}
			}
			.lybtn{
				width:702upx;
				height:80upx;
				background:rgba(255,156,0,1);
				box-shadow:0px 8upx 16upx 0px rgba(225,138,0,0.1);
				border-radius:40upx;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				line-height:80upx;
				text-align: center;
				margin-top:234upx;
				position: fixed;
				left:24upx;
				bottom: 108upx;
			}
			.gbbtn{
				width:702upx;
				height:80upx;
				background:rgba(216,216,216,1);
				box-shadow:0px 8upx 16upx 0px rgba(51,51,51,0.1);
				border-radius:40upx;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:80upx;
				text-align: center;
				margin-top:40upx
			}
			
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
				// 留言
				.message {
					position: fixed;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 760upx;
					z-index: 4001;
					width:750upx;
					height:760upx;
					padding-left: 24upx;
					padding-right:24upx;
					box-sizing: border-box;
					background:rgba(255,255,255,1);
					border-radius:16upx 16upx 0px 0px;
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
						.selectback{
							position: absolute;
							left:48upx;
							top:50upx;
							margin-top:-16upx;
							width:23upx;
							height:32upx;
						}
					}
					.textwrap{
						width:100%;
						height:400upx;
						background:rgba(222,222,222,0.3);
						border-radius:8upx;
						position: relative;
						.textarea{
							position: absolute;
							left:0;
							top:0;
							width:100%;
							height:100%;
							padding:20upx;
							font-size:26upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:36upx;
						}
						.tip{
							position: absolute;
							right:20upx;
							bottom: 20upx;
							font-size:26upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(51,51,51,1);
							line-height:u36px;
							display: flex;
							flex-direction: row;
							.t2{
								color:rgba(153, 153, 153, 1)
							}
						}
					}
					hoverclass{
						background: rgba(255, 156, 0, 1);
					}
					
				}
				.message view:last-child{
					width:702upx;
					height:80upx;
					background:rgba(255,156,0,0.5);
					box-shadowss:0px 8upx 16upx 0px rgba(225,138,0,0.1);
					border-radius:40upx;
					margin-top:64upx;
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
					line-height:80upx;
					text-align: center;
				}
	
			}
		}
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
				z-index: 2001;
				background: rgba(0, 0, 0, 0.6);
			}
			// 开通小区
			.openarea {
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 3009;
				width: 100%;
				height: 652upx;
				background: rgba(255, 255, 255, 1);
				border-radius: 16upx 16upx 0upx 0upx;
				display: flex;
				flex-direction: column;
				padding-left: 48upx;
				padding-right: 48upx;
				box-sizing: border-box;
				.openheader {
					height: 100upx;
					line-height: 100upx;
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
					.selectback{
						position: absolute;
						left:48upx;
						top:50upx;
						margin-top:-16upx;
						width:23upx;
						height:32upx;
					}
				}
				.openitem {
					display: flex;
					flex-direction: row;
					align-items: center;
					position: relative;
					height: 90upx;
					border-bottom: 2upx solid rgba(222, 222, 222, 0.3);
					.opentitle {
						width: 120upx;
						font-size: 30upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(51, 51, 51, 1);
						margin-right: 30upx;
						text-align: right;
					}
					.opentxt {
						width: calc(100% - 72upx - 150upx);
						font-size: 26upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(153, 153, 153, 0.5);
						// display: flex;
						// justify-content: flex-end;
					}
					.opendown {
						width: 30upx;
						height: 20upx;
						margin-left: auto;
					}
					input {
						width: calc(100% - 72upx - 150upx);
					}
					.adico {
						width: 32upx;
						height: 42upx;
						display: flex;
						margin-left: auto;
					}
					.openmobile {
						width: 136upx;
						height: 56upx;
						background: rgba(255, 156, 0, 1);
						border-radius: 8upx;
						border: none;
						font-size: 26upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(255, 255, 255, 1);
						line-height: 56upx;
						text-align: center;
						padding: 0;
					}
				}
				// 说明
				.openinfo {
					width: 100%;
					font-size: 22upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					line-height: 32upx;
					margin-top: 20upx;
					.rcolor{
						color: #ff9c00;
					}
				}
				.openbutton {
					width: 100%;
					height: 80upx;
					background: #ff9c00;
					border-radius: 8upx;
					font-size: 34upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(255, 255, 255, 1);
					line-height: 80upx;
					text-align: center;
					margin-top: 64upx;
				}
				.hover-openbutton {
					background: rgba(255, 156, 0, 0.5) !important;
				}
			}
			//选择业主
			.chooseid{
				height:500upx;
				bottom:0;
				// bottom:calc(100rpx + env(safe-area-inset-bottom) / 2);
				.pickerview{
					width:100%;
					height:200upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.item{
						width: 100%;
						font-size: 34upx;
						text-align: center;
					}
				}
			}
		}
	}
</style>
