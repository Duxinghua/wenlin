<template>
	<!-- 收藏 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="searchheader" :style="{top:(CustomBar)+'px'}">
				<view class="search">
					<view class="searchwrap">
					<image src="../../static/search.png" class="searchico" mode=""></image>
					<input class="searchinput" placeholder-class="collectsearch" placeholder="搜索我的收藏"  v-model="title"/>
					</view>
					<text @click="goSearch">搜索</text>
				</view>
<!-- 				<view class="catelist">
					<view :class="['cateitem',cateIndex === item.id ? 'active':'']" v-for="(item,index) in catelist" :key="index" @click="navClick(item)">
							{{item.tag}}
					</view>
				</view> -->
				<scroll-view   scroll-x class="bg-white nav tagwrap" scroll-with-animation :scroll-left="scrollLeft">
					<!-- 分类 -->
					<view  class="cu-item nav-item" :class="['tagitem', cateIndex == item.id ? 'active' : '']" v-for="(item, index) in catelist" :key="index" @click="navClick(item)" @tap="tabSelect" :data-id="index">{{ item.tag }}</view>
				</scroll-view>
			</view>
			<view class="searchlist">
				<view class="searchitem" v-for="(item,index) in list" :key="index" :index="index">
					<view class="titlewrap" @click="goDetail(item)">
						<view class="t1">
							<text>#{{item.object_type | filterType}}</text>
							<text class="tc">{{item.title ? item.title: item.description}}</text>
						</view>
						<text class="t2">{{item.create_time | formatTime}}</text>
					</view>
					<view class="btnitem" @click="unsetCancel(item)">
						取消收藏
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
					title: '我的收藏', //title
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
				catelist:[
				{
					id:0,
					tag:'全部'
				}],
				type:0,
				page:1,
				page_size:10,
				list:[],
				total_page:0,
				cateIndex:0,
				title:'',
				listResult:false,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				scrollLeft: 0,
				TabCur: 0
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.catelist = this.catelist.concat(this.Tool.navList)
			this.getmyFavoriteList()
		},
		methods:{
			tabSelect(e) {
					this.TabCur = e.currentTarget.dataset.id;
					this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			goDetail(pitem){
				var type = pitem.object_type//2为居委会 3小区
				if(type == 5){
					uni.navigateTo({
						url:'/pages/index/cdetail?dynamics_id='+pitem.object_id+'&type='+pitem.object_type+'&id='+pitem.third_id
					})
				}else{
					if( type == 7 || type == 8){
						uni.navigateTo({
								url:'/pages/index/detail?dynamics_id='+pitem.object_id+'&type='+pitem.object_type+'&id='+pitem.object_id
						})
						
					}else if(type == 16){
						uni.navigateTo({
							url: '/pages/update/ysdetail?dynamics_id=' + pitem.id + '&type=' + pitem.type + '&id=' + pitem.object_id
						});
					}else if(type == 17){
						uni.navigateTo({
							url: '/pages/update/ptdetail?dynamics_id=' + pitem.id + '&type=' + pitem.type + '&id=' + pitem.object_id
						});
					}else{
						uni.navigateTo({
							url:'/pages/index/detail?id='+pitem.object_id+'&type='+pitem.object_type
						})
					}
				}
			},
			goSearch(){
				if(!this.title){
					uni.showToast({
						icon:'none',
						title:'请输入关键字',
						duration:2000
					})
					return
				}
				this.getmyFavoriteList()
			},
			unsetCancel(e){
				var data = {
					community_id: uni.getStorageSync('community_id'),
					dynamics_id: e.object_id,
					object_type:e.object_type,
					title:this.title
				}
				if(e.type == 5 || e.type == 7){
					data.dynamics_id = e.object_id
				}
				this.Api.unsetFavorites(data).then((result)=>{
					if(result.code == 1){
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					
						this.getmyFavoriteList()
					}else{
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				})
			},
			customConduct(e){
				console.log(e)
			},
			navClick(obj){
				this.cateIndex = obj.id
				this.type = obj.id
				this.page = 1
				this.page_size = 10
				this.getmyFavoriteList()
			},
			getmyFavoriteList(ismore){
				var data = {
					page:this.page,
					page_size:this.page_size,
					community_id:uni.getStorageSync('community_id'),
					type:this.type,
					title:this.title
				}
				this.Api.myFavoriteList(data).then((result) => {
					if(result.code == 1){
						if(ismore){
							this.list = this.list.concat(result.data.list)
							this.total_page = result.data.total_page
						}else{
							this.list = result.data.list
							this.total_page = result.data.total_page
						}
						if(this.list.length == 0){
							this.listResult = true
						}else{
							this.listResult = false
						}
					}
				})
			}
		},
		onReachBottom() {
			if(this.page < this.total_page){
				this.page ++
				this.getmyFavoriteList(true)
			}
		},
		components: {
			navigationCustom,
			Nodata
		}
	};
</script>

<style lang="scss" scoped>
	.integral{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			padding:0upx 24upx 0 24upx;
			box-sizing: border-box;
			.searchheader{
				width:100%;
				display: flex;
				flex-direction: column;
				position: fixed;
				padding:0upx 24upx;
				box-sizing: border-box;
				left:0;
				top:0;
				background: white;
				.search{
					width:100%;
					height:80upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					position: relative;
					.searchwrap{
						width:90%;
						border-radius:40upx;
						height:80upx;
						line-height: 80upx;
						background:rgba(222,222,222,0.3);
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						.searchico{
							position: absolute;
							top:50%;
							transform: translateY(-50%);
							left:24upx;
							width:50upx;
							height:50upx;
							margin-right:8upx;
						}
						.searchinput{
							width:calc(100% - 78upx);
							text-align: left;
							height:80upx;
							line-height: 80upx;
							padding-left:78upx;
						}
						.collectsearch{
							height:36upx;
							font-size:26upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:36upx;
						}
					}
				}
				.tagwrap {
					display: flex;
					flex-direction: row;
					align-items: center;
					width: 100%;
					padding: 19upx 30upx;
					box-sizing: border-box;
					.tagitem {
						font-size: 26upx;
						font-weight: 500;
						color: #020433;
						min-width: 117upx;
						// padding-left: 20upx;
						// padding-right: 20upx;
						height: 42upx;
						line-height: 42upx;
						margin-right: 30upx;
						text-align: center;
						background: #eef2fa;
						border-radius: 10upx;
					}
					.active {
						background: #FF9C00;
						color: white;
					}
				}
				// .catelist{
				// 	display: flex;
				// 	flex-direction: row;
				// 	flex-wrap: wrap;
					// .cateitem{
					// 	min-width:120upx;
					// 	text-align: center;
					// 	padding-left:20upx;
					// 	padding-right:20upx;
					// 	height:48upx;
					// 	line-height: 48upx;
					// 	font-size:28upx;
					// 	color:#333;
					// 	font-weight: 500;
					// 	background:rgba(222,222,222,0.3);
					// 	border-radius:21upx;
					// 	margin-right:75upx;
					// 	margin-top:40upx;
					// 	display: flex;
					// 	align-items: center;
					// 	justify-content: center;
					// }
					// .active{
					// 	color:#FF9C00;
					// 	background: rgba(255,156,0,0.1);;
					// }
					// .cateitem:nth-child(4n){
					// 	margin-right:0upx;
					// }
				// 	.tagitem {
						
				// 		font-size: 26upx;
				// 		font-weight: 500;
				// 		color: #020433;
				// 		width:117upx;
				// 		// padding-left: 20upx;
				// 		// padding-right: 20upx;
				// 		height: 42upx;
				// 		line-height: 42upx;
				// 		margin-right: 30upx;
				// 		text-align: center;
				// 		background: #EEF2FA;
				// 		border-radius: 10upx;
				// 	}
				// 	.active {
				// 		background: rgba(255, 156, 0, 0.1);
				// 		color: #ff9c00;
				// 	}
				// }
			}

			.searchlist{
				display: flex;
				flex-direction: column;
				margin-top:120upx;
				/deep/ .nodata{
					margin-top:800upx;
				}
				.searchitem:first-child{
					margin-top:20upx;
				}
				.searchitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					height:146upx;
					border-bottom: 1px solid #DEDEDE;
					.titlewrap{
						flex:1;
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: flex-start;
						.t1{
							display: flex;
							flex-direction: row;
							font-size:28upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(255,156,0,1);
							text:last-child{
								color:#333;
								margin-left:15upx;
								width:400upx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
						.t2{
							height:34upx;
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:34upx;
						}
					}
					.btnitem{
						text-align: center;
						width:140upx;
						height:56upx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
						border-radius:8px;
						border:1px solid rgba(216,216,216,1);
					}
				}
			}
		}
	}
</style>
