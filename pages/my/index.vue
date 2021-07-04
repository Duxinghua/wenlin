<template>
<view class="my">
	<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
	<view class="content">
		<view class="header">
			<view class="avatarwrap" @click="targetClick(15)">
				<image src="../../static/da.png" class="da" v-if="userinfo.daren"></image>
				<image :src="userinfo.avatar" class="avatar"></image>
			</view>
			<view class="nameinfo">
				<!-- @click="targetClick(15)" -->
				<view class="useredit"  >
					<text class="name">{{userinfo.user_nickname}}·{{userinfo.building}}#</text>
					<button   @click="getaHandler" :class="['','editfix']">
					更新
					</button>
				</view>
				<view class="usersex">
					<image :src="userinfo.sex == 1 ? '../../static/man.png' : (userinfo.sex == 0 ? '../../static/mi.png' : '../../static/wuman.png' )" class="sexico" ></image>
<!-- 				
					<text class="t1">{{userinfo.sex == 1 ? '男' : (userinfo.sex == 0 ? '保密' : '女')}}</text> -->
					<!--  v-if="userinfo.founder == 1" -->
					<view class="t2">创</view>
				</view>
			</view>
			<button @click="singleHandler" :class="['single', userinfo.is_sign == 1 ? 'singlefix':'']">{{userinfo.is_sign == 1 ? '已签到' :'签到'}}</button>
<!-- 			<button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="onGotUserInfo">获取用户信息</button> -->
		</view>
		<view class="personalwrap">
			<view class="personitem" @click="targetClick(11)">
				<text class="num">{{userinfo.publish_count}}</text>
				<text class="text">发贴</text>
			</view>
			<view class="personitem" @click="targetClick(12)">
				<text class="num">{{userinfo.score}}</text>
				<text class="text">积分</text>
			</view>
			<view class="personitem"  @click="targetClick(13)">
				<text class="num" >{{userinfo.know_count}}</text>
				<text class="text">认识我</text>
			</view>
			<view class="personitem"  @click="targetClick(14)">
				<text class="num">{{userinfo.love_value}}</text>
				<text class="text">热心值</text>
			</view>
		</view>
		<view class="navwrap">
			<view class="navitem" @click="targetClick(1)">
				<image src="../../static/me1.png" class="mico"></image>
				<text class="navtext">我的消息</text>
				<text class="num_count" v-if="notices_count != 0"> {{(notices_count <= 99) ? notices_count : '99+'}}</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(2)">
				<image src="../../static/me2.png" class="mico"></image>
				<text class="navtext">我的收藏</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(3)">
				<image src="../../static/me3.png" class="mico"></image>
				<text class="navtext">我的小区</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(4)">
				<image src="../../static/me4.png" class="mico"></image>
				<text class="navtext">我的邻居</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(7)" v-if="false">
				<image src="../../static/me5.png" class="mico"></image>
				<text class="navtext">我的居委会</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(6)">
				<image src="../../static/me6.png" class="mico"></image>
				<text class="navtext">社区公益</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(8)">
				<image src="../../static/me7.png" class="mico"></image>
				<text class="navtext">意见建议</text>
				<image src="../../static/mearrow.png" class="cardico"></image>
			</view>
<!-- 			<view class="navitem"  @click="targetClick(5)" v-if="false">
				<image src="../../static/me5.png" class="mico"></image>
				<text class="navtext">我的闲置</text>
				<image src="../../static/cardmore.png" class="cardico"></image>
			</view>
			<view class="navitem" @click="targetClick(6)">
				<image src="../../static/me5.png" class="mico"></image>
				<text class="navtext">达人信息</text>
				<image src="../../static/cardmore.png" class="cardico"></image>
			</view> -->
		</view>
	</view>
	<!-- 签到 -->
	<view class="popup" v-if="singShow">
		<view class="mb" @click="closeSingShow"></view>
		<view class="qdcontent">
			<view class="tips">
				恭喜获得
			</view>
			<view class="tipswrap">
				<image src="../../static/jf.png" class="jf"></image>
				<image src="../../static/jfx.png" class="jfx"></image>
				<text class="jfm">{{singValue}}</text>
			</view>
		</view>
	</view>
	<!-- 发布处理 -->
