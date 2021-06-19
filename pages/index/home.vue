<template>
	<view class="content">
		<cu-custom
			bgColor="bg-white-pink"
			:isShow="isShow"
			@shows="shows"
			:allCommunity="all_community"
			:communityMenu="community_menu"
			@hides="hides"
			@scallCommunity="scallCommunity"
		>
			<block slot="content"></block>
		</cu-custom>
		<view class="home">
			<view class="home-top" id="hometop"  :style="[{top:CustomBar + 'px'}]" >
				<view class="joinlist" v-if="usersList.length &&　false">
					<view class="join-user" >
						<view class="imgwrap" @click.stop="userHandler(item)" v-for="(item, index) in usersList" :key="index" v-if="index < 7">
							<u-image width="100%" height="100%" :src="item.avatar" border-radius="32rpx"></u-image>
							<image src="../../static/new.png" class="news" v-if="index == 0"></image>
						</view>
						<view class="imgwrap grap" @click="moreHandler">
							<view class="rr" v-for="(item,index) in 3" :key="index"></view>
						</view>
					</view>
		<!-- 			<view class="usernumber">
						{{usersList.length}}
					</view> -->
				</view>
				<view class="search">
					<view class="searchleft" @click="searchLink">
						<image src="../../static/search.png" class="ico"></image>
						<text class="search-text">搜索问邻共享资源</text>
					</view>
					<view class="searchright" @click="messageLink">
						<image src="../../static/messageico.png" class="red"></image>
						<text class="redtext" v-if="notices_count != 0">{{ notices_count < 99 ? notices_count : '99+' }}</text>
					</view>
				</view>

				<!-- 			<view class="tagwrap"> -->
				<scroll-view scroll-x class="bg-white nav tagwrap" scroll-with-animation :scroll-left="scrollLeft">
					<!-- 分类 -->
					<view
						class="cu-item nav-item"
						:class="['tagitem', cateIndex == index ? 'active' : '']"
						v-for="(item, index) in tagList"
						:key="index"
						@click="cateClick(index)"
						@tap="tabSelect"
						:data-id="index"
					>
						{{ item.tag }}
					</view>
				</scroll-view>
			</view>
			<!-- 			</view> -->
			<view :class="['postwrap', type == 3 && postList.length > 0 ? 'usedwrap' : '']">
			<mescroll-uni scroll-y="true"  v-if="type != 3" :style="{height: height+'px'}" 
			class="listwrap"
			:top="topFixed"
			bottom="120"
			ref="mescrollRef"
			@init="mescrollInit"
			@down="downCallback"
			@up="upCallback"
			:down="downOption"
			:up="upOption"
			 >
<!-- 			 //@refresherpulling="pulling" -->
					<PostItem
						:allFlag="allFlag"
						:type="current"
						v-for="(item, index) in postList"
						:pitem="item"
						:key="index"
						@flush="flushHandler"
						@moreClick="moreClick"
						@helpPush="helpPush"
						@shareClick="shareClick"
						@toLogin="goDetails"
						@danrenHandler="danrenHandler"
					></PostItem>
					<!-- https://sq.wenlinapp.com/upload/mini/regnodata.png -->
<!-- 					<view class="guestdata" v-if="flexNoData">
						<u-image width="654" height="550" src="https://sq.wenlinapp.com/upload/mini/regnodata.png"></u-image>
						<view class="guesttext">
							{{guestdata}}
						</view>
					</view> -->
				</mescroll-uni>

				<mescroll-uni scroll-y="true"  v-if="type == 3" :style="{height: height+'px'}"
				class="listwrap"
				:top="topFixed"
				bottom="120"
				ref="mescrollRef"
				@init="mescrollInit"
				@down="downCallback"
				@up="upCallback"
				:down="downOption"
				:up="upOption"
				>
					<UsedItem v-for="(item, index) in postList" :pitem="item" :key="index" :usedIndex="index" @toLogin="goDetails" />
	<!-- 				flexNoData guestFlag -->
<!-- 					<view class="guestdata" v-if="flexNoData">
						<u-image width="654" height="550" src="https://sq.wenlinapp.com/upload/mini/regnodata.png"></u-image>
						<view class="guesttext">
							{{guestdata}}
						</view>
					</view> -->
				</mescroll-uni>
			</view>
			<!-- 闲置 -->
			<!-- <view class="usedwrap"><UsedItem v-for="(item, index) in 4" :key="index" :usedIndex="index" /></view> -->
		</view>

		<!-- 小区等待开通 -->
		<view class="community" style="display: none;">小区申请正在审核中，请耐心等待！</view>

		<!-- 选择小区 -->
		<view class="popup" style="display: none;">
			<view class="mb"></view>
			<view class="openarea choosearea"></view>
		</view>
		<!-- 个人信息 -->
		<view class="popup" v-if="setcommunity">
			<view class="mb" @click="setcommunityClose"></view>
			<view class="openarea openinfomation">
				<view class="openheader">
					<text>填写个人信息</text>
					<image src="../../static/close.png" class="opencolse" @click="setcommunityClose" />
				</view>
				<view class="openitem" @click="getMap">
					<text class="opentitle">小区全称</text>
					<input type="opentxt" disabled="true" placeholder="请选择小区" v-model="community" @input="communityInput" />
					<image src="../../static/adico.png" class="adico" />
				</view>
				<view class="openitem">
					<text class="opentitle">楼栋号</text>
					<input type="opentxt" placeholder="请输入楼栋号,仅限数字、字母" v-model="building" @input="buildingInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">单元号</text>
					<input type="opentxt" placeholder="请输入单元号,仅限数字、字母" v-model="unit" @input="unitInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">门牌号</text>
					<input type="opentxt" placeholder="请输入门牌号,仅限数字、字母" v-model="room" @input="roomInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">身份</text>
					<input type="opentxt" placeholder="业主" v-model="setcommunityValue" :disabled="true" @click="openPicker" />
					<image src="../../static/down.png" class="opendown" @click="openPicker" />
				</view>
				<view class="openinfo">
					以上信息仅用于核实小区邻居真实身份，请放心填写，点击进入小区即代表同意
					<text class="rcolor" @click="gosecret">{{ textread }}</text>
					。
				</view>
				<view class="openbutton" hover-class="hover-openbutton" @click="setcommunityHandler">进入小区</view>
			</view>
		</view>

		<!-- 开通小区 -->
		<view class="popup" v-if="openCommunity">
			<view class="mb" @click="openCommunityClose"></view>
			<view class="openarea">
				<view class="openheader">
					<text>开通小区</text>
					<image src="../../static/close.png" class="opencolse" @click="openCommunityClose" />
				</view>
				<view class="openitem">
					<text class="opentitle">小区全称</text>
					<input type="opentxt" placeholder="请输入小区全称" v-model="communityTitle" @input="communityTitleInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">小区地址</text>
					<input type="opentxt" placeholder="请输入详细地址" v-model="communityAddress" @input="communityAddressInput" />
					<image style="display:none" src="../../static/adico.png" class="adico" @click="getAddress" />
				</view>
				<view class="openitem">
					<text class="opentitle">手机号</text>
					<input type="opentxt" v-model="mobile" disabled="true" placeholder="请授权" />
					<button class="openmobile" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">一键授权</button>
				</view>
				<view class="openbutton" hover-class="hover-openbutton" @click="openCommunityHandler">立即申请</view>
			</view>
		</view>
		<!-- 选择小区 -->
		<view class="popup" v-if="chooseCommunity">
			<view class="mb" @click="closeCommunity"></view>
			<view class="openarea choosecommunity">
				<view class="openheader">
					<text>选择小区</text>
					<image src="../../static/close.png" @click="closeCommunity" class="opencolse" />
					<image src="../../static/selectback.png" class="selectback" />
				</view>
				<view class="searchwrap">
					<input type="text" class="chooseinput" v-model="community_text" placeholder="请输入小区" @input="chooseInput" />
					<text class="choosetext" @click="searchCommunity">搜索</text>
				</view>
				<view class="searchlist">
					<view class="searchitem" v-for="(item, index) in searchCommunityList" :key="index" @click="selectCommunity(item)">
						<text class="searchico"></text>
						<view class="comminginfo">
							<text class="title">{{ item.title }}</text>
							<text class="addressinfo">{{ item.address }}</text>
						</view>
					</view>
					<Nodata :type="smallNodata" v-if="searchCommunityList.length == 0" />
				</view>
				<view class="welcomeopen">
					<text class="welcometext">没有自己的小区，您可以立即</text>
					<view class="welcomebtn" @click="openCommunityTodo">申请开通</view>
				</view>
			</view>
		</view>

		<!-- 提示登陆  -->
		<view class="popup" v-if="guestShow">
			<view class="mb" @click="guestShow = !guestShow"></view>
			<view class="tipslogin">
				<view class="logintop">您尚未登录</view>
				<view class="loginbottom">
					<text class="textitem" @click="guestShow = !guestShow">取消</text>
					<button open-type="getUserInfo" @getuserinfo="getUserInfo" class="textitem textitem-fix">微信登录</button>
				</view>
			</view>
		</view>

		<!-- 登录方式切换    -->
		<view class="popup" v-if="loginFalse">
			<view class="mb"></view>
			<view class="content contentfix">
				<image src="../../static/close.png" class="popupclose" @click="guestClick"></image>
				<image class="wlimg" src="https://sq.wenlinapp.com/appimg/share500400.jpg" />
				<view class="logintitles"></view>
