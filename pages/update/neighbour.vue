<template>
	<!-- 我的领居 -->
	<view :class="['neighbour',scrollFiexd ? 'neighbourfix' : '']">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="header">
				<text>共{{total}}名邻居（{{community_name}}小区）</text>
				<view class="rightneig" @click="onActivelink">
					<image src="../../static/invited.png" class="joinimg"></image>
					<text class="jointext">邀请邻居</text>
				</view>
			</view>
			<view class="navwrap">
				<view :class="['navitem',navIndex === 1 ? 'acitve' : '']" @click="navClick(1)">
					热心榜
				</view>
				<view :class="['navitem',navIndex === 2 ? 'acitve' : '']" @click="navClick(2)">
					名人榜
				</view>
				<view :class="['navitem',navIndex === 3 ? 'acitve' : '']" @click="navClick(3)"  v-if="false">
					达人榜
				</view>
			</view>
			<view class="list">
				<view class="listitem listitemself" v-if="false">
					<view class="avatar">
						<image v-if="item.daren == 1" src="../../static/da.png" class="da"></image>
						<image :src="item.avatar" class="headerav"></image>
					</view>
					<view class="userinfo">
						<view class="name">我是用户自己</view>
						<view class="des">
							暂无达人标签，等待报名
						</view>
					</view>
					<view class="apply">
						立即报名
					</view>
				</view>
				<view class="listitem listitemother" v-for="(item,index) in list" :key="index" :index="index" v-if="false">
					<view class="number">
						NO.{{index}}
					</view>
					<view class="avatar">
						<image v-if="item.daren == 1" src="../../static/da.png" class="da"></image>
						<image :src="item.avatar" class="headerav"></image>
					</view>
					<view class="userinfo">
						<view class="name">{{item.user_nickname}}</view>
						<view class="dalist" v-for="(sitem,sindex) in item.skill_desc_list" :key="sindex" :index="sindex">
							<view class="daitem">{{sitem}}</view>
						</view>
					</view>
					<view class="scoreinfo">
						<image src="../../static/push-a.png" class="ico"></image>
						<view class="icotext">111</view>
					</view>
				</view>
				<view class="listitem" v-if="navIndex == 2 " v-for="(item,index) in list" :key="index" :index="index" @click="getPro(item)">
					<view class="avatar">
						<image v-if="item.daren == 1" src="../../static/da.png" class="da"></image>
						<image :src="item.avatar" class="headerav"></image>
					</view>
					<view class="info">
						<text class="t1">{{item.user_nickname}}·{{item.building}}#</text>
						<text class="t2">{{item.sex == 1 ? '男' : (item.sex == 2 ? '女' : '保密')}}</text>
					</view>
					<view class="other">
						<text class="t3">
							{{item.know_user_total}}
						</text>
						<text class="t4" v-if="index == 0">
							人认识TA
						</text>
					</view>
				</view>
				
				<view class="listitem" v-if="navIndex == 1 " v-for="(item,index) in  list" :index="index" :key="index"  @click="getPro(item)">
					<view class="avatar">
						<image v-if="item.daren == 1" src="../../static/da.png" class="da"></image>
						<image :src="item.avatar" class="headerav"></image>
					</view>
					<view class="info">
						<text class="t1">{{item.user_nickname}}·{{item.building}}#</text>
						<text class="t2">{{item.sex == 1 ? '男' : (item.sex == 2 ? '女' : '保密')}}</text>
					</view>
					<view class="other">
						<text class="t3">
							{{item.love_value}}
						</text>
						<text class="t4" v-if="index == 0">
							热心值
						</text>
					</view>
				</view>

			</view>
		</view>
		<!-- 分享 -->
<!-- 		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
 -->	<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />	
		<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
		</view>
		<!-- 分享功能 -->
		<Onshare  :isShow="onShareShow" :isHome="false" @close="onShowclose" @onsend="onsend" @ontodo="onShowtodo" @onshare="onShowshare" />
		<Firend ref="Firend" />
	</view>
</template>

