<template>
	<!-- 居委会活动详情 -->
	<view :class="['helpdetail','u-skeleton',scrollFixed ? 'helpdetailfix' : '' ]">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view class="swiper-wrap">
<!-- 				<swiper class="screen-swiper" :circular="true" @change="swiperChange"
				 :autoplay="true" interval="5000" duration="500"> -->
<!-- 					<swiper-item > -->
				<view class="swiper-imgs" :src="item" mode="widthFix" v-for="(item,index) in detail.images" :key="index" @click="previewImage(index)">
					<u-image :src="item"  mode="widthFix"></u-image>
				</view>
		<!-- 			</swiper-item>
				</swiper> -->
				<!-- <view class="imgIndex">{{imgIndex}}</view> -->
			</view>
			<view class="detail-title">
			
			{{detail.title}}
			<text style="color:#FF9C00" v-if="false">【{{detail.status | joinStatus}}】</text>
			<text style="color:#ED3269" v-if="detail.modular_type == 2">【抽奖】</text>
				<text style="color:#ED3269" v-if="detail.modular_type == 1">【答题】</text>
			</view>
			<view class="postpush">
<!-- 				<text class="t1" @click="goComitee(detail.communitycommittee.committee_id)">{{detail.communitycommittee.title}}</text> -->
				<text class="t1" @click="goComitee(detail.committee.committee_id)">{{detail.committee.title}}</text>
				<text class="t2">{{detail.create_time | formatTime}}</text>
				<image class="t3"  @click="fCollect" :src="detail.user_favorite == 0 ? require('../../static/collect.png') : require('../../static/collected.png')"></image>
				<text class="t4"  @click="fCollect" >{{detail.user_favorite == 0 ? '收藏' : '已收藏'}}</text>
			</view>
			<view class="alist">
				<view class="aitem" v-if="detail.activity_time">
					<image src="../../static/aitem1.png" class="aitem1"></image>
					<text class="label">活动时间:</text>
					<text class="name">{{detail.activity_time}}</text>
				</view>
				<view class="aitem" v-if="detail.address">
					<image src="../../static/aitem2.png" class="aitem1"></image>
					<text class="label">活动地址:</text>
					<text class="name">{{detail.address }}</text>
				</view>
				<view class="aitem">
					<image src="../../static/aitem3.png" class="aitem1"></image>
					<text class="label">活动人数:</text>
					<text class="name">{{detail.max_joins == 0 ?  '无限制' : detail.max_joins+'人' }}</text>
				</view>
				<view class="aitem" v-if="detail.join_time">
					<image src="../../static/aitem1.png" class="aitem1"></image>
					<text class="label">报名时间:</text>
					<text class="name">{{detail.join_time}}</text>
				</view>
				<view class="aitem" v-if="detail.contacts.length">
					<image src="../../static/aitem4.png" class="aitem1"></image>
					<text class="label">联系人:</text>
					<view class="name namec">
						<text v-for="(item,index) in detail.contacts" :key="index" @click="mobilecall(item.phone)">{{item.name}} {{item.phone}}</text>
					</view>
					
				</view>
			</view>
			<view class="postcontent">
				<view class="postkey">
					活动详情
				</view>
				<view :class="['postdes',limit ? 'limit-postcontent' : '']">
					<rich-text :nodes="detail.content"></rich-text>
				</view>
				<view class="dpo">{{detail.post_hits}}人浏览</view>
				<view class="contentmore" @click="limitClick">
						<image class="moreico" src="../../static/acontentshow.png"></image>
						<text class="moretext">{{limittext}}</text>
				</view>
			</view>
		
			<view class="detailnav">
				<text :class="['navitem', navIndex == 3 ? 'active': '']" @click="navClick(3)" v-if="detail.activity_type == 1">报名{{detail.joins? detail.joins : ''}}</text>
				<text :class="['navitem', navIndex == 4 ? 'active': '']" @click="navClick(4)" v-if="detail.activity_type == 2">已答题{{detail.joins? detail.joins : ''}}</text>
				<text :class="['navitem', navIndex == 1 ? 'active': '']" @click="navClick(1)">评论{{detail.comment_count ? detail.comment_count: ''}}</text>
				<text :class="['navitem', navIndex == 2 ? 'active': '']" @click="navClick(2)">帮推{{detail.help_score ? detail.help_score : ''}}</text>
				
			</view>
			<view class="detailcontent">
				<Comment v-for="(item,index) in commentList" :key="index" :pitem="item" @reply="replyHandler" @flover="floverHandler" @del="delHandler" @goPer="goPerHandler" v-if="navIndex == 1" />
				
				<view class="headerItem" v-if="navIndex == 2" v-for="(item,index) in commentList" :key="index" >
					<view class="userheader">
						<image :src="item.user.avatar" class="useravatar"></image>
						<view class="userlist">
							<view class="usertop">
								<text class="username">{{item.user.user_nickname}}·{{ucommunityid == item.user.community_id ? item.user.building+'#' : item.user.community_name}}</text>
								<view class="like">
									<image src="../../static/like.png" class="likeimg" />
									<text class="liketext">{{item.user.love_value}}</text>
								</view>
								<view class="chuang"  v-if="item.user.founder == 1">
									创
								</view>
							</view>
							<view class="userbottom">
								<text>{{item.create_time | formatTime}}</text>
							</view>
						</view>
					
						<text class="flovertext">{{item.score}}</text>
				
					</view>
				</view>
				
				<view class="headerItem" v-if="navIndex == 3 || navIndex == 4" v-for="(item,index) in commentList" :key="index">
					<view class="userheader">
						<image :src="navIndex == 3 ? item.avatar : item.user.avatar" class="useravatar"></image>
						<view class="userlist">
							<view class="usertop">