<!-- 				<view class="testBtn" @click="loginHandler">
					测试专用登录
				</view> -->
				<view class="loginwrap">
					<view class="logintitle">选择登录方式</view>
					<view class="logintype">
						<view class="loginitem">
							<button open-type="getUserInfo" @getuserinfo="getUserInfo" class="weixinbtn">
								<image src="../../static/weixin.png"></image>
								<text>微信登录</text>
							</button>
						</view>
						<view class="loginitem" @click="guestClick">
							<image src="../../static/guest.png"></image>
							<text>访客浏览</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 选择业主身份 -->
		<view class="popup" v-if="pickerId">
			<view class="mb" @click="closePicker"></view>
			<view class="openarea chooseid">
				<view class="openheader">
					<text>选择业主身份</text>
					<image src="../../static/close.png" class="opencolse" @click="closePicker" />
				</view>
				<picker-view :value="pickerValue" @change="pickerChange" class="pickerview" indicator-style="height:50px;">
					<picker-view-column>
						<view class="item" style="line-height:50px" v-for="(item, index) in picker" :key="index">{{ item.label }}</view>
					</picker-view-column>
				</picker-view>

				<view class="openbutton" hover-class="hover-openbutton" @click="pickerClick">确认</view>
			</view>
		</view>

		<view class="guestpop" v-if="guestShowOpen">
			<text class="gtiptext">登录查看本小区新鲜事</text>
			<view class="gtipbtn" @click="guestLoginTodo">立即登录</view>
		</view>
		
		<view class="guestpop" v-if="setcommunityOpen">
			<text class="gtiptext">设置小区可查看本小区新鲜事</text>
			<view class="gtipbtn" @click="setcommunityOpenTodo">立即设置</view>
		</view>
		
<!-- 		<view class="guestpop" v-if="guestPaiOpen">
			<text class="gtiptext">登录之后加入小区才可以拜年</text>
			<view class="gtipbtn" @click="guestLoginTodo">立即登录</view>
		</view> -->
		
		<view class="popup" v-if="guestPaiOpen">
			<view class="mb" @click="guestPaiOpen = !guestPaiOpen"></view>
			<view class="tipslogin">
				<view class="logintop">登录之后加入小区才可以拜年</view>
				<view class="loginbottom">
					<text class="textitem" @click="guestPaiOpen = !guestPaiOpen">取消</text>
					<button open-type="getUserInfo" @getuserinfo="getUserInfo" class="textitem textitem-fix">微信登录</button>
				</view>
			</view>
		</view>
		
		<!-- 挑错 -->
		<LeaveWords :messageValue.sync="messageText" :messageShow.sync="messageShow" @textareaBlur="textareaBlur" @closeMessage="closeMessage" @submitTodo="submitTodo" />
		<!-- 帮推 -->
		<Help ref="Help" :isShow="helpShow" @close="Helpcancel" @ok="ok" :score="score" />
		<!-- 找错 -->
		<FindFault
			:isShow="findFaultValue"
			:isCollect="findFaultCollect"
			:isType="findFaultType"
			@close="fClose"
			@collect="fCollect"
			@find="fFind"
			@report="report"
			@onshare="onShowshare"
		/>
		<!-- 		<cu-tarbar :selectIndex="selectIndex"></cu-tarbar> -->
		<!-- 分享功能 -->
		<Onshare :isShow="onShareShow" :isHome.sync="isHome" @close="onShowclose" @ontodo="onShowtodo" @onshare="onShowshare" />
		<Pushedit ref="Pushedit" />

		<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />
		<view :hidden="canvasFlag">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas>
			<!-- 海报 -->
		</view>
		<!-- 积分提示 -->
		<Integraltip ref="integraltip" :types.sync="add_type" :score.sync="score_text" />
		<!-- 拜年 -->
<!-- 		<u-mask :show="paiAd" @click.stop="false">
				<view class="paiwarp">
					<view class="pairect">
						<u-image :src="imgURl+'homepai.png'" width="100%" height="100%"></u-image>
					</view>
					<view class="paiclose" @click.stop="paiAd = false">
						<u-image :src="imgURl+'paiclose.png'" width="100%" height="100%"></u-image>
					</view>
					<view class="paienter" @click.stop="paiHandler">
						<u-image :src="imgURl+'btnshare.png'" width="100%" height="100%"></u-image>
					</view>
				</view>
		</u-mask>
		<view class="xf" v-if="false " @click.stop="paiHandler">
			<u-image :src="imgURl+'xf.png'" width="100%" height="100%"></u-image>
		</view> -->
	</view>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import LeaveWords from '@/components/leavewords/leavewords.vue';
