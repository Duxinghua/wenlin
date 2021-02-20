<template>
	<view class="newyear">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view class="header">
				<u-image :src="imgURl+'bg1.png'" width="100%" height="100%"></u-image>
				<view class="title">
					{{community_name}}
				</view>
				<view class="anbtn" @click.stop="pushShow">
					<u-image :src="imgURl + 'an.png'" class="an"  width="100%" height="100%"></u-image>
				</view>
			</view>
			<view class="body">
				<view class="list" :style="{'height': height+'px'}">
				<scroll-view scroll-y="true" :style="{'height': (height-20)+'px'}" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll" >
					<view class="listitem" v-for="(item,index) in yearList" :key="index">
						<view class="no">
							NO.{{item.number}}
						</view>
						<view class="ucc">
							<view class="userwrap" @click.stop="goPer(item)">
								<view class="avatar">
								<u-image :src="item.avatar" width="100%" height="100%" border-radius="50%"></u-image>
								</view>
								<view class="username">
									{{item.user_nickname}}·{{item.building}}#
								</view>
								<view class="title">
									给大家拜年了
								</view>
							</view>
							<view class="paicont">
							{{item.content}}
							</view>
							<view class="toolitem">
								<view class="time">
									{{item.create_time | formatTime}}
								</view>
								<button  open-type="share" class="share">
									<image :src="imgURl + 'shareico.png'"></image>
									<view class="text">分享</view>
								</button>
								<view class="like" @click="likeHandler(item)">
									<image :src="imgURl + 'likeico.png'"></image>
									<view class="text" v-if="item.user_like == 0">点赞</view>
									<view class="text" v-if="item.user_like == 1">{{item.like}}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				</view>
			</view>
		</view>
		<u-popup v-model="paisend" mode="center" width="622rpx" height="695rpx" border-radius="20">
			<view class="pushcontent">
				<image :src="imgURl+'paiclose.png'" class="paiclose" @click.stop="paisend = false"></image>	
				<textarea v-model="paiinput" type="textarea" placeholder-class="placeholderclass" class="textarea"  height="270"  placeholder="我们的社区，我们的家。新年有什么祝福邻居的话，尽情写出来吧"/>
				<view class="pushbtnwrap">
					<view class="btns color" @click.stop="paisend = false">
						取消
					</view>
					<view class="btns yellow" @click.stop="pushHandler">
						确定
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="shareShow" mode="center" width="622rpx" height="695rpx" border-radius="20">
			<view class="pushcontent">
				<image :src="imgURl+'paiclose.png'" class="paiclose" @click.stop="shareShow = false"></image>
				<u-image :src="avatar" width="148rpx" height="148rpx" border-radius="74rpx" class="avatar"></u-image>
				<view class="title">
					拜年接龙成功
				</view>
				<view class="pushbtnwrap">
					<button  open-type="share" class="btns color">
						分享给好友
					</button>
					
					<view class="btns yellow" @click.stop="shareHandler">
						分享到朋友圈
					</view>
				</view>
			</view>
		</u-popup>
				<Onshare ref="sharer"  />
	</view>
</template>

