<template>
	<!-- 帮推详情 -->
	<view :class="['u-skeleton', 'helpdetail', srouceShow == true ? 'helpdetailfix' : '', scrollFixed ? 'helpdetailfix' : '']">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="detailcontent">
			<UserHeader :type.sync="type" :pitem.sync="detail" @moreClick="moreClick" @goPer="goPer" v-if="type != 8" />
			<view class="postheader" style="display: none;">
				<view class="userinfo">
					<view class="userwrap">
						<text class="name">{{ detail.title }}</text>
					</view>
					<view class="usertime">{{ detail.create_time | formatTime }}</view>
				</view>
				<view class="morewrap" @click="moreClick"><image src="../../static/more.png" class="more"></image></view>
			</view>
			<view :class="['content', type == 7 ? 'contentfix' : '']">
				<view class="dalist" v-if="detail.type == 6">
					<view class="daitem" v-for="(item, index) in skillList" :key="index" :index="index">{{ item }}</view>
				</view>
				<view class="sellwrap" v-if="detail.type == 3">
					<view class="sellinfo">
						<text class="t1">{{ detail.sell_type | sellType }}</text>
						|
						<text class="t2" v-if="detail.sell_type != 4">￥{{ detail.sell_type == 2 ? 0 : detail.sell_price }}</text>
						<text class="t2" v-if="detail.sell_type == 4">{{ detail.exchange_score != 0 ? detail.exchange_goods : detail.exchange_score }}</text>
					</view>
				</view>
				<view class="posttitle" v-if="detail.title && type == 7">{{ detail.title }}</view>

				<view class="postcontent" v-if="type != 7 && type != 8">
					<!-- 	<text class="postcate">#{{Tool.resultValue(detail.type)}}</text> -->
					<text class="postdes">{{ detail.content }}</text>
				</view>
				<view class="posttitle" v-if="detail.title && type == 8">{{ detail.title }}</view>
				<view class="posttimefovr" v-if="type == 8">
					<text class="t2" @click="goComitee(detail.committee.committee_id)">{{ detail.committee.title }}</text>
					<text class="t3">{{ detail.create_time | formatTime }}</text>
					<view class="sc" @click="fCollect">
						<image class="scimg" :src="detail.user_favorite == 0 ? '../../static/collect.png' : '../../static/collected.png'"></image>
						<text class="sc_text">{{ detail.user_favorite == 0 ? '收藏' : '已收藏' }}</text>
					</view>
				</view>
				<view class="postcontent postcontentfix" v-if="type == 7 || type == 8">
					<!-- 	<text class="postcate">#{{Tool.resultValue(detail.type)}}</text> -->
					<view class="contentmb" v-if="detail.contacts">
						<text v-for="(item, index) in detail.contacts" :key="index" @click="mobilecall(item.phone)">
							{{ item.name }}
							<text class="mobile">{{ item.phone }}</text>
						</text>
					</view>
					<view class="addresstext" @click="getMap" v-if="detail.address">{{ detail.city + detail.area + detail.address }}</view>
					<rich-text :nodes="detail.content" />
				</view>