import PostItem from '@/components/postItem/postitem.vue';
import UsedItem from '@/components/usedItem/useditem.vue';
import FindFault from '@/components/findFault/findFault.vue';
import Help from '@/components/help/help.vue';
import Onshare from '@/components/onshare/onshare.vue';
import Nodata from '@/components/nodata/nodata.vue';
import hchPoster from '../../wxcomponents/hch-poster/hch-poster.vue';
import Integraltip from '@/components/integraltip/integraltip.vue';
import Tool from '@/utils/tool.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			CustomBar:this.CustomBar,
			scroll_refresher_enabled:false,
			findsh:false,
			apirequire:true,
			imgURl:this.Config.minUrl,
			guestFlag:false,
			isHome: false,
			smallNodata: true,
			flexType: false,
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				native: false, // 是否使用系统自带的下拉刷新; 默认false; 仅mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
				autoShowLoading: false, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
				isLock: false, // 是否锁定下拉刷新,默认false;
				offset: 80 // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
			},
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				isLock: false, // 是否锁定上拉加载,默认false;
				isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认true,两者可同时触发;
				isBounce: false, // 默认禁止橡皮筋的回弹效果, 必读事项: http://www.mescroll.com/qa.html?v=190725#q25
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10, // 每页数据的数量
					time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				empty: {
					use: true, // 是否显示空布局
					icon: 'https://sq.wenlinapp.com/upload/mini/nodata.png', // 图标路径
					tip: '暂无数据', // 提示

					fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
					top: '100rpx', // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
					zIndex: 99 // fixed定位z-index值
				},
				onScroll: true // 是否监听滚动事件, 默认false, 仅mescroll-uni生效; mescroll-body直接声明onPageScroll (配置为true时,可@scroll="scroll"获取到滚动条位置和方向; 注意监听列表滚动是非常耗性能的,很容易出现卡顿,非特殊情况不要配置此项)
			},
			picker: [
				{
					value: 1,
					label: '业主'
				},
				{
					value: 2,
					label: '亲友'
				},
				{
					value: 3,
					label: '租客'
				}
			],
			pickerValue: 0,
			selectIndex: 1,
			cateIndex: '',
			community: '', //小区名
			building: '', //楼栋号
			unit: 1, //单元号
			loginFalse: false, //授权
			userinfo: {},
			current: 1,
			isShow: false,
			tagList: [],
			all_community: [], //我的小区
			setcommunity: false, //设置小区
			chooseCommunity: false, //选择小区
			community_text: '', //搜索小区名
			searchCommunityList: [],
			openCommunity: false, //开通小区
			mobile: '',
			communityTitle: '', //小区名
			communityId: '', //选择小区id
			communityAddress: '', //小区地址
			community_id: '', //小区id
			community_menu: '', //小区名
			committee_id: '', //居委会
			pickerId: false, //选择业主
			setcommunityType: 1,
			setcommunityValue: '业主',
			page: 1,
			page_size: 10,
			totalPage:0,
			type: 0,
			postList: [],
			scrollLeft: 0,
			TabCur: 0,
			findFaultValue: false,
			findFaultCollect: false,
			findFaultType: 1,
			findFaultObject: {},
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
			messageShow: false,
			messageText: '',
			onShareShow: false,
			flexNoData: true,
			shareObj: {},
			helpShow: false,
			helpObj: {},
			allFlag: true, //控制显示
			score: 0,
			textread: `《问邻服务协议及隐私政策》`,
			guestShow: false,
			notices_count: 0,
			guestShowOpen: false,
			pos: 'home',
			add_type: '',
			score_text: '',
			usersList:[],
			darenObj:null,
			guestdata:'暂无数据，请登录或者加入小区即可查看数据',
			setcommunityOpen:false,
			paiAd:true,
			guestPaiOpen:false,
			height:700,
			rate:0,
			topFixed:0
		};
	},
	onLoad() {

	},

	computed:{
		autoTop(){
			return this.usersList.length ? 375 : 300
		}
	},

	mounted() {
		var system = uni.getSystemInfoSync()
		let rate = 750 / system.windowWidth 
		this.rate = rate
		this.topFixed = 190+this.CustomBar*rate
		this.height = system.windowHeight - uni.upx2px(188);
		console.log(this.height,'height')
		this.paiAd = uni.getStorageSync('paiAd') == 1 ? false : true
		if (!uni.getStorageSync('longitude')) {
			uni.getLocation({
				success: res => {
					// latitude: 30.39085
					// longitude: 114.89495
					uni.setStorageSync('latitude', res.latitude);
					uni.setStorageSync('longitude', res.longitude);
				
				},
				fail: err => {
		
					uni.showToast({
						title: '您未开通地图授权，请打开授权',
						icon:'none',
						duration: 2500
					});

		
				}
			});
		} 
		this.tagList = [{id:0,tag:'全部'}].concat(this.Tool.navList)
		this.$Bus.$on('noToken', e => {
			this.goLogin(res => {});
		});
		if (uni.getStorageSync('token')) {
			this.$getCount(result => {
				var count = 0;
				if (result.code == 1) {
					if (!isNaN(result.data.comment_unread)) {
						count += result.data.comment_unread;
						count += result.data.leave_message_unread;
						count += result.data.sys_notices_unread;
						count += result.data.thanks_unread;
						this.notices_count = count;
					} else {
						this.notices_count = 0;
					}
				}
			});

			this.$Bus.$on('countmsg', countmsg => {
				this.$getCount(result => {
					var count = 0;
					if (result.code == 1) {
						if (!isNaN(result.data.comment_unread)) {
							count += result.data.comment_unread;
							count += result.data.leave_message_unread;
							count += result.data.sys_notices_unread;
							count += result.data.thanks_unread;
							this.notices_count = count;
						} else {
							this.notices_count = 0;
						}
					}
				});
			});
		}
		uni.setStorageSync('o', 1); //菜单
		var that = this;
		var auth = new Promise(function(resolve, reject) {
			uni.login({
				success: res => {
					let { errMsg, code } = res;
					if (errMsg == 'login:ok') {
						that.Api.wechatAuth({ code: code }).then(result => {
							if (result.code == 1) {
								if(result.data.all_community){
									result.data.all_community.map((item)=>{
										item.title = item.community_name
									})
								}
								uni.setStorageSync('token', result.data.token);
								uni.setStorageSync('user', result.data.user);
								uni.setStorageSync('maxJoin', result.data.max_join);
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
			this.token = uni.getStorageSync('token');
			this.all_community = uni.getStorageSync('all_community');
			if (this.all_community.length) {
				this.getUser();
				uni.setStorageSync('community_id', this.all_community[0].community_id);
				uni.setStorageSync('committee_id', this.all_community[0].committee_id);
				var url = uni.getStorageSync('url');
				if (url) {
					uni.removeStorageSync('url');
					uni.navigateTo({
						url: url
					});
				}
			}
			this.mobile = uni.getStorageSync('mobile');
			this.community_id = uni.getStorageSync('community_id');

			this.community_menu =
				uni.getStorageSync('community_menu') || this.all_community.length
					? this.all_community[0].title + (this.all_community[0].total ? ' (' + this.all_community[0].total + ') ' : '')
					: '问邻';
			if (!this.token) {
				//没有token要求用户授权
				this.loginFalse = true;
				this.guestFlag = true;
				this.guestShowOpen = true
			} else {
				this.loginFalse = false;
				this.guestFlag = false;
				this.guestShowOpen = false
				//判断我是否设置小区
				if (this.all_community.length == 0) {
					this.Api.checkUserCommunityOpening({}).then(result => {
						if (result.code == 1) {
							if(result.data.opening == 1){
								this.guestdata = result.msg
							}
							if (this.all_community.length) {
								this.current = 1;
								
							}else{
								this.guestFlag = true
								this.setcommunityOpen = true
							}
							//this.setcommunity = true;
							// uni.navigateTo({
							// 	url:'../update/openingcommunity'
							// })
							var pid = uni.getStorageSync('pid');
							if (pid) {
								this.community = uni.getStorageSync('ptitle');
								this.communityId = uni.getStorageSync('pcommunity_id');
							}
						} else {
							if (this.all_community.length) {
								setTimeout(() => {
									this.current = 1;
									//this.mescroll.resetUpScroll();
									this.mescroll.resetUpScroll()
								}, 3000);
							}
						}
					});
				} else {
					this.setcommunity = false;
				}
			}
			if (this.community_id) {
				var p = new Promise((resolve, reject) => {
					if (!uni.getStorageSync('longitude')) {
						// resolve();
						uni.getLocation({
							success: res => {
								// latitude: 30.39085
								// longitude: 114.89495
								uni.setStorageSync('latitude', res.latitude);
								uni.setStorageSync('longitude', res.longitude);
								resolve();
							},
							fail: err => {

								uni.showToast({
									title: '您未开通地图授权，请打开授权',
									icon:'none',
									duration: 2500
								});
								setTimeout(()=>{
									resolve();
									this.mescroll.resetUpScroll()
								},1000)

							}
						});
					}
					resolve();
				});
				p.then(r => {
					this.mescroll.resetUpScroll();
				});
			}else{

					if (!uni.getStorageSync('longitude')) {
						// resolve();
						uni.getLocation({
							success: res => {
								// latitude: 30.39085
								// longitude: 114.89495
								uni.setStorageSync('latitude', res.latitude);
								uni.setStorageSync('longitude', res.longitude);
								resolve();
							},
							fail: err => {
				
								uni.showToast({
									title: '您未开通地图授权，请打开授权',
									icon:'none',
									duration: 2500
								});
						
				
							}
						});
					} 
				
		
			}
			// this.Api.getCommunityWiki({}).then(result => {
			// 	console.log(result);
			// });
		});
		setTimeout(()=>{
			this.scroll_refresher_enabled = true;
		},1000)
	},
	watch: {
		scroll_refresher_enabled:{
			deep:true,
			handler:function(data){
				console.log(data,'data')
				if(!data){
					this.onRestore()
				}
			}
		}
	},
	methods: {
		throttle(fn,wait){
		    var timer = null;
		    return function(){
		        var context = this;
		        var args = arguments;
		        if(!timer){
		            timer = setTimeout(function(){
		                fn.apply(context,args);
		                timer = null;
		            },wait)
		        }
		    }
		},
		onRestore(e){
			console.log(e,'onrestore')
		},
		onAbort(e){
			console.log(e,'onabort')
		},
		refresh(e){
			if (this._freshing) return;
			this._freshing = true;
			setTimeout(() => {
			    this.scroll_refresher_enabled = false;
			    this._freshing = false;
			}, 3000)
			this.mescroll.resetUpScroll()
		},
		pulling(e){
			console.log("onpulling", e);
			// if(this.page == 1){
			// 	this.scroll_refresher_enabled = false;
			// 	this.findsh = false;
			// }
		},
		scroll(e) {
			console.log(e,'xxxx')
			// if(this.page == 1){
			// 	this.scroll_refresher_enabled = false;
			// 	this.findsh = false;
			// }
		},
		flushHandler(){
			this.upCallback()
		},
		loginHandler(){
			var data = {
				mobile:'13920876192',
				password: '123456'
			}
			this.Api.loginByMobile(data).then((result)=>{
				if(result.code == 1){
					uni.setStorageSync('token', result.data.token);
					uni.setStorageSync('user', result.data.user);
					uni.setStorageSync('maxJoin', result.data.max_join);
					uni.setStorageSync('mobile', result.data.user.mobile);
					uni.setStorageSync('all_community', result.data.all_community);
					this.loginFalse = false
					uni.switchTab({
						url:'/pages/my/index'
					})
				}
			})
		},
		upper(e){
			
		},
		lower(e){
			console.log(this.totalPage)
			if(this.totalPage >= this.page){
				this.page++
				this.upCallback(true)
			}
		},
		paiHandler(){
			if(this.token){
				uni.navigateTo({
					url:'/pages/update/newYear'
				})
			}else{
				console.log(111)
				this.guestPaiOpen = true
				this.paiAd = false
			}
		},
		danrenHandler(){
			uni.navigateTo({
				url:'/pages/push/edit?type=9'
			})
		},
		moreHandler(){
			uni.navigateTo({
				url:'/pages/update/neighbour'
			})
		},
		userHandler(item){
			uni.navigateTo({
				url:'/pages/index/personalcard?user_id='+item.user_id+'&community_id='+item.community_id
			})
		},
		getUser() {
			var params = {
				community_id: uni.getStorageSync('community_id')
			};
			this.Api.getNewNeighbor(params).then(result => {
				if(result.code == 1){
					this.$nextTick(() => {
						// this.usersList = result.data
						this.usersList = []
						var system = uni.getSystemInfoSync()
						this.height = this.usersList.length ? system.windowHeight - uni.upx2px(320) :  system.windowHeight - uni.upx2px(240)
					})
				}
			});
		},
		guestLoginTodo() {
			this.guestShowOpen = false;
			this.loginFalse = true;
		},
		setcommunityOpenTodo(){
			uni.navigateTo({
				url:'../update/selectcommunity'
			})
		},
		//游客登录操作
		weixinlogin() {
			this.guestShow = false;
			// this.setcommunity = true;
			// uni.navigateTo({
			// 	url:'../update/setcommunity'
			// })
		},
		goLogin(cb) {
			var result = false;
			var token = uni.getStorageSync('token');
			var committee_id = uni.getStorageSync('committee_id');
			var all_community = uni.getStorageSync('all_community');
			
			if (!token) {
				this.guestFlag = true
				if (!this.guestShow) {
					this.guestShow = true;
				}
				result = true;
				//不进行切换
				// this.current = 3;
				// this.mescroll.resetUpScroll();
				cb(result);
				return;
			}else{
				this.guestFlag = false
			}

			if (isNaN(committee_id) || all_community.length == 0) {
				if (!this.setcommunity) {
					// this.setcommunity = true;
					uni.navigateTo({
						url:'../update/openingcommunity'
					})
				}
				this.guestShow = true;
				result = true;
				this.guestFlag = true
				
				// this.current = 3;
				// this.mescroll.resetUpScroll();
				cb(result);
				return;
			}
			this.guestShow = false
			cb(result);
		},
		goDetails() {
			this.goLogin(res => {});
		},
		gosecret() {
			uni.navigateTo({
				url: '/pages/update/secret'
			});
		},
		getData(){
			this.flexNoData = false
			this.page = 1
			this.totalPage = 0
			this.postList = []
			this.upCallback()
		},
		upCallback(page) {
			//联网加载数据
			var that = this
			var params = {
				page: page.num,
				page_size: page.size,
				community_id: uni.getStorageSync('community_id'),
				committee_id: uni.getStorageSync('committee_id'),
				type: this.type,
				latitude: uni.getStorageSync('latitude'),
				 longitude: uni.getStorageSync('longitude')
			};
			if (this.current == 1) {
				this.Api.allByCommunityId(params)
					.then(result => {
	
						if (result.code == 1) {
							this.totalPage = result.data.total_pages;
							var totalPage = result.data.total_pages;
							var curPageLen = result.data.list.length;
							if (this.page == 1) {
								this.postList = [];
								var list = []
								if(this.type == 6 && this.darenObj){
									list.push(this.darenObj)
								}
								this.postList = list.concat(result.data.list)
							}else{
								this.postList = this.postList.concat(result.data.list);
							}
							this.mescroll.endByPage(curPageLen, totalPage);
	// 						if(ismore){
	// 							this.postList = this.postList.concat(result.data.list);
	// 						}else{
	// 							var list = []
	// 							if(this.type == 6 && this.darenObj){
	// 								list.push(this.darenObj)
	// 							}
	// 							this.postList = list.concat(result.data.list)
	// 						}
	
							// if (this.postList.length) {
							// 	this.flexNoData = false;
							// } else {
							// 	this.flexNoData = true;
							// }
				
						}
					})
					.catch(() => {
						//联网失败的回调,隐藏下拉刷新的状态
						this.mescroll.endErr();
					});
			} else if (this.current == 2) {
				this.Api.nearByCommunityId(params)
					.then(result => {
						if (result.code == 1) {
						// 	this.totalPage = result.data.total_pages;
						
						// 	if(ismore){
						// 		this.postList = this.postList.concat(result.data.list);
						// 	}else{
						// 		this.postList = result.data.list;
						// 	}
							
						// 	if (this.postList.length) {
						// 		this.flexNoData = false;
						// 	} else {
						// 		this.flexNoData = true;
						// 	}
							var totalPage = result.data.total_pages;
							var curPageLen = result.data.list.length;
							if (page.num == 1) this.postList = [];
							this.postList = this.postList.concat(result.data.list);
							this.mescroll.endByPage(curPageLen, totalPage);
							// if (this.postList.length) {
							// 	this.flexNoData = true;
							// } else {
							// 	this.flexNoData = false;
							// }
						}
					})
					.catch(() => {
						//联网失败的回调,隐藏下拉刷新的状态
						this.mescroll.endErr();
					});
			} else if (this.current == 3) {
				this.Api.helpDynamicsByCommunityId(params)
					.then(result => {
						if (result.code == 1) {
							// this.totalPage = result.data.total_pages;
							var totalPage = result.data.total_pages;
							var curPageLen = result.data.list.length;
							if (this.page == 1) {
								this.postList = [];
								var list = []
								if(this.type == 6 && this.darenObj){
									list.push(this.darenObj)
								}
								this.postList = list.concat(result.data.list)
		
							}else{
								this.postList = this.postList.concat(result.data.list);
								this.mescroll.endByPage(curPageLen, totalPage);
							}
							// if (this.postList.length) {
							// 	this.flexNoData = true;
							// } else {
							// 	this.flexNoData = false;
							// }
						// 	if(ismore){
						// 		this.postList = this.postList.concat(result.data.list);
						// 	}else{
						// 		var list = []
						// 		if(this.type == 6 && this.darenObj){
						// 			list.push(this.darenObj)
						// 		}
						// 		this.postList = list.concat(result.data.list)
								
						// 	}
						
						// 	if (this.postList.length) {
						// 		this.flexNoData = false;
						// 	} else {
						// 		this.flexNoData = true;
						// 	}
						}
					})
					.catch(() => {
						//联网失败的回调,隐藏下拉刷新的状态
						this.mescroll.endErr();
					});

			}
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		},
		//开通小区
		openCommunityTodo() {
			this.chooseCommunity = false;
			this.setcommunity = false;
			this.openCommunity = true;
		},
		//选择业主事件
		openPicker(e) {
			this.pickerId = true;
		},
		closePicker(e) {
			this.pickerId = false;
		},
		//业主选择
		pickerChange(e) {
			var target = e.detail.value[0];
			this.pickerValue = target;
		},
		pickerClick(e) {
			this.setcommunityType = this.picker[this.pickerValue].value;
			this.setcommunityValue = this.picker[this.pickerValue].label;
			this.pickerId = false;
		},
		openCommunityClose() {
			this.openCommunity = false;
		},
		setcommunityClose() {
			this.setcommunity = false;
		},
		//搜索附近小区
		searchNearCommunity(data) {
			this.ApigetNearCommunity(data).then(result => {
				console.log(result);
			});
		},
		//选择小区 [{"community_id":1,"title":"加州橘郡","committee_id":1}]
		scallCommunity(e) {
			this.community_id = e.community_id;
			this.community_menu = e.title + ' (' + e.total + ') ';
			this.committee_id = e.committee_id;
			var that = this
			this.Api.setDefaultCommunity({ community_id: e.community_id }).then(result => {
				if (result.code == 1) {
					this.usersList = []
					this.getUser()
					uni.showToast({
						icon: 'success',
						title: result.msg,
						duration: 2000,
						success: () => {
							uni.setStorageSync('community_id', e.community_id);
							uni.setStorageSync('community_menu', e.title + (e.total ? ' (' + e.total + ') ' : ''));
							uni.setStorageSync('committee_id', e.committee_id);
							uni.setStorageSync('community_name',e.title)
							this.current = 1;
							this.cateIndex = 0;
							this.mescroll.resetUpScroll();
							uni.login({
								success: res => {
									let { errMsg, code } = res;
									if (errMsg == 'login:ok') {
										that.Api.wechatAuth({ code: code }).then(result => {
											if (result.code == 1) {
												if(result.data.all_community){
													result.data.all_community.map((item)=>{
														item.title = item.community_name
													})
												}
												uni.setStorageSync('token', result.data.token);
												uni.setStorageSync('user', result.data.user);
												uni.setStorageSync('maxJoin', result.data.max_join);
												uni.setStorageSync('mobile', result.data.user.mobile);
												uni.setStorageSync('all_community', result.data.all_community);
												
											}
										});
									}
								}
							});
							
						}
					});
				}
			});
			
		},
		selectCommunity(obj) {
			this.communityId = obj.community_id;
			this.communityTitle = obj.title;
			this.community = obj.title;
			this.chooseCommunity = false;
		},
		closeCommunity() {
			this.chooseCommunity = false;
		},
		//游客访问
		guestClick() {
			this.loginFalse = false;
			//首页不进行切换
			// this.current = 3;
			// this.guestShowOpen = true;
			// this.mescroll.resetUpScroll();
		},
		// 手机号授权处理
		getPhoneNumber(e) {
			console.log(e);
			var { encryptedData, iv } = e.detail;

			this.Api.setUserPhoneBySecret({ encrypted_data: encryptedData, iv: iv }).then(result => {
				if (result.code == 1) {
					this.mobile = result.data;
					uni.setStorageSync('mobile', result.data);
				}
			});
		},
		shows() {
			if (this.all_community.length > 1) {
				this.isShow = !this.isShow;
			}
		},
		hides() {
			this.isShow = false;
		},
		itemClick(arg) {
			this.cateIndex = 0;
			this.scrollLeft = 0;
			this.type = 0;
			this.postList = [];
			this.current = arg;
			if (arg == 2) {
				this.goLogin(data => {
					if (!data) {
						this.tagList = this.tagList2;
						this.mescroll.resetUpScroll();
					} else {
						this.current = 3;
					}
				});
			} else if (arg == 3) {
				
				this.mescroll.resetUpScroll();
			} else if (arg == 1) {
				this.goLogin(data => {
					if (!data) {
						this.mescroll.resetUpScroll();
					} else {
						this.current = 3;
					}
				});
			}
		},
		//开通小区获取地址
		getAddress() {
			var p = new Promise((resolve, reject) => {
				if (!uni.getStorageSync('longitude')) {
					resolve();
					// uni.getLocation({
					// 	success: res => {
					// 		// latitude: 30.39085
					// 		// longitude: 114.89495
					// 		uni.setStorageSync('latitude', res.latitude);
					// 		uni.setStorageSync('longitude', res.longitude);
					//      resolve();
					// 	},
					// 	fail: err => {
					// 		console.log(err);
					// 	}
					// });
				}
				resolve();
			});
			p.then(data => {
				// var that = this;
				// if (uni.getStorageSync('longitude')) {
				// 	uni.chooseLocation({
				// 		latitude: uni.getStorageSync('latitude'),
				// 		longitude: uni.getStorageSync('longitude'),
				// 		success: res => {
				// 			this.communityAddress = res.address
				// 		}
				// 	});
				// } else {
				// 	uni.showToast({
				// 		title: '您未开通地图授权，请输入地址',
				// 		icon:'none',
				// 		duration: 2000
				// 	});
				// }
			});
		},
		communityAddressInput(e) {
			this.communityAddress = e.detail.value;
		},
		communityTitleInput(e) {
			this.communityTitle = e.detail.value;
		},
		openCommunityHandler() {
		
			this.Api.communityOpening({ title: this.communityTitle, address: this.communityAddress, contact_phone: this.mobile }).then(result => {
				if (result.code == 1) {
					uni.showToast({
						title: result.msg,
						duration: 2000
					});
					this.openCommunity = false;
				} else {
					uni.showToast({
						title: result.msg,
						icon: 'none',
						duration: 2000
					});
				}
			});
		},
		//授权处理
		getUserInfo(e) {
			var p = new Promise((resolve, reject) => {
				uni.getLocation({
					success: res => {
						// latitude: 30.39085
						// longitude: 114.89495
						uni.setStorageSync('latitude', res.latitude);
						uni.setStorageSync('longitude', res.longitude);
						resolve();
					},
					fail: err => {
						console.log(err);
						resolve();
					}
				});
				
			});
			p.then(data => {
				//登录授权
				var { encryptedData, iv, rawData, signature } = e.detail;
				uni.login({
					success: result => {
						let { errMsg, code } = result;
						if (errMsg == 'login:ok') {
							var params = {
								code: code,
								encrypted_data: encryptedData,
								signature: signature,
								raw_data: rawData,
								iv: iv
							};
							this.Api.communityLogin(params).then(res => {
								if (res.code == 1) {
									uni.setStorageSync('token', res.data.token);
									uni.setStorageSync('user', res.data.user);
									uni.setStorageSync('all_community', res.data.all_community);
									this.community_id = res.data.all_community.length ? res.data.all_community[0].community_id : '';
									uni.setStorageSync('community_id', this.community_id);
									this.community_menu = res.data.all_community.length
										? res.data.all_community[0].title + (res.data.all_community[0].total ? res.data.all_community[0].total : '')
										: '问邻';
									this.all_community = res.data.all_community;
									
									this.loginFalse = false;
									this.guestShow = false;
									this.userinforeg = true;
									if(this.all_community.length == 0){
										this.guestFlag = true
									}
									if (this.all_community.length) {
										this.mescroll.resetUpScroll();
									} else {
										//如果开通过小区，待审核
										//this.current = 3;
										// this.setcommunity = true;
										//
										uni.navigateTo({
											url:'../update/selectcommunity'
										})
										console.log('pid');
										var pid = uni.getStorageSync('pid');
										if (pid) {
											this.community = uni.getStorageSync('ptitle');
											this.communityId = uni.getStorageSync('pcommunity_id');
										}
									}
								}
							});
						}
					}
				});
			});
		},
		//设置小区
		setcommunityHandler() {
			if (!this.communityId) {
				uni.showToast({
					title: '请选择小区',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!this.building) {
				uni.showToast({
					title: '请输入楼栋号',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!this.unit) {
				uni.showToast({
					title: '请输入单元号',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!this.room) {
				uni.showToast({
					title: '请输入门牌号',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			var data = {
				building: this.building,
				unit: this.unit,
				community_id: this.communityId,
				room: this.room,
				type: this.setcommunityType
			};
			var that = this;
			this.Api.setUserCommunityInfo(data).then(result => {
				if (result.code == 1) {
					uni.showToast({
						title: result.msg,
						duration: 2000,
						success: () => {
							uni.setStorageSync('committee_id', result.data.committee_id);
							uni.setStorageSync('community_id', result.data.community_id);
							uni.setStorageSync('community_menu', this.communityTitle);
							this.community_menu = this.communityTitle;
							this.current = 1;
							this.mescroll.resetUpScroll();
							this.setcommunity = false;
							this.guestShowOpen = false;
							//绑定上下级
							var pid = uni.getStorageSync('pid');

							if (pid) {
								var pdata = {
									from_user_id: pid
								};
								that.Api.inviteNeighbor(pdata).then(result => {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								});
							} else {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}
						}
					});
				}
			});
		},

		//选择小区
		chooseInput(e) {
			this.community_text = e.detail.value;
			var data = {
				title: this.community_text
			};
			if (!isNaN(this.community_text)) {
				this.community_text = 0;
				return;
			}
			if (this.community_text.length == 0) {
				return;
			}
			this.Api.searchCommunity(data).then(result => {
				if (result.code == 1) {
					this.searchCommunityList = result.data;
				}
			});
		},
		searchCommunity() {
			var data = {
				title: this.community_text
			};
			if (!this.community_text) {
				uni.showToast({
					title: '请输入要搜索的小区',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			this.Api.searchCommunity(data).then(result => {
				if (result.code == 1) {
					this.searchCommunityList = result.data;
				}
			});
		},
		//是否通过地图选择
		getMap() {
			// var that = this;
			// if (uni.getStorageSync('longitude')) {
			// 	uni.chooseLocation({
			// 		latitude: uni.getStorageSync('latitude'),
			// 		longitude: uni.getStorageSync('longitude'),
			// 		success: res => {
			// 			console.log(res);
			// 			this.community = res.name;
			// 		}
			// 	});
			// } else {
			// }
			var that = this;
			var p = new Promise((resolve, reject) => {
				if (!uni.getStorageSync('longitude')) {
					uni.getLocation({
						success: res => {
							// latitude: 30.39085
							// longitude: 114.89495
							uni.setStorageSync('latitude', res.latitude);
							uni.setStorageSync('longitude', res.longitude);
						},
						fail: err => {
							uni.showToast({
								title: '您未开通地图授权，请打开授权',
								icon: 'none',
								duration: 2000
							});
						}
					});
					resolve();
				}

				resolve();
			});
			p.then(data => {
				var that = this;
				// if (uni.getStorageSync('longitude')) {
				// 	uni.chooseLocation({
				// 		latitude: uni.getStorageSync('latitude'),
				// 		longitude: uni.getStorageSync('longitude'),
				// 		success: res => {
				// 			this.communityAddress = res.address
				// 		}
				// 	});
				// } else {
				// 	uni.showToast({
				// 		title: '您未开通地图授权，请输入地址',
				// 		duration: 2000
				// 	});
				// }
				that.Api.getNearCommunity({ latitude: uni.getStorageSync('latitude'), longitude: uni.getStorageSync('longitude') }).then(result => {
					if (result.code == 1) {
						that.searchCommunityList = result.data;
						that.community_text = '';
						that.chooseCommunity = true;
					}
				});
			});
		},
		//小区处理
		communityInput(e) {
			this.community = e.detail.value;
		},
		//楼栋处理 // replace(/[^\w\.\/]/ig,''
		buildingInput(e) {
			this.building = e.detail.value.replace(/[^a-z|0-9]/gi, '');
		},
		unitInput(e) {
			this.unit = e.detail.value.replace(/[^a-z|0-9]/gi, '');
		},
		roomInput(e) {
			this.room = e.detail.value.replace(/[^a-z|0-9]/gi, '');
		},
		// 分类点击
		cateClick(index) {
			this.postList = [];
			this.cateIndex = index;
			if (index == 0) {
				this.allFlag = true;
			} else {
				this.allFlag = false;
			}
			this.type = this.tagList[index].id;
			var token = uni.getStorageSync('token');
			if(!token){
				this.guestFlag = true
				return
			}else{
				 if(this.all_community.length == 0){
					 this.guestFlag = true
					 return
				 }
			}
			this.$nextTick(() => {
				if (this.type == 3) {
					this.flexType = true;
				} else {
					this.flexType = false;
				}
				if (this.type == 6) {
					var data = {
						community_id:uni.getStorageSync('community_id')
					}
					this.Api.myCenter(data).then((result)=>{
						if(result.code == 1){
							console.log(result.data.daren == 0,'esult.data.daren == 0')
							if(result.data.daren == 0){
								this.darenObj = result.data
								this.darenObj.user = {
									avatar:result.data.avatar,
									user_nickname:result.data.user_nickname
								}
								this.darenObj.regedit = true
								this.darenObj.type = 6
							}
								// this.mescroll.scrollTo(0, 300);
								this.mescroll.resetUpScroll();
								this.$forceUpdate();
							
						}else{
							// this.mescroll.scrollTo(0, 300);
								this.mescroll.resetUpScroll();
								this.$forceUpdate();
							
						}
					})
				}else{
					// this.mescroll.scrollTo(0, 300);
					this.mescroll.resetUpScroll();
					this.$forceUpdate();
				}
			});
		},
		//收藏处理
		moreClick(e) {
			this.goLogin(res => {
				if (!res) {
					this.findFaultType = e.type;
					this.findFaultCollect = e.user_favorite == 0 ? false : true;
					this.findFaultObject = e;
					this.findFaultValue = true;
				}
			});
		},
		//收藏处理
		fCollect(e) {
			var data = {
				object_id: this.findFaultObject.id,
				object_type: this.findFaultObject.type,
				community_id: uni.getStorageSync('community_id')
			};
			if (e.type == 5 || e.type == 7) {
				data.object_id = this.findFaultObject.object_id;
			}
			if (this.findFaultObject.user_favorite == 0) {
				this.Api.setFavorites(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
						this.findFaultValue = false;
						this.mescroll.resetUpScroll();
					} else {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				});
			} else if (this.findFaultObject.user_favorite == 1) {
				this.Api.unsetFavorites(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
						this.findFaultValue = false;
						this.mescroll.resetUpScroll();
					} else {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				});
			}
		},
		//找错处理
		fFind(e) {
			this.findFaultValue = false;
			this.messageText = '';
			this.$forceUpdate();
			this.messageShow = true;
		},
		report() {
			//findFaultObject
			uni.navigateTo({
				url: '/pages/update/report?object_id=' + this.findFaultObject.id + '&object_type=' + this.findFaultObject.type,
				success: () => {
					this.findFaultValue = false;
				}
			});
		},
		fClose() {
			this.findFaultValue = false;
		},
		//帮推处理
		helpPush(e) {
			this.goLogin(res => {
				if (!res) {
					this.helpObj = e;
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
				}
			});
		},
		Helpcancel() {
			this.helpShow = false;
		},
		ok(e) {
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
				object_id: this.helpObj.id,
				object_type: this.helpObj.type,
				community_id: uni.getStorageSync('community_id'),
				score: score
			};

			//
			// if(this.helpObj.type == 7 || this.helpObj.type == 5){
			// 	data.dynamics_id = this.helpObj.id
			// }
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
								this.mescroll.resetUpScroll();
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
				wiki_id: this.findFaultObject.object_id,
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
		// 分享弹窗
		shareClick(e) {
			this.goLogin(data => {
				if (!data) {
					this.findFaultObject = e;
					console.log(e,'e0')
					this.onShareShow = true;
				}
			});
		},
		onShowclose() {
			this.onShareShow = false;
		},
		onShowtodo() {
			var pages = getCurrentPages(); //获取加载的页面

			var currentPage = pages[pages.length - 1]; //获取当前页面的对象
			console.log(currentPage.route);
			// return
			var data = {};
			if (this.findFaultObject.publish_type == 1 || this.findFaultObject.publish_type == 3) {
				data.page = 'pages/index/detail';
			} else if (this.findFaultObject.publish_type == 2) {
				if (this.findFaultObject.type == 5) {
					data.page = 'pages/index/cdetail';
				} else {
					data.page = 'pages/index/detail';
				}
			} else {
				data.page = 'pages/index/detail';
			}
			if (this.findFaultObject.type == 5) {
				if (this.findFaultObject.publish_type == 2) {
					data.scene = 'id=' + this.findFaultObject.object_id + '&type=' + this.findFaultObject.type + '&d_id=' + this.findFaultObject.id;
				} else {
					data.scene = 'id=' + this.findFaultObject.id + '&type=' + this.findFaultObject.type;
				}
			} else if (this.findFaultObject.type == 7) {
				data.scene = 'id=' + this.findFaultObject.object_id + '&type=' + this.findFaultObject.type + '&d_id=' + this.findFaultObject.id;
			} else if (this.findFaultObject.type == 8) {
				data.scene = 'id=' + this.findFaultObject.object_id + '&type=' + this.findFaultObject.type + '&d_id=' + this.findFaultObject.id;
			} else {
				data.scene = 'id=' + this.findFaultObject.id + '&type=' + this.findFaultObject.type;
			}
			this.Api.getWXACodeUnlimit(data).then(result => {
				if (result.code == 1) {
					this.$nextTick(() => {
						this.onShareShow = false;
						this.posterData.posterImgUrl = this.findFaultObject.images.length ? this.findFaultObject.images[0] : 'https://sq.wenlinapp.com/appimg/share500400.jpg';
						if (this.findFaultObject.publish_type == 3 || this.findFaultObject.publish_type == 2) {
							this.posterData.title = this.findFaultObject.title;
						} else if (this.findFaultObject.publish_type == 1) {
							this.posterData.title = this.findFaultObject.content;
						} else {
							this.posterData.title = this.findFaultObject.title;
						}
						if (this.posterData.title.length > 35) {
							this.posterData.title = this.posterData.title.substr(0, 35) + '...';
						}
						this.posterData.avatarUrl = uni.getStorageSync('user').avatar;
						this.posterData.posterCodeUrl = result.data;
						this.posterData.des = uni.getStorageSync('user').user_nickname + '给你分享了一个' + Tool.resultValue(this.findFaultObject.type) + '信息';
						this.$forceUpdate();
						setTimeout(() => {
							this.canvasFlag = false; //显示canvas海报
							this.deliveryFlag = false; //关闭分享弹窗
							this.$refs.hchPoster.posterShow();
						}, 500);
					});
				}
			});
		},
		canvasCancel(val) {
			this.scrollFixed = false;
			this.canvasFlag = val;
		},
		onShowshare() {
			this.findFaultValue = false;
			this.onShareShow = false;
		},
		//信息处理
		messageLink() {
			this.goLogin(res => {
				if (!res) {
					uni.navigateTo({
						url: '/pages/update/message'
					});
				}
			});
		},
		//搜索处理
		searchLink() {
			this.goLogin(res => {
				if (!res) {
					uni.navigateTo({
						url: '/pages/update/search'
					});
				}
			});
		},
		createCanvasImageEvn() {
			// 这个是固定写死的小程序码
			Object.assign(this.posterData, {
				url: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg', //商品主图
				icon: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png', //醉品价图标
				title: '诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g', //标题
				des:
					' 以下是根据后端接口动态生成小程序码  以下是根据后端接口动态生成小程序码  以下是根据后端接口动态生成小程序码  以下是根据后端接口动态生成小程序码  以下是根据后端接口动态生成小程序码 ',
				discountPrice: '250.00', //折后价格 以下是根据后端接口动态生成小程序码  以下是根据后端接口动态生成小程序码
				orignPrice: '300.00', //原价
				code: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png' //小程序码
			});
			this.$forceUpdate(); //强制渲染数据
			setTimeout(() => {
				this.canvasFlag = false; //显示canvas海报
				this.deliveryFlag = false; //关闭分享弹窗
				this.$refs.hchPoster.createCanvasImage(); //调用子组件的方法
			}, 500);
			// 这个是固定写死的小程序码 end
			// 以下是根据后端接口动态生成小程序码
			// let code="https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png";
			// this.codeImg().then((res)=>{
			// 	code = res;
			// 	Object.assign(this.posterData,
			// 	{
			// 		url:'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg',//商品主图
			// 		icon:'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png',//醉品价图标
			// 		title:"诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g",//标题
			// 		discountPrice:"250.00",//折后价格
			// 		orignPrice:"300.00",//原价
			// 		code:code,//小程序码
			// 	})
			// 	this.$forceUpdate();//强制渲染数据
			// 	setTimeout(()=>{
			// 		this.canvasFlag=false;//显示canvas海报
			// 		this.deliveryFlag = false;//关闭分享弹窗
			// 		this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
			// 	},500)
			// })
			// 以下是根据后端接口动态生成小程序码 end
		}
	},
	components: {
		PostItem,
		UsedItem,
		Nodata,
		FindFault,
		LeaveWords,
		Onshare,
		Help,
		hchPoster,
		Integraltip
	}
	// onReachBottom(){
	// 	this.upOption.page.num ++
	// }
};
</script>

<style lang="scss" scoped>
page {
	background: white;
}

.content {
	display: flex;
	flex-direction: column;
	height: 100vh;
	.paiwarp{
		position: fixed;
		width:100%;
		height:calc(838rpx * 0.85);
		left:50%;
		top:50%;
		transform: translate(-50%,-50%);
		z-index: 4000;
		.pairect{
			position: fixed;
			width:85%;
			height:calc(720rpx * 0.85);
			left:50%;
			top:50%;
			transform: translate(-50%,-50%);
			z-index: 4000;
		}
		.paiclose{
			position: fixed;
			width:45rpx;
			height:45rpx;
			right:120rpx;
			top:calc(50% - 260rpx);
			z-index: 4000;
		}
		.paienter{
			position: fixed;
			width:358rpx;
			height:118rpx;
			left:50%;
			top:650rpx;
			transform: translateX(-50%);
			z-index: 4102;
		}
	}
	.xf{
		position: fixed;
		right:0;
		bottom: 300rpx;
		z-index: 50000;
		width:205rpx;
		height:123rpx;
	}
	.guestdata{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 40rpx auto;
		.guesttext{
			font-size: 34rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #95A0B6;
			margin-top:30rpx
		}
	}
	.guestpop {
		width: 100%;
		height: 100upx;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 24upx;
		padding-right: 24upx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
		z-index: 10000;
		.gtiptext {
			font-size: 30upx;
			color: white;
		}
		.gtipbtn {
			width: 160rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			background: #ff9c00;
			border-radius: 8rpx;
			font-size: 30rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			color: white;
		}
	}
	.uni-bottom-empty {
		width: 100%;
		height: 180upx;
		background: transparent;
	}
	.home {
		height: 100vh;
		width: 100%;
		box-sizing: border-box;
		background: #f7f9ff;

		box-sizing: border-box;
		.home-top {
			position: fixed;
			top:0;
			width:0;
			display: flex;
			flex-direction: column;
			width: 100%;
			background: white;
		}
		.joinlist{
			width: 100%;
			padding-left:48upx;
			padding-right:48upx;
			box-sizing: border-box;
			height: 88upx;
			margin-top:30upx;
			position: relative;
		.join-user {
			width: 100%;
			// padding: 24upx 0upx 0upx 0upx;
			box-sizing: border-box;
			height: 88upx;
			overflow-x: auto;
			display: -webkit-box;
			.imgwrap {
				width: 64upx;
				height: 64upx;
				margin-right: 20upx;
				border-radius: 50%;
				position: relative;
				.news {
					position: absolute;
					width: 40upx;
					height: 40upx;
					right: 0upx;
					bottom: 0upx;
				}
			}
			.grap{
				background:#95a0b4;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-right: 0!important;
				margin-left:10rpx!important;
				.rr{
					width:8rpx;
					height:8rpx;
					margin:0 4rpx;
					background:white;
					border-radius: 50%;
				}
			}
		}
		.usernumber{
			width: 64upx;
			height: 64upx;
			line-height: 64upx;
			text-align: center;
			background: #FF9C00;
			border-radius: 50%;
			font-size: 22upx;
			color:white;
			position: absolute;
			right:30upx;
			top:24upx;
		}
		}
		.search {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			padding: 20upx 45upx;
			box-sizing: border-box;
			// margin-bottom: 24upx;
			.searchleft {
				width: 600upx;
				height: 80upx;
				border-radius: 40upx;
				padding: 0 42upx;
				box-sizing: border-box;
				background: #f5f6fa;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				margin-right: auto;
				.ico {
					width: 33upx;
					height: 33upx;
					margin-right: 30upx;
				}
				.search-text {
					font-size: 28upx;
					padding-left: 5upx;
					color: #95a0b6;
				}
			}
			.searchright {
				width: 44upx;
				height: 52upx;
				margin-right: 0upx;
				margin-left: auto;
				position: relative;
				.red {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
				.redtext {
					position: absolute;
					right: -10upx;
					top: -10upx;
					width: 40upx;
					height: 40upx;
					text-align: center;
					font-size: 20upx;
					line-height: 40upx;
					border-radius: 50%;
					border: 1px solid white;
					color: white;
					background: rgba(255, 43, 32, 1);
					border: 2px solid white;
				}
			}
		}
		.menuwrap {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding-bottom: 20upx;
			box-sizing: border-box;
			border-bottom: 1px solid #eef2fa;
			width: 100%;
			position: relative;
			text {
				width: fit-content;
				padding-left: 32upx;
				padding-right: 32upx;
				font-size: 34upx;
				color: #333333;
				font-weight: bold;
				height: 60upx;
				line-height: 60upx;
			}
			.nearbywrap {
				display: flex;
				flex-direction: row;
				align-items: center;
				position: absolute;
				right: 30upx;
				top: 50%;
				transform: translateY(-50%);
				.nerico {
					width: 45upx;
					height: 45upx;
				}
				.nearbytext {
					font-size: 20upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #020433;
					line-height: 40upx;
					border-bottom: 2upx solid #404b69;
				}
			}
			.active {
				font-size: 44upx;
				color: #ff9c00;
				font-weight: bold;
				position: relative;
			}
			.active::after {
				position: absolute;
				content: '';
				left: 50%;
				bottom: -15upx;
				transform: translateX(-50%);
				width: 48upx;
				height: 8upx;
				background: rgba(255, 156, 0, 1);
				border-radius: 4upx;
			}
		}

		.tagwrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			padding: 19upx 48upx;
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
				margin-left:0rpx;
				text-align: center;
				background: #eef2fa;
				border-radius: 10upx;
			}
			.active {
				background: #FF9C00;
				color: white;
			}
		}
		.postwrap {
			display: flex;
			flex-direction: column;
		}
		.usedwrap {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		,
		.usedwrapfix {
			display: flex;
			flex-direction: column;
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
		// 开通小区
		.openarea {
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 3009;
			width: 100%;
			height: 652upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 16upx 16upx 0upx 0upx;
			display: flex;
			flex-direction: column;
			padding-left: 48upx;
			padding-right: 48upx;
			box-sizing: border-box;
			.openheader {
				height: 100upx;
				line-height: 100upx;
				font-size: 32upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				display: flex;
				align-items: center;
				text {
					flex: 1;
					display: flex;
					justify-content: center;
				}
				.opencolse {
					width: 31upx;
					height: 31upx;
				}
				.selectback {
					position: absolute;
					left: 48upx;
					top: 50upx;
					margin-top: -16upx;
					width: 23upx;
					height: 32upx;
				}
			}
			.openitem {
				display: flex;
				flex-direction: row;
				align-items: center;
				position: relative;
				height: 90upx;
				border-bottom: 2upx solid rgba(222, 222, 222, 0.3);
				.opentitle {
					width: 120upx;
					font-size: 30upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					margin-right: 30upx;
					text-align: right;
				}
				.opentxt {
					width: calc(100% - 72upx - 150upx);
					font-size: 26upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 0.5);
					// display: flex;
					// justify-content: flex-end;
				}
				.opendown {
					width: 30upx;
					height: 20upx;
					margin-left: auto;
				}
				input {
					width: calc(100% - 72upx - 150upx);
				}
				.adico {
					width: 32upx;
					height: 42upx;
					display: flex;
					margin-left: auto;
				}
				.openmobile {
					width: 136upx;
					height: 56upx;
					background: rgba(255, 156, 0, 1);
					border-radius: 8upx;
					border: none;
					font-size: 26upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					line-height: 56upx;
					text-align: center;
					padding: 0;
				}
			}
			// 说明
			.openinfo {
				width: 100%;
				font-size: 22upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 32upx;
				margin-top: 20upx;
				.rcolor {
					color: #ff9c00;
				}
			}
			.openbutton {
				width: 100%;
				height: 80upx;
				background: #ff9c00;
				border-radius: 8upx;
				font-size: 34upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(255, 255, 255, 1);
				line-height: 80upx;
				text-align: center;
				margin-top: 64upx;
			}
			.hover-openbutton {
				background: rgba(255, 156, 0, 0.5) !important;
			}
		}
		//选择业主
		.chooseid {
			height: 500upx;
			bottom: 0;
			// bottom:calc(100rpx + env(safe-area-inset-bottom) / 2);
			.pickerview {
				width: 100%;
				height: 200upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.item {
					width: 100%;
					font-size: 34upx;
					text-align: center;
				}
			}
		}
		//选择小区
		.choosecommunity {
			height: 798upx;
			.searchwrap {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				input {
					padding-left: 25upx;
					padding-right: 25upx;
					box-sizing: border-box;
					width: 580upx;
					height: 64upx;
					background: rgba(222, 222, 222, 0.3);
					border-radius: 32upx;
				}
				.choosetext {
					font-size: 28upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
			}
			.searchlist {
				display: flex;
				flex-direction: column;
				padding-top: 16upx;
				padding-bottom: 16upx;
				box-sizing: border-box;
				height: 400upx;
				overflow: hidden;
				overflow-y: auto;
				.searchitem {
					display: flex;
					flex-direction: row;
					align-items: center;
					// padding-bottom: 24upx;
					// padding-top:24upx;
					// height: 200upx;
					flex: 0 0 120upx;
					border-bottom: 2upx solid rgba(222, 222, 222, 0.5);
					.searchico {
						width: 12upx;
						height: 12upx;
						background: rgba(153, 153, 153, 0.6);
						border-radius: 50%;
						margin-right: 20upx;
					}
					.comminginfo {
						display: flex;
						flex-direction: column;
						width: 100%;

						.title {
							height: 42upx;
							font-size: 30upx;
							// font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight: 500;
							color: rgba(51, 51, 51, 1);
							line-height: 42upx;
						}
						.addressinfo {
							height: 32upx;
							font-size: 22upx;
							// font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight: 500;
							color: rgba(153, 153, 153, 1);
							line-height: 32upx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
			.welcomeopen {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 72upx;
				.welcometext {
					font-size: 30upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					line-height: 42upx;
					margin-right: 34upx;
				}
				.welcomebtn {
					width: 142upx;
					height: 56upx;
					background: rgba(255, 156, 0, 1);
					border-radius: 8upx;
					line-height: 56upx;
					text-align: center;
					font-size: 28upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
				}
			}
		}
		// 个人信息
		.openinfomation {
			height: 916upx;
		}
		// 等待小区
		.community {
			display: none;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 360upx;
			height: 160upx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 16upx;
			font-size: 28upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			line-height: 40upx;
			padding: 40upx;
			box-sizing: border-box;
		}
		// 登录方式
		.content {
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 560upx;
			height: 720upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 16upx;
			z-index: 3002;
			padding-left: 32upx;
			padding-right: 32upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.wlimg {
				width: 560upx;
				height: 400upx;
				margin-top: 0upx;
				border-radius: 16upx 16upx 0 0;
			}
			.popupclose {
				position: absolute;
				right: 26upx;
				top: 26upx;
				width: 30upx;
				height: 30upx;
			}
				.testBtn{
					position: fixed;
					top:440upx;
					left:50%;
					transform: translateX(-50%);
					width:300upx;
					height:90upx;
					background: rgba(255, 156, 0, 1);
					color:white;
					border-radius: 10upx;
					font-size: 36upx;
					line-height: 90upx;
					text-align: center;
					z-index: 3004;
				}
			.loginwrap {
				position: fixed;
				top: 460upx;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				display: flex;
				flex-direction: column;
				z-index: 3003;
				.logintitle {
					text-align: center;
					width: 180upx;
					height: 40upx;
					font-size: 28upx;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					line-height: 40upx;
					margin: 0 auto;
					background: white;
				}
				.logintype {
					width: 100%;
					display: flex;
					flex-direction: row;
					padding-top: 50upx;
					padding-left: 100upx;
					padding-right: 100upx;
					box-sizing: border-box;
					.loginitem {
						width: 50%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.weixinbtn {
							background-color: white;
							border: none;
							font-size: 24upx;
							font-weight: 500;
							color: rgba(51, 51, 51, 1);
							line-height: 34upx;
							white-space: nowrap;
							display: flex;
							flex-direction: column;
							justify-content: center;
							image {
								width: 84upx;
								height: 84upx;
								margin: 0 auto;
								margin-bottom: 16upx;
							}
						}
						.weixinbtn::after {
							border: 0;
						}
						image {
							width: 84upx;
							height: 84upx;
							margin-bottom: 16upx;
						}
						text {
							font-size: 24upx;
							font-weight: 500;
							color: rgba(51, 51, 51, 1);
							line-height: 34upx;
						}
					}
				}
			}
			.logintitles {
				position: fixed;
				z-index: 3002;
				left: 50%;
				transform: translateX(-50%);
				top: 480upx;
				height: 2upx;
				width: 90%;
				background: #999999;
			}
		}
		.contentfix {
			padding-left: 0upx;
			padding-right: 0upx;
		}
		//发布样式
		.pushcatewrap {
			position: fixed;
			left: 0;
			width: 100%;
			height: 472upx;
			bottom: 0;
			z-index: 6000;
			background: white;
			border-radius: 24upx 24px 0px 0upx;
			padding-top: 64upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			.pushclose {
				position: absolute;
				bottom: 108upx;
				left: 50%;
				transform: translateX(-50%);
				width: 104upx;
				height: 104upx;
				// box-shadow:0px 12upx 20upx 0px rgba(0,0,0,0.1);
				border-radius: 50%;
			}
			.pushcateitem {
				width: 20%;
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 160upx;
				image {
					width: 80upx;
					height: 80upx;
				}
				text {
					font-size: 26upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #666666;
					line-height: 36upx;
					height: 36upx;
					margin-top: 16upx;
				}
			}
		}
	}
	.popupfix {
		z-index: 50000;
	}
	.btns {
		width: 100upx;
		height: 100upx;
	}
}
</style>