<script>
	import Onshare from '@/components/onfirend/onfirend.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom,
			Onshare
		},
		data(){
			return {
				imgURl:this.Config.minUrl,
				config: {
					title: '拜年接龙', //title
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
				paisend:false,
				paiinput:'',
				shareShow:false,
				yearList:[],
				total_page:0,
				page:1,
				page_size:10,
				community_name:'',
				avatar:'',
				community_id:'',
				onShareShow:false,
				isHome:false,
				ios:false,
				height: 700,
				todo:false,
				number:0,
				total:0
			}
		},
		onLoad(options) {
			var that = this
			uni.getSystemInfo({
				success: (res) => {
					that.ios = res.platform == 'ios' ? true : false
				}
		 	})
			if(options.community_name){
				this.community_name = options.community_name
			}else{
				if(uni.getStorageSync('all_community')){
					this.community_name = uni.getStorageSync('all_community')[0].title
				}
			}
			if(options.community_id){
				this.community_id = options.community_id
				this.getList()
			}else{
				this.community_id = uni.getStorageSync('community_id')
				if(this.community_id){
					this.getList()
				}
			}
			
			this.checkLogin()
			var that = this
			uni.getSystemInfo({
				success: (res) => {
					that.height = res.screenHeight - 280
				}
			})
		},
		onShow(){
	
			uni.setStorageSync('paiAd',1)
			if(!this.community_name){
				if(uni.getStorageSync('all_community')){
					this.community_name = uni.getStorageSync('all_community')[0].title
				}
			}
			this.avatar = uni.getStorageSync('user').avatar
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShareAppMessage(e){
			var title = ''
			var user_id = uni.getStorageSync('user_id')
			if(e.from == 'menu'){
				title = '2021拜年接龙:我是第'+this.number+'个，给'+this.community_name+'邻居拜年啦！'
			}else if(e.from == 'button'){
				// for(var i in this.yearList){
				// 	if(this.yearList[i].user_id == user_id){
				// 		number = this.yearList[i].number
				// 		break;
				// 	}
				// }
				title = '2021拜年接龙:我是第'+this.number+'个，给'+this.community_name+'邻居拜年啦！'	
			}
			var user = uni.getStorageSync('user').user_nickname
			var community_id = this.community_id
			
			if(this.number == 0){
				title = '2021拜年接龙:已有'+this.total+'位'+this.community_name+'邻居参与，快来参与吧～'
			}
			var image = 'https://sq.wenlinapp.com/upload/mini/paishare.png'
			return {
				title: title,
				imageUrl: image,
				path:
					'/pages/update/newYear?srouce=1&community_id='+community_id+'&user_id='+user_id+'&community_name='+this.community_name
			}
		},
		onShareTimeline(e) {
			// var  number =  0
			var user_id = uni.getStorageSync('user_id')
			var community_id = this.community_id
			// for(var i in this.yearList){
			// 	if(this.yearList[i].user_id == user_id){
			// 		number = this.yearList[i].number
			// 		break;
			// 	}
			// }
			var title = '2021拜年接龙:我是第'+this.number+'个，给'+this.community_name+'邻居拜年啦！'	
			var image = 'https://sq.wenlinapp.com/upload/mini/paishare.png'
			if(this.number == 0){
				title = '2021拜年接龙:已有'+this.total+'位'+this.community_name+'邻居参与，快来参与吧～'
			}
			return {
				title: title,
				imageUrl: image,
				query: 'community_id='+community_id+'&user_id='+user_id+'&community_name='+this.community_name
			};
		},
		methods:{
			checkLogin(){
				var singPage = uni.getStorageSync('singPage');
				var that = this
				if(singPage == 0){
					var auth = new Promise(function(resolve, reject) {
						var token = uni.getStorageSync('token');
						if (!token) {
							resolve(true);
						} else {
							resolve(false);
						}
					});
					auth.then(status => {
						if(status){
							uni.navigateTo({
								url:'/pages/index/index'
							})
						}else{
							var all_community = uni.getStorageSync('all_community');
							all_community.map((item)=>{
								if(item.community_id == that.community_id){
									that.todo = true
								}
							})
						}
					});
				}
			},
			upper(){
				
			},
			lower(e){
				if(this.total_page > this.page){
					this.page++
					this.getList(true)
				}
			},
			scroll(){
				
			},
			goPer(item) {
				uni.navigateTo({
					url: '/pages/index/personalcard?user_id=' + item.user_id + '&community_id=' + item.community_id
				});
			},
			getList(ismore){
				var data = {
					page:this.page,
					page_size:this.page_size,
					community_id:this.community_id
				}
				this.Api.newyearGreetings(data).then((result)=>{
					if(result.code == 1){
						this.community_name = result.data.community.title
						this.total = result.data.total
						this.total_page = result.data.total_page
						this.number = result.data.my_number
						if(ismore){
							this.yearList = this.yearList.concat(result.data.list)
						}else{
							this.yearList = result.data.list
						}
						
					}
				})
			},
			shareHandler(){
		
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					this.checkLogin()
					if(!this.todo){
						return this.$u.toast('您不是本小区用户，请返回首页进行拜年接龙')
					}
					if(this.ios){
						return this.$u.toast('目前不支持苹果手机')
					}
					this.shareShow = false
					this.$refs.sharer.show = true
				}
			},
			pushHandler(){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					this.checkLogin()
					if(!this.todo){
						return this.$u.toast('您不是本小区用户，请返回首页进行拜年接龙')
					}
					var data = {
						community_id:this.community_id
					}
					if(!this.paiinput){
						return this.$u.toast('请输入内容')
					}else{
						data.content = this.paiinput
					}
					this.Api.publishGreetings(data).then((result)=>{
						if(result.code == 1){
							this.paisend = false
							this.paiinput = ''
							this.$u.toast('发布成功')
							this.page = 1
							this.yearList = []
							this.getList()
							this.shareShow = true
						}else{
							return this.$u.toast('发布失败')
						}
					})
				}
			},
			likeHandler(item){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					this.checkLogin()
					if(!this.todo){
						return this.$u.toast('您不是本小区用户，请返回首页进行拜年接龙')
					}
					var data = {
						community_id:this.community_id,
						id:item.id
					}
					this.Api.greetingsLike(data).then((result)=>{
						if(result.code == 1){
							this.$u.toast('点赞成功')
							this.page = 1
							this.yearList = []
							this.getList()
						}
					})
				}
			},
			pushShow(){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					this.checkLogin()
					if(!this.todo){
						return this.$u.toast('您不是本小区用户，请返回首页进行拜年接龙')
					}
					this.paisend  = true			
				}
			}
		},
		onReachBottom() {
	
		}
	}