<!-- 								<text class="username">{{item.name}}·{{item.userinfo.building}}#</text> -->
								<text class="username" v-if="navIndex == 3">{{item.user.user_nickname}}·{{ucommunityid == item.userinfo.community_id ? item.userinfo.building+'#' : item.userinfo.community_name}}</text>
								<text class="username" v-if="navIndex == 4">{{item.user.user_nickname}}·{{ucommunityid == item.user_info.community_id ? item.user_info.building+'#' : item.user_info.community_name}}</text>
								
								<view class="like">
									<image src="../../static/like.png" class="likeimg" />
									<text class="liketext">{{item.user.love_value}}</text>
								</view>
								<view class="chuang" v-if="item.user.founder == 1">
									创
								</view>
							</view>
						</view>
					
						<text class="flovertext jointe">{{item.create_time | formatTime}}</text>

					</view>
				</view>
				<Nodata v-if="nodataFlag" />
			</view>
		</view>
		<!-- 报名 -->
		<view :class="['signup',autoStyle ? 'signupfix': '']" @click="signupHandler" v-if="detail.activity_type == 1">
			{{detail.status | joinStatus}}
		</view>
		<view :class="['signup',autoStyle ? 'signupfix': '']" @click="askHandler" v-if="detail.activity_type == 2">
			立即答题
		</view>
		<!-- 回复框 -->
		<view class="reply">
			<view class="inputrow">
				<view class="inputwrap inputwrapinit" @click="replyInit">
					<input
						maxlength="500"
						type="text"
						:disabled="true"
						:placeholder="parent_text"
					/>
				</view>
				<view class="pushwrap"  @click="helpPush">
					<image :src="detail.user_help == 1 ? '../../static/push-a.png' : '../../static/push.png'" class="pushico"></image>
					<text class="pushtext">{{ detail.help_score }}</text>
				</view>
				<view class="sharewrap"  @click="shareClick"><image src="../../static/forward.png" class="shareico"></image></view>
			</view>
		</view>
		<view class="replymb"  v-if="replyTextarea" @click="closeReplyInit"></view>
		<view class="reply" v-if="replyTextarea" :style="{bottom:autoBottom+'px'}">
			<view class="inputrow">
				<view class="inputwrap">
					<textarea
					    :adjust-position="adjustposition"
						maxlength="500"
						type="text"
						:fixed="true"
						:placeholder="parent_text"
						:focus="!replyFlag"
						:show-confirm-bar="showconfirmbar"
						v-model="inputValue"
						:auto-focus="textareaautofocus"
						:hold-keyboard="textareaautofocus"
						@focus="InputFocus"
						@blur="InputBlur"
						@confirm="inputValueHander"
					/>
				</view>
				<!-- 					<view class="pushwrap" v-if="replyFlag" @click="helpPush">
						<image :src="detail.user_help == 1 ? '../../static/push-a.png' : '../../static/push.png' " class="pushico"></image>
						<text class="pushtext">{{detail.help_score}}</text>
					</view>
					<view class="sharewrap" v-if="replyFlag" @click="shareClick">
						<image src="../../static/forward.png" class="shareico"></image>
					</view> -->
			</view>
			<view class="emowrap" v-if="isShowEmj">
				<!-- 表情插件 -->
				<emotion @emotion="handleEmj" :height="200"></emotion>
			</view>
			<view class="wrapc">
				<image src="../../static/face.png" class="face" @click="faceClick"></image>
				<view class="inputbtn" @click="inputValueHander">发送</view>
			</view>
		</view>
		<!-- 帮推 -->
		<Help ref="Help" :isShow="helpShow" @close="Helpcancel" @ok="ok" :score="score"/>
		<!-- 找错 -->
		<FindFault :isShow="findFaultValue" :isCollect="findFaultCollect" :isType="findFaultType" @close="fClose" @collect="fCollect" @find="fFind"  @onshare="onShowshare" />
		<!-- 分享 -->
		<Onshare :isShow="onShareShow" :isHome.sync="isHome" @onsend="onsend" @close="onShowclose" @ontodo="onShowtodo" @onshare="onShowshare" />
<!-- 		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
 -->
		<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />
 
		<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
		</view>
		<!-- 积分提示 -->
		<Integraltip ref="integraltip" :types.sync="add_type" :score.sync="score_text"  />
		<view class="shareswrap"  v-if="srouceShow">
			<view class="sharecontent" >
				<view class="sharewc">
					<text class="t1">{{srouceText}}</text>
					<text class="wbtns" @click="goHomeIndex">{{srouceBtnText}}</text>
				</view>
			
			</view>
		</view>
		<Firend ref="Firend" />
		<Confrimpop ref='confrims' @del="condelHandler"/>
		<DeleteTip ref="deletetip" />
		<u-skeleton :loading="loading" :animation="true" el-color="#ddd" bg-color="#fff" border-radius="10"></u-skeleton>
	</view>
</template>

