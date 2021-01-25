。0<template>
	<!-- 居委会 -->
	<view class="helpdetail">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<UserHeader :pitem.sync="detail" @moreClick="moreClick"/>
			<view class="postcontent">
			<!-- 	<text class="postcate">#{{Tool.resultValue(detail.type)}}</text> -->
				<text class="postdes">
					{{detail.content}}
				</text>
			</view>
			<view class="phonewrap" @click="openWxsj">联系方式</view>
			<view class="swiper-wrap">
				<swiper class="screen-swiper" :circular="true" @change="swiperChange"
				 :autoplay="true" interval="5000" duration="500">
					<swiper-item v-for="(item,index) in detail.images" :key="index" @click="previewImage(index)">
						<image class="swiper-imgs" :src="item" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="imgIndex">{{imgIndex}}</view>
			</view>
			<view class="detailnav">
				<text :class="['navitem', navIndex == 1 ? 'active': '']" @click="navClick(1)">评论{{detail.comment_count ? detail.comment_count: ''}}</text>
				<text :class="['navitem', navIndex == 2 ? 'active': '']" @click="navClick(2)">帮推45</text>
			</view>
			<view class="detailcontent">
				<Comment v-for="(item,index) in commentList" :key="index" :pitem="item" @reply="replyHandler" @flover="floverHandler" @del="delHandler"/>
				<view class="headerItem" v-if="false">
					<view class="userheader">
						<image src="../../static/heading.png" class="useravatar"></image>
						<view class="userlist">
							<view class="usertop">
								<text class="username">用户昵称·3#</text>
								<view class="like">
									<image src="../../static/like.png" class="likeimg" />
									<text class="liketext">219</text>
								</view>
								<view class="chuang">
									创
								</view>
							</view>
							<view class="userbottom">
								<text>5-19</text>
								<text>15:16</text>
							</view>
						</view>
					
						<text class="flovertext">219</text>

					</view>
				</view>
			</view>
		</view>
		<!-- 回复框 -->
		<view class="reply">
			<view class="inputrow">
				<view class="inputwrap" :class="{'inputwrap-fix':!replyFlag}">
					<image src="../../static/face.png" class="face" @click="faceClick">
					<input type="text" :placeholder="parent_text" v-model="inputValue" @focus="InputFocus" @blur="InputBlur" @confirm="inputValueHander">
				</view>
	<!-- 			<view class="inputbtn" @click="inputValueHander">
					发送
				</view> -->
				<view class="pushwrap" v-if="replyFlag">
					<image src="../../static/push-a.png" class="pushico"></image>
					<text class="pushtxt">98</text>
				</view>
				<view class="sharewrap" v-if="replyFlag">
					<image src="../../static/forward.png" class="shareico"></image>
					<text>分享</text>
					
				</view>
			</view>
			<view class="emowrap">
				<!-- 表情插件 -->
				<emotion @emotion="handleEmj" :height="200" v-if="isShowEmj"></emotion>
			</view>
		</view>
		<!-- 电话 -->
		<view class="popup" v-if="wxsj">
			<view class="mb" @click="closewxsj"></view>
			<view class="wxsjcontent">
				<view class="mobile" @click="copy(1)">
					<text>手机号</text>
					<text>{{detail.mobile}}</text>
					<text>复制</text>
				</view>
				<view class="mobile" @click="copy(2)">
					<text>微信号</text>
					<text>{{detail.weixin}}</text>
					<text>复制</text>
				</view>
			</view>
		</view>
		<!-- 找错 -->
		<FindFault :isShow="findFaultValue" :isCollect="findFaultCollect" :isType="findFaultType" @close="fClose" @collect="fCollect" @find="fFind" />
	</view>
</template>

