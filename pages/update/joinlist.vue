<template>
	<view class="setvote">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
		<view class="headerItem"  v-for="(item, index) in joinList" :key="index" @click.stop="HandlerItem(item)">
			<view class="userheader">
				<image :src="item.user.avatar" class="useravatar"></image>
				<view class="userlist">
					<view class="usertop">
						<text class="username">
							{{ item.user.user_nickname }}
						</text>
						<view class="like">
							<image src="../../static/like.png" class="likeimg" />
							<text class="liketext">{{ item.user.love_value }}</text>
						</view>
						<view class="chuang" v-if="item.user.founder == 1">创</view>
					</view>
					<view class="userbottom">
						<text>{{ item.create_time | formatTime }}</text>
					</view>
				</view>
		
				<text class="flovertext numbertext">{{ item.buy_num }}份</text>
			</view>
			<view class="remarktext">
				{{item.mark}}
			</view>
		</view>
		</view>
		<Selectitem :list="selist" :isShow="isShow" @select="selectHandler" @close="isShow = false"></Selectitem>
		<u-popup v-model="remrkShow" closeable border-radius="20" mode="center" width="622" height="650">
			<view class="remarkcontent">
				<view class="title">添加备注</view>
				<textarea class="textarea" v-model="remarkText" placeholder-style="font-size:24rpx"   />
				<view class="rcontent">
					<view class="label">
						常用备注：
					</view>
					<view class="itemwrap">
						<view class="item" v-for="(item,index) in itemlist" :key="index" @click.stop="itemHandler(item)">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="rbtn" @click="submitHandler">
					我知道了
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	import Selectitem from '../../components/selectitem/selectitem.vue'
	export default{
		components:{
			navigationCustom,
			Selectitem
		},
		data(){
			return{
				config: {
					title: '查看团购报名列表', //title
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
				scrollMaxHeight: 200 ,//滑动的高度限制，超过这个高度即背景全部显示
				groupbuy_id:0,
				page:1,
				page_size:10,
				joinList:[],
				total:0,
				selist:[
					{
						id:1,
						name:'添加备注'
					},
					{
						id:2,
						name:'拔打电话'
					},
					{
						id:3,
						name:'复制微信'
					}
				],
				isShow:false,
				targetObj:{},
				remrkShow:false,
				remarkText:'',
				itemlist:[
					{
						id:1,
						name:'已付款'
					},
					{
						id:2,
						name:'已取货'
					},
					{
						id:3,
						name:'已退货'
					},
					{
						id:4,
						name:'待取货'
					},
					{
						id:5,
						name:'已退款'
					}
				]
			}
		},
		onLoad(options) {
			this.groupbuy_id = options.id
			this.getList()
		},
		methods:{
			submitHandler(){
				var data = {
					id:this.targetObj.id,
					mark:this.remarkText
				}
				if(!data.mark){
					return this.$u.toast('请输入备注')
				}
				this.Api.addJoinMark(data).then((result)=>{
					if(result.code == 1){
						this.page = 1
						this.$u.toast('添加成功')
						this.remrkShow = false
						this.getList()
					}else{
						this.$u.toast('添加失败')
					}
				})
			},
			itemHandler(item){
				this.remarkText = item.name
			},
			async getList(ismore){
				var data = {
					groupbuy_id:this.groupbuy_id,
					page:this.page,
					page_size:this.page_size
				}
				var result = await this.Api.groupbuyJoinList(data)
				if(result.code == 1){
					this.total = result.data.total_page
					if(ismore){
						this.joinList = this.joinList.concat(result.data.list)
					}else{
						this.joinList = result.data.list
					}
				}
			},
			HandlerItem(item){
				this.targetObj = item
				this.isShow = true
			},
			selectHandler(e){
				if(e.id == 1){
					this.remrkShow = true
				}else if(e.id == 2){
					uni.makePhoneCall({
						phoneNumber:this.targetObj.mobile
					})
				}else if(e.id == 3){
					uni.setClipboardData({
						data:this.targetObj.weixin
					})
				}
				this.isShow = false
			}
		},
		onReachBottom() {
			if (this.total > 1) {
				if (this.total > this.page) {
					this.page++;
					this.getList(true);
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.setvote{
		display: flex;
		flex-direction: column;
		width:100%;
		min-height: 100vh;
		background: white;
		.content{
			padding:24upx 48upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.headerItem {
				display: flex;
				flex-direction: column;
				padding-bottom: 34upx;
				padding-top: 34upx;
				border-bottom: 2upx solid #dedede;
				.userheader {
					display: flex;
					flex-direction: row;
					align-items: center;
					// margin-bottom: 24upx;
					.useravatar {
						width: 80upx;
						height: 80upx;
						border-radius: 50%;
						margin-right: 16upx;
					}
					.userlist {
						display: flex;
						flex-direction: column;
						flex: 1;
						.usertop {
							display: flex;
							flex-direction: row;
							.username {
								font-size: 26upx;
								font-family: PingFang-SC-Bold, PingFang-SC;
								font-weight: bold;
								color: rgba(51, 51, 51, 1);
								line-height: 36upx;
								margin-right: 24upx;
							}
							.like {
								width: 82upx;
								height: 32upx;
								background: #08C299;
								border-radius: 8upx;
								margin-right: 16upx;
								display: flex;
								flex-direction: row;
								align-items: center;
								justify-content: center;
								.likeimg {
									width: 30upx;
									height: 26upx;
									margin-right: 8upx;
								}
								.liketext {
									font-size: 20upx;
									font-family: PingFang-SC-Medium, PingFang-SC;
									font-weight: 500;
									color: white;
									line-height: 28upx;
								}
							}
							.chuang {
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
						.userbottom {
							height: 32upx;
							font-size: 22upx;
							font-family: PingFang-SC-Medium, PingFang-SC;
							font-weight: 500;
							color: rgba(153, 153, 153, 1);
							line-height: 32upx;
							text-align: left;
							text {
								margin-right: 16upx;
							}
						}
					}
					.numbertext{
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #020433;
					}
			
					.flovertext {
						height: 40upx;
						font-size: 28upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(51, 51, 51, 1);
						line-height: 40upx;
						margin-right: auto;
					}
				}
				.remarktext{
					margin-top:10rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FF9C00;
					padding-left:96rpx;
				}
			}
			
		}
		.textarea{
			background: #F7F9FF;
			border-radius: 10rpx;
			padding:15rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			height:120rpx;
		}
		.remarkcontent{
			padding:62rpx 24rpx;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			.title{
				width:100%;
				text-align: center;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #020433;
				line-height: 48rpx;
				margin-bottom: 30rpx;
			}

			.rcontent{
				display: flex;
				flex-direction: row;
				margin-top:30rpx;
				.label{
					width:380rpx;
					font-size: 35rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #95A0B6;
				}
				.itemwrap{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-content: flex-start;
					.item{
						width: 167rpx;
						margin-bottom: 20rpx;
						margin-right:20rpx;
						height: 48rpx;
						line-height: 48rpx;
						text-align: center;
						background: #EEF2FA;
						border-radius: 10rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #95A0B6;
					}
				}
			}
			.rbtn{
				width: 100%;
				height: 99rpx;
				line-height: 99rpx;
				text-align: center;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
				border-radius: 10rpx;
				text-align: center;
				font-size: 38rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;

			}
		}
	}
</style>
