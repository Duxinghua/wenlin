<template>
	<!-- 我的消息 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="headerwrap">
				<view class="headeritem" @click="headerClick(1)">
					<view :class="['headericos',headerIndex == 1 ? 'headericosac' :'']">
						<image :src="headerIndex == 1 ? '../../static/a1a.png' : '../../static/a1.png'" class="headerico"></image>
						<view class="numtext" v-if="unreads.sys_notices_unread">{{ unreads.sys_notices_unread < 99 ? unreads.sys_notices_unread : '99+' }}</view>
					</view>
					<text class="headertext">系统</text>
				</view>
				<view class="headeritem" @click="headerClick(2)">
					<view :class="['headericos',headerIndex == 2 ? 'headericosac' :'']">
						<image :src="headerIndex == 2 ? '../../static/a2a.png' : '../../static/a2.png'" class="headerico"></image>
						<view class="numtext" v-if="unreads.comment_unread">{{ unreads.comment_unread < 99 ? unreads.comment_unread : '99+' }}</view>
					</view>
					<text class="headertext">评论</text>
				</view>
				<view class="headeritem" @click="headerClick(3)">
					<view :class="['headericos',headerIndex == 3 ? 'headericosac' :'']">
						<image :src="headerIndex == 3 ? '../../static/a3a.png' : '../../static/a3.png'" class="headerico"></image>
						<view class="numtext" v-if="unreads.thanks_unread">{{ unreads.thanks_unread < 99 ? unreads.thanks_unread : '99+' }}</view>
					</view>
					<text class="headertext">答谢</text>
				</view>
				<view class="headeritem" @click="headerClick(4)">
					<view :class="['headericos',headerIndex == 4 ? 'headericosac' :'']">
						<image :src="headerIndex == 4 ? '../../static/a4a.png' : '../../static/a4.png'" class="headerico"></image>
						<view class="numtext" v-if="unreads.leave_message_unread">{{ unreads.leave_message_unread < 99 ? unreads.leave_message_unread : '99+' }}</view>
					</view>
					<text class="headertext">留言</text>
				</view>
			</view>
			<view class="list">
				<view class="listitem" v-for="(item, index) in sysNoticesList" :key="index" :index="index" @click="goDetail(item.id)" v-if="headerIndex == 1">
					<view class="t1">
						<view class="s1">
							{{ item.title }}
							<text class="st" v-if="item.read_status == 0"></text>
						</view>
						<text class="s2">{{ item.create_time | formatTime }}</text>
					</view>
					<view class="t2" v-if="item.object_type != 6">{{ item.content }}</view>
					<view class="t2" v-if="item.object_type == 6">
						您的房间号已被昵称为
						<text class="red" v-for="(sitem,sindex) in item.info_json" :key="sindex" @click.stop="goPer(sitem)">{{sitem.user_nickname}}{{sindex == item.info_json.length - 1 ? '' : ','}}</text>
						的用户注册，请注意核实，如有问题，可对相关用户进行举报。
					</view>
				</view>
				<view class="dxitem" v-if="headerIndex == 2" v-for="(item, index) in sysNoticesList" :key="index" :index="index" @click="goDetails(item)">
					<view class="dheader">
						<image :src="item.user.avatar" class="avatar" />
						<view class="userinfo">
							<text class="s1">{{ item.user.user_nickname }}·{{ item.userinfo.building }}#</text>
							<view class="s2">
								<image src="../../static/like.png" mode="" class="like"></image>
								<text class="liketext">{{ item.user.love_value }}</text>
							</view>
						</view>
						<text class="time">{{ item.create_time | formatTime }}</text>
					</view>
					<view class="dx-content"><rich-text :nodes="item.nodes" class="dx-content-rich"></rich-text></view>
					<text class="dx-input" v-if="false">我:{{ item.title }}</text>
					<view class="dx-border"></view>
				</view>
				<view class="dxitem" v-if="headerIndex == 3" v-for="(item, index) in sysNoticesList" :key="index" :index="index" @click="goDetails(item)">
					<view class="dheader">
						<image :src="item.fromuser.avatar" class="avatar" />
						<view class="userinfo">
							<text class="s1">{{ item.fromuser.user_nickname }}·{{ item.fromuser.building }}#</text>
							<view class="s2">
								<image src="../../static/like.png" mode="" class="like"></image>
								<text class="liketext">{{ item.fromuser.love_value }}</text>
							</view>
						</view>
						<text class="time">{{ item.create_time | formatTime }}</text>
					</view>
					<view class="dx-content">{{ item.title }}</view>
					<view class="dx-input" v-if="false"><rich-text :nodes="item.nodes"></rich-text></view>
					<view class="dx-border"></view>
				</view>
				<view class="dxitem" v-if="headerIndex == 4" v-for="(item, index) in sysNoticesList" :key="index" :index="index" @click="getPerson(item)">
					<view class="dheader">
						<image :src="item.fromuser.avatar" class="avatar" />
						<view class="userinfo">
							<text class="s1">{{ item.fromuser.user_nickname }}·{{ item.fromuser.building ? item.fromuser.building : '' }}#</text>
							<view class="s2">
								<image src="../../static/like.png" mode="" class="like"></image>
								<text class="liketext">{{ item.fromuser.love_value }}</text>
							</view>
						</view>
						<text class="time">{{ item.create_time | formatTime }}</text>
					</view>
					<view class="dx-content">{{ item.content }}</view>
					<view class="dx-border"></view>
				</view>
				<Nodata v-if="showNodata" />
			</view>
		</view>
		<Reply
			ref="reply"
			:replyShow.sync="replayShow"
			:parent_text.sync="parent_text"
			:inputVlue.sync="inputValues"
			:isShowEmj="showReply"
			@faceClick="faceClick"
			@InputFocus="InputFocus"
			@inputValueHander="inputValueHander"
		/>
	</view>