<script>
	import FindFault from '@/components/findFault/findFault.vue';
	import emotion from '@/components/bkhumor-emoji/index.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	import UserHeader from '@/components/userHeader/userheader.vue'
	import Comment from '@/components/comment/comment.vue'
	import Tool from '../../utils/tool.js'
	export default{
		data () {
			return {
				//表情配置
				isShowEmj: false,
				emojiIcon:'cuIcon-emoji',
				inputValue:'',
				config: {
					title: '', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200 ,//滑动的高度限制，超过这个高度即背景全部显示
				wxsj:false,
				cardCur: 0,
				swiperIndex: 1,
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
				}, {
					id: 1,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
				}, {
					id: 2,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
				}, {
					id: 3,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
				}, {
					id: 4,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
				}, {
					id: 5,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
				}, {
					id: 6,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
				}],
				dotStyle: false,
				towerStart: 0,
				direction: '',
				navIndex: 1,
				id:'',
				detail:{
					images:[]
				},
				commentList:[],
				parent_id:'',
				parent_text:'说说你的看法',
				community_id:'',
				findFaultType:1,
				findFaultCollect:false,
				findFaultValue:false,
				replyFlag:true,//回复开启
				total:0,
				page:1,
				page_size:10
			}
		},
		mounted(){
			if(this.$mp.query.id){
				this.id = this.$mp.query.id
				this.getDetail()
			}
		},
		onReachBottom(e){
			if(this.total > 1){
				if(this.total > this.page){
					this.page ++
					this.getCommentList(true)
				}
			}
		},
		methods:{
			getCommentList(ismore){
				var data = {
					object_id:this.id,
					object_type:this.detail.type,
					page:this.page,
					page_size:10
				}
				this.Api.getMultistageComments(data).then((result)=>{
					if(result.code == 1){
						if(ismore){
							var res = result.data.list
								this.total = result.data.total_page
								res.map((item)=>{
									item.nodes = new String(item.content).toString().replace(/\[em\_(\d{1,3})\]/g,'<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/'+"$1"+'.gif  align=middle/>')
									if(item.children){
										item.children.map((sitem) => {
											sitem.nodes = new String(sitem.content).toString().replace(/\[em\_(\d{1,3})\]/g,'<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/'+"$1"+'.gif  align=middle/>')
										})
									}
								})
								this.commentList = this.commentList.concat(res)
								this.commentpageTotal = result.data.total_page
						}else{
							var res = result.data.list
							this.total = result.data.total_page
							res.map((item)=>{
								item.nodes = new String(item.content).toString().replace(/\[em\_(\d{1,3})\]/g,'<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/'+"$1"+'.gif  align=middle/>')
								if(item.children){
									item.children.map((sitem) => {
										sitem.nodes = new String(sitem.content).toString().replace(/\[em\_(\d{1,3})\]/g,'<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/'+"$1"+'.gif  align=middle/>')
									})
								}
							})
							this.commentList = res
							this.commentpageTotal = result.data.total_page
						}
					}
				})
			},
			//删除评论
			delHandler(e){
				this.Api.delComments({id:e.id}).then((result) => {
					if(result.code == 1){
						uni.showToast({
						    title: result.msg,
						    duration: 2000
						});
					}
				})
			},
			//评论功能
			faceClick(){
				this.isShowEmj = !this.isShowEmj;
			},
			//评论点赞
			floverHandler(e){
				console.log(e)
				var data = {
					object_id:e.id,
					object_type:e.object_type,
					community_id:uni.getStorageSync('community_id')
					
				}
				this.Api.setLikes(data).then((result) => {
					console.log(result)
				})
			},
			InputFocus(e){
				this.isShowEmj = false;
				this.$emit('foc')
			},
			handleEmj(i) {
				
				if(i == '[em_98]') {
					//匹配最后一个表情符号并删除。
					this.inputValue = this.inputValue.replace(/(\[[^\]]+\]|[\s\S])$/, '');
				} else {
					this.inputValue += i;
				}
			},
			showEmj() {
				let bool = !this.isShowEmj;
				if(bool) {
					this.emojiIcon = 'cuIcon-keyboard';
				} else {
					this.emojiIcon = 'cuIcon-emoji';
				}
				
				this.isShowEmj = bool;
				this.$emit('show')
			},
			InputBlur(e){
				
			},
			
			inputValueHander(e){
				console.log(this.inputValue,'11')
				if(!this.inputValue){
					uni.showToast({
					    title: '请输入评论内容',
					    duration: 2000
					});
					return
				}
				var data = {
					object_id:this.id,
					object_type:this.detail.type,
					content:this.inputValue,
					parent_id:this.parent_id,
					community_id:uni.getStorageSync('community_id')
				}
	
				this.Api.setComments(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
						    title: result.msg,
						    duration: 2000
						});
					}
				})
			},
			//复制功能
			copy(index){
				var data = ''
				var that = this
				if(index == 1){
					data = this.detail.mobile
				}else if(index == 2){
					data = this.detail.weixin
				}
				uni.setClipboardData({
				    data: data,
				    success: function () {
				        uni.showToast({
				            title: '复制成功',
				            duration: 2000
				        });
						that.wxsj = false
				    }
				});
			},
			//放大处理
			previewImage(index){
				console.log(index)
				uni.previewImage({
					loop:true,
					current:index,
					urls: this.detail.images,
					success: () => {
						
					}
				})
			},
			getDetail(){
				this.Api.communityDynamicsDetail({id:this.id}).then((result) =>{
					if(result.code == 1){
						this.detail = result.data
						this.config.title = Tool.resultValue(result.data.type)
						this.getCommentList()
					}
				})
			},
			swiperChange(e) {
				this.swiperIndex = e.detail.current + 1
			},
			// 打开手机微信
			openWxsj(){
				this.wxsj = true
			},
			closewxsj(){
				this.wxsj = false
			},
			navClick(index){
				this.navIndex = index
			},
			//收藏处理
			moreClick(){
				this.findFaultType = this.detail.type
				this.findFaultCollect = this.detail.user_favorite == 0 ? false : true
				this.findFaultValue = true
			},
			//收藏处理
			fCollect(e){
				var data = {
					object_id: this.id,
					object_type:this.detail.type,
					community_id: uni.getStorageSync('community_id')
				}
				if(this.detail.user_favorite == 0){
					this.Api.setFavorites(data).then((result) => {
						if(result.code == 1){
							uni.showToast({
								title: result.msg,
								duration: 2000
							});
	
						}else{
							uni.showToast({
								title: result.msg,
								duration: 2000
							});
						}
					})
				}else if(this.detail.user_favorite == 1){
					this.Api.unsetFavorites(data).then((result)=>{
						if(result.code == 1){
							uni.showToast({
								title: result.msg,
								duration: 2000
							});

						}else{
							uni.showToast({
								title: result.msg,
								duration: 2000
							});
						}
					})
				}
				this.findFaultValue = false
				this.getDetail()
				this.$forceUpdate()
			},
			//找错处理
			fFind(e){
				
			},
			fClose(){
				this.findFaultValue = false
			},
			//评论回复操作
			replyHandler(e){
				console.log(e)
				this.replyFlag = false
				this.parent_id = e.id
				this.parent_text = '回复'+e.user.user_nickname
				// parent_id:'',
				// parent_text:'说说你的看法',
			}
		},
		components:{
			UserHeader,
			Comment,
			navigationCustom,
			emotion,
			FindFault
		},
		computed:{
			imgIndex () {
				return this.swiperIndex +'/'+ this.detail.images.length
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: white;
	}
	.helpdetail{
		display: flex;
		flex-direction: column;
		background: white;
		.content{
			display: flex;
			flex-direction: column;
			padding:10upx 24upx;
			box-sizing: border-box;
			min-height: 100vh;
			margin-bottom: 168upx;
			.postcontent {
				position: relative;
				display: inline-flex;
				width:100%;
				.postcate {
					font-size: 30upx;
					color: #ff9c00;
					line-height: 42upx;
					margin-right: 10upx;
					position: absolute;
					left: 0;
					top: 0;
				}
				.postdes {
					font-size: 30upx;
					font-weight: 500;
					line-height: 42upx;
					text-align: left;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// display: -webkit-box;
					// -webkit-line-clamp: 3;
					// -webkit-box-orient: vertical;
					// text-indent: 3em;
				}
			}
			.phonewrap{
				font-size:30upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:rgba(255,156,0,1);
				line-height:42upx;
				margin-bottom: 20upx;
				width:100%;
				text-align: left;
			}
			.swiper-wrap{
				width:100%;
				height:480upx;
				border-radius: 16upx;
				overflow: hidden;
				position: relative;
				margin-bottom: 40upx;
				.imgIndex{
					width:68upx;
					height:36upx;
					line-height: 36upx;
					text-align: center;
					background:rgba(0,0,0,0.3);
					border-radius:20upx;
					font-size:22upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(255,255,255,0.8);
					text-align: center;
					position: absolute;
					right:24upx;
					bottom: 24upx;
				}
				.screen-swiper{
					width:100%;
					height:100%;
					border-radius: 16upx;
					overflow: hidden;
					.swiper-imgs{
						width:100%;
						height:100%;
						border-radius: 16upx;
						overflow: hidden;
					}
				}
			}
			.detailnav{
				display: flex;
				flex-direction: row;
				align-items: center;
				.navitem{
					min-width: 128upx;
					height:50upx;
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(153,153,153,1);
					line-height:50upx;
				}
				.active{
					color:#333333;
				}
				.navitem:nth-of-type(1){
					margin-right:32upx;
					padding-right:32upx;
					border-right:4upx solid rgba(216,216,216,1);
				}
			}
			.detailcontent{
				display: flex;
				flex-direction: column;
				.headerItem{
					display: flex;
					flex-direction: column;
					padding-bottom: 34upx;
					padding-top:34upx;
					border-bottom: 2upx solid #DEDEDE;;
					.userheader{
						display: flex;
						flex-direction: row;
						align-items: center;
						// margin-bottom: 24upx;
						.useravatar{
							width:64upx;
							height:64upx;
							border-radius: 50%;
							margin-right:16upx;
						}
						.userlist{
							display: flex;
							flex-direction: column;
							flex:1;
							.usertop{
								display: flex;
								flex-direction: row;
								.username{
									font-size:26upx;
									font-family:PingFang-SC-Bold,PingFang-SC;
									font-weight:bold;
									color:rgba(51,51,51,1);
									line-height:36upx;
									margin-right:24upx;
								}
								.like{
									width:82upx;
									height:32upx;
									background:rgba(255,156,0,0.1);
									border-radius:8upx;
									margin-right:16upx;
									display: flex;
									flex-direction: row;
									align-items: center;
									justify-content: center;
									.likeimg{
										width:30upx;
										height:26upx;
										margin-right:8upx;
									}
									.liketext{
										font-size:20upx;
										font-family:PingFang-SC-Medium,PingFang-SC;
										font-weight:500;
										color:rgba(255,156,0,0.8);
										line-height:28upx;
									}
								}
								.chuang{
									width:36upx;
									height:32upx;
									background:rgba(255,156,0,0.1);
									border-radius:8upx;
									font-size:20upx;
									font-family:PingFang-SC-Bold,PingFang-SC;
									font-weight:bold;
									color:rgba(255,156,0,0.8);
									line-height:32upx;
									text-align: center;
								}
							}
							.userbottom{
								height:32upx;
								font-size:22upx;
								font-family:PingFang-SC-Medium,PingFang-SC;
								font-weight:500;
								color:rgba(153,153,153,1);
								line-height:32upx;
								text{
									margin-right:16upx;
								}
							}
						}
	

						.flovertext{
							height:40upx;
							font-size:28upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(51,51,51,1);
							line-height:40upx;
							margin-right:auto;
						}
					
					}
				}
			}
		}
		.reply{
			display: flex;
			flex-direction: column;
			position: fixed;
			padding:20upx 24upx 88upx 24upx;
			left:0;
			bottom: 0;
			width:100%;
			min-height:168upx;
			background:white;
			box-shadow:0upx 12upx 20upx 0upx rgba(0,0,0,0.1);
			.inputrow{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.inputbtn{
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,1);
				}
				.inputwrap{
					width:420upx;//420upx
					height:60upx;
					background:rgba(234,234,234,0.3);
					border-radius:32upx;
					position: relative;
					.face{
						width:40upx;
						height:40upx;
						position: absolute;
						right:22upx;
						top:50%;
						transform: translateY(-50%);
					}
					input{
						padding-left:30upx;
						width:80%;
						height:100%;
						font-size:24upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						line-height:100%;
					}
				}
				.inputwrap-fix{
					width:100%;
				}
				.pushwrap{
					font-size:22upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,1);
					line-height:32upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					margin:0 auto;
					.pushico{
						width:36upx;
						height:38upx;
						margin-right:8upx;
					}
				}
				.sharewrap{
					font-size:22upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(102,102,102,1);
					line-height:32upx;
					display: flex;
					align-items: center;
					.shareico{
						width:36upx;
						height:36upx;
						margin-right:8upx;
					}
				}
			}
			.emowrap{
				padding-top:24upx;
				// display: flex;
			}

		}
		.popup{
			position: fixed;
			left:0;
			top:0;
			width:100%;
			height:100%;
			z-index: 3000;
			.mb{
				position: fixed;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index: 3001;
				background: rgba(0,0,0,0.3);
			}
			.wxsjcontent{
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
				.mobile:nth-of-type(2){
					border-bottom: 1px solid transparent;
				}
				.mobile{
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					height:120upx;
					line-height: 120upx;
					border-bottom: 1px solid #DEDEDE;
					text:nth-of-type(1){
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
					text:nth-of-type(2){
						font-size:28upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						margin-left:24upx;
						margin-right:68upx;
					}
					text:nth-of-type(3){
						width:100upx;
						height:56upx;
						background:rgba(255,156,0,1);
						border-radius:8upx;
						font-size:26upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(255,255,255,1);
						line-height:56upx;
						text-align: center;
					}
				}
			}
		}
	}
</style>