<!-- 				<view class="phonewrap" @click="openWxsj" v-if="autoMobileOpen" style="display: none;">
					{{ detail.user.user_nickname.length > 6 ? new String(detail.user.user_nickname).substring(0, 5) + '...' : detail.user.user_nickname }}的联系方式
				</view> -->
				<view :class="['swiper-wrap', type == 7 || type == 8 ? 'swiper-wrap-fix' : '']" v-if="detail.images.length">
					<!-- 				<swiper class="screen-swiper" :circular="true" @change="swiperChange"
				 :autoplay="true" interval="5000" duration="500">
					<swiper-item v-for="(item,index) in detail.images" :key="index" @click="previewImage(index)"> -->
					<!-- :src="item" -->
					<view class="swiper-imgs" mode="widthFix" v-for="(item, index) in detail.images" :key="index" @click="previewImage(index)">
						<u-image :src="item" mode="widthFix"></u-image>
					</view>
					<!-- 					</swiper-item>
				</swiper>
				<view class="imgIndex">{{imgIndex}}</view> -->
					<view class="dpo" v-if="type == 8">{{ detail.post_hits }}人浏览</view>
				</view>
				<view class="votelistwrap">
					<view class="voteitem" v-for="(item,index) in detail.vote_list" :key="index">
						<view class="votetitle" @click.stop="lookVodetail(item)">
							{{item.vote_title}}
						</view>
						<view class="voteprogess" @click.stop="lookVodetail(item)">
							<u-line-progress height="30" :show-percent="false" active-color="#FF9C00" inactive-color="#F5F6FA" :percent="item.vote_percent * 100"></u-line-progress>
							<view class="votetext">
								{{(item.vote_percent * 100).toFixed(2) }}%
							</view>
						</view>
						<view class="votetool">
							<view class="votetoolitem" @click.stop="lookVodetail(item)" >
								{{item.vote_num}}票
							</view>
							<view class="votetoolitem" @click.stop="lookVodetail(item)">
								<image src="../../static/a2.png" class="voteico"></image>
								<view class="votedes">
									{{item.comment_count}}
								</view>
							</view>
							<view class="votetoolitem" @click.stop="votoTodo(item)">
								<image :src="item.is_vote == 0 ? require('../../static/vite.png') : require('../../static/voteactive.png')" class="voteicos"></image>
								<view class="votedes">
									{{item.is_vote == 0 ? '投票' : '已投'}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 添加观点 -->
				<image src="../../static/pushb-a.png" class="addVote" @click.stop="addVoteHandler"></image>		
				<view class="detailnav" v-if="false">
					<text :class="['navitem', navIndex == 1 ? 'active' : '']" @click="navClick(1)">评论{{ detail.comment_count ? detail.comment_count : '' }}</text>
					<text :class="['navitem', navIndex == 2 ? 'active' : '']" @click="navClick(2)">帮推{{ detail.help_score ? detail.help_score : '' }}</text>
				</view>
				<view class="detailcontent u-skeleton-fillet"  v-if="false">
					<Comment
						v-if="navIndex == 1"
						:type="type"
						v-for="(item, index) in commentList"
						:key="index"
						:pitem="item"
						@reply="replyHandler"
						@flover="floverHandler"
						@del="delHandler"
						@thank="thankHandler"
						@goPer="goPerHandler"
					/>
					<view class="headerItem" v-if="navIndex == 2" v-for="(item, index) in commentList" :key="index">
						<view class="userheader">
							<image :src="item.user.avatar" class="useravatar"></image>
							<view class="userlist">
								<view class="usertop">
									<text class="username">
										{{ item.user.user_nickname }}·{{ ucommunityid == item.user.community_id ? item.user.building + '#' : item.user.community_name }}
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

							<text class="flovertext">{{ item.score }}</text>
						</view>
					</view>
		<!-- 			<Nodata v-if="nodataFlag" :text.sync="nodatatext" /> -->
				</view>
			</view>
		</view>
		<!-- 回复框 -->
		<view class="reply" v-if="false">
			<view class="inputrow">
				<view class="inputwrap inputwrapinit" @click="replyInit"><input maxlength="500" type="text" :disabled="true" :placeholder="parent_text" /></view>
				<view class="pushwrap" @click="helpPush">
					<image :src="detail.user_help == 1 ? '../../static/push-a.png' : '../../static/push.png'" class="pushico"></image>
					<text :class="['pushtext',detail.user_help == 1 ? 'pushtextActive' : '']">{{ detail.help_score }}</text>
				</view>
				<view class="sharewrap" @click="shareClick">
					<image src="../../static/forward.png" class="shareico"></image>
					<view class="sharetext">
						分享
					</view>
				</view>
			</view>
		</view>
		<view class="replymb" v-if="replyTextarea" @click="closeReplyInit"></view>
		<view class="reply" v-if="replyTextarea" :style="{ bottom: autoBottom + 'px' }">
			<view class="inputrow">
				<view class="inputwrap">
					<textarea
						:adjust-position="adjustposition"
						maxlength="500"
						type="text"
						:placeholder="parent_text"
						:focus="!replyFlag"
						:fixed="true"
						:show-confirm-bar="showconfirmbar"
						v-model="inputValue"
						:auto-focus="textareaautofocus"
						:hold-keyboard="textareaautofocus"
						@focus="InputFocus"
						@blur="InputBlur"
						@confirm="inputValueHander"
						bindkeyboardheightchange="keyboardHandler"
					/>
				</view>
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
		<!-- 电话 -->
		<view class="wpwrap" v-if="autoMobileOpen">
			<image :src="imgURl + 'weixinico.png'" class="wpico" @click="copy(2)"   v-if="detail.weixin"></image>
			<image :src="imgURl + 'phoneico.png'" class="wpico" @click="copy(1)" v-if="detail.mobile"></image>
		</view>
		<view class="popup" v-if="wxsj">
			<view class="mb" @click="closewxsj"></view>
			<view class="wxsjcontent">
				<view class="mobile" @click="copy(1)" v-if="detail.mobile">
					<text>手机号</text>
					<text>{{ detail.mobile }}</text>
					<text>拔打</text>
				</view>
				<view class="mobile" @click="copy(2)" v-if="detail.weixin">
					<text>微信号</text>
					<text>{{ detail.weixin }}</text>
					<text>复制</text>
				</view>
			</view>
		</view>

		<!-- 挑错 -->
		<LeaveWords
			:messageValue.sync="messageText"
			:typeFlag.sync="typeFlag"
			:messageShow.sync="messageShow"
			@textareaBlur="textareaBlur"
			@closeMessage="closeMessage"
			@submitTodo="submitTodo"
		/>

		<!-- 找错 -->
		<FindFault  @del="deleteDynamics" :pitem="detail"  :isShow="findFaultValue" :isCollect="findFaultCollect" :isType="findFaultType" @close="fClose" @collect="fCollect" @find="fFind" @report="report" @onshare="onShowshare" />
		<!-- 答谢 -->
		<Thank ref="thank" :isShow="thankShow" @close="cancel" @ok="ok" :score="score" />
		<!-- 帮推 -->
		<Help ref="Help" :isShow="helpShow" @close="Helpcancel" @ok="helpOk" :score="score" />
		<!-- 分享 -->
		<!-- 分享功能 -->
		<Onshare :isShow="onShareShow" :isHome.sync="isHome" @close="onShowclose" @onsend="onsend" @ontodo="onShowtodo" @onshare="onShowshare" />
		<!-- 分享 -->
		<!-- <hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/> -->
		<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />
		<view :hidden="canvasFlag">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas>
			<!-- 海报 -->
		</view>
		<view class="shareswrap" v-if="srouceShow">
			<view class="sharecontent">
				<view class="sharewc">
					<text class="t1">{{ srouceText }}</text>
					<text class="wbtns" @click="goHomeIndex">{{ srouceBtnText }}</text>
				</view>
			</view>
		</view>
		<!-- 积分提示 -->
		<Integraltip ref="integraltip" :types.sync="add_type" :score.sync="score_text" />
		<Firend ref="Firend" />
		<Confrimpop ref="confrims" @del="condelHandler" />
		<DeleteTip ref="deletetip" />
		<u-skeleton :loading="loading" :animation="true" el-color="#ddd" bg-color="#fff" border-radius="10"></u-skeleton>
		<u-popup v-model="voteFlag" mode="center" border-radius="10" closeable>
			<view class="votepopup">
				<view class="votitle">
					{{voteType == 'vote' ? '投票' : '添加我的观点' }}
				</view>
				<u-input height="158" v-model="votetextarea" :placeholder="voteType == 'vote' ? '顺便说点理由' : '每个人最多添加3次'" type="textarea"/>
				<view v-if="voteType == 'commit'" class="selectwrap" @click.stop="selectTodo('name')">
					<view class="label">{{nameLabel}}</view>
					<u-icon color="#95A0B6" name="arrow-down-fill" size="20" ></u-icon>
				</view>
				<view class="btnwrap">
					<view v-if="voteType == 'vote' " class="btn" @click.stop="voteFlag = false">
						取消
					</view>
					<view :class="['btn','confirm',voteType == 'commit' ? 'widthFix' : '']" @click.stop="voteHandler">
						确定
					</view>
				</view>
			</view>
		</u-popup>
		<SelectItem :list="nameList" :type="selectType" :isShow="nameShow" @select="selectHandler" @close="nameShow = false"/>
		<Confrimpops ref="dconfrims" @del="condelHandlers" />
	</view>
</template>

<script>
import Reply from '@/components/reply/reply.vue';
import Nodata from '@/components/nodata/nodata.vue';
import Thank from '@/components/thank/thank.vue';
import Help from '@/components/help/help.vue';
import LeaveWords from '@/components/leavewords/leavewords.vue';
import Onshare from '@/components/onshare/onshare.vue';
import Firend from '../../components/onfirend/onfirend.vue';
import FindFault from '@/components/findFault/findFault.vue';
import emotion from '@/components/bkhumor-emoji/index.vue';
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
import UserHeader from '@/components/userHeader/userheader.vue';
import Comment from '@/components/comment/comment.vue';
import Tool from '../../utils/tool.js';
import hchPoster from '../../wxcomponents/hch-poster/hch-poster.vue';
import Integraltip from '@/components/integraltip/integraltip.vue';
import Confrimpop from '@/components/confrim/confrim.vue';
import Confrimpops from '@/components/confrim/confrim.vue';
import DeleteTip from '@/components/deletetip/deletetip.vue';
import SelectItem from '@/components/selectitem/selectitem.vue'
export default {
	data() {
		return {
			imgURl:this.Config.minUrl,
			//表情配置
			windowHeight: 0, //记录界面高度
			containerHeight: 0, //记录未固定整体滚动界面的高度
			containerBottomHeight: 0, //记录未固定整体滚动界面距离底部高度
			keyboardHeight: 0, //键盘高度
			autoBottom: 0,
			showconfirmbar: false,
			adjustposition: false,
			textareaautofocus: false,
			isShowEmj: false,
			emojiIcon: 'cuIcon-emoji',
			inputValue: '',
			config: {
				title: '详情', //title
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
			wxsj: false,
			cardCur: 0,
			swiperIndex: 1,
			swiperList: [],
			dotStyle: false,
			towerStart: 0,
			direction: '',
			navIndex: 1,
			id: '',
			detail: {
				images: [],
				community: {},
				user: {}
			},
			commentList: [],
			parent_id: '',
			parent_text: '说说你的看法',
			community_id: '',
			findFaultType: 1,
			findFaultCollect: false,
			findFaultObject: {},
			findFaultValue: false,
			replyFlag: true, //回复开启
			total: 0,
			page: 1,
			page_size: 10,
			type: '',
			messageShow: false,
			messageText: '',
			typeFlag: true,
			deliveryFlag: false,
			canvasFlag: true,
			posterData: {
				marginLR: 30,
				marginTB: 80,
				radius: 0.03,
				innerLR: 20,
				innerTB: 20,
				posterRatio: 1.3,
				posterImgUrl: '',
				title: '',
				titleFontSize: 15,
				desFontSize: 14,
				desLineHeight: 22,
				titleLineHeight: 24,
				posterCodeUrl: 'https://sq.wenlinapp.com/upload/share/20200821/20200821233746683.png',
				codeWidth: 0.22,
				codeRatio: 1,
				codeRadius: 0.5,
				codeMT: 15,
				codeName: '问邻',
				codeNameMT: 15,
				tips: '长按/扫描识别进入贴子',
				posterBgUrl: '',
				avatarUrl: uni.getStorageSync('user').avatar,
				des: ''
			},
			dynamics_id: '',
			thankShow: false,
			onShareShow: false,
			isSelf: false, //是否是自己
			helpShow: false,
			score: 0,
			user_id: '',
			srouce: 0, //分享来源，
			opening: 0, //0 本小区可见 1所有小区可见
			srouceShow: false,
			srouceText: '提示您尚未登录，请登录后操作',
			srouceCommunity_id: '',
			srouceCommunity_text: '',
			srouceBtnText: '登录',
			skillList: [],
			scrollFixed: false,
			add_type: '',
			score_text: '',
			query: '',
			author: '',
			ucommunityid: uni.getStorageSync('community_id'),
			nodataFlag: false,
			nodatatext: '暂无评论',
			simpleFlag: false,
			replyTextarea: false,
			isHome: true,
			loading: true,
			voteFlag:false,
			votetextarea:'',
			voteobj:{},
			voteType:'vote',
			nameList:[
				{value:0,name:'实名发布',check:false},
				{value:1,name:'匿名发布',check:true}
			],
			nameLabel:'匿名发布',
			selectType:'name',
			nameShow:false
		};
	},
	mounted() {
		console.log(this.$mp.query);
		var singPage = uni.getStorageSync('singPage');
		var that = this;
		if (singPage == 0) {
			var auth = new Promise(function(resolve, reject) {
				var token = uni.getStorageSync('token');
				var all_community = uni.getStorageSync('all_community');
				if (!token && !all_community) {
					uni.login({
						success: res => {
							let { errMsg, code } = res;
							if (errMsg == 'login:ok') {
								that.Api.wechatAuth({ code: code }).then(result => {
									if (result.code == 1) {
										uni.setStorageSync('token', result.data.token);
										uni.setStorageSync('user', result.data.user);
										uni.setStorageSync('maxJoin', result.data.max_join);
										uni.setStorageSync('mobile', result.data.user.mobile);
										uni.setStorageSync('all_community', result.data.all_community.length ? result.data.all_community : []);
										resolve();
									}
								});
							}
						}
					});
				} else {
					resolve();
				}
			});
			auth.then(status => {
				var token = uni.getStorageSync('token');
				var all_community = uni.getStorageSync('all_community');
				that.loginTodoHander();
			});
		} else {
			that.loginTodoHander();
		}
	},
	onReachBottom(e) {
		if (this.total > 1) {
			if (this.total > this.page) {
				this.page++;
				this.getCommentList(true);
			}
		}
	},
	onPullDownRefresh(e) {
		this.getDetailAll();
	},
	onPageScroll: function(e) {},
	onShareAppMessage: function() {
		if (this.detail.publish_type == 2 || this.detail.publish_type == 3) {
			return {
				title: this.detail.title,
				imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
				path: '/pages/update/ysdetail?srouce=1&id=' + this.id + '&type=' + this.type + '&dynamics_id=' + this.dynamics_id
			};
		} else if (this.detail.publish_type == 1) {
			var content = this.detail.content
			if(this.detail.sell_type && this.detail.sell_type == 2){
				content = '赠送:'+content
			}
			return {
				title: content.length > 30 ? content.substr(0, 30) + '...' : content,
				imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
				path: '/pages/update/ysdetail?srouce=1&id=' + this.id + '&type=' + this.type + '&dynamics_id=' + this.dynamics_id
			};
		} else {
			return {
				title: this.detail.title,
				imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
				path: '/pages/update/ysdetail?srouce=1&id=' + this.id + '&type=' + this.type + '&dynamics_id=' + this.dynamics_id
			};
		}
	},
	onShareTimeline(e) {
		var title = '';
		if (this.detail.publish_type == 1) {
			var content = this.detail.content
			if(this.detail.sell_type && this.detail.sell_type == 2){
				content = '赠送:'+content
			}
			title = content.length > 30 ? content.substr(0, 30) + '...' : content;
		} else {
			title = this.detail.title;
		}
		var query = {};
		if (this.type == 7 || this.type == 8) {
			query.id = this.id;
			query.type = this.type;
			query.dynamics_id = this.dynamics_id;
		} else {
			query.id = this.id;
			query.type = this.type;
		}
		// query=JSON.stringify(query);
		return {
			title: title,
			imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
			query: query
		};
	},
	methods: {
		deleteDynamics(obj){
			console.log(obj)
			this.$refs.dconfrims.guestShow = true
			this.$refs.dconfrims.id = obj.id
			this.$refs.dconfrims.type = obj.type
			this.$refs.dconfrims.obj = obj
			this.$refs.dconfrims.text = '是否删除本贴?'
		},
		condelHandlers(obj){
			console.log(obj)
			var pitem = obj
			var object_id = pitem.id
			var type = pitem.type
			var object_type = pitem.type
			// if (type == 5) {
			// 	object_id = pitem.object_id	
			// } else {
			
			// 	if (type == 7 || type == 8) {
			// 		if(type == 8){
			// 			object_id = pitem.object_id	
			// 		}else{
			// 			object_id = pitem.wiki_id
			// 		}
			// 	} else if(type == 16){
			// 		object_id = pitem.object_id	
			// 	}else if(type == 17){
			// 		object_id = pitem.object_id	
			// 	}else{
			// 		object_id = pitem.object_id	
			// 	}
			// }
			this.Api.deleteDynamics({object_type:object_type,object_id:object_id,community_id:uni.getStorageSync('community_id')}).then((result) => {
				if(result.code == 1){
					uni.showToast({
						icon:'success',
						title:result.msg,
						duration:2000,
						success: () => {
							this.$refs.dconfrims.guestShow = false
							this.findFaultValue = false
							uni.reLaunch({
								url:'/pages/index/index'
							})
						}
					})
				}
			})
		},
		lookVodetail(item){
			uni.navigateTo({
				url: 'ysvdetail?vote_id=' + item.vote_id+'&type='+this.detail.type
			});
		},
		addVoteHandler(){
			this.voteType = 'commit'
			this.voteFlag = true
		},
		selectTodo(value){
			this.nameShow = true
		},
		selectHandler(item){
			this.nameList.map((sitem) => {
				if(sitem.name == item.name){
					this.nameLabel = sitem.name
					sitem.check = true
				}else{
					sitem.check = false
				}
			})
			this.nameShow = false
		},
		voteHandler(){
			if(this.voteType == 'vote'){
				var data = {
					dynamics_id:this.dynamics_id,
					community_id:this.detail.community_id,
					title:this.votetextarea,
					vote_id:this.voteobj.vote_id,
					anonymous:1
				}
				// this.nameList.map((item)=>{
				// 	if(item.check){
				// 		data.anonymous = item.value
				// 	}
				// })
				this.Api.vote(data).then((result)=>{
					if(result.code == 1){
						this.getDetailAll()
						this.votetextarea = ''
						this.voteFlag = false
					}else{
						return this.$u.toast(result.msg)
					}
				})
			}else{
				var data = {
					dynamics_id:this.dynamics_id,
					community_id:this.detail.community_id,
					vote_title:this.votetextarea
				}
				this.nameList.map((item)=>{
					if(item.check){
						data.anonymous = item.value
					}
				})
				this.Api.addDynamicsVoteVote(data).then((result)=>{
					if(result.code == 1){
						this.getDetailAll()
						this.votetextarea = ''
						this.voteFlag = false
					}else{
						return this.$u.toast(result.msg)
					}
				})
			}
		},
		votoTodo(item){
			this.votetextarea = ''
			this.voteType = 'vote'
			this.voteobj = item
			if(this.voteobj.is_vote == 0){
				this.voteFlag = true
			}else{
				return this.$u.toast('您已投票')
			}
		},
		loginTodoHander() {
			if (this.$mp.query.scene) {
				this.srouce = 1;
				var scene = decodeURIComponent(this.$mp.query.scene);
				var arr = scene.split('&');
				if (arr[0]) {
					if (arr[0].split('=')[1]) {
						this.id = arr[0].split('=')[1];
					}
				}
				if (arr[1]) {
					if (arr[1].split('=')[1]) {
						this.type = arr[1].split('=')[1];
					}
				}
				if (arr[2]) {
					if (arr[2].split('=')[1]) {
						this.dynamics_id = arr[2].split('=')[1];
					}
				}

				this.getDetailAll();
			}

			if (this.$mp.query.type) {
				this.type = this.$mp.query.type;
			}
			if (this.$mp.query.dynamics_id) {
				this.id = this.$mp.query.dynamics_id;
				this.dynamics_id = this.$mp.query.dynamics_id;
				this.getDetailAll();
			}
			if (this.$mp.query.user_id) {
				this.user_id = this.$mp.query.user_id;
				this.community_id = this.$mp.query.community_id;
				this.getuserDetail();
			}
			if (this.$mp.query.srouce) {
				this.srouce = this.$mp.query.srouce;
			}
			this.query = this.$mp.query;
			if (this.type == 2) {
				this.config.title = '小区新鲜事';
			} else if (this.type == 5) {
				this.config.title = '小区新鲜事';
			} else {
				this.config.title = '小区' + Tool.resultValue(this.type);
			}
		},
		getMap() {
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
			var that = this;
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					uni.openLocation({
						//​使用微信内置地图查看位置。
						latitude: parseFloat(that.detail.latitude), //要去的纬度-地址
						longitude: parseFloat(that.detail.longitude), //要去的经度-地址
						name: '',
						address: that.detail.province + that.detail.city + that.detail.area + that.detail.address
					});
				}
			});
		},
		mobilecall(mobile) {
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
			uni.makePhoneCall({
				phoneNumber: mobile
			});
		},
		keyboardHandler(e) {
			var height = e.detail.height;
			if (this.autoBottom == height) {
				return;
			} else {
				this.autoBottom = height;
			}
		},
		replyInit() {
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
			this.replyTextarea = true;
			this.textareaautofocus = true;
			this.scrollFixed = true;
		},
		closeReplyInit() {
			this.replyTextarea = false;
			this.textareaautofocus = false;
			this.scrollFixed = false;
			this.parent_text = '说说你的看法';
		},
		//转发朋友圈
		onsend() {
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
			this.onShareShow = false;
			this.$refs.Firend.onshow();
		},
		operation() {
			if (this.srouce == 1) {
				if (this.opening == 0) {
					// if(this.srouceCommunity_id
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		goComitee(obj) {
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
				url: '/pages/update/committee?id=' + obj
			});
		},
		goHomeIndex() {
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
				url: '/pages/index/index'
			});
		},
		autoShare() {
			if (this.srouce == 1) {
				if (uni.getStorageSync('token')) {
					if (this.opening == 0 && this.detail.publish_type == 1) {
						if (this.srouceCommunity_id != uni.getStorageSync('community_id')) {
							this.srouceText = '本贴设置了' + this.srouceCommunity_text + '小区内部可见,您无权浏览';
							this.srouceBtnText = '返回首页';
							this.srouceShow = true;
						}
					}
				} else {
					// this.srouceShow = true
					// this.srouceText = '提示您尚未登录，请登录后操作'
					// this.srouceBtnTex = '登录'

					var that = this;
					var auth = new Promise(function(resolve, reject) {
						uni.login({
							success: res => {
								let { errMsg, code } = res;
								if (errMsg == 'login:ok') {
									that.Api.wechatAuth({ code: code }).then(result => {
										if (result.code == 1) {
											uni.setStorageSync('token', result.data.token);
											uni.setStorageSync('user', result.data.user);
											uni.setStorageSync('mobile', result.data.user.mobile);
											uni.setStorageSync('all_community', result.data.all_community);
											resolve();
										}
									});
								}
							}
						});
					});

					auth.then(status => {
						var token = uni.getStorageSync('token');
						var all_community = uni.getStorageSync('all_community');
						if (all_community.length) {
							uni.setStorageSync('community_id', all_community[0].community_id);
							uni.setStorageSync('committee_id', all_community[0].committee_id);
						} else {
							this.srouceText = '提示您尚未登录，请登录后操作';
							this.srouceBtnText = '登录';
							this.srouceShow = true;
						}
					});
				}
			}
		},
		getuserDetail() {
			var data = {
				user_id: this.user_id,
				community_id: this.community_id
			};
			this.Api.otherUserDarenInfo(data).then(result => {
				if (result.code == 1) {
					this.detail = result.data;
					this.id = result.data.id;
					this.type = result.data.type;
					if (this.type == 2) {
						this.config.title = '小区新鲜事';
					} else if (this.type == 5) {
						this.config.title = '小区新鲜事';
					} else {
						this.config.title = Tool.resultValue(this.type);
					}
					this.getCommentList();
				}
			});
		},
		// 取不同的详情
		getDetailAll() {
			var that = this;
			that.getDetail();
		
		},
		//便民详情
		getPDetail() {
			this.Api.communitydynamicswikiDetail({ wiki_id: this.id }).then(result => {
				if (result.code == 1) {
					if (!result.data.wiki_id) {
						// uni.redirectTo({
						// 	url:'/pages/index/404'
						// })
						this.$refs.deletetip.deleteShow = true;
						return;
					}
					this.detail = result.data;
					this.loading = false;
					//this.detail.contacts = this.detail.contacts.concat(this.detail.contacts)
					this.detail.content = this.detail.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
					if (this.type == 2) {
						this.config.title = '小区新鲜事';
					} else if (this.type == 5) {
						this.config.title = '小区新鲜事';
					}
					this.getCommentList();
					if (this.srouce) {
						this.autoShare();
					}
				}
			});
		},
		//个人名片
		goPer() {
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
				url: '/pages/index/personalcard?user_id=' + this.detail.user.id + '&community_id=' + this.detail.user.community_id
			});
		},
		//帮推
		helpPush() {
			// this.$getMyscore((data) => {
			// 	this.score = data.score
			// 	this.helpShow = true
			// })
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
			this.$getMyscore(res => {
				if (res.code == 1) {
					this.score = res.data.score;
					if (this.score == 0) {
						uni.showToast({
							title: '您的积分不足，请参加积分任务',
							icon: 'none',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/update/integral'
							});
						}, 2000);
					} else {
						this.helpShow = true;
					}
				}
			});
		},
		Helpcancel() {
			this.helpShow = false;
		},
		helpOk() {
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
			var score = this.$refs.Help.inputValue;
			if (!score) {
				uni.showToast({
					title: '请输入帮推积分',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			var data = {
				dynamics_id: this.id,
				community_id: uni.getStorageSync('community_id'),
				type: this.type,
				score: score
			};
			if (this.type == 7 || this.type == 8) {
				data.dynamics_id = this.dynamics_id;
			}
			this.Api.communityDynamicsPushDynamics(data).then(result => {
				if (result.code == 1) {
					uni.showToast({
						title: result.msg,
						duration: 2000,
						success: () => {
							this.add_type = result.data.add == -1 ? '-' : '+';
							this.score_text = result.data.score;
							this.helpShow = false;
							this.$refs.integraltip.show();
							setTimeout(() => {
								this.add_type = '';
								this.score_text = '';
								this.$refs.Help.inputValue = 0;
								this.$refs.integraltip.close();
								this.getDetailAll();
							}, 2000);
						}
					});
				} else {
					uni.showToast({
						title: result.msg,
						duration: 2000,
						success: () => {}
					});
				}
			});
		},
		getCommentList(ismore) {
			//所有的都是10
			var data = {
				object_id: this.id,
				object_type: this.detail.type,
				page: this.page,
				page_size: 10
			};
			if (this.type == 7 || this.type == 8) {
				data.object_type = this.type;
				data.type = this.type;
				data.object_id = this.dynamics_id;
			}
			if (this.navIndex == 1) {
				this.Api.getMultistageComments(data).then(result => {
					if (result.code == 1) {
						if (ismore) {
							var res = result.data.list;
							this.total = result.data.total_page;
							res.map(item => {
								item.nodes =
									'<p style="display:inline-flex;align-items:center;">' +
									new String(item.content)
										.toString()
										.replace(
											/\[em\_(\d{1,3})\]/g,
											'<img class="imgemoji" style="width:21px;" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>'
										) +
									'</p>';
								if (item.children) {
									item.children.map(sitem => {
										sitem.nodes =
											'<p style="display:inline-block"><i style="color:#ff9c00;font-style: inherit;margin-right:2px;white-space:nowrap">' +
											sitem.user.user_nickname +
											'</i> <i style="color:#333333;font-style: inherit;white-space:nowrap">回复</i> <i style="margin-left:2px;margin-right:2px;color:#ff9c00;font-style: inherit;white-space:nowrap">' +
											sitem.to_user.user_nickname +
											'</i>:<i style="margin-left:3px;font-style: inherit">' +
											new String(sitem.content)
												.toString()
												.replace(
													/\[em\_(\d{1,3})\]/g,
													'<span style="width:21px;height:21px;position:relative;margin-right:25px"><img style="position: absolute;left: 0;top: -2px;width:21px;" class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' +
														'$1' +
														'.gif  align=middle/></span>'
												) +
											'</i></p>';
									});
								}
							});
							this.commentList = this.commentList.concat(res);
						} else {
							var res = result.data.list;
							this.total = result.data.total_page;
							res.map(item => {
								item.nodes =
									'<p style="display:inline-flex;align-items:center;">' +
									new String(item.content)
										.toString()
										.replace(
											/\[em\_(\d{1,3})\]/g,
											'<img class="imgemoji" style="width:21px" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>'
										) +
									'</p>';
								if (item.children) {
									item.children.map(sitem => {
										sitem.nodes =
											'<p style="display:inline-block"><i style="color:#ff9c00;font-style: inherit;margin-right:2px;white-space:nowrap">' +
											sitem.user.user_nickname +
											'</i> <i style="color:#333333;font-style: inherit;white-space:nowrap">回复</i> <i style="margin-left:2px;margin-right:2px;color:#ff9c00;font-style: inherit;white-space:nowrap">' +
											sitem.to_user.user_nickname +
											'</i>:<i style="margin-left:3px;font-style: inherit">' +
											new String(sitem.content)
												.toString()
												.replace(
													/\[em\_(\d{1,3})\]/g,
													'<span style="width:21px;height:21px;position:relative;margin-right:25px"><img style="position: absolute;left: 0;top: -2px;width:21px;" class="imgemoji"  src=https://sq.wenlinapp.com/bkhumor-emoji/' +
														'$1' +
														'.gif  align=middle/></span>'
												) +
											'</i></p>';
									});
								}
							});
							this.commentList = res;
						}
						if (this.commentList.length) {
							this.nodataFlag = false;
						} else {
							this.nodataFlag = true;
						}
						this.$forceUpdate();
					}
				});
			} else if (this.navIndex == 2) {
				data.id = this.id;
				data.type = this.type;
				this.Api.getDynamicsPushLog(data).then(result => {
					if (result.code == 1) {
						if (ismore) {
							var res = result.data.list;
							this.total = result.data.total_page;
							this.commentList = this.commentList.concat(res);
						} else {
							var res = result.data.list;
							this.total = result.data.total_page;
							this.commentList = res;
						}
						if (this.commentList.length) {
							this.nodataFlag = false;
						} else {
							this.nodataFlag = true;
						}
						this.$forceUpdate();
					}
				});
			}
		},
		//删除评论
		delHandler(e) {
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
			this.$refs.confrims.guestShow = true;
			this.$refs.confrims.id = e.id;
		},
		//评论功能
		faceClick() {
			this.isShowEmj = !this.isShowEmj;
		},
		//评论点赞
		floverHandler(e) {
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

			// 10
			if (e.user_like == 0) {
				var data = {
					object_id: e.id,
					object_type: 10,
					community_id: uni.getStorageSync('community_id')
				};
				if (this.type == 7) {
					data.dynamics_id = this.dynamics_id;
				}
				this.Api.setLikes(data).then(result => {
					if (result.code == 1) {
						// uni.showToast({
						// 	title: result.msg,
						// 	duration: 2000,
						// 	success: () => {
						this.getCommentList();
						// 	}
						// });
					}
				});
			} else if (e.user_like == 1) {
				var data = {
					object_id: e.id,
					object_type: 10,
					community_id: uni.getStorageSync('community_id')
				};
				if (this.type == 7) {
					data.dynamics_id = this.dynamics_id;
				}
				this.Api.unsetLikes(data).then(result => {
					if (result.code == 1) {
						// uni.showToast({
						// 	title: result.msg,
						// 	duration: 2000,
						// 	success: () => {
						this.getCommentList();
						// }
						//});
					}
				});
			}
		},
		InputFocus(e) {
			console.log(e, 'e inputfocus');
			console.log('111');
			this.autoBottom = e.detail.height;
			this.isShowEmj = false;
			this.replyFlag = false;
			this.$emit('foc');
		},
		handleEmj(i) {
			if (i == '[em_98]') {
				//匹配最后一个表情符号并删除。
				this.inputValue = this.inputValue.replace(/(\[[^\]]+\]|[\s\S])$/, '');
			} else {
				this.inputValue += i;
			}
		},
		showEmj() {
			let bool = !this.isShowEmj;
			if (bool) {
				this.emojiIcon = 'cuIcon-keyboard';
			} else {
				this.emojiIcon = 'cuIcon-emoji';
			}

			this.isShowEmj = bool;
			this.$emit('show');
		},
		InputBlur(e) {
			this.autoBottom = 0;
		},

		inputValueHander(e) {
			var that = this
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
			if (this.inputValue.length < 1) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none',
					duration: 2000
				});
				return;
			}else{
		
				var data = {
					dynamics_id: this.detail.id,
					object_type: this.type,
					content: this.inputValue,
					parent_id: this.parent_id,
					community_id: uni.getStorageSync('community_id')
				};
				if (this.type == 7 || this.type == 5) {
					data.third_id = this.id;
				}
				if (this.type == 7) {
					data.dynamics_id = this.dynamics_id;
				}
				this.Api.setComments(data).then(result => {
					if (result.code == 1) {
						
						// uni.showToast({
						// 	title: result.msg,
						// 	duration: 2000,
						// 	success: () => {
							that.$u.toast(result.msg)
								that.subMessageTodo(that.comIds,3,(ss) => {
									that.replyTextarea = false;
									that.textareaautofocus = false;
									that.scrollFixed = false;
									// this.isShowEmj = false
									// this.inputValue = ''
									// this.parent_id = ''
									// this.replyFlag = true
									// this.parent_text = '说说你的看法'
									// this.getCommentList()
									that.isShowEmj = false;
									that.inputValue = '';
									that.parent_id = '';
									that.replyFlag = true;
									that.parent_text = '说说你的看法';
									if (result.data.add) {
										that.add_type = result.data.add == -1 ? '-' : '+';
										that.score_text = result.data.score;
										that.$refs.integraltip.show();
										setTimeout(() => {
											that.add_type = '';
											that.score_text = '';

											that.$refs.integraltip.close();
											that.getCommentList();
										}, 2000);
									} else {
										that.getCommentList();
									}
								})
						// 	}
						// });
					}
				});
				}

		},
		//复制功能
		copy(index) {
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
			var data = '';
			var that = this;
			if (index == 1) {
				uni.makePhoneCall({
					phoneNumber: this.detail.mobile
				});
			} else if (index == 2) {
				data = this.detail.weixin;
				uni.setClipboardData({
					data: data,
					success: function() {
						uni.showToast({
							title: '复制成功',
							duration: 2000
						});
						that.wxsj = false;
					}
				});
			}
		},
		//放大处理
		previewImage(index) {
			console.log(index);
			uni.previewImage({
				loop: true,
				current: index,
				urls: this.detail.images,
				success: () => {}
			});
		},
		getDdetail() {
			this.Api.dongtaiDetail({ dynamics_id: this.dynamics_id }).then(result => {
				if (result.code == 1) {
					if (!result.data.id) {
						// uni.redirectTo({
						// 	url:'/pages/index/404'
						// })
						this.$refs.deletetip.deleteShow = true;
						return;
					}
					this.detail = result.data;
					this.loading = false;
					this.detail.content = this.detail.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
					if (this.type == 2) {
						this.config.title = '小区新鲜事';
					} else if (this.type == 5) {
						this.config.title = '小区新鲜事';
					}
					this.detail.user = {
						user_nickname: ''
					};
					this.getCommentList();
					if (this.srouce) {
						console.log('dd,2');
						this.autoShare();
					}
				}
			});
		},
		getDetail() {
			this.Api.dynamicsVoteDetail({ object_id: this.id,object_type:this.type}).then(result => {
				if (result.code == 1) {
					if (!result.data.id) {
						// uni.redirectTo({
						// 	url:'/pages/index/404'
						// })
						this.$refs.deletetip.deleteShow = true;
						return;
					}
					this.detail = result.data;
					this.loading = false;
					this.detail.content = this.detail.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
					this.opening = result.data.opening;
					this.srouceCommunity_id = result.data.community.community_id;
					this.srouceCommunity_text = result.data.community.title;
					if (this.type == 2) {
						this.config.title = '小区新鲜事';
					} else if (this.type == 5) {
						this.config.title = '小区新鲜事';
					} else {
						if (this.detail.community) {
							this.config.title = this.detail.community.title + Tool.resultValue(this.type);
						}
					}
					this.author = result.data.user_id;
					if(!this.voteobj){
						this.voteobj = result.data.vote_list[0]
					}
					this.getCommentList();
					if (this.srouce) {
						console.log('d2');
						this.autoShare();
					}
				}
			});
		},
		swiperChange(e) {
			this.swiperIndex = e.detail.current + 1;
		},
		// 打开手机微信
		openWxsj(index) {
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
			this.wxsj = true;
		},
		closewxsj() {
			this.wxsj = false;
		},
		navClick(index) {
			this.navIndex = index;
			if (index == 1) {
				this.nodatatext = '暂无评论';
			} else if (index == 2) {
				this.nodatatext = '暂无帮推';
			}
			this.getCommentList();
		},
		//收藏处理
		moreClick() {
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
			this.typeFlag = true;
			this.findFaultType = this.type;
			this.findFaultCollect = this.detail.user_favorite == 0 ? false : true;
			this.findFaultValue = true;
		},
		//收藏处理
		fCollect(e) {
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
			var data = {
				community_id: uni.getStorageSync('community_id'),
				dynamics_id: this.id,
				object_type: this.detail.type
			};
			if (this.type == 8) {
				data.dynamics_id = this.dynamics_id;
			}
			if (this.detail.user_favorite == 0) {
				this.Api.setFavorites(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					} else {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				});
			} else if (this.detail.user_favorite == 1) {
				this.Api.unsetFavorites(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					} else {
						uni.showToast({
							title: result.msg,
							icon: 'none',
							duration: 2000
						});
					}
				});
			}
			this.findFaultValue = false;
			this.getDetailAll();
			this.$forceUpdate();
		},
		//找错处理
		fFind(e) {
			this.findFaultValue = false;
			this.messageText = '';
			this.$forceUpdate();
			this.typeFlag = false;
			this.messageShow = true;
		},
		fClose() {
			this.findFaultValue = false;
		},
		//评论回复操作
		replyHandler(e) {
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
			console.log(e);
			this.replyFlag = false;
			this.parent_id = e.id;
			this.parent_text = '回复' + e.user.user_nickname;
			this.replyTextarea = true;
			this.textareaautofocus = true;
			this.scrollFixed = true;
			// parent_id:'',
			// parent_text:'说说你的看法',
		},
		report() {
			//findFaultObject
			uni.navigateTo({
				url: '/pages/update/report?object_id=' + this.detail.id + '&object_type=' + this.detail.type,
				success: () => {
					this.findFaultValue = false;
				}
			});
		},
		//挑错处理
		textareaBlur(e) {
			console.log(e.detail);
		},
		closeMessage() {
			this.messageShow = false;
		},
		submitTodo(e) {
			if (!e) {
				uni.showToast({
					icon: 'none',
					title: '请输入挑错内容'
				});
				return;
			}
			var data = {
				wiki_id: this.detail.object_id,
				community_id: uni.getStorageSync('community_id'),
				content: e
			};
			this.Api.communitydynamicswikiCorrection(data).then(result => {
				if (result.code == 1) {
					uni.showToast({
						icon: 'success',
						duration: 1000,
						title: result.msg,
						success: () => {
							this.messageShow = false;
						}
					});
				}
			});
		},
		thankHandler(e) {
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
			this.findFaultObject = e;
			this.$getMyscore(result => {
				if (result.code == 1) {
					this.score = result.data.score;
					this.thankShow = true;
				}
			});
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
		cancel() {
			this.thankShow = false;
		},
		ok(e) {
			var input = this.$refs.thank.inputValue;
			if (!input) {
				uni.showToast({
					title: '请输入积分',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			var data = {
				score: input,
				comment_id: this.findFaultObject.id,
				community_id: uni.getStorageSync('community_id'),
				from_community_id: this.findFaultObject.userinfo.community_id
			};
			this.Api.communityDynamicsThanksHelp(data).then(result => {
				if (result.code == 1) {
					uni.showToast({
						title: result.msg,
						icon: 'success',
						duration: 2000,
						success: () => {
							this.$refs.Help.inputValue = 0;
							this.thankShow = false;
							this.add_type = result.data.add == -1 ? '-' : '+';
							this.score_text = result.data.score;
							this.$refs.integraltip.show();
							setTimeout(() => {
								this.add_type = '';
								this.score_text = '';
								this.$refs.integraltip.close();
								this.getCommentList();
							}, 2000);
						}
					});
				}
			});
		},
		// 分享弹窗
		onShowshare() {
			this.findFaultValue = false;
			this.onShareShow = false;
		},
		shareClick(e) {
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
			this.findFaultObject = this.detail;
			// console.log(		this.findFaultObject.title,'sss')
			// return;
			this.onShareShow = true;
		},
		onShowclose() {
			this.onShareShow = false;
		},
		onShowtodo() {
			this.scrollFixed = true;
			var pages = getCurrentPages(); //获取加载的页面

			var currentPage = pages[pages.length - 1]; //获取当前页面的对象
			console.log(currentPage.route);
			// return
			var data = {};
			if (this.dynamics_id) {
				data = {
					scene: 'id=' + this.id + '&type=' + this.type + '&d_id=' + this.dynamics_id,
					page: currentPage.route
				};
			} else {
				data = {
					scene: 'id=' + this.id + '&type=' + this.type,
					page: currentPage.route
				};
			}

			this.Api.getWXACodeUnlimit(data).then(result => {
				if (result.code == 1) {
					this.$nextTick(() => {
						this.onShareShow = false;
						this.posterData.posterImgUrl = this.findFaultObject.images.length ? this.findFaultObject.images[0] : 'https://sq.wenlinapp.com/appimg/share500400.jpg';
						if (this.type == 7 || this.type == 8) {
							this.posterData.title = this.findFaultObject.title;
						} else {
							this.posterData.title = this.findFaultObject.content;
						}
						if (this.posterData.title.length > 35) {
							this.posterData.title = this.posterData.title.substr(0, 35) + '...';
						}
						this.posterData.avatarUrl = uni.getStorageSync('user').avatar;
						this.posterData.posterCodeUrl = result.data;
						this.posterData.des = uni.getStorageSync('user').user_nickname + '给你分享了一个' + Tool.resultValue(this.type) + '信息';
						this.$forceUpdate();
						setTimeout(() => {
							this.canvasFlag = false; //显示canvas海报
							this.deliveryFlag = false; //关闭分享弹窗
							this.$refs.hchPoster.posterShow();
						}, 500);
					});
				} else {
					this.scrollFixed = false;
				}
			});
		},
		canvasCancel(val) {
			this.scrollFixed = false;
			this.canvasFlag = val;
		},
		condelHandler(e) {
			if (e == -1) {
				var url = '';
				if (this.type == 7 || this.type == 8) {
					url = '/pages/index/detail?dynamics_id=' + this.dynamics_id + '&type=' + this.type + '&id=' + this.id;
				} else {
					url = '/pages/index/detail?id=' + this.id + '&type=' + this.type;
				}
				uni.setStorageSync('url', url);
				uni.reLaunch({
					url: '/pages/index/index'
				});
				return;
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
							this.$refs.confrims.guestShow = false;
							this.getCommentList();
						}
					});
				}
			});
		}
	},
	components: {
		UserHeader,
		Comment,
		navigationCustom,
		emotion,
		FindFault,
		LeaveWords,
		Thank,
		Help,
		Onshare,
		hchPoster,
		Integraltip,
		Nodata,
		Firend,
		Reply,
		Confrimpop,
		Confrimpops,
		DeleteTip,
		SelectItem
	},
	computed: {
		imgIndex() {
			return this.swiperIndex + '/' + this.detail.images.length;
		},
		autoMobileOpen() {
			if(this.detail.anonymous == 1){
				return false
			}else{
				if (this.type != 8) {
					if (this.detail.user) {
						if (this.detail.mobile || this.detail.weixin) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.dpo {
	margin-top: 20upx;
	font-size: 30upx;
	font-weight: 500;
	color: #999;
	line-height: 40upx;
	text-align: left;
}
page {
	background: #F7F9FF;
}
.helpdetailfix {
	overflow: hidden;
	height: 100vh;
}
.detailcontent {
	display: flex;
	flex-direction: column;
}
.helpdetail {
	display: flex;
	flex-direction: column;
	background: white;
	.postheader {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 20upx;
		padding-bottom: 20upx;
		padding-left: 24upx;
		box-sizing: border-box;
		.headerimg {
			width: 64upx;
			height: 64upx;
			border-radius: 50%;
			position: relative;
			margin-right: 14upx;
			.avatar {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				z-index: 1;
			}
			.da {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 32upx;
				height: 32upx;
				z-index: 2;
			}
		}
		.userinfo {
			display: flex;
			flex-direction: column;
			margin-right: 20upx;
			width: calc(100% - 100upx);
			.userwrap {
				display: flex;
				flex-direction: row;
				.name {
					// height: 52upx;
					font-size: 40upx;
					// font-weight: bold;
					color: rgba(51, 51, 51, 1);
					line-height: 52upx;
					margin-right: 20upx;
				}
				.likewrap {
					width: fit-content;
					padding-left: 8upx;
					padding-right: 8upx;
					height: 32upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					background: rgba(255, 156, 0, 0.1);
					border-radius: 8upx;
					margin-right: 15upx;
					.like {
						width: 30upx;
						height: 26upx;
						margin-right: 10upx;
					}
					text {
						font-size: 20upx;
						font-weight: 500;
						color: rgba(255, 156, 0, 0.8);
					}
				}
				.chuang {
					padding-left: 5upx;
					padding-right: 5upx;
					height: 32upx;
					background: #08C299;
					border-radius: 8upx;
					font-size: 20upx;
					font-weight: bold;
					color: white;
					line-height: 32upx;
				}
			}
			.usertime {
				height: 32upx;
				font-size: 22upx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 32upx;
				text-align: left;
				.juli {
					padding-left: 15upx;
				}
			}
		}
		.morewrap {
			margin-left: auto;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 64upx;
			width: 100upx;
			padding-right: 29upx;
			box-sizing: border-box;
		}
		.more {
			width: calc(48upx * 1.2);
			height: calc(48upx * 1.2);
			// transform: rotate(-90deg);
			margin-right: 5upx;
			// margin-left: auto;
		}
	}
	.shareswrap {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 5000;
		.sharecontent {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.6);
			z-index: 5001;
			.sharewc {
				display: flex;
				flex-direction: column;
				position: fixed;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 500upx;
				padding-top: 30upx;
				box-sizing: border-box;
				background: rgba(255, 255, 255, 0.9);
				.t1 {
					font-size: 32upx;
					display: inline-block;
					padding-left: 20upx;
					padding-right: 20upx;
					text-align: center;
				}
				.wbtns {
					width: 200upx;
					height: 80upx;
					background: #ff9c00;
					color: white;
					font-size: 40upx;
					text-align: center;
					line-height: 80upx;
					border-radius: 10upx;
					margin: 40upx auto;
				}
			}
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		padding: 0upx 0upx;
		box-sizing: border-box;
		min-height: 100vh;
		margin-bottom: 168upx;
		.dalist {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 0 24upx;
			box-sizing: border-box;
			// margin-top:20upx;
			// margin-bottom: 20upx;
			.daitem {
				width: fit-content;
				height: 42upx;
				line-height: 42upx;
				background: rgba(255, 156, 0, 0.1);
				color: #ff9c00;
				border-radius: 21upx;
				padding-left: 20upx;
				padding-right: 20upx;
				margin-right: 20upx;
				margin-bottom: 20upx;
			}
		}
		.sellwrap {
			padding: 0 24upx 24upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;
			.sellinfo {
				height: 48upx;
				background: rgba(255, 156, 0, 0.1);
				border-radius: 8upx;
				width: fit-content;
				padding-left: 20upx;
				padding-right: 20upx;
				font-size: 28upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(255, 156, 0, 1);
				line-height: 48upx;
				.t1 {
					padding-right: 10upx;
				}
				.t2 {
					padding-left: 10upx;
				}
			}
		}
		.posttitle {
			padding: 0upx 24upx;
			box-sizing: border-box;
			font-size: 40upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			// font-weight:bold;
			line-height: 52upx;
			color: rgba(51, 51, 51, 1);
			text-align: left;
		}
		.posttimefovr {
			padding: 0upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 20upx;
			margin-bottom: 0upx;
			.t2 {
				height: 34upx;
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(255, 156, 0, 1);
				line-height: 34upx;
				margin-right: 20upx;
			}
			.t3 {
				height: 34upx;
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 34upx;
			}
			.sc {
				display: flex;
				flex-direction: row;
				margin-left: auto;
				align-items: center;
				.scimg {
					width: 42upx;
					height: 40upx;
					margin-right: 6upx;
				}
				.sc_text {
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(255, 156, 0, 1);
					line-height: 34upx;
				}
			}
		}
		.postcontent {
			padding: 0upx 24upx 24upx 24upx;
			box-sizing: border-box;
			position: relative;
			display: inline-flex;
			font-size: 34upx;
			font-family: 'PingFang-SC-Regular';
			line-height: 52upx;
			width: 100%;
			image {
				width: 100%;
			}
			rich-text {
				width: 100%;
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
				font-size: 34upx;
				font-weight: 500;
				line-height: 52upx;
				text-align: left;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-line-clamp: 3;
				// -webkit-box-orient: vertical;
				// text-indent: 3em;
			}
		}
		.postcontentfix {
			padding-top: 24upx;
			display: flex;
			flex-direction: column;
			.contentmb {
				display: flex;
				flex-direction: column;
				text {
					.mobile {
						margin-left: 15upx;
						color: #ff9c00;
					}
				}
			}
			.addresstext {
				color: #ff9c00;
			}
		}
		.phonewrap {
			padding: 4upx 26upx;
			box-sizing: border-box;
			font-size: 34upx;
			font-family: PingFang-SC-Regular, PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: white;
			background: #ff9c00;
			border-radius: 10rpx;
			width: fit-content;
			// line-height:52upx;
			// background: rgba(255, 156, 0, 0.1);
			margin: 0 auto 20upx auto;
			text-align: center;
		}
		.swiper-wrap {
			padding: 0upx 24upx;
			box-sizing: border-box;
			width: 100%;
			// min-height:480upx;
			// border-radius: 16upx;
			overflow: hidden;
			position: relative;
			margin-bottom: 20upx;
			image {
				// margin-bottom: 20upx;
				width: 100%;
			}
			.imgIndex {
				width: 68upx;
				height: 36upx;
				line-height: 36upx;
				text-align: center;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 20upx;
				font-size: 22upx;
				font-family: PingFang-SC-Regular, PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 0.8);
				text-align: center;
				position: absolute;
				right: 24upx;
				bottom: 24upx;
			}
			.screen-swiper {
				width: 100%;
				height: 100%;
				border-radius: 16upx;
				overflow: hidden;
				.swiper-imgs {
					width: 100%;
					height: 100%;

					border-radius: 16upx;
					overflow: hidden;
				}
			}
		}
		.swiper-wrap-fix {
			margin-top: 20upx;
		}
		.votelistwrap{
			display: flex;
			flex-direction: column;
			width:100%;
			.voteitem{
				padding:24upx;
				box-sizing: border-box;
				width:100%;
				background: white;
				border-top:20upx solid  #F7F9FF;
				.votetitle{
					font-size: 30upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #020433;
					margin-bottom: 20upx;
				}
				.voteprogess{
					width:100%;
					display: flex;
					flex-direction: row;
					align-items: center;
					/deep/ .u-progress{
						width:600rpx;
						display: flex;
						align-items: center;
					}
					.votetext{
						font-size: 30upx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #FF9C00;
						margin-left:auto;
					}
				}
				.votetool{
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top:20upx;
					.votetoolitem{
						display: flex;
						flex-direction: row;
						align-items: center;
						width:33.33%;
						justify-content: center;
						color:#95A0B6;
						.voteico{
							width:34upx;
							height:32upx;
						}
						.voteicos{
							width:32upx;
							height:31upx;
						}
						.votedes{
							font-size: 30upx;
							font-family: PingFang SC;
							font-weight: 500;
							color:#95A0B6;
						}
					}
				}
			}
		}
		.addVote{
			width: 107upx;
			height: 107upx;
			border-radius: 50%;
			position: fixed;
			bottom: 130upx;
			right:28.5upx;
		}
		.detailnav {
			border-top: 20upx solid #F7F9FF;
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			padding: 24upx 24upx;
			box-sizing: border-box;
			.navitem {
				display: inline-flex;
				// min-width: 128upx;
				height: 50upx;
				font-size: 36upx;
				font-family: PingFang-SC-Regular, PingFang-SC-Bold, PingFang-SC;
				// font-weight:bold;
				color: rgba(153, 153, 153, 1);
				line-height: 50upx;
			}
			.active {
				color: #333333;
			}
			.navitem:nth-of-type(1) {
				margin-right: 32upx;
				padding-right: 32upx;
				border-right: 4upx solid rgba(216, 216, 216, 1);
			}
		}
		.detailcontent {
			padding: 0upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			/deep/ .nodata {
				margin-top: 325rpx;
			}
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
						width: 68upx;
						height: 68upx;
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
			}
		}
	}
	.contentfix {
		padding-top: 0px;
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
		-webkit-overflow-scrolling: touch;
		.inputrow {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-top: solid transparent 0.01rpx;
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
				border-top: solid transparent 0.01rpx;
				.face {
					width: 45upx;
					height: 45upx;
					position: absolute;
					right: 22upx;
					top: 50%;
					transform: translateY(-50%);
				}
				textarea {
					border-top: solid transparent 0.01rpx;
					width: 100%;
					padding: 20upx;
					box-sizing: border-box;
					font-size: 30upx;
					height: 200upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					color: #333333;
				}
			}
			.inputwrapinit {
				//width: 480upx; //420upx
				flex:1;
				height: 100upx;
				background: rgba(234, 234, 234, 0.3);
				border-radius: 10upx;
				position: relative;
				input {
					width: 100%;
					height: 100upx;
					padding-left: 30upx;
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
				min-width: 48upx;
				margin-right:24upx;
				margin-left:24upx;
				height: 48upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				// position: relative;
				.pushico {
					width: 48upx;
					height: 48upx;
					margin-right: 8upx;
				}
				.pushtext {
					// position: absolute;
					// left: 40upx;
					// top: 0;
					font-size: 20upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color:#404B69;
					line-height: 28upx;
				}
				.pushtextActive{
					color: rgba(255, 156, 0, 1);
				}
			}
			.sharewrap {
				font-size: 28upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: #404B69;
				line-height: 32upx;
				display: flex;
				align-items: center;
				.shareico {
					width: 48upx;
					height: 48upx;
					margin-right: 8upx;
				}
				.sharetext{
				
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
	.wpwrap{
		display: flex;
		flex-direction: column;
		width:116upx;
		position: fixed;
		top:60%;
		right:24upx;
		.wpico{
			width:116upx;
			height:116upx;
			margin-bottom: 20upx;
		}
	}
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 3000;
		.mb {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 3001;
			background: rgba(0, 0, 0, 0.3);
		}
		.wxsjcontent {
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 3002;
			width: 702upx;
			// height:240upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 16px;
			display: flex;
			flex-direction: column;
			.mobile:nth-child(1) {
				border-bottom: 1px solid transparent;
			}
			.mobile {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				height: 120upx;
				line-height: 120upx;
				border-bottom: 1px solid #dedede;
				text:nth-of-type(1) {
					font-size: 28upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					width: 100upx;
				}
				text:nth-of-type(2) {
					font-size: 28upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					margin-left: 24upx;
					margin-right: 68upx;
					width: 180upx;
				}
				text:nth-of-type(3) {
					width: 100upx;
					height: 56upx;
					background: rgba(255, 156, 0, 1);
					border-radius: 8upx;
					font-size: 26upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					line-height: 56upx;
					text-align: center;
				}
			}
		}
	}
	.votepopup{
		width: 622upx;
		min-height: 550upx;
		display: flex;
		flex-direction: column;
		padding:60upx 20upx;
		box-sizing: border-box;
		.votitle{
			width: 100%;
			height: 34upx;
			font-size: 36upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #404B69;
			text-align: center;
			margin-bottom: 40upx;
		}
		.selectwrap{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding:17upx;
			border: 1px solid #404B69;
			border-radius: 10upx;
			width: fit-content;
			margin-top:40upx;
			margin-bottom: 40upx;
			margin-right:20upx;
			.label{
				font-size: 28upx;
				margin-right:14upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #95A0B6;
			}
			/deep/ .u-icon{
				margin-top:8upx;
			}
		}
		/deep/ .u-input__textarea{
			background:#F7F9FF;
			padding:31upx 20upx;
			box-sizing: border-box;
		}
		.btnwrap{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top:auto;
			.btn{
				width: 284upx;
				height: 99upx;
				background: #EEF2FA;
				border-radius: 10upx;
				font-size: 38upx;
				line-height: 99upx;
				text-align: center;
				font-family: PingFang SC;
				font-weight: bold;
				color: #404B69;
			}
			.confirm{
				margin-left: auto;
				color:white;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
			}
			.widthFix{
				width:100%;
			}
		}
	}
}
</style>
