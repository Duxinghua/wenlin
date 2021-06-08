<template>
	<!-- 发贴 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="searchtab" :style="[{top:CustomBar + 'px'}]">
				<view class="search">
					<view class="searchwrap">
					<image src="../../static/search.png" class="searchico" mode=""></image>
					<input class="searchinput" placeholder-class="collectsearch" placeholder="搜索我的贴子"  v-model="title"/>
					</view>
					<text @click="goSearch">搜索</text>
				</view>
<!-- 				<view class="catelist">
					<view :class="['cateitem',cateIndex === item.id ? 'active':'']" v-for="(item,index) in catelist" :key="index" @click="navClick(item)">
							{{item.tag}}
					</view>
				</view> -->
				<scroll-view  v-if="false"  scroll-x class="bg-white nav tagwrap" scroll-with-animation :scroll-left="scrollLeft">
					<!-- 分类 -->
					<view  class="cu-item nav-item" :class="['tagitem', cateIndex == item.id ? 'active' : '']" v-for="(item, index) in catelist" :key="index" @click="navClick(item)" @tap="tabSelect" :data-id="index">{{ item.tag }}</view>
				</scroll-view>
				
			</view>
			<view class="searchlist">
				<view class="searchitem"  v-for="(item,index) in list" :key="index" :index="index">
					<view class="left" @click="goDetail(item)">
						<view class="t1">
							<text class="s1">#{{item.type | filterType}}</text>
							<text class="s2">{{ item.title ? item.title : item.content }}</text>
						</view>
					</view>
					<view class="imgwrap" @click="goDetail(item)" v-if="item.images.length">
						<text class="numtext" v-if="item.images.length > 3">{{item.images.length}}</text>
						<image class="img1" :src="subitem" :data="item" :item="subitem" v-for="(subitem,index) in item.images" :index="index" :key="index" mode="aspectFill"></image>
					</view>
					<view class="right">
						<text class="t2">{{item.create_time | formatTime}}</text>
						<text class="r1" @click="refreshMyDynamicsHandler(item)">
							刷新
						</text>
						<text class="r2" @click="deleteDynamics(item)">
							删除
						</text>
					</view>
				</view>
				<Nodata v-if="resultfalse" />
			</view>
		</view>
		<!-- 提示登陆  -->
		<view class="popup" v-if="guestShow" >
			<view class="mb" @click="guestShow = !guestShow"></view>
			<view class="tipslogin">
				<view class="logintop">刷新一次扣掉{{refresh_dynamics_score}}个积分</view>
				<view class="loginbottom">
					<text class="textitem" @click="guestShow = !guestShow">取消</text>
					<text @click="refreshMyDynamics" class="textitem textitem-fix">
					确认
					</text>
				
				</view>
			</view>
		</view>
		<!-- 积分提示 -->
		<Integraltip ref="integraltip" :types.sync="add_type" :score.sync="score_text"  />
		<Confrimpop ref='confrims' @del="condelHandler"/>
	</view>
</template>