</template>

<script>
import Nodata from '@/components/nodata/nodata.vue';
import Reply from '@/components/reply/reply.vue';
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	data() {
		return {
			config: {
				title: '我的消息', //title
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
			catelist: [
				{
					id: 1,
					text: '全部'
				},
				{
					id: 2,
					text: '求助'
				},
				{
					id: 3,
					text: '新鲜事'
				},
				{
					id: 4,
					text: '闲置'
				},
				{
					id: 5,
					text: '鹊桥'
				},
				{
					id: 6,
					text: '便民'
				},
				{
					id: 7,
					text: '达人'
				}
			],
			headerIndex: 1,
			page: 1,
			page_size: 10,
			type: 1,
			sysNoticesList: [],
			total_page: 0,
			unreads: {
				comment_unread: 0,
				leave_message_unread: 0,
				sys_notices_unread: 0,
				thanks_unread: 0
			},
			replayShow: false,
			parent_text: '',
			replyFlag: false,
			inputValues: '',
			showReply: false,
			replyitem: {},
			showNodata: false
		};
	},
	mounted() {
		this.getmySysNotices();
		this.$getCount(result => {
			if (result.code == 1) {
				this.unreads = result.data;
			}
		});
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		messageHandler() {
			this.$Bus.$emit('countmsg', 'countmsg');
		},
		todoReply(obj) {
			this.replayShow = !this.replayShow;
			this.replyitem = obj;
		},
		faceClick() {
			this.showReply = !this.showReply;
		},
		InputFocus() {
			this.showReply = !this.showReply;
		},
		inputValueHander(e) {
			if (!e) {
				uni.showToast({
					icon: '',
					title: '请输入评论内容'
				});
				return;
			}
			var data = {
				dynamics_id: this.replyitem.object_id,
				third_id: this.replyitem.object_id,
				object_type: this.replyitem.object_type,
				parent_id: this.replyitem.id,
				community_id: this.replyitem.community_id,
				content: e
			};
			this.Api.setComments(data).then(result => {
				if (result.code == 1) {
					uni.showToast({
						icon: 'success',
						title: result.msg,
						duration: 2000,
						success: () => {
							this.$refs.reply.clearInput();
							this.replayShow = false;
							this.getmySysNotices();
						}
					});
				}
			});
		},
		goDetails(pitem) {
			this.getmySysNotices();
			this.messageHandler();
			this.$getCount(result => {
				if (result.code == 1) {
					this.unreads = result.data;
				}
			});
			if (this.headerIndex == 3) {
					uni.navigateTo({
						url:'/pages/index/detail?id='+pitem.object_id+'&type=1'
					})
			} else {
				if (pitem.object_type == 7 || pitem.object_id == 8) {
					uni.navigateTo({
						url: '/pages/index/detail?dynamics_id=' + pitem.object_id + '&type=' + pitem.object_type + '&id=' + pitem.third_id
					});
				} else if (pitem.object_type == 5) {
					if (pitem.third_id != 0) {
						uni.navigateTo({
							url: '/pages/index/cdetail?dynamics_id=' + pitem.object_id + '&type=' + pitem.object_type + '&id=' + pitem.third_id
						});
					} else {
						uni.navigateTo({
							url: '/pages/index/detail?id=' + pitem.object_id + '&type=' + pitem.object_type
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/index/detail?id=' + pitem.object_id + '&type=' + pitem.object_type
					});
				}
			}
		},
		getPerson(obj) {
			this.getmySysNotices();
			this.messageHandler();
			this.$getCount(result => {
				if (result.code == 1) {
					this.unreads = result.data;
				}
			});
			uni.navigateTo({
				url: '/pages/index/personalcard?user_id=' + obj.from_user_id + '&community_id=' + obj.from_community_id
			});
		},
		goDetail(id) {
			this.getmySysNotices();
			this.messageHandler();
			this.$getCount(result => {
				if (result.code == 1) {
					this.unreads = result.data;
				}
			});
			uni.navigateTo({
				url: '/pages/update/messagedetail?id=' + id
			});
		},
		customConduct(e) {
			console.log(e);
		},
		navClick(obj) {
			this.cateIndex = obj.id;
		},
		headerClick(index) {
			this.headerIndex = index;
			this.page = 1;
			this.page_size = 10;
			this.total_page = 0;
			this.sysNoticesList = [];
			this.replayShow = false;
			this.getmySysNotices();
		},
		//个人名片
		goPer(item) {
			uni.navigateTo({
				url: '/pages/index/personalcard?user_id=' + item.user_id + '&community_id=' + item.community_id
			});
		},
		getmySysNotices(ismore) {
			var data = {
				page: this.page,
				page_size: this.page_size,
				object_type: 1,
				community_id: uni.getStorageSync('community_id')
			};
			if (this.headerIndex == 1) {
				this.Api.mySysNotices(data).then(result => {
					if (result.code == 1) {
						if (ismore) {
							this.sysNoticesList = this.sysNoticesList.concat(result.data.list);
							this.total_page = result.data.total_page;
						} else {
							this.sysNoticesList = result.data.list;
							this.total_page = result.data.total_page;
						}
						if (this.sysNoticesList.length == 0) {
							this.showNodata = true;
						} else {
							this.showNodata = false;
						}
					}
				});
			} else if (this.headerIndex == 2) {
				this.Api.myCommentNotices(data).then(result => {
					if (result.code == 1) {
						if (ismore) {
							var s = result.data.list;
							s.map(item => {
								item.nodes = new String(item.comment_content)
									.toString()
									.replace(/\[em\_(\d{1,3})\]/g, '<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>');
							});
							this.sysNoticesList = this.sysNoticesList.concat(s);
							this.total_page = result.data.total_page;
						} else {
							var s = result.data.list;
							s.map(item => {
								item.nodes = new String(item.comment_content)
									.toString()
									.replace(/\[em\_(\d{1,3})\]/g, '<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>');
							});
							this.sysNoticesList = s;
							this.total_page = result.data.total_page;
						}
						if (this.sysNoticesList.length == 0) {
							this.showNodata = true;
						} else {
							this.showNodata = false;
						}
					}
				});
			} else if (this.headerIndex == 3) {
				this.Api.myThanksNotices(data).then(result => {
					if (result.code == 1) {
						if (ismore) {
							var s = result.data.list;
							s.map(item => {
								item.nodes =
									'我：' +
									new String(item.content)
										.toString()
										.replace(/\[em\_(\d{1,3})\]/g, '<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>');
							});
							this.sysNoticesList = this.sysNoticesList.concat(s);
							this.total_page = result.data.total_page;
						} else {
							var s = result.data.list;
							s.map(item => {
								item.nodes =
									'我：' +
									new String(item.content)
										.toString()
										.replace(/\[em\_(\d{1,3})\]/g, '<img class="imgemoji" src=https://sq.wenlinapp.com/bkhumor-emoji/' + '$1' + '.gif  align=middle/>');
							});
							this.sysNoticesList = s;
							this.total_page = result.data.total_page;
						}

						if (this.sysNoticesList.length == 0) {
							this.showNodata = true;
						} else {
							this.showNodata = false;
						}
					}
				});
			} else if (this.headerIndex == 4) {
				this.Api.myLeaveMessageNotices(data).then(result => {
					if (result.code == 1) {
						if (ismore) {
							this.sysNoticesList = this.sysNoticesList.concat(result.data.list);
							this.total_page = result.data.total_page;
						} else {
							this.sysNoticesList = result.data.list;
							this.total_page = result.data.total_page;
						}

						if (this.sysNoticesList.length == 0) {
							this.showNodata = true;
						} else {
							this.showNodata = false;
						}
					}
				});
			}
		}
	},
	onReachBottom() {
		if (this.total_page > this.page) {
			this.page++;
			this.getmySysNotices(true);
		}
	},
	components: {
		navigationCustom,
		Reply,
		Nodata
	}
};
</script>

<style lang="scss" scoped>
.integral {
	display: flex;
	flex-direction: column;
	.content {
		display: flex;
		flex-direction: column;
		padding: 48upx;
		box-sizing: border-box;
		.headerwrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			.headeritem {
				width: 112upx;
				height:168upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right:calc((100% - 448upx)/3);
				.headericos {
					position: relative;
					height: 112upx;
					width: 112upx;
					border-radius: 50%;
					background: #EEF2FA;
					.numtext {
						width: 36upx;
						height: 36upx;
						line-height: 36upx;
						text-align: center;
						font-size: 20upx;
						color: white;
						border-radius: 50%;
						border: 2upx solid white;
						background: rgba(255, 43, 32, 1);
						position: absolute;
						right: -8upx;
						top: -8upx;
					}
					.headerico {
						position: absolute;
						top:26upx;
						left:50%;
						transform: translateX(-50%);
						width: 60upx;
						height: 60upx;
					}
				}
				.headericosac{
					background: #FF9C00;
				}
				.headertext {
					font-size: 26upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: #020433;
					margin-top: auto;
				}
			}
			.headeritem:nth-child(4n){
				margin-right:0px!important
			}
		}
		.list {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin-top:100upx;
			/deep/ .nodata {
				margin-top: 350upx;
			}
			.dxitem {
				display: flex;
				flex-direction: column;
				padding: 32upx 0;
				box-sizing: border-box;
				.dheader {
					display: flex;
					flex-direction: row;
					align-items: center;
					.avatar {
						width: 64upx;
						height: 64upx;
						border-radius: 50%;
						margin-right: 16upx;
					}
					.userinfo {
						display: flex;
						flex-direction: row;
						align-items: center;
						.s1 {
							margin-right: 16upx;
							font-size: 26upx;
							font-family: PingFang-SC-Bold, PingFang-SC;
							font-weight: bold;
							color: rgba(51, 51, 51, 1);
							line-height: 36upx;
						}
						.s2 {
							height: 32upx;
							padding-left: 15upx;
							padding-right: 15upx;
							background: rgba(255, 156, 0, 0.1);
							border-radius: 8upx;
							display: flex;
							flex-direction: row;
							align-items: center;
							.like {
								width: 22upx;
								height: 18upx;
							}
							.liketext {
								font-size: 20upx;
								font-family: PingFang-SC-Medium, PingFang-SC;
								font-weight: 500;
								color: rgba(255, 156, 0, 0.8);
								line-height: 28upx;
							}
						}
					}
					.time {
						height: 32upx;
						font-size: 22upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
						line-height: 32upx;
						margin-left: auto;
					}
				}
				.dx-content {
					width: 100%;
					margin-top: 24upx;
					// height:42upx;
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 42upx;
					text-align: left;
					.dx-content-rich {
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
				.dx-input {
					margin-top: 24upx;
					width: 100%;
					background: rgba(234, 234, 234, 0.3);
					border-radius: 8upx;
					text-align: left;
					padding-left: 24upx;
					padding-right: 24upx;
					box-sizing: border-box;
					line-height: 72upx;
				}
				.dx-border {
					margin-top: 32upx;
					border-bottom: 1px solid rgba(234, 234, 234, 0.6);
				}
			}
			.listitem {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				// padding: 0 24upx;
				padding-bottom: 24upx;
				box-sizing: border-box;
				border-bottom: 1px solid rgba(222, 222, 222, 0.3);
				.t1 {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					padding-top: 24upx;
					box-sizing: border-box;
					width: 100%;
					.s1 {
						max-width: calc(100% - 140upx);
						width: fit-content;
						font-size: 32upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: #020433;
						line-height: 44upx;
						text-align: left;
						position: relative;
						.st {
							position: absolute;
							width: 12upx;
							height: 12upx;
							border-radius: 50%;
							background: rgba(255, 43, 32, 1);
							top: 6upx;
							right: -12upx;
						}
					}
					.s2 {
						width: 150upx;
						text-align: right;
						font-size: 24upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #404B69;
						line-height: 34upx;
					}
				}
				.t2 {
					width: 100%;
					font-size: 28upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: #020433;
					line-height: 48upx;
					margin-top: 16upx;
					text-align: left;
					text-overflow: ellipsis;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					.red{
						color:rgba(255, 156, 0, 0.8);
						padding:0 10upx;
					}
				}
			}
		}
	}
}
</style>
