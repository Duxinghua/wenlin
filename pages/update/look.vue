<template>
	<!-- 我的领居 -->
	<view class="neighbour">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="navwrap">
				<view :class="['navitem',navIndex === 1 ? 'acitve' : '']" @click="navClick(1)">
					<text>认识我</text>
					<text>{{count.konw_my}}</text>
				</view>
				<view :class="['navitem',navIndex === 2 ? 'acitve' : '']" @click="navClick(2)">
					<text>我认识</text>
					<text>{{count.my_kown}}</text>
				</view>
			</view>
			<view class="list">
				<view class="listitem" v-if="navIndex == 1" v-for="(item,index) in list" :key="index" :index="index" @click.stop="goPer(1,item)">
					<view class="avatar">
						<image src="../../static/da.png" class="da" v-if="item.fromuser.daren == 1"></image>
						<image :src="item.fromuser.avatar" class="headerav"></image>
					</view>
					<view class="info">
						<text class="t1">{{item.fromuser.user_nickname}}·{{ item.fromcommunity.community_id == ucommunityid ? item.fromuser.building +'#' :  item.fromcommunity.title }}</text>
						<text class="t2">{{item.fromuser.sex == 1 ? '男' : (item.fromuser.sex ==  0 ? '保密' :'女')}}</text>
					</view>
					<view :class="['other',item.renshi == 1 ? 'otherfix' : '' ]" @click.stop="setKownHandler(1,item)">
						{{item.renshi == 1 ? '取消认识' : '认识TA'}}
					</view>
				</view>
				
				<view class="listitem" v-if="navIndex == 2" v-for="(item,index) in list" :key="index" :index="index" @click.stop="goPer(2,item)">
					<view class="avatar">
						<image :src="item.touser.avatar" class="headerav"></image>
					   <image src="../../static/da.png" class="da" v-if="item.touser.daren == 1"></image>
					</view>
					<view class="info">
						<text class="t1">{{item.touser.user_nickname}}·{{ item.tocommunity.community_id == ucommunityid ? item.touser.building +'#' :  item.tocommunity.title }}</text>
						<text class="t2">{{item.touser.sex == 1 ? '男' : item.touser.sex == 0 ? '保密' : '女'}}</text>
					</view>
					<view class="other otherfix"  @click.stop="setKownHandler(2,item)">
					 取消认识
					</view>
				</view>
				<Nodata v-if="listResult" />
			</view>
		</view>
	</view>
</template>

<script>
	import Nodata from '@/components/nodata/nodata.vue'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '认识我', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				navIndex:1,
				page:1,
				page_size:10,
				list:[],
				total_page:10,
				count:{
					konw_my:0,
					my_kown:0
				},
				listResult:false,
				ucommunityid:uni.getStorageSync('community_id')
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.getList()
			this.getCount()
		},
		// onShow() {
		// 	this.getCount()
		// },
		methods:{
			goPer(index,obj){
				if(index == 1){
					uni.navigateTo({
						url:'/pages/index/personalcard?user_id='+obj.from_user_id+'&community_id='+obj.from_community_id
					})
				}else if(index == 2){
					uni.navigateTo({
						url:'/pages/index/personalcard?user_id='+obj.to_user_id+'&community_id='+obj.to_community_id
					})
				}
			},
			setKownHandler(type,obj){
				console.log(obj,'obj')
				var data = {}
				if(type == 1){
					if(obj.renshi == 0){
						console.log(1)
						data = {
							from_community_id:obj.fromcommunity.community_id,
							to_user_id:obj.fromuser.id,
							to_community_id:obj.fromuser.community_id
						}
						this.Api.usersetKown(data).then((result) => {
							console.log(result)
							if(result.code == 1){
								uni.showToast({
									title:result.msg,
									icon:'success',
									success: () => {
										if(this.page < this.total_page){
											this.getList(true)
										}else{
											this.getList()
										}
									}
								})
							}else{
								uni.showToast({
									title:result.msg,
									icon:'none'
								})
							}
						})
					}else{
						console.log(2)
						data = {
							from_community_id:obj.fromuser.community_id,
							to_user_id:obj.fromuser.id,
							to_community_id:obj.fromuser.community_id
						}
						this.Api.userunSetKown(data).then((result) => {
								console.log(result)
								if(result.code == 1){
									uni.showToast({
										title:result.msg,
										icon:'success',
										success: () => {
											if(this.page < this.total_page){
												this.getList(true)
											}else{
												this.getList()
											}
										}
									})
								}else{
									uni.showToast({
										title:result.msg,
										icon:'none'
									})
								}
							})
						
					}
				}else if(type == 2){
					data = {
						from_community_id:obj.tocommunity.community_id,
						to_user_id:obj.touser.id,
						to_community_id:obj.touser.community_id
					}
					this.Api.userunSetKown(data).then((result) => {
							console.log(result)
							if(result.code == 1){
								uni.showToast({
									title:result.msg,
									icon:'success',
									success: () => {
										if(this.page < this.total_page){
											this.getList(true)
										}else{
											this.getList()
										}
									}
								})
							}else{
								uni.showToast({
									title:result.msg,
									icon:'none'
								})
							}
						})
				}
			},
			getCount(){
				var data = {
					community_id:uni.getStorageSync('community_id')
				}
				this.Api.kownCount(data).then((result) => {
					if(result.code == 1){
						this.count = result.data
						this.$forceUpdate()
					}
				})
			},
			customConduct(e){
				console.log(e)
			},
			navClick(index){
				this.navIndex = index
				this.page = 1
				this.page_size = 10
				this.list = []
				this.total_page = 0
				this.getList()
			},
			getList(ismore){
				var data = {
					community_id:uni.getStorageSync('community_id'),
					page:this.page,
					page_size:this.page_size
				}
				if(this.navIndex == 1){
					this.Api.kownMyList(data).then((result) => {
						if(result.code == 1){
							if(ismore){
								this.list = this.list.concat(result.data.list)
								this.total_page = result.data.total_pages
							}else{
								this.list = result.data.list
								this.total_page = result.data.total_pages
							}
							if(this.list.length == 0){
								this.listResult = true
							}else{
								this.listResult = false
							}
						}
					})
				}else if(this.navIndex == 2){
					this.Api.myKownList(data).then((result) => {
						if(result.code == 1){
							if(ismore){
								this.list = this.list.concat(result.data.list)
								this.total_page = result.data.total_pages
							}else{
								this.list = result.data.list
								this.total_page = result.data.total_pages
							}
							if(this.list.length == 0){
								this.listResult = true
							}else{
								this.listResult = false
							}
						}
					})
				}
			}
		},
		onReachBottom() {
			if(this.page < this.total_page){
				this.page ++
				this.getList(true)
			}
		},
		components: {
			navigationCustom,
			Nodata
		}
	};
