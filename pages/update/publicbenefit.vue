<template>
	<view class="publicbenefit">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view class="labelwrap">
				<view :class="['labelitem',labelIndex == 1 ? 'labelActive' : '']" @click.stop="LabelHandler(1)">
					公益金
				</view>
				<view :class="['labelitem',labelIndex == 2 ? 'labelActive' : '']" @click.stop="LabelHandler(2)">
					捐赠榜
				</view>
				<view :class="['labelitem',labelIndex == 3 ? 'labelActive' : '']" @click.stop="LabelHandler(3)">
					支出记录
				</view>
			</view>
			<view class="labelitem3" v-if="labelIndex ==3">
				<view class="labelitem">
					<u-image src="https://cdn.uviewui.com/uview/swiper/1.jpg" width="100%" height="348rpx" border-radius="10rpx"></u-image>
					<view class="content">
						<view class="title">
							我是标题我是标题我是标题我是我是标题我是我是标题我是标题我是标题我是标题我是标题
						</view>
						<view class="score">
							+98
						</view>
						<image src="../../static/jf.png" class="jf"></image>
					</view>
				</view>
				
			</view>
			<view class="labelitem2" v-if="labelIndex == 2">
				<view class="labelbottomitem" v-for="(item,index) in scorelist" :key="index">
					<view class="scoretext">
						{{index+1}}
					</view>
					<view class="avatarwarp">
						<image :src="item.avatar" class="avatar"></image>
						<image src="../../static/da.png" class="da" v-if="item.daren == 1"></image>
					</view>
					<view class="userwrap">
						<view class="t1">
							{{item.user_nickname}}
						</view>
						<view class="t2">
							<image src="../../static/man.png" class="ico" v-if="item.sex == 1"></image>
							<image src="../../static/wuman.png" class="ico" v-if="item.sex == 2"></image>
							<image src="../../static/mi.png" class="ico" v-if="item.sex == 3"></image>
						</view>
					</view>
					<view class="score">
						+{{item.total_score}}
					</view>
					<image src="../../static/jf.png" class="jf"></image>
				</view>
			</view>
			<view class="labelitem1" v-if="labelIndex == 1">
				<view class="labeltop">
					<view class="canvaswrap">
						<image :src="imgUrl +'linebg.png'" class="linebg" width="100%" height="459rpx"></image>
						<!-- <u-image src="../../static/linebg.png" ></u-image> -->
						<view class="title">
							<view class="titleitem">
								当前公益金：
								<view class="text">
									{{detail.score}}
								</view>
							</view>
							<view class="titleitem">
								累积：
								<view class="text">
									{{detail.total_score}}
								</view>
							</view>
							<view class="titleitem">
								排名：
								<view class="text">
									{{detail.ranking}}
								</view>
							</view>
						</view>
						<view class="qiun-charts" >
							<!--#ifdef MP-ALIPAY -->
							<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
							<!--#endif-->
							<!--#ifndef MP-ALIPAY -->
							<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
							<!--#endif-->
						</view>
					</view>
					<view class="line">
						小区公益金来源于大家的积分捐赠，平台按照一定比例兑换现金，作为小区各种公益活动的经费。                   
					</view>
					<view class="line">
						积分兑换现金的比例目前为<text>{{detail.score_to_money}}积分兑换1元</text>
					</view>
				</view>
				<view class="labelbottom">
					<view class="labelbottomitem" v-for="(item,index) in detail.new_list" :key="index">
						<view class="avatarwarp">
							<image :src="item.avatar" class="avatar"></image>
							<image src="../../static/da.png" class="da" v-if="item.daren == 1"></image>
						</view>
						<view class="userwrap">
							<view class="t1">
								{{item.user_nickname}}
							</view>
							<view class="t2">
								{{item.create_time | formatTime}}捐赠
							</view>
						</view>
						<view class="score">
							+{{item.score}}
						</view>
						<image src="../../static/jf.png" class="jf"></image>
					</view>
				</view>

			</view>
		</view>
		<view class="btns" @click.stop="todoHandler">
			我要捐赠
		</view>
		<u-popup v-model="scoreshow" border-radius="10" mode="center" closeable>
				<view class="scorepopup">
					<u-image :src="user.avatar" width="128" height="128" border-radius="64"></u-image>
					<view class="usertext">
						积分捐赠将作为小区的公益金 感谢您的热心捐献
					</view>
					<view class="inputwrap">
						<view class="label">捐赠积分：</view>
						<u-input v-model="scoreValue" placeholder="请输入积分" />
					</view>
					<view class="btnwrap">
						<view class="btn1 color1" @click.stop="scoreshow = false">
							取消
						</view>
						<view class="btn1 color2" @click.stop="confirmHandler">
							确定
						</view>
					</view>
				</view>
		</u-popup>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import  { isJSON } from '@/common/checker.js';
	var _self;
	var canvaLineA=null;
	var lastMoveTime=null;//最后执行移动的时间戳
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom
		},
		data(){
			return {
				imgUrl:this.Config.minUrl,
				config: {
					title: '社区公益', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)",//文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					tnransparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200,
				labelIndex:1,
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				Interactive:'',//交互显示的数据
				detail:{
					score:0,
					total_score:0,
					ranking:0,
					score_to_money:0
				},
				scoreshow:false,
				user:{},
				scoreValue:'',
				community_id:0,
				scorelist:[],
				page:1,
				page_size:10,
				total_pages:0
				
			}
		},
		onLoad(options){
			this.community_id = options.community_id
			this.user = uni.getStorageSync('user')
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth=uni.upx2px(707);
			this.cHeight=uni.upx2px(361);
			this.getServerData();
			this.getList()

		},
		onShareAppMessage(){
			//#ifdef MP-QQ
			qq.showShareMenu({showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']})
			//#endif
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if(this.total_pages > this.page){
				this.page ++
				this.getList(true)
			}
		},
		methods:{
			getList(ismore){
				var data = {
					page_size:this.page_size,
					page:this.page,
					community_id:this.community_id || uni.getStorageSync('community_id')
				}
				this.Api.donateScoreList(data).then((result)=>{
					if(result.code == 1){
						this.total_pages = result.data.total_pages
						this.scorelist = result.data.list
					}
				})
			},
			confirmHandler(){
				if(!this.scoreValue){
					return this.$u.toast('请输入捐赠积分')
				}
				var data = {
					to_community_id:this.community_id || uni.getStorageSync('community_id'),
					from_community_id:uni.getStorageSync('community_id'),
					score:this.scoreValue
				}
				this.Api.userDonateScore(data).then((result)=>{
					if(result.code == 1){
						this.scoreshow = false
						this.getServerData()
						this.scoreValue = ''
						return this.$u.toast(result.msg)
					}else{
						return this.$u.toast(result.msg)
					}
				})
			},
			todoHandler(){
				this.scoreshow = true
			},
			LabelHandler(index){
				this.labelIndex = index
				this.page = 1
				this.page_size = 10
				this.scorelist = []
				if(index == 1){
					this.getServerData()
				}else if(index == 2){
					this.getList()
				}
			},
			getServerData(){
				var data = {
					community_id:this.community_id || uni.getStorageSync('community_id')
				}
				this.Api.getCommunityScore(data).then((result)=>{
					if(result.code == 1){
						var categories = []
						var datavalue = []
						result.data.community_7day.map((item)=>{
								categories.push(
									this.formatTimeMd(item.today_time)
								)
								datavalue.push(item.total_score)
						})
						this.detail = result.data
						var LineA = {
						  "categories": categories,
						  "series": [{
						    "name": "公益金",
						    "data": datavalue
						  }]
						}
						_self.textarea = JSON.stringify(LineA);
						_self.showLineA("canvasLineA",LineA);
					}
				})
		
			},
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					colors:['#ffffff'],
					fontSize:11,
					padding:[15,15,0,15],
					legend:{
						show:false,
						padding:5,
						lineHeight:11,
						margin:0,
					},
					dataLabel:false,
					dataPointShape:false,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						axisLineColor:'#ffffff',
						fontColor:'#ffffff',
						gridColor:'transparent',
						gridType:'dash',
						dashLength:8,
						//disableGrid:true
					},
					yAxis: {
						gridType:'dash',
						axisLineColor:'#ffffff',
						fontColor:'#ffffff',
						gridColor:'transparent',
						dashLength:8,
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						},
						tooltip:{
							gridColor:'#ffffff',
							labelFontColor:'#ffffff',
							horizentalLine:false,
							xAxisLabel:false,//是否显示X轴辅助标签
							yAxisLabel:false
						}
					}
				});
				
			},
			touchLineA(e) {
				lastMoveTime=Date.now();
			},
			moveLineA(e){
				let currMoveTime = Date.now();
				let duration = currMoveTime - lastMoveTime;
				if (duration < Math.floor(1000 / 60)) return;//每秒60帧
				lastMoveTime = currMoveTime;
				
				let currIndex=canvaLineA.getCurrentDataIndex(e);
				if(currIndex>-1&&currIndex<canvaLineA.opts.categories.length){
					let riqi=canvaLineA.opts.categories[currIndex];
					let leibie=canvaLineA.opts.series[0].name;
					let shuju=canvaLineA.opts.series[0].data[currIndex];
					this.Interactive=leibie+':'+riqi+'-'+shuju+'元';
				}
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			touchEndLineA(e){
				let currIndex=canvaLineA.getCurrentDataIndex(e);
				if(currIndex>-1&&currIndex<canvaLineA.opts.categories.length){
					let riqi=canvaLineA.opts.categories[currIndex];
					let leibie=canvaLineA.opts.series[0].name;
					let shuju=canvaLineA.opts.series[0].data[currIndex];
					this.Interactive=leibie+':'+riqi+'-'+shuju+'元';
				}
				canvaLineA.touchLegend(e);
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			changeData(){
				if(isJSON(_self.textarea)){
					let newdata=JSON.parse(_self.textarea);
					canvaLineA.updateData({
						series: newdata.series,
						categories: newdata.categories
					});
				}else{
					uni.showToast({
						title:'数据格式错误',
						image:'../../../static/images/alert-warning.png'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.publicbenefit{
		display: flex;
		flex-direction: column;
		background: white;
		width:100%;
		min-height: 100vh;
		.content{
			display: flex;
			flex-direction: column;
			.labelwrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				height:100rpx;
				border-bottom: 1px solid #EEF2FA;
				.labelitem{
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #020433;
					width:33.33%;
					height:100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.labelActive{
					position: relative;
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FF9C00;
				}
				.labelActive:before{
					position: absolute;
					content:'';
					left:50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44rpx;
					height: 7rpx;
					background: #FF9C00;
					border-radius: 4rpx;
				}
			}
			.labelitem3{
				display: flex;
				flex-direction: column;
				padding:0 48rpx;
				box-sizing: border-box;
				.labelitem{
					display: flex;
					flex-direction: column;
							padding-top:20rpx;
							box-sizing: border-box;
					.content{
						display: flex;
						flex-direction: row;
						align-items: flex-start;
						margin-top:20rpx;
						padding-bottom: 20rpx;
						box-sizing: border-box;
						border-bottom: 2rpx solid #F0F0F0;
						.title{
							flex:1;
							overflow: hidden;
							  text-overflow: ellipsis;
							  display: -webkit-box;
							  -webkit-line-clamp: 2;
							  -webkit-box-orient: vertical;
							font-size: 34rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #020433;
						}
						.score{
							font-size: 22rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #08C299;
							margin-left:20rpx;
						}
						.jf{
							width:50rpx;
							height:50rpx;
							margin-left:20rpx;
						}
					}
				}
				
			}
			.labelitem2{
				display: flex;
				flex-direction: column;
				padding:0 28rpx;
				box-sizing: border-box;
			}
			.labelitem1{
				display: flex;
				flex-direction: column;
				.labeltop{
					display: flex;
					flex-direction: column;
					padding:40rpx 22rpx;
					box-sizing: border-box;
					border-bottom: 10rpx solid #F7F9FF;
					.canvaswrap{
						width: 100%;
						height: 459rpx;
						position: relative;
						z-index: 2;
						background: linear-gradient(0deg, #FA8326, #FDAC0D);
						border-radius: 10rpx;
						display: flex;
						flex-direction: column;
						margin-bottom: 20rpx;
						.linebg{
							position: absolute;
							z-index: -1;
							left:0;
							top: 0;
							width:100%;
							height:100%;
						}
						.title{
							width:calc(100% - 40rpx);
							margin:0 auto;
							display: flex;
							flex-direction: row;
							align-items: center;
							height:76rpx;
							border-bottom: 2rpx solid white;
							.titleitem{
								width:40%;
								font-size: 22rpx;
								font-family: PingFang SC;
								font-weight: bold;
								color: #FFFFFF;
								display: flex;
								flex-direction: row;
								align-items: center;
								.text{	
									font-size: 30rpx;
								}
							}
							.titleitem:nth-child(2n){
							  width:30%;
							}
							.titleitem:nth-child(3n){
							  width:30%;
							}
						}
						/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
						.qiun-charts {
							width: 707upx;
							height: 361upx;
							background-color: transparent;
						}
						
						.charts {
							width: 707upx;
							height: 361upx;
							background-color: transparent;
						}
					}
					.line{
						font-size: 26rpx;
						font-weight: bold;
						font-family: PingFang SC;
						color: #95A0B6;
						text{
							color:#FF9C00;
						}
					}
				}
				.labelbottom{
					display: flex;
					flex-direction: column;
					padding:0 24rpx;
					box-sizing: border-box;

				}
			}
		}
		.labelbottomitem{
			display: flex;
			flex-direction: row;
			align-items: center;
			height:180rpx;
			width:100%;
			border-bottom: 1px solid #F0F0F0;
			.scoretext{
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #020433;
				margin-right:30rpx;
			}
			.avatarwarp{
				width:90rpx;
				height:90rpx;
				margin-right:20rpx;
				position: relative;
				.avatar{
					position: absolute;
					left:0;
					top:0;
					width:90rpx;
					height:90rpx;
					border-radius: 50%;
				}
				.da{
					position: absolute;
					right:0;
					bottom: 0;
					width:32rpx;
					height:32rpx;
				}
			}
			.userwrap{
				width:380rpx;
				display: flex;
				flex-direction: column;
				.t1{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #020433;
				}
				.t2{
					margin-top:10rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #404B69;
					.ico{
						width:40rpx;
						height:36rpx;
					}
				}
			}
			.score{
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #08C299;
				margin-left:auto;
			}
			.jf{
				width:70rpx;
				height:70rpx;
				margin-left:16rpx;
			}
		}
		.btns{
			width: 654rpx;
			height: 100rpx;
			background: linear-gradient(44deg, #FEAA0E, #FFC000);
			border-radius: 12rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 38rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			position: fixed;
			left:50%;
			bottom: 150rpx;
			transform: translateX(-50%);
		}
		.scorepopup{
			width: 622rpx;
			height: 695rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding:75rpx 28rpx;
			box-sizing: border-box;
			.usertext{
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #020433;
				line-height: 48rpx;
				margin-top:16rpx;
			}
			.inputwrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top:50rpx;
				.label{
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #404B69;
				}
				/deep/ .u-input__input,
				/deep/ .u-input{
					width: 320rpx;
					height: 92rpx;
					min-height: 92rpx;
					line-height: 92rpx;
					padding:0 21rpx;
					background: #F7F9FF;
					border-radius: 10rpx;

				}
			}
			.btnwrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				width:100%;
				margin-top:auto;
				.btn1{
					width: 264rpx;
					height: 99rpx;
					line-height: 99rpx;
					text-align: center;
					border-radius: 10rpx;
					font-size: 38rpx;
					font-family: PingFang SC;
					font-weight: bold;
				}
				.color1{
					background: #EEF2FA;
					color: #404B69;
					margin-right:auto;
				}
				.color2{
					color:white;
					background: linear-gradient(44deg, #FEAA0E, #FFC000);
				}
			}
		}
		
	}
</style>