</script>

<style lang="scss" scoped>
	.newyear{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			padding-bottom: 30rpx;
			box-sizing: border-box;
			.header{
				width:100%;
				height: 378rpx;
				position: relative;
				z-index: 100;
				.anbtn{
					position: absolute;
					right:136rpx;
					top:250rpx;
					width: 268rpx;
					height:70rpx;
					z-index: 250;
				}
				.title{
					font-size: 42rpx;
					font-family: Microsoft YaHei;
					font-weight: bold;
					color: #FFF8F3;
					position: absolute;
					top:48rpx;
					left:50%;
					white-space:nowrap;
					transform: translateX(-25%);
					z-index: 251;
				}
			}
			.body{
				position: static;
				z-index: 99;
				margin-top:-40rpx;
				width:100%;
				padding:20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.list{
					height: 900rpx;
					border-radius: 20rpx;		
					background: linear-gradient(0deg, #CD4533, #A9242E);
					.listitem{
						display: flex;
						flex-direction: row;
						align-items: flex-start;
						padding:20rpx;
						box-sizing: border-box;
						.no{
							font-size: 20rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #E89163;
							width:90rpx;
							line-height:67rpx;
						}
						.ucc{
							width:calc(100% - 105rpx);
							margin-left:15rpx;
							display: flex;
							flex-direction: column;
							padding-bottom: 20rpx;
							border-bottom: 2rpx solid #D24E42;
							.userwrap{
								display: flex;
								flex-direction: row;
								align-items: center;
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #FFF9AE;
								.avatar{
									width: 67rpx;
									height: 67rpx;
									border-radius: 34rpx;
									margin-right:23rpx;
								}
								.username{
									width:180rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									color:white;
								}
								.title{
									flex:1;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									color:white;
								}
								
							}
							.paicont{
								font-size: 32rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #FFF7B2;
								padding-left:90rpx;
							}
							.toolitem{
								display: flex;
								flex-direction: row;
								align-items: center;
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 500;
								margin-top:20rpx;
								padding-left:90rpx;
								box-sizing: border-box;
								color: #E89163;
								.time,.share,.like{
									flex:auto;
									display: flex;
									flex-direction: row;
									align-items: center;
								}
								.share {
									.text{
										color: #E89163;
									}
								}
								.like{
									justify-content: flex-end;
								}
								image{
									width:30rpx;
									height:30rpx;
								}
							}
						}
					}
				}
			}
		}
		.pushcontent{
			width: 622rpx;
			height: 695rpx;
			background: linear-gradient(0deg, #CD4533, #A9242E);
			border: 1px solid rgba(234, 111, 83, 0.63);
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding:20rpx 20rpx 20rpx 20rpx;
			box-sizing: border-box;
			.paiclose{
				width:45rpx;
				height:45rpx;
				margin-left:auto;
				margin-bottom: 80rpx;
			}
			.textarea{
				background: white;
				width:580rpx;
				border-radius: 20rpx;
				padding:20rpx !important;
				box-sizing: border-box;
				word-wrap:break-word;
				word-break:break-all;
				font-size:28rpx;
				line-height:41rpx;
			}
			.placeholderclass{
				word-wrap:break-word;
				word-break:break-all;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #000000;
				line-height: 41rpx;
			}
			.avatar{
				margin-top:40rpx;
			}
			.title{
				font-size: 38rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #EEF2FA;
				margin-top: 40rpx;
			}
			.pushbtnwrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				margin-top:80rpx;
				.btns{
					width: 284rpx;
					height: 99rpx;
					border-radius: 10rpx;
					line-height: 99rpx;
					text-align: center;
					font-size: 38rpx;
					font-family: PingFang SC;
					font-weight: bold;
				}
				.color{
					background: #EEF2FA;
					color:#404B69;
				}
				.yellow{
					color:white;
					background:-webkit-linear-gradient(44deg, #FEAA0E, #FFC000);
					background:-moz-linear-gradient(44deg, #FEAA0E, #FFC000);
					background:-o-linear-gradient(44deg, #FEAA0E, #FFC000);
					background:linear-gradient(44deg, #FEAA0E, #FFC000);
				}	
			}
		}
	}
</style>
