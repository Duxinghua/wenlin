<template>
	<!-- 举报 -->
	<view class="personalcard">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="pcontent">
			<text class="reportheader">请选择举报原因（可多选）：</text>
			<view class="reportlist">
				<view class="reportitem" v-for="(item,index) in reportList" :key="index" @click="itemClick(item)">
					<text>{{item.name}}</text>
					<image :src="item.check ? '../../static/checked.png' : '../../static/check.png'"></image>
				</view>
				
			</view>
			<text class="reportother">
				请填写举报内容（必填）：
			</text>
			<view class="textareawrap">
				<textarea class="textarea" @input="textHandler" placeholder="请填写举报内容，不超过200字"></textarea>
				<text class="textareanum">{{textValue.length}}/200</text>
			</view>
			<view class="lybtn" @click="reportHandler">
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
						<textarea maxlength="200" v-model="textValue" class="textarea" placeholder="想对TA说点什么，不超过200字"></textarea>
					</view>
					<view hover-class="hoverclass" >提交</view>
				</view>
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
					title: '举报', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: true, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				reportList:[
				],
				textValue:'',
				params:{}

			}
		},
		mounted(){
			if(this.$mp.query){
				this.params = this.$mp.query
			}
			this.getTypes()
		},
		methods:{
			textHandler(e){
				this.textValue = e.detail.value
			},
			closePicker(){
			},
			itemClick(obj){
				this.reportList.map((item) => {
					if(item.category_id == obj.category_id){
						item.check = !item.check
					}
				})
			},
			getTypes(){
				this.Api.getAccusationType({}).then((result) => {
					if(result.code == 1){
						var res = result.data
						res.map((item) => {
							item.check = false
						})
						this.reportList = res
					}
				})
			},
			reportHandler(){
				this.params.community_id = uni.getStorageSync('community_id')
				var arr = []
				this.reportList.map((item) => {
					if(item.check){
						arr.push(item.category_id)
					}
				})
				if(arr.length == 0){
					uni.showToast({
						icon:'none',
						title:'请选择举报分类'
					})
					return
				}else{
					this.params.category_id = arr.join(',')
				}
				if(!this.textValue){
					uni.showToast({
						icon:'none',
						title:'请输入举报内容'
					})
					return
				}else{
					this.params.description = this.textValue
				}
				this.Api.setUserAccusation(this.params).then((result)=>{
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							duration:3000,
							success: () => {
								uni.navigateBack({
								    delta: 1
								});
							}
						})
					}
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
					height:84upx;
					align-items: center;
					border-bottom: 1px solid rgba(222, 222, 222, 0.5);
					text{
					
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:84upx;
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
	}
</style>