<script>
	import Confrimpop from '@/components/confrim/confrim.vue';
	import Integraltip from '@/components/integraltip/integraltip.vue';
	import Nodata from '@/components/nodata/nodata.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '我的发贴', //title
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
				}
				],
				cateIndex:0,
				list:[],
				page:1,
				page_size:10,
				total_page:0,
				scrollLeft:0,
				TabCur:0,
				CustomBar: this.CustomBar,
				type:0,
				resultfalse:false,
				title:'',
				add_type:'',
				score_text:'',
				guestShow:false,
				guestObj:{},
				refresh_dynamics_score:0
			
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted(){
			this.catelist = this.catelist.concat(this.Tool.navList)
			this.getMyDynamicsList()
		},
		computed:{
			headerHeight(){
				return 160
			}
		},
		methods:{
			tabSelect(e) {
					this.TabCur = e.currentTarget.dataset.id;
					this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
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
				this.getMyDynamicsList()
			},
			navClick(obj){
				this.cateIndex = obj.id
				this.type = obj.id
				this.page = 1
				this.page_size = 10
				this.list = []
				this.getMyDynamicsList()
			},
			goDetail(obj){
				var pitem = obj
				var type = pitem.type
				if (type == 5) {
					uni.navigateTo({
						url: '/pages/index/cdetail?dynamics_id=' + pitem.object_id + '&type=' + pitem.type + '&id=' + pitem.object_id
					});
				} else {
				
					if (type == 7 || type == 8) {
						if(type == 8){
							uni.navigateTo({
								url: '/pages/index/detail?dynamics_id=' + pitem.object_id + '&type=' +pitem.type + '&id=' + pitem.object_id
							});
						}else{
							uni.navigateTo({
								url: '/pages/index/detail?dynamics_id=' + pitem.wiki_id + '&type=' + type + '&id=' +pitem.wiki_id
							});
						}
					} else if(type == 16){
						uni.navigateTo({
							url: '/pages/update/ysdetail?dynamics_id=' + pitem.object_id + '&type=' + pitem.type + '&id=' + pitem.object_id
						});
					}else if(type == 17){
						uni.navigateTo({
							url: '/pages/update/ptdetail?dynamics_id=' + pitem.object_id + '&type=' + pitem.type + '&id=' + pitem.object_id
						});
					}else{
						uni.navigateTo({
							url: '/pages/index/detail?id=' + pitem.object_id + '&type=' + pitem.type
						});
					}
				}
			},
			deleteDynamics(obj){
				console.log(obj)
				this.$refs.confrims.guestShow = true
				this.$refs.confrims.id = obj.id
				this.$refs.confrims.id = obj.type
				this.$refs.confrims.obj = obj
				this.$refs.confrims.text = '是否删除本贴?'
			},
			condelHandler(obj){
				var pitem = obj
				var object_id = ''
				var type = pitem.type
				var object_type = pitem.type
				if (type == 5) {
					object_id = pitem.object_id	
				} else {
				
					if (type == 7 || type == 8) {
						if(type == 8){
							object_id = pitem.object_id	
						}else{
							object_id = pitem.wiki_id
						}
					} else if(type == 16){
						object_id = pitem.object_id	
					}else if(type == 17){
						object_id = pitem.object_id	
					}else{
						object_id = pitem.object_id	
					}
				}
				this.Api.deleteDynamics({object_type:object_type,object_id:object_id,community_id:uni.getStorageSync('community_id')}).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							duration:2000,
							success: () => {
								this.$refs.confrims.guestShow = false
								this.getMyDynamicsList()
							}
						})
					}
				})
			},
			refreshMyDynamicsHandler(item){
				this.guestObj = item
				this.Api.getScoreSetting({}).then((result)=>{
					if(result.code == 1){
						this.refresh_dynamics_score = result.data.refresh_dynamics
						this.guestShow = true
					}else{
						uni.showToast({
							icon:'none',
							title: result.msg,
							duration:2000
						})
					}
				})
				
			},
			refreshMyDynamics(obj){
				var data = {
					dynamics_id:this.guestObj.id,
					type:this.guestObj.type
				}
				this.Api.refreshMyDynamics(data).then((result) => {
					if(result.code == 1){
						this.guestShow = false
						if(result.data.add){
							this.add_type = result.data.add == -1 ? '-' : '+'
							this.score_text = result.data.score
							this.$refs.integraltip.show()
							setTimeout(()=>{
								this.add_type = ''
								this.score_text = ''
								
								this.$refs.integraltip.close()
								uni.showToast({
									icon:'success',
									title:result.msg,
									duration:2000
								})
							},2000)
						}else{
							uni.showToast({
								icon:'success',
								title:result.msg,
								duration:2000
							})
						}
				
					}
				})
			},
			customConduct(e){
				console.log(e)
			},
			cateClick(obj){
				this.cateIndex = obj
				this.catelist.forEach((i,v) => {
					if(obj == v){
						this.type = i.id
					}
				})
				this.page = 0
				this.page_size = 10
				this.list = []
				this.total_page = 0
				this.getMyDynamicsList()
			},
			getMyDynamicsList(ismore){
				var data = {
					community_id:uni.getStorageSync('community_id'),
					type:this.type,
					page:this.page,
					title:this.title,
					page_size:this.page_size
				}
				this.Api.getMyDynamicsList(data).then((result) => {
					if(result.code == 1){
						if(ismore){
							var imgs = []
							var list = result.data.list
							list.map((item) => {
								item.images = item.images.slice(0,3)
								imgs.push(item)
							})
							this.list = this.list.concat(imgs)
							this.total_page = result.data.total_pages
						}else{
							var imgs = []
							var list = result.data.list
							list.map((item) => {
								item.images = item.images.slice(0,3)
								imgs.push(item)
							})
							this.list = imgs
							this.total_page = result.data.total_pages
						}
						if(this.list.length == 0){
							this.resultfalse = true
						}else{
							this.resultfalse = false
						}
					}
				})
			}
		},
		onReachBottom() {
			console.log(1,this.total_page,this.page)
			if(this.total_page > this.page){
				this.page++
				this.getMyDynamicsList(true)
			}
		},
		components: {
			navigationCustom,
			Nodata,
			Integraltip,
			Confrimpop
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
			padding:24upx 24upx 0 24upx;
			box-sizing: border-box;
			background: white;
			.searchtab{
				position: fixed;
				left:0;
				top:0;
				width: 100%;
				// height:180upx;
				background: white;
				opacity: 1;
				padding-left:24upx;
				padding-right:24upx;
				padding-top:24upx;
				box-sizing: border-box;
				z-index: 1000;
			}
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
					border-radius:30upx;
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
			// 	.cateitem{
			// 		width:120upx;
			// 		text-align: center;
			// 		// padding-left:20upx;
			// 		// padding-right:20upx;
			// 		height:48upx;
			// 		line-height: 48upx;
			// 		font-size:28upx;
			// 		color:#333;
			// 		font-weight: 500;
			// 		background:rgba(222,222,222,0.3);
			// 		border-radius:21upx;
			// 		margin-right:75upx;
			// 		margin-top:40upx;
			// 		display: flex;
			// 		align-items: center;
			// 		justify-content: center;
			// 	}
			// 	.active{
			// 		color:#FF9C00;
			// 		background: rgba(255,156,0,0.1);;
			// 	}
			// 	.cateitem:nth-child(4n){
			// 		margin-right:0upx;
			// 	}
			// }
			.searchwrap{
				width:100%;
				height:60upx;
				background:rgba(222,222,222,0.3);
				border-radius:30upx;
				display: flex;
				justify-content: center;
				align-items: center;
				.searchico{
					width:44upx;
					height:44upx;
					margin-right:15upx;
				}
				.searchtext{
					font-size:26upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(153,153,153,1);
				}
			}
			.tagwrap {
				display: flex;
				flex-direction: row;
				width: 100%;
				// height: 44upx;
				margin-top:24upx;
				margin-bottom: 24upx;
				box-sizing: border-box;
				.tagitem {
					font-size: 24upx;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					padding-left: 20upx;
					padding-right: 20upx;
					height: 42upx;
					line-height: 44upx;
					margin-right: 30upx;
					text-align: center;
					background: rgba(222, 222, 222, 0.3);
					border-radius: 21upx;
					width:fit-content;
				}
				.active {
					background: rgba(255, 156, 0, 0.1);
					color: #ff9c00;
				}
			}
			.searchlist{
				display: flex;
				flex-direction: column;
				margin-top:80upx;
				/deep/ .nodata{
					top:400upx;
				}
				.searchitem:first-child{
					margin-top:20upx;
				}
				.searchitem{
					border-bottom: 1upx solid #DEDEDE;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.left{
							position: relative;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: flex-start;
							padding-top:32upx;
							box-sizing: border-box;
							width:100%;
							margin-bottom:24upx;
							.t1{
								font-size:30upx;
								font-family:PingFang-SC-Medium,PingFang-SC;
								font-weight:bold;
								color:#333;
								line-height:42upx;
								position: relative;
								.s1{
									color:#FF9C00;
									margin-right:15upx;
									line-height: 42rpx;
									margin-right: 10rpx;
									position: absolute;
									left: 0;
									top: 0;

								}
								.s2{
									text-indent: 4em;
									font-size:28upx;
									font-family:PingFang-SC-Medium,PingFang-SC;
									font-weight:500;
									color:rgba(51,51,51,1);
									line-height:40upx;
									overflow : hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 2;
									 -webkit-box-orient: vertical;
								}
							}

							.c1{
								width:100%;
								font-size:28upx;
								font-family:PingFang-SC-Medium,PingFang-SC;
								font-weight:500;
								color:rgba(51,51,51,1);
								line-height:40upx;
								overflow : hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								 -webkit-box-orient: vertical;
							}
							.t2{
								height:32upx;
								font-size:22upx;
								font-family:PingFang-SC-Medium,PingFang-SC;
								font-weight:500;
								color:rgba(153,153,153,1);
								line-height:32upx;
							}
					}
					.right{
						display: flex;
						flex-direction: row;
						padding-bottom: 32upx;
						box-sizing: border-box;
						.r1{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(255,156,0,1);
							margin-right:120upx;
							margin-left:auto;
						}
						.r2{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
						}
					}
					.imgwrap{
						width:100%;
						height: 160upx;
						margin-bottom: 24upx;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						position: relative;
						.img1{
							width:228upx;
							height:160upx;
							border-radius: 8upx;
							overflow: hidden;
							margin-right:8upx;
						}
						.img1:nth-child(3n){
							margin-right: 0upx!important;
						}
						.numtext{
							position: absolute;
							right:24upx;
							bottom: 24upx;
							width:44upx;
							height:36upx;
							line-height: 36upx;
							text-align: center;
							background:rgba(0,0,0,0.3);
							border-radius:20upx;
							font-size:22upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(255,255,255,0.8);
						}
					}
				}
				.searchresult{
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top:20upx;
					margin-bottom: 20upx;
					.s1{
						margin-right:20upx;
						height:42upx;
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:42upx;
					}
					.s2{
						width:142upx;
						height:56upx;
						line-height: 56upx;
						text-align: center;
						background:rgba(255,156,0,1);
						border-radius:8px;
						font-size:28upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(255,255,255,1);
					}
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
			// 提示登陆
			.tipslogin {
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 450upx;
				// height: 224upx;
				background: rgba(255, 255, 255, 1);
				border-radius: 16upx;
				z-index: 3002;
				display: flex;
				flex-direction: column;
				.logintop {
					font-size: 32upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					line-height: 44upx;
					height: 180upx;
					line-height: 180upx;
					text-align: center;
					border-bottom: 2upx solid #dedede;
				}
				.loginbottom {
					height: 126upx;
					display: flex;
					flex-direction: row;
					.textitem {
						width: calc(50% - 1upx);
						display: flex;
						justify-content: center;
						font-size: 30upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						line-height: 126upx;
						border-right: 2upx solid #dedede;
					}
					.textitem-fix {
						border-right: 2upx solid #dedede;
						color: #ff9c00;
					}
				}
			}
		}
	}
</style>