<script>
	import Nodata from '@/components/nodata/nodata.vue';
	import Onshare from '@/components/onshare/onshare.vue';
	import FindFault from '@/components/findFault/findFault.vue';
	import emotion from '@/components/bkhumor-emoji/index.vue';
	import Help from '@/components/help/help.vue';
	import Firend from '../../components/onfirend/onfirend.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	import UserHeader from '@/components/userHeader/userheader.vue'
	import Comment from '@/components/comment/comment.vue'
	import Tool from '../../utils/tool.js'
	import hchPoster from '../../wxcomponents/hch-poster/hch-poster.vue'
	import Integraltip from '@/components/integraltip/integraltip.vue'
	import Confrimpop from '@/components/confrim/confrim.vue'
	import DeleteTip from '@/components/deletetip/deletetip.vue'
	export default{
		data () {
			return {
				//表情配置
				isShowEmj: false,
				emojiIcon:'cuIcon-emoji',
				inputValue:'',
				config: {
					title: '居委会活动', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"#333333", //文字颜色，默认白色
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
				navIndex: 3,
				id:'',
				type:'',
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
				page_size:10,
				limit:false,//限制高度开启
				limittext:'收回',
				dynamics_id:'',
				onShareShow:false,
				findFaultObject:{},
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
					codeWidth: 0.22,
					codeRatio: 1,
					codeRadius: 0.5,
					codeMT: 15,
					codeName: "问邻",
					codeNameMT: 15,
					tips: "长按/扫描识别进入贴子",
					posterBgUrl:'',
					avatarUrl: uni.getStorageSync('user').avatar,
					des:''
				},
				helpShow:false,
				helpObj:{},
				score:0,
				scrollFixed:false,
				add_type:'',
				score_text:'',
				srouce:0,
				ucommunityid:uni.getStorageSync('community_id'),
				srouceShow:false,
				srouceText:'提示您尚未登录，请登录后操作',
				srouceCommunity_id:'',
				srouceCommunity_text:'',
				srouceBtnText:'登录',
				nodataFlag:false,
				replyTextarea:false,
				textareaautofocus:false,
				autoBottom:0,
				showconfirmbar:false,
				adjustposition:false,
				isHome:true,
				rule:false,
				loading:true
			}
		},
		mounted(){
			console.log(this.$mp.query)
			var singPage = uni.getStorageSync('singPage')
			var that = this;
			if(singPage == 0){
				var auth = new Promise(function(resolve, reject) {
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && !all_community){
						uni.login({
							success: res => {
								let { errMsg, code } = res;
								if (errMsg == 'login:ok') {
									that.Api.wechatAuth({ code: code }).then(result => {
										if (result.code == 1) {
											uni.setStorageSync('token', result.data.token);
											uni.setStorageSync('user', result.data.user);
											uni.setStorageSync('mobile', result.data.user.mobile);
											uni.setStorageSync('all_community', result.data.all_community.length ? result.data.all_community : []);
											resolve();
										}
									});
								}
							}
						});
					}else{
						resolve();
					}
				});
				auth.then(status => {
					var token = uni.getStorageSync('token');
					var all_community = uni.getStorageSync('all_community');
					that.loginTodoHander()
				})
			}else{
				that.loginTodoHander()
			}
		

	
		},
		onReachBottom(e){
			if(this.total > 1){
				if(this.total > this.page){
					this.page ++
					
					if(this.navIndex == 1 || this.navIndex == 2 || this.navIndex == 4){
						this.getCommentList(true)
					}else if(this.navIndex == 3){
						this.getJoinUserList(true)
					}
				}
			
			}
		},
		onPullDownRefresh(e){
			if(this.navIndex == 1 || this.navIndex == 2 || this.navIndex == 4){
				this.getCommentList()
			}else if(this.navIndex == 3){
				this.getJoinUserList()
			}
		},
		onShareAppMessage:function(){
				var img = this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/act_post.png'
				return {
				 title: this.detail.title,
				 imageUrl: img,
				 path: '/pages/index/cdetail?srouce=1&id='+this.id+'&type='+this.type+'&dynamics_id='+this.dynamics_id
				}
		},
		onShareTimeline(e) {
			var title = ''
			if(this.detail.publish_type == 1){
				title = this.detail.content
			}else{
				title = this.detail.title
			}
			var query = {}
			if( this.type == 7 || this.type == 8){
				query.id=this.id
				query.type=this.type
				query.dynamics_id=this.dynamics_id
			}else{
				query.id=this.id
				query.type=this.type
			}
		    // query=JSON.stringify(query);
		    return {
		      title: title,
		      imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/act_post.png',
		      query: query,
		    }
		},
		methods:{
			loginTodoHander(){
				if(this.$mp.query.scene){
					this.srouce = 1
				var scene = decodeURIComponent(this.$mp.query.scene);
				var arr = scene.split("&")
					if(arr[0]){
						if(arr[0].split("=")[1]){
							this.id = arr[0].split("=")[1]
						}
					}
					if(arr[1]){
						if(arr[1].split("=")[1]){
							this.type = arr[1].split("=")[1]
						}
					}
					if(arr[2]){
						if(arr[2].split("=")[1]){
							this.dynamics_id = arr[2].split("=")[1]
						}
					}
					
					this.getDetail()
				}
				if(this.$mp.query.id){
					this.id = this.$mp.query.id
					this.type = this.$mp.query.type
					this.dynamics_id = this.$mp.query.dynamics_id
					this.getDetail()
				}
				if(this.$mp.query.srouce){
					this.srouce = this.$mp.query.srouce
				}
			},
			goHometodo(){
				var token = uni.getStorageSync('token')
				var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
			},
			replyInit(){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				this.replyTextarea = true
				this.textareaautofocus = true
				this.scrollFixed = true
			},
			goPerHandler(e){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				} else {
					var token = uni.getStorageSync('token');
					var all_community = uni.getStorageSync('all_community');
					if ((!token && all_community.length == 0) || (token && all_community.length == 0)) {
						this.$refs.confrims.text = '暂无权限操作，登录问邻即可操作';
						this.$refs.confrims.id = -1;
						this.$refs.confrims.guestShow = true;
						return;
					}
				}
				uni.navigateTo({
					url: '/pages/index/personalcard?user_id=' + e.id + '&community_id=' + e.community_id
				});	
			},
			closeReplyInit(){
					this.replyTextarea = false
					this.textareaautofocus = false
					this.scrollFixed = false
					this.parent_text = '说说你的看法'
			},
			//转发朋友圈
			onsend(){
				this.onShareShow = false
				this.$refs.Firend.onshow()
			},
			goHomeIndex(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			autoShare(){
				if(this.srouce == 1){
					if(uni.getStorageSync('token')){
							if(this.opening == 0 && this.detail.publish_type == 1){
								if(this.srouceCommunity_id != uni.getStorageSync('community_id')){
									this.srouceText = '本贴设置了'+this.srouceCommunity_text+'小区内部可见,您无权浏览'
									this.srouceBtnText = '返回首页'
									this.srouceShow = true
								}
							}
					}else{
							// this.srouceShow = true
							// this.srouceText = '提示您尚未登录，请登录后操作'
							// this.srouceBtnTex = '登录'
					
						var that = this
						var auth = new Promise(function(resolve, reject){
							uni.login({
								success: (res) => {
									let { errMsg,code} = res
									if(errMsg == 'login:ok'){
										that.Api.wechatAuth({code:code}).then((result)=>{
											if(result.code == 1){
												uni.setStorageSync('token', result.data.token);
												uni.setStorageSync('user', result.data.user);
												uni.setStorageSync('mobile', result.data.user.mobile);
												uni.setStorageSync('all_community', result.data.all_community);
												resolve()
											}
											
										})
									}
								}
							})
						})
						
						
						auth.then((status) => {
							var token = uni.getStorageSync('token');
							var all_community = uni.getStorageSync('all_community')
							if(all_community.length){
								uni.setStorageSync('community_id',all_community[0].community_id)
								uni.setStorageSync('committee_id',all_community[0].committee_id)
							
							}else{
								this.srouceText = '提示您尚未登录，请登录后操作'
								this.srouceBtnText = '登录'
								this.srouceShow = true
							}
							
							
						})
						
				
						
					}
				}
			
			},
			goComitee(obj){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				uni.navigateTo({
					url:'/pages/update/committee?id='+obj
				})
			},
			//收藏处理
			fCollect(e){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				var data = {
					community_id: uni.getStorageSync('community_id'),
					object_id: this.detail.id,
					object_type: this.type
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
			//切换
			navClick(index){
				this.page = 1
				this.total = 0
				this.commentList = []
				this.navIndex = index
				if(index == 1){
					this.nodatatext = '暂无评论'
				}else if(index == 2){
					this.nodatatext = '暂无帮推'
				}else if(index == 3){
					this.nodatatext = '暂无报名'
				}else if(index == 4){
					this.nodatatext = '暂无答题人'
				}
				setTimeout(()=>{
					if(this.navIndex == 1 || this.navIndex == 2 || this.navIndex == 4){
						this.getCommentList()
					}else if(this.navIndex == 3){
						this.getJoinUserList()
					}
				},300)
			},
			//报名处理
			signupHandler(){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				if(this.detail.status == 1 && !this.detail.draw_id && !this.detail.answer_id){
					uni.navigateTo({
						url:'/pages/update/committeeactivity?id='+this.id
					})
				}
				if(this.detail.draw == 1 && this.detail.draw_id >0){
					var draw_id =  this.detail.draw_id
					uni.navigateTo({
						url:'../update/award?draw_id='+ draw_id
					})
				}
				if(this.detail.answer == 1 && this.detail.answer_id >0){
					var answer_id =  this.detail.answer_id
					uni.navigateTo({
						url:'../update/answer?answer_id='+ answer_id
					})
				}
			},
			//答题处理
			askHandler(){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				

					var answer_id =  this.detail.modular_id
					uni.navigateTo({
						url:'../update/answer?answer_id='+ answer_id
					})
				
			},
			//限制处理
			limitClick(e){
				this.limit = !this.limit
				if(this.limit){
					this.limittext = '展开'
				}else{
					this.limittext = '收回'
				}
			},
			mobilecall(phone){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				uni.makePhoneCall({
					phoneNumber:phone
				})
			},
			getCommentList(ismore){
				var data = {
					object_id:this.dynamics_id,
					object_type:this.type,
					page:this.page,
					page_size:10
				}
				if(this.navIndex == 1){
					this.Api.getMultistageComments(data).then((result)=>{
						if(result.code == 1){
							if(ismore){
								var res = result.data.list
									this.total = result.data.total_page
									res.map(item => {
										item.nodes = '<p style="display:inline-flex;align-items:center;">' +  new String(item.content)
											.toString()
											.replace(/\[em\_(\d{1,3})\]/g, '<img class="imgemoji" style="width:21px" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>') + '</p>';
										if (item.children) {
											item.children.map(sitem => {
												sitem.nodes = '<p style="display:inline-block"><i style="color:#ff9c00;font-style: inherit;margin-right:2px;white-space:nowrap">'+ sitem.user.user_nickname +'</i> <i style="color:#333333;font-style: inherit;white-space:nowrap">回复</i> <i style="margin-left:2px;margin-right:2px;color:#ff9c00;font-style: inherit;white-space:nowrap">'+sitem.to_user.user_nickname+'</i>:<i style="margin-left:3px;font-style: inherit">' + new String(sitem.content)
													.toString()
													.replace(/\[em\_(\d{1,3})\]/g, '<span style="width:21px;height:21px;position:relative;margin-right:25px"><img style="position: absolute;left: 0;top: -2px;width:21px;" class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/></span>') +'</i></p>';
											});
										}
									});
									this.commentList = this.commentList.concat(res)
									this.commentpageTotal = result.data.total_page
							}else{
								var res = result.data.list
								this.total = result.data.total_page
								res.map(item => {
									item.nodes = '<p style="display:inline-flex;align-items:center;">' +  new String(item.content)
										.toString()
										.replace(/\[em\_(\d{1,3})\]/g, '<img class="imgemoji" style="width:21px" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>') + '</p>';
									if (item.children) {
										item.children.map(sitem => {
											sitem.nodes = '<p style="display:inline-block"><i style="color:#ff9c00;font-style: inherit;margin-right:2px;white-space:nowrap">'+ sitem.user.user_nickname +'</i> <i style="color:#333333;font-style: inherit;white-space:nowrap">回复</i> <i style="margin-left:2px;margin-right:2px;color:#ff9c00;font-style: inherit;white-space:nowrap">'+sitem.to_user.user_nickname+'</i>:<i style="margin-left:3px;font-style: inherit">' + new String(sitem.content)
												.toString()
												.replace(/\[em\_(\d{1,3})\]/g, '<span style="width:21px;height:21px;position:relative;margin-right:25px"><img style="position: absolute;left: 0;top: -2px;width:21px;" class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/></span>') +'</i></p>';
										});
									}
								});
								this.commentList = res
								this.commentpageTotal = result.data.total_page
							}
							if(this.commentList.length){
								this.nodataFlag = false
							}else{
								this.nodataFlag = true
							}
						}
					})
				}else if(this.navIndex == 2){
					data.id = this.id
					data.type = this.type
					this.Api.getDynamicsPushLog(data).then((result)=>{
						if(result.code == 1){
							if(ismore){
									var res = result.data.list
									this.total = result.data.total_page
									this.commentList = this.commentList.concat(res)
							}else{
								var res = result.data.list
								this.total = result.data.total_page
								this.commentList = res
							}
							if(this.commentList.length){
								this.nodataFlag = false
							}else{
								this.nodataFlag = true
							}
						}
					})
				}else if(this.navIndex == 4){
					data.answer_id =  this.detail.modular_id
					this.Api.answerresultList(data).then((result)=>{
						if(result.code == 1){
							if(ismore){
									var res = result.data.list
									this.total = result.data.total_page
									this.commentList = this.commentList.concat(res)
							}else{
								var res = result.data.list
								this.total = result.data.total_page
								this.commentList = res
							}
							if(this.commentList.length){
								this.nodataFlag = false
							}else{
								this.nodataFlag = true
							}
						}
					})
				}
			},
			//报名列表
			getJoinUserList(ismore){
				var data = {
					activity_id:this.id,
					page:this.page,
					page_size:10
				}
				this.Api.getJoinUser(data).then((result)=>{
					if(result.code == 1){
						if(ismore){
							var res = result.data.list
								this.total = result.data.total_page
								this.commentList = this.commentList.concat(res)
								this.commentpageTotal = result.data.total_page
						}else{
							var res = result.data.list
							this.total = result.data.total_page
							this.commentList = res
							this.commentpageTotal = result.data.total_page
						}
						if(this.commentList.length){
							this.nodataFlag = false
						}else{
							this.nodataFlag = true
						}
					}
				})
			},
			//删除评论
			delHandler(e){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				this.$refs.confrims.guestShow = true
				this.$refs.confrims.id = e.id
			},
			//评论功能
			faceClick(){
				this.isShowEmj = !this.isShowEmj;
			},
			//评论点赞
			floverHandler(e){
				if (uni.getStorageSync('singPage') == 1) {
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon: 'none',
						duration: 2000
					});
					return;
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				// 点赞/
				if(e.user_like == 0){
					var data = {
						object_id:e.id,
						object_type:10,
						community_id:uni.getStorageSync('community_id')
						
					}
					this.Api.setLikes(data).then((result) => {
						if(result.code == 1){
							// uni.showToast({
							// 	icon:'success',
							// 	title:result.msg,
							// 	duration:2000,
							// 	success: () => {
									this.getCommentList()	
							// 	}
							// })
						}
					})
				}else if(e.user_like == 1) {
					var data = {
						object_id:e.id,
						object_type:10,
						community_id:uni.getStorageSync('community_id')
						
					}
					this.Api.unsetLikes(data).then((result) => {
						if(result.code == 1){
							// uni.showToast({
							// 	icon:'success',
							// 	title:result.msg,
							// 	duration:2000,
							// 	success: () => {
									this.getCommentList()	
							// 	}
							// })
						}
					})
				}
			},
			InputFocus(e){
				this.autoBottom = e.detail.height
				this.isShowEmj = false;
				this.replyFlag = false
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
				this.autoBottom = 0
			},
			
			inputValueHander(e){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
					
				}
				if(this.inputValue.length < 1){
					uni.showToast({
					    title: '请输入评论内容',
					    duration: 2000
					});
					return
				}
				this.subMessageTodo(this.comIds,3,(ss) => {
					var data = {
						object_id:this.id,
						object_type:this.type,
						content:this.inputValue,
						parent_id:this.parent_id,
						community_id:uni.getStorageSync('community_id')
					}
					if(this.type == 7 || this.type == 5){
						data.third_id = this.id;
					}
		
					this.Api.setComments(data).then((result) => {
						if(result.code == 1){
							this.navIndex = 1
							uni.showToast({
								title: result.msg,
								duration: 2000,
								success: () => {
									// this.inputValue = ''
									// this.parent_id = ''
									// this.replyFlag = true
									// this.parent_text = '说说你的看法'
									// this.getCommentList()
									this.replyTextarea = false
									this.textareaautofocus = false
									this.scrollFixed = false
									this.inputValue = ''
									this.parent_id = ''
									this.replyFlag = true
									this.parent_text = '说说你的看法'
									if(result.data.add){
										this.add_type = result.data.add == -1 ? '-' : '+'
										this.score_text = result.data.score
										this.$refs.integraltip.show()
										setTimeout(()=>{
											this.add_type = ''
											this.score_text = ''
											
											this.$refs.integraltip.close()
											this.getCommentList()
										},2000)
									}else{
										this.getCommentList()
									}
								}
							});
						}
					})
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
				this.Api.pactivityDetail({object_id:this.id,object_type:this.type}).then((result) =>{
					if(result.code == 1){
						if(!result.data.id){
							// uni.redirectTo({
							// 	url:'/pages/index/404'
							// })
							this.$refs.deletetip.deleteShow = true
							
							return
						}
						this.detail = result.data
						if(this.detail.admin_id){
							this.config.title = this.publishType(this.detail.committee.type) + '活动'
						}
						this.detail.content = this.detail.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"')
						this.detail.images = []
						if(this.detail.image.length){
							this.detail.images.push(this.detail.image)
						}else{
							this.detail.images.push('https://sq.wenlinapp.com/appimg/act_post.png')
						}
						if(result.data.join_start_time == result.data.join_end_time){
							this.detail.join_time = result.data.join_end_time ? Tool.dateFormat('YY-mm-dd',result.data.join_end_time) : 0
						}else{
							this.detail.join_time = result.data.join_start_time ? Tool.dateFormat('YY-mm-dd',new Date(result.data.join_start_time * 1000)) + ' 至 '+Tool.dateFormat('YY-mm-dd',new Date(result.data.join_end_time * 1000)) : 0
						}
						this.loading = false
						this.$forceUpdate()
						// this.getCommentList()
						if(this.detail.activity_type == 1){
							this.navIndex = 3
							this.getJoinUserList()
						}else if(this.detail.activity_type == 2){
							this.navIndex = 4
							this.getCommentList()
						}
						
						if(this.srouce){
							console.log('d2')
							this.autoShare()
						}
					}
				})
			},
			swiperChange(e) {
				this.swiperIndex = e.detail.current + 1
			},
			//收藏处理
			moreClick(){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				this.findFaultType = this.detail.type
				this.findFaultCollect = this.detail.user_favorite == 0 ? false : true
				this.findFaultValue = true
			},
			//找错处理
			fFind(e){
				
			},
			fClose(){
				this.findFaultValue = false
			},
			//评论回复操作
			replyHandler(e){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				this.replyFlag = false
				this.parent_id = e.id
				this.parent_text = '回复'+e.user.user_nickname
				this.replyTextarea = true
				this.textareaautofocus = true
				this.scrollFixed = true
				// parent_id:'',
				// parent_text:'说说你的看法',
			},
			//帮助处理
			helpPush(){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				this.$getMyscore((res) => {
					if(res.code == 1){
						this.navIndex = 2
						this.getCommentList()
						this.score = res.data.score
						if(this.score == 0){
							
							uni.showToast({
								title: '您的积分不足，请参加积分任务',
								icon:'none',
								duration: 2000,
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:'/pages/update/integral'
								})
							},2000)
					
						}else{
							this.helpShow = true
						}
					}
				})
			},
			Helpcancel(){
				this.helpShow = false
			},
			ok(e){
				var score = this.$refs.Help.inputValue
				if(!score){
					uni.showToast({
						title: '请输入帮推积分',
						icon:'none',
						duration: 2000,
					})
					return
				}
				var data = {
					object_id:this.detail.id,
					object_type:5,
					community_id:uni.getStorageSync('community_id'),
					score:score
				}
				//
				// if(this.helpObj.type == 7 || this.helpObj.type == 5){
				// 	data.dynamics_id = this.helpObj.id
				// }
				this.Api.communityDynamicsPushDynamics(data).then((result) => {
					if(result.code == 1){
						this.navIndex = 2
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								this.add_type = result.data.add == -1 ? '-' : '+'
								this.score_text = result.data.score
								this.$refs.Help.inputValue = 0
								this.helpShow = false
								this.$refs.integraltip.show()
								setTimeout(()=>{
									this.add_type = ''
									this.score_text = ''
									this.$refs.integraltip.close()
		
								},2000)
								
							}
						});
					}else{
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								
							}
						});
					}
				})
			},
			// 分享弹窗
			shareClick(e){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}else{
					var token = uni.getStorageSync('token')
					var all_community = uni.getStorageSync('all_community')
					if(!token && all_community.length == 0 || token && all_community.length == 0){
						this.$refs.confrims.text = '精彩活动，登录问邻即可报名'
						this.$refs.confrims.id = -1
						this.$refs.confrims.guestShow = true
						return
					}
				}
				this.findFaultObject = this.detail
				this.onShareShow = true
			},
			onShowclose(){
				this.onShareShow = false
			},
			onShowtodo(){
				this.scrollFixed = true
				var pages = getCurrentPages() //获取加载的页面
				
				var currentPage = pages[pages.length-1] //获取当前页面的对象
				console.log(currentPage.route)
				// return
				var data = {}
				if(this.dynamics_id){
					data = {
						scene:'id='+this.id+'&type='+this.type+'&d_id='+this.dynamics_id,
						page:currentPage.route
					}
				}else{
					data = {
						scene:'id='+this.id+'&type='+this.type,
						page:currentPage.route
					}
				}
		
				this.Api.getWXACodeUnlimit(data).then((result) => {
					if(result.code == 1){
						this.$nextTick(() => {
							this.onShareShow = false
							this.posterData.posterImgUrl =  this.findFaultObject.images.length ? this.findFaultObject.images[0] : 'https://sq.wenlinapp.com/appimg/share500400.jpg'
							if(this.type == 7 || this.type == 8 || this.type == 5) {
								this.posterData.title =  this.findFaultObject.title
							}else{
								this.posterData.title = this.findFaultObject.content
							}
							if(this.posterData.title.length > 35){
								this.posterData.title = this.posterData.title.substr(0,35)+'...'
							}
							this.posterData.avatarUrl = uni.getStorageSync('user').avatar
							this.posterData.posterCodeUrl = result.data
							this.posterData.des =  uni.getStorageSync('user').user_nickname+'给你分享了一个'+Tool.resultValue(this.type)+'信息'
							this.$forceUpdate()
							setTimeout(()=>{
								this.canvasFlag=false;//显示canvas海报
								this.deliveryFlag = false;//关闭分享弹窗
								this.$refs.hchPoster.posterShow()
							},500)
							
						
						})
						
					}else{
						this.scrollFixed = false
					}
				})
				
				
			},
			canvasCancel(val){
				this.scrollFixed = false
				this.canvasFlag=val;
			},
			onShowshare(){
				this.findFaultValue = false
				this.onShareShow = false
			},
			condelHandler(e){
				if(e == -1){
					var url = '/pages/index/cdetail?dynamics_id='+this.dynamics_id+'&type='+this.type+'&id='+this.id
					uni.setStorageSync('url',url)
					uni.reLaunch({
						url:'/pages/index/index'
					})
					return
				}
				var data = {
					id: e
				};
				this.Api.delComments(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								this.$refs.confrims.guestShow = false
								this.getCommentList();
							}
						});
					}
				});
			}
		},
		components:{
			UserHeader,
			Comment,
			navigationCustom,
			emotion,
			FindFault,
			Onshare,
			hchPoster,
			Help,
			Integraltip,
			Nodata,
			Firend,
			Confrimpop,
			DeleteTip
		},
		computed:{
			imgIndex () {
				return this.swiperIndex +'/'+ this.detail.images.length
			},
			autoStyle() {
				//tojoin：1可报名 0不可报名 status：1、立即报名，2、已报名，3、报名人数已满,4、报名未开始，5、报名已结束，6、没有设置报名时间，状态为活动预告
				if(this.detail.status == 3 || this.detail.status == 5){
					return true
				}else{
					return false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dpo{
		margin-top:20upx;
		font-size: 30upx;
		font-weight: 500;
		color: #999;
		line-height: 40upx;
		text-align: left;
	}
	page{
		background: white;
	}
	.helpdetailfix{
		overflow: hidden;
		height:100vh;
	}
	.helpdetail{
		display: flex;
		flex-direction: column;
		background: white;
		min-height: 100vh;
		.content{
			display: flex;
			flex-direction: column;
			padding:10upx 24upx 300upx 24upx;
			box-sizing: border-box;
			min-height: 100vh;
			.posttitle{
				width:100%;
				font-size:40upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:52upx;
				text-align: left;
			}
			.postpush{
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				width:100%;
				// height:40upx;
				margin-bottom: 5upx;
				.t1{
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,1);
					line-height:60upx;
					margin-right:20upx;
					width: fit-content;
				}
				.t2{
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(153,153,153,1);
					line-height:60upx;
					width:fit-content;
				}
				.t3{
					width:38upx;
					height:40upx;
					margin-left:auto;
				}
				.t4{
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,1);
					line-height:60upx;
					margin-left:8upx;
				}
			}
			.alist{
				display: flex;
				flex-direction: column;
				margin-bottom: 14upx;
				.aitem{
					display: inline-flex;
					flex-direction: row;
					.aitem1{
						margin-right:10upx;
						width:36upx;
						height:36upx;
						margin-bottom: 10px;
					}
					.name,.label{
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:40upx;
						margin-right:15upx;
					}
					.label{
						width: fit-content;
						max-width:120upx;
					}
					.name{
						text-align: left;
						max-width:calc(100% - 185upx);
						margin-right:0;
					}
					.namec{
						color:#FF9C00;
						display:flex;
						flex-direction: column;
					}
				}
		
			}
			.postcontent {
				position: relative;
				display: flex;
				flex-direction: column;
				width:100%;
				padding-bottom: 28upx;
				font-family: PingFang-SC-Regular;
				.postkey{
					font-size:40upx;
					font-family:PingFang-SC-Regular,PingFang-SC-Bold,PingFang-SC;
					// font-weight:bold;
					color:rgba(51,51,51,1);
					line-height:52upx;
					margin-bottom: 20upx;
					align-items: left;
					display: flex;
					justify-content: flex-start;
				}
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
				.contentmore{
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					margin-top:16upx;
					.moreico{
						width:36upx;
						height:34upx;
						margin-right:10upx;
					}
					.moretext{
						height:32upx;
						font-size:22upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						line-height:32upx;
					}
				}
			}
			.postcontent::after{
				position: absolute;
				content:'';
				left:-24upx;
				width:calc(100% + 48upx);
				bottom: 0upx;
				height: 20upx;
				background-color: rgba(222,222,222,0.3);
			}
			.limit-postcontent{
				height:80upx;
				overflow: hidden;
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
				// height:480upx;
				// border-radius: 16upx;
				// overflow: hidden;
				// position: relative;
				margin-bottom: 24upx;
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
				// .screen-swiper{
				// 	width:100%;
				// 	height:100%;
				// 	// border-radius: 16upx;
				// 	overflow: hidden;
					.swiper-imgs{
						width:100%;
						height:100%;
						// border-radius: 16upx;
						overflow: hidden;
					}
				//}
			}
			.detail-title{
				width:100%;
				font-size:40upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				// font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:52upx;
			}
			.detailnav{
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-top:32upx;
				.navitem{
					// min-width: 128upx;
					height:50upx;
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					// font-weight:bold;
					color:rgba(153,153,153,1);
					line-height:50upx;
					margin-right:32upx;
					padding-right:32upx;
					border-right:2upx solid rgba(216,216,216,0.6);
				}
				.active{
					color:#333333;
				}
				.navitem:last-child{
					margin-right:32upx;
					padding-right:32upx;
					border-right:2upx solid transparent;
				}
			}
			.detailcontent{
				display: flex;
				flex-direction: column;
				/deep/ .nodata{
					margin-top:300upx;
				}
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
									background:#08C299;
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
										color:white;
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
								text-align: left;
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
						.jointe{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:34upx;
						}
					
					}
				}
			}
		}
		.signup{
			position: fixed;
			bottom: 158upx;
			left:24upx;
			width:702upx;
			height:80upx;
			background:rgba(255,156,0,1);
			box-shadow:0px 8upx 16upx 0px rgba(225,138,0,0.1);
			border-radius:40upx;
			font-size:36upx;
			font-family:PingFang-SC-Bold,PingFang-SC;
			font-weight:bold;
			color:white;
			line-height: 80upx;
			text-align: center;
		}
		.signupfix{
			background:rgba(153,153,153,1);
			box-shadow:0px 8upx 16upx 0px rgba(0,0,0,0.1);
			border-radius:40px;
		}
		.replymb {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba($color: #000000, $alpha: 0.6);
			z-index: 98;
		}
		.reply {
			display: flex;
			flex-direction: column;
			justify-content: center;
			position: fixed;
			padding: 20upx 24upx 20upx 24upx;
			left: 0;
			bottom: 0;
			width: 100%;
			min-height: 100upx;
			background: white;
			box-shadow: 0upx 12upx 20upx 0upx rgba(0, 0, 0, 0.4);
			// box-shadow:0px -1px 0px 0px rgba(238,238,238,1);
			z-index: 100;
			.inputrow {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.inputbtn {
					width: 100upx;
					text-align: right;
					margin-left: auto;
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(255, 156, 0, 1);
				}
				.inputwrap {
					width: 100%; //420upx
					min-height: 100upx;
					background: rgba(234, 234, 234, 0.3);
					border-radius: 30upx;
					position: relative;
					.face {
						width: 45upx;
						height: 45upx;
						position: absolute;
						right: 22upx;
						top: 50%;
						transform: translateY(-50%);
					}
					textarea {
						width: 100%;
						padding: 20upx;
						height:200upx;
						box-sizing: border-box;
						font-size: 30upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						color: #333333;
					}
				}
				.inputwrapinit{
					width: 520upx; //420upx
					height: 100upx;
					background: rgba(234, 234, 234, 0.3);
					border-radius: 50upx;
					position: relative;
					input{
						width:100%;
						height:100upx;
						padding-left:30upx;
						box-sizing: border-box;
						line-height: 100upx;
					}
				}
				.inputwrap-fix {
					width: 85%;
				}
				.pushwrap {
					font-size: 22upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(255, 156, 0, 1);
					line-height: 48upx;
					width: 48upx;
					height: 48upx;
					position: relative;
					.pushico {
						width: 48upx;
						height: 48upx;
						margin-right: 8upx;
					}
					.pushtext {
						position: absolute;
						left: 40upx;
						top: 0;
						font-size: 20upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(255, 156, 0, 1);
						line-height: 28upx;
					}
				}
				.sharewrap {
					font-size: 22upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					line-height: 32upx;
					display: flex;
					align-items: center;
					.shareico {
						width: 48upx;
						height: 48upx;
						margin-right: 8upx;
					}
				}
			}
			.wrapc {
				display: flex;
				flex-direction: row;
				height: 100upx;
				align-items: center;
				.face {
					width: 45upx;
					height: 45upx;
					margin-left: auto;
					margin-right: 45upx;
				}
				.inputbtn {
					width: 120upx;
					height: 70upx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 10upx;
					text-align: right;
					font-size: 34upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: white;
					background: rgba(255, 156, 0, 1);
				}
			}
			.emowrap {
				padding-top: 24upx;
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
		.shareswrap{
			position: fixed;
			left:0;
			top:0;
			width: 100%;
			height:100%;
			z-index: 5000;
			.sharecontent{
				position: fixed;
				left:0;
				bottom: 0;
				width:100%;
				height:100%;
				background: rgba(255,255,255,0.6);
				z-index: 5001;
				.sharewc{
					display: flex;
					flex-direction: column;
					position: fixed;
					left:0;
					bottom: 0;
					width:100%;
					height:500upx;
					padding-top:30upx;
					box-sizing: border-box;
					background: rgba(255,255,255,0.9);
					.t1{
						font-size: 32upx;
						display: inline-block;
						padding-left:20upx;
						padding-right:20upx;
						text-align: center;
					}
					.wbtns{
						width:200upx;
						height:80upx;
						background:#ff9c00;
						color:white;
						font-size: 40upx;
						text-align: center;
						line-height: 80upx;
						border-radius: 10upx;
						margin:40upx auto;
						
					}
				}
			}
		}
	}
</style>
