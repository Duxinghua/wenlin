<template>
	<!-- 居委会 -->
	<view :class="['personalcard',scrollFixed ? 'pcontentfix' : '']">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="pcontent" :style="{'margin-top':heightPx}">
			<view class="swiper-wrap">
				<swiper
					class="swiper"
					:indicator-color="indicatorColor"
					:indicator-active-color="indicatorActiveColor"
					:indicator-dots="indicatorDots"
					:autoplay="autoplay"
					:interval="interval"
					:duration="duration"
				>
					<swiper-item v-for="(item,index) in detail.images" :key="index" :index="index">
						<view :src="item" class="swiperimg" mode="aspectFill">
							<u-image :src="item" height='629'  mode="aspectFill"></u-image>
						</view>
					</swiper-item>

				</swiper>
				<view class="userheader">
								<view class="avatarwrap">
				<!-- 					<view class="header"> -->
										<u-image :src="detail.logo" :height="headerHeight" ></u-image>
							<!-- 		</view> -->
								<!-- 	<image :src="detail.logo" class="heading"></image> -->
									
									<!-- 					<image src="../../static/da.png" class="daing"></image> -->
								</view>
								<view class="userinfo">
									<text class="username">{{detail.title}}</text>
									<view class="userdes"><text class="u1">{{detail.create_time | formatTimeYMD}} 创建</text></view>
								</view>
							</view>
			</view>
			<view class="navlist">
				<view class="navitem" v-for="(item,index) in navList" :key="index" @click="navClick(item)">
					<image :src="item.image" mode=""></image>
					<text>{{item.value}}</text>
				</view>
			</view>
			<view class="somethingwrap">
				<view class="sometop">
					<text class="header">新鲜事</text>
					<view class="lookall" @click="goAll">
						<text class="looktext">全部</text>
						<image class="lookico" src="../../static/cardmore.png"></image>
					</view>
				</view>
				<view class="somelist">
					<view class="someitem" v-for="(item,index) in detail.dynamics" :key="index" @click="postDetail(item)">
						<text class="sometype">[{{item.type | listValue}}]</text>
						<text class="sometitle">{{item.title}}</text>
						<text class="sometime">{{item.create_time | formatTimeMd}}</text>
					</view>

				</view>
			</view>
			<view class="somethingwrap commentwrap">
				<view class="sometop">
					<text class="header">留言板</text>
					<view class="lookall" style="display: none;">
						<text class="looktext">全部</text>
						<image class="lookico" src="../../static/cardmore.png"></image>
					</view>
				</view>
				<view class="somelist">
					<Comment v-for="(item,index) in commitList" :replyFlag="replyFlag" :key="index" :pitem="item" @reply="replyHandler" @flover="floverHandler" @del="delHandler"/>
					
				</view>
			</view>
			<!-- <view class="lybtn">加入小区</view> -->
			<!-- 留言组件 -->
			<view class="popup" style="display: none;">
				<view class="mb"></view>
				<view class="message">
					<view class="openheader">
						<text>留言</text>
						<image src="../../static/close.png" class="opencolse" @click="closePicker" />
					</view>
					<view class="textwrap">
						<view class="tip">
							<text class="t1">0</text>
							<text class="t2">/200</text>
						</view>
						<textarea class="textarea" placeholder="想对TA说点什么，不超过200字"></textarea>
					</view>
					<view hover-class="hoverclass">提交</view>
				</view>
			</view>

		</view>
		<Mobile @closewxsj="closewxsj" :wxsj="wxsj" :list="mobileList"></Mobile>
		<!-- 回复框 -->
		<view class="reply">
			<view class="inputrow" @click="replyInit">
				<view class="inputwrap inputwrapinit" >
					<input
						maxlength="500"
						type="text"
						:disabled="true"
						:placeholder="'给'+detail.type_title+'留言'"
					/>
				</view>
		
<!-- 				<view class="sharebtns">
					发送
				</view> -->
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
						:placeholder="'给'+detail.type_title+'留言'"
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
	</view>
</template>

