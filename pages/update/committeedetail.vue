<template>
	<!-- 居委会详情 -->
	<view class="personalcard">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="pcontent">
			<view class="itemwrap">
				<view class="item" v-for="(item,index) in navList" :key="index" @click.stop="itemHandler(index)">
					<view :class="['imagewrap',navIndex == index ? 'active' : '']">
						<image :src="item.image" v-if="navIndex != index"></image>
						<image :src="item.imagea" v-if="navIndex == index"></image>
					</view>
					<view :class="['itemtext',navIndex == index ? 'itemactive' : '']">
						{{item.value}}
					</view>
				</view>
			</view>
			<view class="dcontent">
				<rich-text :nodes="content"></rich-text>
			</view>
		</view>
	<Mobile @closewxsj="closewxsj" :wxsj="wxsj" :list="mobileList"></Mobile>
	</view>
</template>

<script>
	
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
import Reply from '@/components/reply/reply.vue'
import Mobile from '../../components/mobile/mobile.vue'

export default {
	data() {
		return {
			config: {
				title: '居委会详情', //title
				bgcolor: 'white', //背景颜色
				fontcolor: 'rgba(51, 51, 51, 1)', //文字颜色，默认白色
				type: 1, //type 1，3胶囊 2，4无胶囊模式
				transparent: false, //是否背景透明 默认白色
				linear: false, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			indicatorColor: 'rgba(255, 255, 255, 1)',
			indicatorActiveColor: 'rgba(255, 156, 0, 1)',
			navList:[
				{
					id:1,
					value:'简介',
					image:require('../../static/c1.png'),
					imagea:require('../../static/c1a.png')
				},
				{
					id:2,
					value:'工作人员',
					image:require('../../static/c2.png'),
					imagea:require('../../static/c2a.png')
				},
				{
					id:3,
					value:'电话',
					image:require('../../static/c3.png'),
					imagea:require('../../static/c3a.png')
				},
				{
					id:4,
					value:'导航',
					image:require('../../static/c4.png'),
					imagea:require('../../static/c4a.png')
				}
			],
			showReply:false,
			committee_id:'',
			content:'',
			detail:{},
			navIndex:0,
			wxsj:false,
			mobileList:[],
		};
	},
	mounted() {
		this.committee_id = this.$mp.query.id
		var data ={
			committee_id:this.committee_id
		}
		this.getDetail(data)
	},
	methods: {
		closewxsj(){
			this.wxsj = false
		},
		itemHandler(index){
			this.navIndex = index
			var obj = this.navList[index]
			if(obj.id == 1){

			}else if(obj.id == 2){

				uni.navigateTo({
					url: '/pages/update/committeeworker?id='+this.committee_id
				})
			}else if(obj.id == 3){

				this.wxsj = true
			}else if(obj.id == 4){

				var {address,longitude,latitude,contacts,business_time,title,images,...data} = this.detail
				var data = {
					title,
					address,
					longitude,
					latitude,
					contacts,
					business_time,
					images
				}
				uni.navigateTo({
					url: '/pages/update/committeemap?data='+JSON.stringify(data)
				})
			}else if(obj.id == 5){
				uni.navigateTo({
						url:'/pages/update/dynamicslist?type=8'
				})
			}
		},
		getDetail(data){
			this.Api.getCommitteeDetail(data).then((result) => {
				if(result.code == 1){
					this.detail = result.data
					this.content = result.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"')
					var res = {
						text:'固话',
						num:this.detail.contacts
					}
					this.mobileList.push(res)
					this.$forceUpdate()

				}
			})
		},
		closePicker() {},
		faceClick(){
			this.showReply = !this.showReply
		},
		InputFocus(){
			this.showReply = !this.showReply
		}
	},
	computed:{
		headerHeight(){
			return 96
		}
	},
	components: {
		navigationCustom,
		Reply,
		Mobile
	}
};
</script>

<style lang="scss" scoped>
page {
	background: white !important;
}
.personalcard {
	display: flex;
	flex-direction: column;
	background: whtie !important;
	min-height: 100vh;
	.pcontent {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.dcontent{
			padding: 48rpx;
			box-sizing: border-box;
		}
		.itemwrap{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 10rpx solid #F7F9FF;
			.item{
				display: flex;
				flex-direction: column;
				width:25%;
				align-items: center;
				.imagewrap{
					width:112rpx;
					height:112rpx;
					border-radius: 50%;
					background: #EEF2FA;
					position: relative;
					image{
						width:60rpx;
						height:60rpx;
						position: absolute;
						left:50%;
						top:50%;
						transform: translate(-50%,-50%);
					}
				}
				.active{
					background: #FF9C00;
				}
				.itemtext{
					margin-top:10rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #020433;
					line-height: 36rpx;
				}
				.itemactive{
					color: #FF9C00;
				}
			}
		}
		.userheader {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 16upx;
			.avatarwrap {
				width: 96upx;
				height: 96upx;
				margin-right: 16upx;
				position: relative;
				.heading {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					overflow: hidden;
				}
				.daing {
					position: absolute;
					right: 0;
					bottom: 0;
					width: 40upx;
					height: 40upx;
				}
			}
			.userinfo {
				display: flex;
				flex-direction: column;
				.username {
					height: 42upx;
					font-size: 30upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					line-height: 42upx;
				}
				.userdes {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top: 8upx;
					.u1 {
						font-size: 24upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						line-height: 34upx;
						margin-right: 24upx;
					}
					.u2 {
						width: 36upx;
						height: 32upx;
						background: rgba(255, 156, 0, 0.1);
						border-radius: 8upx;
						font-size: 20upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(255, 156, 0, 0.8);
						line-height: 32upx;
						text-align: center;
					}
				}
			}
			.userbtn {
				width: 126upx;
				border-radius: 8upx;
				border: 2upx solid rgba(255, 156, 0, 1);
				height: 56upx;
				font-size: 26upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(255, 156, 0, 1);
				line-height: 56upx;
				text-align: center;
				margin-left: auto;
			}
		}
		.swiper-wrap {
			width: 100%;
			height: 400upx;
			margin-top: 26upx;
			background: red;
			.swiper {
				width: 100%;
				height: 100%;
			}
		}
		.navlist{
			margin-top:48upx;
			margin-bottom:48upx;
			padding-left:40upx;
			padding-right:40upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			.navitem{
				width:25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				image{
					width:72upx;
					height:72upx;
				}
				text{
					height:36upx;
					font-size:26upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:36upx;
					margin-top:12upx;
				}
			}
		}
		.somethingwrap{
			display: flex;
			flex-direction: column;
			margin-top:16upx;
			.sometop{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.header{
					font-size:32upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					line-height:44upx;
				}
				.lookall{
					display: flex;
					flex-direction: row;
					align-items: center;
					.looktext{
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
					.lookico{
						width:40upx;
						height:40upx;
						margin-left:5upx;
					}
				}
			}
			.somelist{
				display: flex;
				flex-direction: column;
				.someitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size:28upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					line-height:40upx;
					padding-top:32upx;
					padding-bottom: 32upx;
					border-bottom: 1px solid rgba(222, 222, 222, 0.5);
					.sometype{
						margin-right:5upx;
						color:rgba(255,156,0,1);
					}
					.sometitle{
						font-weight: 500;
						color:rgba(51, 51, 51, 1)
					}
					.sometime{
						margin-left:auto;
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						line-height:36upx;
					}
				}
			}
		}
		.commentwrap{
			padding-top:0.44rem;
		}
		.useritem {
			display: flex;
			flex-direction: row;
			height: 106upx;
			line-height: 106upx;
			width: 100%;
			align-items: center;
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
			.t1 {
				width: 112upx;
				margin-right: 24upx;
				text-align: right;
				font-size: 28upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.t2 {
				font-size: 28upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}
			.ti {
				width: 40upx;
				height: 40upx;
				margin-left: auto;
			}
		}
		.useritemfix {
			height: 118upx;
			line-height: 118upx;
			.imgwrap {
				display: flex;
				flex-direction: row;
				.imgitem {
					width: 72upx;
					height: 72upx;
					border-radius: 8upx;
				}
			}
		}
		.lybtn {
			width: 702upx;
			height: 80upx;
			background: rgba(255, 156, 0, 1);
			box-shadow: 0px 8upx 16upx 0px rgba(225, 138, 0, 0.1);
			border-radius: 40upx;
			font-size: 36upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			line-height: 80upx;
			text-align: center;
			margin-top: 234upx;
			position: relative;
			left: 0upx;
			bottom: 108upx;
		}
		.gbbtn {
			width: 702upx;
			height: 80upx;
			background: rgba(216, 216, 216, 1);
			box-shadow: 0px 8upx 16upx 0px rgba(51, 51, 51, 0.1);
			border-radius: 40upx;
			font-size: 36upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			line-height: 80upx;
			text-align: center;
			margin-top: 40upx;
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
	}
}
</style>