</script>

<style lang="scss" scoped>
	.neighbour{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			padding-left:24upx;
			padding-right:24upx;
			box-sizing: border-box;
			.header{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				height:60upx;
				font-size:28upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:60upx;
				text-align: left;
				.rightneig{
					margin-left:auto;
					display: flex;
					flex-direction: row;
					align-items: center;
					.joinimg{
						width:48upx;
						height:44upx;
					}
					.jointext{
						font-size:24upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(255,156,0,1);
						line-height:34upx;
					}
				}
			}
			.navwrap{
				display: flex;
				flex-direction: row;
				justify-content: center;
				.navitem{
					padding:30upx 60upx;
					box-sizing: border-box;
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(153,153,153,1);
					display: flex;
					flex-direction: column;
					align-items: center;
					text:last-child{
						height:40pux;
						font-size:28upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(153,153,153,1);
						line-height:40upx;
					}
				}
				.acitve{
					color:#FF9C00;
					text:last-child{
						color:#FF9C00;
					}
				}
			}
			.list{
				display: flex;
				flex-direction: column;
				/deep/ .nodata{
					margin-top:400upx;
				}
				.listitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					height:146upx;
					border-bottom: 1px solid #DEDEDE;
					.avatar{
						width:74upx;
						height:74upx;
						margin-right:14upx;
						position: relative;
						.headerav{
							position: absolute;
							left:0;
							top:0;
							width:100%;
							height:100%;
							border-radius: 50%;
							overflow: hidden;
						}
						.da{
							position: absolute;
							right:0;
							bottom: 0;
							width:40upx;
							height:40upx;
							z-index: 109;
						}
					}
					.info{
						display: flex;
						align-items: flex-start;
						flex-direction: column;
						.t1{
							height:36upx;
							font-size:30upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(51,51,51,1);
							line-height:36upx;
						}
						.t2{
							// height:32upx;
							font-size:22upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(102,102,102,1);
							line-height:40upx;
						}
					}

				}
				.other{
					margin-left:auto;
					width:140upx;
					height:56upx;
					line-height: 56upx;
					border-radius:8upx;
					//border:2upx solid rgba(216,216,216,1);
					background: #FF9C00;
					font-size:26upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:white;
					line-height:56upx;
					text-align: center;
				}
				.otherfix{
					width: 140rpx;
					border-radius: 8rpx;
					border: 2rpx solid #ff9c00;
					height: 56rpx;
					font-size: 26rpx;
					font-family: PingFang-SC-Bold,PingFang-SC;
					font-weight: bold;
					color: #ff9c00;
					background: white;
					line-height: 56rpx;
					text-align: center;
					margin-left: auto;

				}
				.othergray{
					margin-left:auto;
					width:140upx;
					height:56upx;
					line-height: 56upx;
					border-radius:8upx;
					border:2upx solid rgba(216,216,216,1);
					font-size:26upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(102,102,102,1);
					line-height:56upx;
					text-align: center;
				}
			}
		}
		
	}
</style>