<script>
	import Onshare from '@/components/onshare/onshare.vue';
	import Firend from '../../components/onfirend/onfirend.vue';
	import hchPoster from '../../wxcomponent/hch-poster/hch-poster.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '我的邻居', //title
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
				community_name:'',
				list:[],
				total:0,
				total_page:0,
				deliveryFlag: false,
				canvasFlag: true,
				posterData:{
					marginLR: 30,
					marginTB: 80,
					radius: 0.03,
					innerLR: 20,
					innerTB: 20,
					posterRatio: 1.3,
					posterImgUrl: "",
					title: "",
					titleFontSize: 15,
					desFontSize: 14,
					desLineHeight: 22,
					titleLineHeight: 24,
					posterCodeUrl: "https://sq.wenlinapp.com/upload/share/20200821/20200821233746683.png",
					codeWidth: 0.3,
					codeRatio: 1,
					codeRadius: 0.5,
					codeMT: 15,
					codeName: "问邻",
					codeNameMT: 15,
					tips: "长按/扫描识别加入小区",
					posterBgUrl:'',
					avatarUrl: uni.getStorageSync('user').avatar,
					des:''
				},
				simpleFlag:false,
				scrollFiexd:false,
				onShareShow:false
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.community_name = uni.getStorageSync('community_name')
			this.myNeighbour()
		},
		onShareAppMessage:function(){
			return {
				 title: uni.getStorageSync('user').user_nickname+'邀请你加入'+ this.community_name + '小区邻里互助平台',
				 imageUrl:  'https://sq.wenlinapp.com/appimg/send54.png',
				 path: '/pages/index/communitycard?community_id='+uni.getStorageSync('community_id')+'&pid='+uni.getStorageSync('user').id
			}
		},
		methods:{
			//转发朋友圈
			onsend(){
				this.onShareShow = false
				this.$refs.Firend.onshow()
			},
			onShowclose(){
				this.onShareShow = false
			},
			onActivelink(){
				this.onShareShow = true
			},
			onShowshare(){
				this.onShareShow = false
			},
			onShowtodo(){
				this.scrollFiexd = true
				var pages = getCurrentPages() //获取加载的页面
				
				var currentPage = pages[pages.length-1] //获取当前页面的对象
				console.log(currentPage.route)
				// return
				var community_id = uni.getStorageSync('community_id')
				var user_id = uni.getStorageSync('user_id')
				var data = {
					scene:'community_id='+community_id+'&pid='+user_id,
					page:'pages/index/communitycard'
				}
				this.Api.getWXACodeUnlimit(data).then((result) => {
					if(result.code == 1){
						this.$nextTick(() => {							
								this.onShareShow = false
								this.posterData.posterImgUrl =  'https://sq.wenlinapp.com/appimg/share500400.jpg'
						
								this.posterData.title =  uni.getStorageSync('user').user_nickname+'邀请你加入'+ this.community_name + '小区邻里互助平台'

								this.posterData.avatarUrl = uni.getStorageSync('user').avatar
								this.posterData.posterCodeUrl = result.data
								this.posterData.des =  ''
								this.$forceUpdate()
								setTimeout(()=>{
									this.canvasFlag=false;//显示canvas海报
									this.deliveryFlag = false;//关闭分享弹窗
									this.$refs.hchPoster.posterShow()
								},500)	
						
						})
						
					}else{
						this.scrollFiexd = false
					}
				})
				
				
			},
			canvasCancel(val){
				this.scrollFiexd = false
				this.canvasFlag=val;
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
				this.myNeighbour(index)
			},
			getPro(obj){
				uni.navigateTo({
					url:'/pages/index/personalcard?user_id='+obj.user_id+'&community_id='+obj.community_id
				})
			},
			myNeighbour(ismore){
				var data = {
					page:this.page,
					page_size:this.page_size,
					community_id:uni.getStorageSync('community_id'),
					type:this.navIndex
				}
				if(this.navIndex == 1 || this.navIndex == 2){
					this.Api.myNeighbour(data).then((result) => {
						if(result.code == 1){
							if(ismore){
								this.total_page = result.data.total_page
								this.list = this.list.concat(result.data.list)
								this.total = result.data.total
								
							}else{
								this.total_page = result.data.total_page
								this.list = result.data.list
								this.total = result.data.total
							}
						}
					})
				}else if(this.navIndex == 3){
					this.Api.myNeighbourDare(data).then((result)=>{
						if(result.code == 1){
							result.data.list.map((item)=>{
								item.user = {
									avatar:item.avatar,
									user_nickname:item.user_nickname
								}
								item.skill_desc_list = item.skill_desc.split(",")
								item.type = 6
							})
							if(ismore){
								this.total_page = result.data.total_page
								this.list = this.list.concat(result.data.list)
								this.total = result.data.total
								
							}else{
								this.total_page = result.data.total_page
								this.list = result.data.list
								this.total = result.data.total
							}
						}
						
					})
				}
			}
		},
		onReachBottom() {
			if(this.total_page > this.page){
				this.page++
				this.myNeighbour(true)
			}
		},
		components: {
			navigationCustom,
			hchPoster,
			Firend,
			Onshare
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
				color:#404B69;
				line-height:60upx;
				text-align: left;
				.rightneig{
					margin-left:auto;
					display: flex;
					flex-direction: row;
					align-items: center;
					.joinimg{
						width:45upx;
						height:45upx;
						margin-right:10upx;
					}
					.jointext{
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:bold;
						color:#404B69;
						line-height:34upx;
					}
				}
			}
			.navwrap{
				display: flex;
				flex-direction: row;
				justify-content: center;
				border-bottom: 2upx solid #EEF2FA;
				margin-bottom: 40upx;
				.navitem{
					padding:30upx 60upx;
					box-sizing: border-box;
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:#020433;
					display: flex;
				}
				.acitve{
					color:#FF9C00;
					position: relative;
				}
				.acitve::before{
					position: absolute;
					content:'';
					left:50%;
					transform: translateX(-50%);
					bottom: 0upx;
					width: 44upx;
					height: 7upx;
					background: #FF9C00;
					border-radius: 4upx;

				}

			}
			.list{
				display: flex;
				flex-direction: column;
				.listitemself{
					display: flex;
					flex-direction: row;
					align-items: center;
					padding-left:120upx;
					.userinfo{
						display: flex;
						flex-direction: column;
						.name{
							font-size: 30upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #FF9C00;
						}
						.des{
							font-size: 22upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #404B69;
						}
					}
					.apply{
						width: 170upx;
						height: 61upx;
						background: linear-gradient(44deg, #FEAA0E, #FFC000);
						border-radius: 10upx;
						line-height: 61upx;
						text-align: center;
						font-size: 26upx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
						margin-left:auto;
					}
				}
				.listitemother{
					.number{
						width: 120upx;
						font-size: 18upx;
						font-family: PingFang SC;
						font-weight: 800;
						color: #020433;
					}
					.userinfo{
						display: flex;
						flex-direction: column;
						width: 350upx;
						overflow: hidden;
						.name{
							font-size: 30upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #020433;
						}
						.dalist {
							display: flex;
							flex-direction: row;
							align-content: flex-start;
							flex-wrap: nowrap;
							// flex-wrap: wrap;
							margin-top: 15upx;
							// margin-bottom: 20upx;
							.daitem {
								width: fit-content;
								height: 42upx;
								line-height: 42upx;
								background: #95A0B6;
								color: white;
								border-radius: 21upx;
								padding-left: 20upx;
								padding-right: 20upx;
								margin-right: 20upx;
								// margin-bottom: 20upx;
							}
						}
					}
					.scoreinfo{
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-left: auto;
						.ico{
							width: 38upx;
							height:38upx;
						}
						.icotext{
							font-size: 30upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #FF9C00;
						}
					}
				}
				.listitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					height:136upx;
					border-bottom: 1px solid #DEDEDE;
					.avatar{
						width:74upx;
						height:74upx;
						margin-right:14upx;
						position: relative;
						z-index: 4;
						.headerav{
							position: absolute;
							left:0;
							top:0;
							width:100%;
							height:100%;
							border-radius: 50%;
							overflow: hidden;
							z-index: 5;
						}
						.da{
							position: absolute;
							right:0;
							bottom: 0;
							width:40upx;
							height:40upx;
							z-index:6
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
							width:500upx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.t2{
							// height:32upx;
							font-size:22upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:#999999;
							line-height:40upx;
						}
					}
					.other{
						display: flex;
						margin-left:auto;
						flex-direction: column;
						align-items: flex-end;
						.t3{
							height:50upx;
							font-size:36upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(255,156,0,1);
							line-height:50upx;
						}
						.t4{
							font-size:24upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:500;
							color:#999999;
						}
					}
				}
			}
		}
		
	}
	.neighbourfix{
		overflow: hidden;
		height: 100vh;
	}
</style>