<script>
import Tool from '@/utils/tool.js'
import emotion from '@/components/bkhumor-emoji/index.vue'
import Comment from '@/components/comment/comment.vue'
import Mobile from '../../components/mobile/mobile.vue'
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	data() {
		return {
			config: {
				title: '居委会', //title
				bgcolor: 'white', //背景颜色
				fontcolor: 'rgba(51, 51, 51, 1)', //文字颜色，默认白色
				type: 1, //type 1，3胶囊 2，4无胶囊模式
				transparent: true, //是否背景透明 默认白色
				linear: false, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			indicatorColor: 'rgba(255, 255, 255, 1)',
			indicatorActiveColor: 'rgba(255, 156, 0, 1)',
			navList:[
				{
					id:1,
					value:'简介',
					image:require('../../static/com1ico.png')
				},
				{
					id:2,
					value:'活动',
					image:require('../../static/com2ico.png')
				},
				{
					id:3,
					value:'便民',
					image:require('../../static/com3ico.png')
				},
				{
					id:4,
					value:'招聘',
					image:require('../../static/com4ico.png')
				},
				{
					id:5,
					value:'动态',
					image:require('../../static/com4ico.png')
				}
			],
			navLists:[
				{
					id:1,
					value:'简介',
					image:require('../../static/c-d-ico.png')
				},
				{
					id:2,
					value:'工作人员',
					image:require('../../static/c-w-ico.png')
				},
				{
					id:3,
					value:'电话',
					image:require('../../static/c-p-ico.png')
				},
				{
					id:4,
					value:'导航',
					image:require('../../static/c-l-ico.png')
				}
			],
			showReply:false,
			committee_id:'',
			detail:{},
			wxsj:false,//手机号显示 控制 
			mobileList:[],
			inputValues:'',//留言处理
			inputValue:'',
			commitList:[],
			page:1,
			page_size:10,
			total_pages:0,
			parent_text:'给居委会留言',
			replyFlag:false,
			autoBottom:0,
			scrollFixed:false,
			showconfirmbar:false,
			adjustposition:false,
			replyTextarea:false,
			textareaautofocus:false,
			isShowEmj:false,
			heightPx:'-100px',
			//{{online}}/api/community/committee/myCommitteeList 参数  type  0查询全部，111 => "居委会", 112 => "街道", 113 => "业委会"，114=>"物业"
			typeList:{
				111:'居委会',
				112:'街道',
				113:'业委会',
				114:'物业'
			}
		};
	},
	onShareAppMessage: function() {
			return {
				title: this.detail.title,
				imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png'
			};
	},
	onShareTimeline(e) {
		var title = this.detail.title;
		var query = {
			id:this.committee_id,
			community_id:uni.getStorageSync('community_id')
		};
		// query=JSON.stringify(query);
		return {
			title: title,
			imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
			query: query
		};
	},
	mounted(){
		this.committee_id = this.$mp.query.id
		var data ={
			committee_id:this.committee_id
		}
		uni.setStorageSync('committee_id',this.committee_id)
		if(this.$mp.query.community_id){
			uni.setStorageSync('community_id',this.$mp.query.community_id)
		}
		this.getDetail(data)
		this.getList()
	},
	methods: {
		height(){
			const {platform,statusBarHeight} = uni.getSystemInfoSync()
			let height = statusBarHeight +4 //ios 24px
			if (platform.toLowerCase() == "android" ){
				height +=4 //android 28px
			}
			// 胶囊高度 32px 下边框6px height 状态栏高度
			
			return "-"+height+ 38 + "px"
		},
		replyInit(){
			if(uni.getStorageSync('singPage') == 1){
				uni.showToast({
					title: '请前往小程序使用完整服务',
					icon:'none',
					duration: 2000,
				})
				return
			}
			this.replyTextarea = true
			this.textareaautofocus = true
			this.scrollFixed = true
		},
		closeReplyInit(){
				this.replyTextarea = false
				this.textareaautofocus = false
				this.scrollFixed = false
				this.parent_text = '给居委会留言'
		},
		postDetail(pitem){
			var type = pitem.type
			var publish_type = pitem.publish_type //2为居委会 3小区
			if(type == 5 && publish_type == 2){
				uni.navigateTo({
					url:'/pages/index/cdetail?dynamics_id='+pitem.id+'&type='+pitem.type+'&id='+pitem.object_id
				})
			}else{
				if( type == 7 || type == 8){
					uni.navigateTo({
						url:'/pages/index/detail?dynamics_id='+pitem.id+'&type='+pitem.type+'&id='+pitem.object_id
					})
					
				}else{
					uni.navigateTo({
						url:'/pages/index/detail?id='+pitem.id+'&type='+pitem.type
					})
				}
			}
		},
		goAll(){
			uni.navigateTo({
				url:'/pages/update/dynamicslist'
			})
		},
		InputBlur(e) {
			this.autoBottom = 0
		},
		getList(ismore){
			var data = {
				page:this.page,
				page_size:this.page_size,
				community_id:uni.getStorageSync('community_id'),
				committee_id:uni.getStorageSync('committee_id')
			}
			this.Api.getLeaveMessages(data).then((result) => {
				if(ismore){
					var res = result.data.list
						this.total_pages = result.data.total_pages
						res.map((item)=>{
							item.nodes = new String(item.content).toString().replace(/\[em\_(\d{1,3})\]/g,'<img class="imgemoji" style="width:21px" src=https://sq.wenlinapp.com/bkhumor-emoji/'+"$1"+'.gif  align=middle/>')
							if(item.children){
								item.children.map(sitem => {
									sitem.nodes = '<p style="display:inline-block"><i style="color:#ff9c00;font-style: inherit;margin-right:2px;white-space:nowrap">'+ sitem.user.user_nickname +'</i> <i style="color:#333333;font-style: inherit;white-space:nowrap">回复</i> <i style="margin-left:2px;margin-right:2px;color:#ff9c00;font-style: inherit;white-space:nowrap">'+sitem.to_user.user_nickname+'</i>:<i style="margin-left:3px;font-style: inherit">' + new String(sitem.content)
										.toString()
										.replace(/\[em\_(\d{1,3})\]/g, '<span style="width:21px;height:21px;position:relative;margin-right:25px"><img style="position: absolute;left: 0;top: -2px;width:21px;" class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/></span>') +'</i></p>';
								});
							}
						})
					this.commitList = this.commitList.concat(res)
				}else{
					var res = result.data.list
						this.total_pages = result.data.total_pages
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
					this.commitList = res
	
				}
			})
		},
		closewxsj(){
			this.wxsj = false
		},
		getDetail(data){
			this.Api.getCommitteeDetail(data).then((result) => {
				if(result.code == 1){
					this.detail = result.data
					this.config.title = this.detail.type_title
					var res = {
						text:'固话',
						num:this.detail.contacts
					}
					this.mobileList.push(res)
				}
			})
		},
		closePicker() {},
		faceClick(){
			this.isShowEmj = !this.isShowEmj;
			
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
		InputFocus(e){
			this.autoBottom = e.detail.height
			this.isShowEmj = false;
			this.replyFlag = false
			this.$emit('foc')
		},
		inputValueHander(e){
			if(!this.inputValue){
				uni.showToast({
					icon:'',
					title:'请输入评论内容'
				})
				return;
			}
			var data = {
				community_id:uni.getStorageSync('community_id'),
				committee_id:uni.getStorageSync('committee_id'),
				content:this.inputValue
			}
			this.Api.setLeaveMessage(data).then((result) => {
				if(result.code == 1){
					uni.showToast({
						icon:'success',
						title:result.msg,
						duration:2000,
						success: () => {
							this.inputValue = ''
							this.replyTextarea = false
							this.textareaautofocus = false
							this.scrollFixed = false
							this.showReply = false
							this.getList()
						}
					})

					
				}
			})
		},
		navClick(obj){
			if(obj.id == 1){
				uni.navigateTo({
					url: '/pages/update/committeedetail?id='+this.committee_id
				})
			}else if(obj.id == 2){
					uni.navigateTo({
						url:'/pages/update/dynamicslist?type=5&title='+this.detail.type_title+'活动'
					})
				// uni.navigateTo({
				// 	url: '/pages/index/committeeworker?id='+this.committee_id
				// })
			}else if(obj.id == 3){
					uni.navigateTo({
						url:'/pages/update/dynamicslist?type=7&title='+this.detail.type_title+'便民'
					})
				// this.wxsj = true
			}else if(obj.id == 4){
				uni.navigateTo({
						url:'/pages/update/dynamicslist?type=15&title='+this.detail.type_title+'招聘'
				})
				// var {address,longitude,latitude,contacts,business_time,title,images,...data} = this.detail
				// var data = {
				// 	title,
				// 	address,
				// 	longitude,
				// 	latitude,
				// 	contacts,
				// 	business_time,
				// 	images
				// }
				// uni.navigateTo({
				// 	url: '/pages/index/committeemap?data='+JSON.stringify(data)
				// })
			}else if(obj.id == 5){
				uni.navigateTo({
						url:'/pages/update/dynamicslist?type=8&title='+this.detail.type_title+'动态'
				})
			}
		},
		//评论点赞
		floverHandler(e){
			if(uni.getStorageSync('singPage') == 1){
				uni.showToast({
					title: '请前往小程序使用完整服务',
					icon:'none',
					duration: 2000,
				})
				return
			}
			var data = {
				object_id:e.id,
				object_type:11,
				community_id:uni.getStorageSync('community_id')
				
			}
			if(this.type == 7){
				data.dynamics_id = this.dynamics_id
			}
			if(e.user_like == 0){
				this.Api.setLikes(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								this.$nextTick(() => {
									this.commitList.map((item) => {
										if(item.id == e.id){
											item.like = item.like+1
											item.user_like = 1
										}
										
									})
									this.$forceUpdate()
								})
							}
						});
					}
				})
			}else if(e.user_like == 1){
				this.Api.unsetLikes(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								this.$nextTick(() => {
								
									this.commitList.map((item) => {
										if(item.id == e.id){
											item.like = item.like ? (item.like - 1) : 0
											item.user_like = 0
										}
										
									})
									this.$forceUpdate()
									
								})

						
							}
						});
					}
				})
			}
		}
	},
	onReachBottom() {
		console.log(1,'ss',this.total_pages,this.page)
		if(this.page < this.total_pages){
			this.page++
			this.getList(true)
		}
	},
	components: {
		navigationCustom,
		Mobile,
		Comment,
		emotion
	},
	computed:{
		headerHeight(){
			return 96
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background: white !important;
}
.personalcard {
	display: flex;
	flex-direction: column;
	background: whtie !important;
	min-height: 100vh;
	padding-bottom: 320upx;
	.pcontent {
		padding: 24upx 0upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.userheader {
			padding: 0upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;
			position: absolute;
			background: rgba(0,0,0,0.5);
			width:100%;
			height:140rpx;
			left:0rpx;
			bottom: 0rpx;
			.avatarwrap {
				width: 96upx;
				height: 96upx;
				margin-right: 16upx;
				border-radius: 50%;
				overflow: hidden;
				position: relative;
				.heading {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					overflow: hidden;
				}
				.daing {
					position: absolute;
					right: 0;
					bottom: 0;
					width: 40upx;
					height: 40upx;
				}
			}
			.userinfo {
				display: flex;
				flex-direction: column;
				.username {
					height: 42upx;
					font-size: 30upx;
					font-family: PingFang-SC-Regular,PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #ffffff;
					line-height: 42upx;
				}
				.userdes {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top: 8upx;
					.u1 {
						font-size: 24upx;
						font-family: PingFang-SC-Regular,PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #ffffff;
						line-height: 34upx;
						margin-right: 24upx;
					}
					.u2 {
						width: 36upx;
						height: 32upx;
						background: rgba(255, 156, 0, 0.1);
						border-radius: 8upx;
						font-size: 20upx;
						font-family: PingFang-SC-Regular,PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: #ffffff;
						line-height: 32upx;
						text-align: center;
					}
				}
			}
			.userbtn {
				width: 126upx;
				border-radius: 8upx;
				border: 2upx solid rgba(255, 156, 0, 1);
				height: 56upx;
				font-size: 26upx;
				font-family: PingFang-SC-Regular,PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(255, 156, 0, 1);
				line-height: 56upx;
				text-align: center;
				margin-left: auto;
			}
		}
		.swiper-wrap {
			width: 100%;
			height: 629upx;
			margin-top: 26upx;
			position: relative;
			.swiper {
				width: 100%;
				height: 100%;
			}
			.swiperimg{
				width:100%;
				height:100%;
			}
		}
		.navlist{
			margin-top:48upx;
			margin-bottom:48upx;
			padding-left:40upx;
			padding-right:40upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			.navitem{
				width:25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				image{
					width:112upx;
					height:112upx;
				}
				text{
					height:36upx;
					font-size:26upx;
					font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
					line-height:36upx;
					margin-top:12upx;
					font-weight: bold;
					color: #020433;
					line-height: 36upx;
				}
			}
		}
		.somethingwrap{
			padding: 0upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			margin-top:16upx;
			.sometop{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.header{
					font-size:32upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					line-height:44upx;
				}
				.lookall{
					display: flex;
					flex-direction: row;
					align-items: center;
					.looktext{
						font-size:26upx;
						font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
					.lookico{
						width:40upx;
						height:40upx;
						margin-left:5upx;
					}
				}
			}
			.somelist{
				display: flex;
				flex-direction: column;
				.someitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size:28upx;
					font-family:PingFang-SC-Regular,PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					line-height:40upx;
					padding-top:32upx;
					padding-bottom: 32upx;
					border-bottom: 1px solid rgba(222, 222, 222, 0.5);
					.sometype{
						margin-right:5upx;
						color:rgba(255,156,0,1);
						max-width: 280upx;
						white-space: nowrap;
					}
					.sometitle{
						font-weight: 500;
						color:rgba(51, 51, 51, 1);
						width:450upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.sometime{
						margin-left:auto;
						font-size:26upx;
						font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						line-height:36upx;
					}
				}
			}
		}
		.commentwrap{
			padding-top:44upx;
		}
		.useritem {
			display: flex;
			flex-direction: row;
			height: 106upx;
			line-height: 106upx;
			width: 100%;
			align-items: center;
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
			.t1 {
				width: 112upx;
				margin-right: 24upx;
				text-align: right;
				font-size: 28upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.t2 {
				font-size: 28upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}
			.ti {
				width: 40upx;
				height: 40upx;
				margin-left: auto;
			}
		}
		.useritemfix {
			height: 118upx;
			line-height: 118upx;
			.imgwrap {
				display: flex;
				flex-direction: row;
				.imgitem {
					width: 72upx;
					height: 72upx;
					border-radius: 8upx;
				}
			}
		}
		.lybtn {
			width: 702upx;
			height: 80upx;
			background: rgba(255, 156, 0, 1);
			box-shadow: 0px 8upx 16upx 0px rgba(225, 138, 0, 0.1);
			border-radius: 40upx;
			font-size: 36upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			line-height: 80upx;
			text-align: center;
			margin-top: 234upx;
			position: relative;
			left: 0upx;
			bottom: 108upx;
		}
		.gbbtn {
			width: 702upx;
			height: 80upx;
			background: rgba(216, 216, 216, 1);
			box-shadow: 0px 8upx 16upx 0px rgba(51, 51, 51, 0.1);
			border-radius: 40upx;
			font-size: 36upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			line-height: 80upx;
			text-align: center;
			margin-top: 40upx;
		}

		.popup {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 40000;
			.mb {
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 4001;
				background: rgba(0, 0, 0, 0.6);
			}
			// 留言
			.message {
				position: fixed;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 760upx;
				z-index: 4001;
				width: 750upx;
				height: 760upx;
				padding-left: 24upx;
				padding-right: 24upx;
				box-sizing: border-box;
				background: rgba(255, 255, 255, 1);
				border-radius: 16upx 16upx 0px 0px;
				.openheader {
					height: 108upx;
					line-height: 108upx;
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
				.textwrap {
					width: 100%;
					height: 400upx;
					background: rgba(222, 222, 222, 0.3);
					border-radius: 8upx;
					position: relative;
					.textarea {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						padding: 20upx;
						font-size: 26upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
						line-height: 36upx;
					}
					.tip {
						position: absolute;
						right: 20upx;
						bottom: 20upx;
						font-size: 26upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						line-height: u36px;
						display: flex;
						flex-direction: row;
						.t2 {
							color: rgba(153, 153, 153, 1);
						}
					}
				}
				hoverclass {
					background: rgba(255, 156, 0, 1);
				}
			}
			.message view:last-child {
				width: 702upx;
				height: 80upx;
				background: rgba(255, 156, 0, 0.5);
				box-shadowss: 0px 8upx 16upx 0px rgba(225, 138, 0, 0.1);
				border-radius: 40upx;
				margin-top: 64upx;
				font-size: 36upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				line-height: 80upx;
				text-align: center;
			}
		}

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
					height: 200upx;
					box-sizing: border-box;
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					color: #333333;
				}
			}
			.sharebtns{
				font-size: 34upx;
				color:#333333;
			}
			.inputwrapinit{
				flex:1;
				// margin-right:30upx;
				//width: 520upx; //420upx
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
}
	.pcontentfix{
		overflow: hidden;
		height: 100vh;
	}
</style>
