<template>
	<view class="openarea choosecommunity">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="searchwrap">
			<image src="../../static/search.png" class="ico"></image>
			<input type="text" class="chooseinput" v-model="community_text" placeholder="请输入小区" @input="chooseInput" />
			<text class="choosetext" @click="searchCommunity">搜索</text>
		</view>
		<view class="searchtip">
			附近的小区
		</view>
		<view class="searchlist">
			<view  class="searchitem" v-for="(item,index) in  searchCommunityList" :key="index" @click="selectCommunity(item)">
				<image src="../../static/itemico.png" class="itemico"></image>
				<view class="comminginfo">
					<text class="title">{{item.title}}</text>
					<text class="addressinfo">{{item.address}}</text>
				</view>
			</view>
			<Nodata :type="smallNodata" v-if="searchCommunityList.length == 0" />
		</view>
		<view class="welcomeopen">
			<text class="welcometext">没有自己的小区，您可以立即</text>
			<view class="welcomebtn" @click="openCommunityTodo">申请开通</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom
		},
		data(){
			return {
				config: {
					title: '选择我的小区', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)",//文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200,
				community_text:'',
				searchCommunityList:[],
				smallNodata:true,
				
			}
		},
		onLoad() {
			this.getlist()
		},
		methods:{
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			getlist(){
				var that = this
				that.Api.getNearCommunity({latitude:uni.getStorageSync('latitude'),longitude:uni.getStorageSync('longitude')}).then((result) => {
					if(result.code == 1){
						that.searchCommunityList = result.data;
					}
				})	
			},
			chooseInput(e) {
				this.community_text = e.detail.value;
				var data = {
					title: this.community_text
				};
				if(!isNaN(this.community_text)){
					this.community_text = 0
					return
				}
				if(this.community_text.length == 0){
					return
				}
				this.Api.searchCommunity(data).then(result => {
					if (result.code == 1) {
						this.searchCommunityList = result.data;
					}
				});
			},
			searchCommunity(){
				
			},
			openCommunityTodo(){
				
			},
			selectCommunity(item){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
		.openarea {
			width: 100%;
			min-height: 100vh;
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
		.choosecommunity {
			height: 798upx;
			.searchwrap {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				position: relative;
				margin-top:20upx;
				box-sizing: border-box;
				.ico{
					width: 33upx;
					height: 33upx;
					margin-right:20upx;
					position: absolute;
					left:40upx;
					top:50%;
					transform: translateY(-50%);
				}
				input {
					padding-left: 100upx;
					padding-right: 40upx;
					box-sizing: border-box;
					width: 580upx;
					height: 80upx;
					background: #F5F6FA;
					border-radius: 40upx;
				}
				.choosetext {
					font-size: 28upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
			}
			.searchtip{
				font-size: 36upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #020433;
				margin-top:20upx;
			}
			.searchlist {
				display: flex;
				flex-direction: column;
				padding-top: 16upx;
				padding-bottom: 16upx;
				box-sizing: border-box;
				// height: 400upx;
				overflow: hidden;
				overflow-y: auto;
				.searchitem {
					display: flex;
					flex-direction: row;
					align-items: flex-start;
					padding-bottom: 40upx;
					padding-top:40upx;
					// height: 200upx;
					flex: 0 0 120upx;
					border-bottom: 2upx solid rgba(222, 222, 222, 0.5);
					.itemico {
						width: 24upx;
						height: 24upx;
						margin-top:18upx;
						border-radius: 50%;
						margin-right:20upx;
					}
	
					.comminginfo {
						display: flex;
						flex-direction: column;
						width:100%;
			
						.title{
								font-size: 36upx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #020433;
						}
						.addressinfo{
							margin-top:22upx;
							font-size: 28upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #404B69;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
			.welcomeopen{
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top:72upx;
				.welcometext{
					
					font-size: 26upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #020433;
					line-height:42upx;
	
				}
				.welcomebtn{
					width: 391upx;
					height: 91upx;
					margin-top:21upx;
					background: linear-gradient(44deg, #FEAA0E, #FFC000);
					border-radius: 10upx;
					line-height: 91upx;
					text-align: center;
					font-size: 38upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
</style>