<!-- 	<view class="popup popupfix" v-if="pushShow == 2">
		<view class="mb" @click="pushclose" ></view>
		<view class="pushcatewrap">
			<view class="pushcateitem" v-for="(item, index) in cateList" :key="index" @click="pushClick(item)">
				<image :src="item.image" />
				<text>{{ item.name }}</text>
			</view>
			<image src="../../static/pclose.png" class="pushclose" @click="pushclose" />
		</view>
		
	</view> -->
	<!-- 发布组件 -->
	<Pushedit ref="Pushedit"  />
</view>
</template>

<script>
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
import Tool from '../../utils/tool.js'
export default {
	data() {
		return {
			config: {
				title: '我的', //title
				bgcolor: 'white', //背景颜色
				fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
				type:3, //type 1，3胶囊 2，4无胶囊模式
				transparent: false, //是否背景透明 默认白色
				linear: false, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			singShow:false,
			singValue:0,
			userinfo:{},
			notices_count:0,
			cateList: [
				{
					id: 1,
					image: require('../../static/p1.png'),
					name: '求助'
				},
				{
					id: 2,
					image: require('../../static/p2.png'),
					name: '新鲜事'
				},
				{
					id: 3,
					image: require('../../static/p3.png'),
					name: '闲置'
				},
				{
					id: 4,
					image: require('../../static/p4.png'),
					name: '鹊桥'
				},
				{
					id: 6,
					image: require('../../static/p5.png'),
					name: '达人'
				}
			],
			isSingFlag:true
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	mounted() {
		this.getMyinfo()
		this.$getCount((result) => {
			var count = 0
			if(result.code == 1){
				if(!isNaN(result.data.comment_unread)){
						count += result.data.comment_unread;
						count += result.data.committee_publish_notices_unread;
						count += result.data.leave_message_unread
						count += result.data.sys_notices_unread;
					this.notices_count = count
				}else{
					this.notices_count = 0
				}
			}
		})
		this.$Bus.$on('noToken', (e) => {
			console.log(e,'e','1111')

		})
		this.$Bus.$on("countmsg",(countmsg)=>{
			this.$getCount((result) => {
				var count = 0
				if(result.code == 1){
					if(!isNaN(result.data.comment_unread)){
						count += result.data.comment_unread
						count += result.data.leave_message_unread
						count += result.data.sys_notices_unread
						count += result.data.thanks_unread
						this.notices_count = count
					}else{
						this.notices_count = 0
					}
				}
			})
		})
	},
	methods:{
		//发布
		pushclose(){
			this.$parent.changeHome()
		},
		pushClick(obj) {
			uni.navigateTo({
				url: '/pages/push/edit?type=' + obj.id
			});
		},
		getMyinfo(){
			var data = {
				community_id:uni.getStorageSync('community_id')
			}
			this.Api.myCenter(data).then((result) => {
				if(result.code == 1){
					this.userinfo = result.data
					uni.setStorageSync('user_id',result.data.id)
					uni.setStorageSync('community_name',result.data.community_name)
				}
			})
		},
		closeSingShow(){
			this.singShow = false
		},
		getaHandler(e){
			 wx.getUserProfile({
			      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			      success: (res) => {
			        
					var u = res.userInfo
					var data = {
						avatarUrl:u.avatarUrl,
						city:u.city,
						country:u.country,
						gender:u.gender,
						nickName:u.nickName
					}
					this.Api.updateUs(data).then((dd)=>{
							this.getMyinfo()
							uni.showToast({
								title:'更新成功',
								icon:'none',
								duration:1000
							})
					
					})
			      }
			 })

		},
		//签到
		singleHandler(e){
			// console.log(e)
			// var imgUrl = e.detail.userInfo.avatarUrl
			// this.Api.updateUserInfo({avatarUrl:imgUrl}).then((dd)=>{
			// 	if(dd.code == 1){
					if(this.userinfo.is_sign != 1){
						if(this.isSingFlag){
							this.isSingFlag = false
							this.Api.userSaveSign({}).then((result) => {
								if(result.code == 1){
									uni.showToast({
										title:result.msg,
										icon:'success',
										duration:1500,
										success: () => {
											this.getMyinfo()
											this.singShow = true
											this.singValue = result.data
											setTimeout(()=>{
												this.singShow = false
											},1500)
										}
									})
						
								}
							})
						}
					}else{
						uni.showToast({
							title:'您已签到',
							icon:'none',
							duration:1000
						})
					}
				
			// 	}
			// })


		},	
		customConduct(e){
	
		},
		targetClick(index){
			switch(index){
				case 1:
				uni.navigateTo({
					url:'/pages/update/message'
				})
				break;
				case 2:
				uni.navigateTo({
					url:'/pages/update/collect'
				})
				break;
				case 3:
				uni.navigateTo({
					url:'/pages/update/mycommunity'
				})
				break;
				case 4:
				uni.navigateTo({
					url:'/pages/update/neighbour'
				})
				break;
				case 5:
				uni.navigateTo({
					url:'/pages/update/myspare'
				})
				break;
				case 6:
				uni.navigateTo({
					url:'/pages/update/publicbenefit'
				})
				break;
				case 7:
				uni.navigateTo({
					url:'/pages/update/committee?id='+this.userinfo.committee_id+'&community_id='+this.userinfo.community_id
				})
				break;
				case 8:
				uni.navigateTo({
					url:'/pages/update/idea'
				})
				break;
				case 11:
				uni.navigateTo({
					url:'/pages/update/postlist'
				})
				break;
				case 12:
				uni.navigateTo({
					url:'/pages/update/integral'
				})
				break;
				case 13:
				uni.navigateTo({
					url:'/pages/update/look'
				})
				break;
				case 14:
				uni.navigateTo({
					url:'/pages/update/love?love='+this.userinfo.love_value
				})
				break;
				case 15:
				uni.navigateTo({
					url:'/pages/update/personalinfo'
				})
				break;
			}
		}
	},
	components: {
		navigationCustom
	}
};
</script>


<style lang="scss" scoped>
	.my{
		background: white;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		.content{
			display: flex;
			flex-direction: column;
			text-align: left;
			padding-bottom: 150upx;
			.header{
				padding:24upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				align-items: center;
				.avatarwrap{
					width:115upx;
					height:115upx;
					position: relative;
					z-index: 1;
					margin-right:29up0x;
					.da{
						position: absolute;
						right:0;
						bottom: 0;
						width:44upx;
						height:44upx;
						z-index: 3;
					}
					.avatar{
						position: absolute;
						left:0;
						top:0;
						width:96upx;
						height:96upx;
						border-radius: 50%;
						overflow: hidden;
						z-index: 2;
					}
				}
				.nameinfo{
					display: flex;
					flex-direction: column;
					.useredit{
						display: flex;
						flex-direction: row;
						align-items: center;
						.edit{
							width:40upx;
							height:40upx;
							margin-left:8upx;
						}
					}
					.name{
						height:50upx;
						font-size:36upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:50upx;
					}
					.usersex{
						display: flex;
						flex-direction: row;
						align-items: center;
						.sexico{
							width:40upx;
							height:36upx;
							margin-right:16upx;
						}
						.t1{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(102,102,102,1);
							line-height:34upx;
							margin-right:16upx;
						}
						.t2{
							text-align: center;
							font-size:20upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 32upx;
							width: 37upx;
							height: 30upx;
							background: #08C299;
							border-radius: 10upx;

						}
					}

				}
				.single{
					width: 170upx;
					height: 61upx;
					line-height: 61upx;
					background: linear-gradient(44deg, #FEAA0E, #FFC000);
					border-radius: 10px;
					text-align: center;
					font-size:28upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
					margin-left:auto;
				}
				.singlefix{
					background:rgba(222,222,222,0.3);
					color:#FF9C00
				}
			}
			.personalwrap{
				padding:24upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-top:50upx;
				padding-bottom: 50upx;
				border-bottom:8upx solid #F7F9FF;
				.personitem{
					width:25%;
					display: flex;
					flex-direction: column;
					align-items: center;
					border-right:2upx solid #F0F0F0;
					.num{
						font-size:36upx;
						font-family:PingFang-SC-Heavy,PingFang-SC;
						font-weight:bold;
						color:#020433;
						line-height:66upx;
					}
					.text{
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:#020433;
						line-height:36upx;
					}
				}
				.personitem:nth-child(4n){
					border: none;
				}
			}
			.navwrap{
				display: flex;
				flex-direction: column;
				padding-left:28upx;
				padding-right:28upx;
				box-sizing: border-box;
				width: 100%;
				.navitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					box-sizing: border-box;
					height:120upx;
					border-bottom: 1upx solid #F0F0F0;
					.mico{
						width:50upx;
						height:44upx;
						margin-right:16upx;
					}
					.navtext{
						font-size:34upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:#020433;
					}
					.num_count{
						width:36upx;
						height:36upx;
						border-radius: 50%;
						background:rgba(255,43,32,1);
						font-size:20upx;
						font-family:PingFang-SC-Heavy,PingFang-SC;
						color:rgba(255,255,255,1);
						line-height:36upx;
						text-align: center;
						margin-left:26upx;
					}
					.cardico{
						width:20upx;
						height:28upx;
						margin-left:auto;
					}
				}
			}
		}
		.popup{
			position: fixed;
			left:0;
			top:0;
			width:100%;
			height:100%;
			z-index: 40000;
			.mb{
				position: fixed;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index: 3001;
				background: rgba(0,0,0,0.6);
			}
			.qdcontent{
				position: fixed;
				left:50%;
				top:50%;
				transform: translate(-50%,-50%);
				z-index: 3002;
				width:528upx;
				height:240upx;
				background:rgba(255,255,255,1);
				border-radius:16px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				// padding-top:32upx;
				// box-sizing: border-box;
				.tips{
					height:44upx;
					font-size:32upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					line-height:44upx;
				}
				.tipswrap{
					margin-top:46upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					.jf{
						width:66upx;
						height:70upx;
					}
					.jfx{
						width:32upx;
						height:32upx;
					}
					.jfm{
						font-size:48upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:66upx;
					}
				}
			}
			//发布样式
			.pushcatewrap {
				position: fixed;
				left: 0;
				width: 100%;
				height:472upx;
				bottom: 0;
				z-index: 6000;
				background:white;
				border-radius:24upx 24px 0px 0upx;
				padding-top:64upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				.pushclose{
					position: absolute;
					bottom: 108upx;
					left:50%;
					transform: translateX(-50%);
					width:104upx;
					height: 104upx;
					// box-shadow:0px 12upx 20upx 0px rgba(0,0,0,0.1);
					border-radius:50%;
					
				}
				.pushcateitem {
					width: 20%;
					display: flex;
					flex-direction: column;
					align-items: center;
					height:160upx;
					image {
						width: 80upx;
						height: 80upx;
					}
					text {
						font-size: 26upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color:#666666;
						line-height: 36upx;
						height: 36upx;
						margin-top: 16upx;
					}
				}
			}
		}
		.popupfix{
			z-index: 50000;
		}
		.editfix{
			color:#333;
			width:80rpx;
			height: 40rpx;
			border-radius: 16rpx;
			background: #F8F8F8;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
