<template>
	<view class="postitem" @click="postDetail">
		<view class="postAlltype" v-if="pitem.type != 6 ">
			<view class="postheader" v-if="pitem.publish_type == 1">
				<view :class="['headerimg',!pitem.user.avatar ? 'headerimgfix':'']" @click.stop="goPer(pitem.user)">
					<image :src="pitem.user.avatar" class="avatar" v-if="(pitem.type == 16 && pitem.anonymous == 0) || ( pitem.type == 18 && pitem.anonymous == 0 )"></image>
					<image src="../../static/heading.png" class="avatar" v-if=" (pitem.type == 16 && pitem.anonymous == 1) || (pitem.anonymous == 1 &&  pitem.type == 18 )"></image>
					<image :src="pitem.user.avatar" class="avatar" v-if="pitem.type != 16 && pitem.type != 18 "></image>
					<image v-if="pitem.user.daren == 1" src="../../static/da.png" class="da"></image>
				</view>
				<view class="userinfo" @click.stop="goPer(pitem.user)">
					<view class="userwrap">
						<text class="name" v-if="pitem.anonymous == 0">
							{{ pitem.user.user_nickname }}·{{ ucommunityid == pitem.user.community_id ? pitem.user.building + '#' : pitem.user.community_name }}
						</text>
						<text class="name" v-if="pitem.anonymous == 1">
							匿名用户
						</text>

						<view class="likewrap" v-if="pitem.anonymous != 1">
							<image class="like" src="../../static/like.png"></image>
							<text>{{ pitem.user.love_value }}</text>
						</view>

						<text class="chuang" v-if="pitem.user.founder == 1 && pitem.anonymous != 1">创</text>
					</view>
					<view class="usertime">
						{{ pitem.create_time | formatTime }}
						<text class="ph">{{pitem.post_hits}}人浏览</text>
						<text class="juli" v-if="type != 1">{{ pitem.juli }}</text>
					</view>
				</view>
				<!-- is_know  0 不认识  1 已认识  2 自己 -->
				<view class="flowwrap" v-if="pitem.type == 13" @click.stop="knowTodo">{{pitem.is_know == 0 ? '认识 TA' : (pitem.is_know == 1 ? '已认识 TA' : '自己')}}</view>
				<view class="morewrap" v-if="pitem.type != 13" @click.stop="moreClick(pitem)"><image src="../../static/more.png" class="more"></image></view>
			</view>
			<view class="postheader" v-if="pitem.publish_type != 1">
				<view class="headerimg" @click.stop="goCom(pitem.committee)">
					<image :src="pitem.committee.logo ? pitem.committee.logo : imgUrl + 'logovi.jpg'" class="avatar"></image>
<!-- 					<image :src="pitem.publish_type == 2 ? pitem.committee.logo : (pitem.admin.avatar ? pitem.admin.avatar : imgUrl + 'logovi.jpg')" class="avatar"></image>
 -->				<!-- <image v-if="pitem.publish_type == 114"  :src="pitem.committee.logo ? pitem.committee.logo : imgUrl + 'logovi.jpg'" class="avatar"></image> -->
					<image style="display: none;" src="../../static/da.png" class="da"></image>
				</view>
				<view class="userinfo" @click.stop="goCom(pitem.committee)">
					<view class="userwrap">
						<text class="name">{{ pitem.committee.title ?  pitem.committee.title : '问邻管理员' }}</text>
<!-- 						<text v-if="pitem.publish_type == 114" class="name">{{pitem.committee.title ?  pitem.committee.title : '问邻管理员' }}</text>
 -->					</view>
					<view class="usertime">
						{{ pitem.create_time | formatTime }}
						<text class="ph">{{pitem.post_hits}}人浏览</text>
						<text class="juli" v-if="type != 1">{{ pitem.juli }}</text>
					</view>
				</view>
				<view class="morewrap"  @click.stop="moreClick(pitem)"><image src="../../static/more.png" class="more"></image></view>
			</view>
			<view class="postcontent" v-if="pitem.type != 13">
			
				<image v-if="pitem.is_top == 1" src="../../static/ding.png" class="ding"></image>
				<text v-if="autoType" :class="['postcate', pitem.is_top == 1 ? 'postcateFix' : '']">#{{ pitem.type | filterType }}</text>
				<view
					:class="['postdes', pitem.is_top == 1 ? 'postdesfix' : '', pitem.type == 6 && !autoType ? 'postdesfix2' : 'postdesfix3', !pitem.title ? 'postdesfix10' : '']"
					v-if="pitem.publish_type == 1 && pitem.type != 7"
				>
					{{ pitem.title ? pitem.title : pitem.content }}
				</view>
				<view
					:class="[
						'postdes',
						pitem.is_top == 1 ? 'postdesfix' : '',
						(pitem.type == 7 || pitem.type == 8 || pitem.type == 5) && !autoType ? 'postdesfix2' : pitem.is_top == 1 ? 'postdesfix5' : 'postdesfix4',
						!pitem.title ? 'postdesfix10' : ''
					]"
					v-if="pitem.publish_type != 1"
				>
					<!-- 		{{pitem.title}} -->
					<!-- 	<rich-text :nodes="pitem.content" ></rich-text>	 -->
					{{ pitem.title ? pitem.title : pitem.description }}
				</view>
				<!-- <view class="posttitle" v-if="(pitem.publish_type == 2 || pitem.publish_type == 3) && pitem.title">{{pitem.description}}</view> -->
				<view class="dalist" v-if="pitem.type == 6">
					<view class="daitem" v-for="(item, index) in skillList" :key="index" :index="index">{{ item }}</view>
				</view>
			</view>
		</view>
		<view class="postAlltype" style="display: none;">
			<view class="postheader" v-if="pitem.publish_type == 1">
				<view class="headerimg" @click.stop="goPer(pitem.user)">
					<image :src="pitem.user.avatar" class="avatar" v-if="pitem.anonymous == 0"></image>
					<image src="../../static/heading.png" class="avatar" v-if="pitem.anonymous == 1"></image>
					<image v-if="pitem.user.daren == 1" src="../../static/da.png" class="da"></image>
				</view>
				<view class="userinfo" @click.stop="goPer(pitem.user)">
					<view class="userwrap">
						<!-- 					<text class="name">{{pitem.user.user_nickname}}·{{pitem.user.building}}#</text> -->
						<text class="name">
							{{ pitem.user.user_nickname }}·{{ ucommunityid == pitem.user.community_id ? pitem.user.building + '#' : pitem.user.community_name }}
						</text>

						<view class="likewrap">
							<image class="like" src="../../static/like.png"></image>
							<text>{{ pitem.user.love_value }}</text>
						</view>

						<text class="chuang" v-if="pitem.user.founder == 1">创</text>
					</view>
					<view class="usertime">
						{{ pitem.create_time | formatTime }}
						<text class="ph">{{pitem.post_hits}}人浏览</text>
						<text class="juli" v-if="type != 1">{{ pitem.juli }}</text>
					</view>
				</view>
				<view class="morewrap" @click.stop="moreClick(pitem)"><image src="../../static/more.png" class="more"></image></view>
			</view>
			<view class="postheader" v-if="pitem.publish_type != 1 && pitem.type != 7">
				<view class="headerimg" @click.stop="goCom(pitem.goCom)">
					<image :src="pitem.publish_type == 2 ? pitem.committee.logo :  imgUrl + 'logovi.jpg'" class="avatar"></image>
					<image style="display: none;" src="../../static/da.png" class="da"></image>
				</view>
				<view class="userinfo" @click.stop="goCom(pitem.committee)">
					<view class="userwrap">
						<text class="name">{{ pitem.publish_type == 2 ? pitem.committee.title : '问邻管理员' }}</text>
					</view>
					<view class="usertime">
						{{ pitem.create_time | formatTime }}
						<text class="ph">{{pitem.post_hits}}人浏览</text>
						<text class="juli" v-if="type != 1">{{ pitem.juli }}</text>
					</view>
				</view>
				<view class="morewrap" @click.stop="moreClick(pitem)"><image src="../../static/more.png" class="more"></image></view>
			</view>
			<view :class="['postheader', allFlag != true ? 'postheaderfix' : '']" v-if="pitem.publish_type != 1 && pitem.type == 7">
				<view :class="['userinfo', pitem.type == 7 ? 'userinfofix' : '']">
					<view class="userwrap">
						<text class="name titlefix">{{ pitem.title}}11</text>
					</view>
					<view class="usertime">{{ pitem.create_time | formatTime }}</view>
					<text class="ph">{{pitem.post_hits}}人浏览</text>
				</view>
				<view :class="['morewrap', pitem.type == 7 ? 'morewrapfix' : '']" @click.stop="moreClick(pitem)"><image src="../../static/more.png" class="more"></image></view>
			</view>
			<view class="postcontent">
				<image v-if="pitem.is_top == 1" src="../../static/ding.png" class="ding"></image>
				<text v-if="autoType" :class="['postcate', pitem.is_top == 1 ? 'postcateFix' : '']">#{{ pitem.type | filterType }}</text>
				<view
					:class="['postdes', pitem.is_top == 1 ? 'postdesfix' : '', pitem.type == 6 ? 'postdesfix2' : '']"
					v-if="(pitem.type != 7 || pitem.type != 8) && pitem.publish_type == 1"
				>
					{{ pitem.title }}
				</view>
				<!-- 			<view class="posttitle"   v-if="pitem.publish_type == 1 && pitem.title">{{pitem.content}}</view>
 -->
				<view :class="['postdes', pitem.is_top == 1 ? 'postdesfix' : '', pitem.type == 2 ? 'postdesfix2' : '']" v-if="pitem.type != 7 && pitem.publish_type != 1">
					<!-- 	<rich-text :nodes="pitem.content" ></rich-text>	 -->
					{{ pitem.title }}
				</view>
				<view
					:class="['postdes', 'postdesfix11', pitem.is_top == 1 ? 'postdesfix' : '', pitem.type == 2 ? 'postdesfix2' : '']"
					v-if="pitem.type == 7 && pitem.publish_type != 1"
				>
					<!-- 	<rich-text :nodes="pitem.content" ></rich-text>	 -->
					{{ pitem.description }}
				</view>
				<view
					:class="['postdes', pitem.is_top == 1 ? 'postdesfix' : '', pitem.type != 2 ? 'postdesfix3' : '']"
					v-if="(pitem.type != 7 || pitem.type != 8) && pitem.publish_type == 1"
				>
					<!-- 	<rich-text :nodes="pitem.content" ></rich-text>	 -->
					{{ pitem.content }}
				</view>
				<!-- 			<view class="posttitle"   v-if="pitem.publish_type != 1 && pitem.title">{{pitem.description}}</view>
 -->
				<view class="posttitle" v-if="false">{{ pitem.description }}</view>

				<view class="dalist" v-if="pitem.type == 6">
					<view class="daitem" v-for="(item, index) in skillList" :key="index" :index="index">{{ item }}</view>
				</view>
			</view>
		</view>

		<view class="postimg" v-if="pitem.images.length && pitem.type != 6">
			<view  :class="classObject" :src="item" v-for="(item, index) in imglist" :key="index" @click.stop="photoView(item)">
				<u-image :src="item" :height="autoHeight" mode="aspectFill"></u-image>
			</view>

			<text class="numwrap" v-if="pitem.images.length > 3">{{ pitem.images.length }}</text>
		</view>
		<view class="tuan" v-if="pitem.type == 17">
			已有<text class="ren">{{pitem.buy_num ? pitem.buy_num : 0}}</text>人参加团购 剩余时间：<u-count-down  color="#ED3269" separator-color="#ED3269" font-size="26" separator-size="26" separator="zh" :timestamp="autoTime"></u-count-down>
		</view>
		<view class="yishi" v-if="pitem.type == 16">
			<text class="ren">{{pitem.vote_num}}</text>人参加投票
		</view>
		<view class="posttool" v-if="pitem.type != 6 && pitem.type != 13" :class="[pitem.images.length == 0 ? 'posttoolfix' : '']">
			<view class="toolitem"  open-type="share" @click.stop="shareClick">
				<image class="toolico" src="../../static/forward.png"></image>
				<text class="tooltext">分享</text>
			</view>
			<view class="toolitem">
				<image class="toolico" src="../../static/red.png"></image>
				<!-- 				<text class="tooltext">{{pitem.comment_count ? pitem.comment_count : '评论'}}</text> -->
				<text class="tooltext">{{ pitem.comment_count ? pitem.comment_count : '评论' }}</text>
			</view>
			<view class="toolitem" @click.stop="helpPush">
				<image class="toolico" :src="pitem.user_help == 1 ? '../../static/push-a.png' : '../../static/push.png'"></image>
				<!-- 				<text class="tooltext">{{pitem.user_help == 1 ? pitem.help_score : '推一下'}}</text> -->
				<text class="tooltext">{{ pitem.help_score ? pitem.help_score : '推一下' }}</text>
			</view>
		</view>
		<view class="darenitem" v-if="pitem.type == 6">
			<view class="avatarwrap" >
				<image :src="pitem.user.avatar"  class="avatar"></image>
				<image src="../../static/da.png" class="da" v-if="pitem.user.daren == 1"></image>
			</view>
			<view class="dareninfo">
				<view class="t1">
					{{ pitem.user.user_nickname }}
				</view>
				<view class="t2" >
					<view class="tagitem" v-if="skillList.length" v-for="(subitem,subindex) in skillList" :key="subindex">
						{{subitem}}
					</view>
					<view class="tagitem tagfix" v-if="pitem.daren == 0">
						暂无达人标签，等待报名
					</view>
				</view>
			</view>
			<view class="toolbtn" v-if="pitem.daren == 0" @click.stop="danrenHandler">
				立即报名
			</view>
			<view class="toolitem" @click.stop="helpPush" v-if="skillList.length">
				<image class="toolico" :src="pitem.user_help == 1 ? '../../static/push-a.png' : '../../static/push.png'"></image>
				<!-- 				<text class="tooltext">{{pitem.user_help == 1 ? pitem.help_score : '推一下'}}</text> -->
				<text class="tooltext">{{ pitem.help_score ? pitem.help_score : '推一下' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgUrl:this.Config.minUrl,
			deliveryFlag: false,
			canvasFlag: true,
			posterData: {},
			ucommunityid: uni.getStorageSync('community_id')
		};
	},
	props: {
		pitem: {
			type: Object
		},
		type: {
			type: [Number, String]
		},
		allFlag: {
			type: [Boolean, String]
		},
		pm:{
			type:[Boolean],
			default:false
		}
	},
	computed: {
		autoTime(){
			if(this.pitem.type == 17){
				var obj = JSON.parse(this.pitem.relation_more)
				var group_endtime = obj.group_endtime
				if(group_endtime){
					return (group_endtime - this.pitem.now_time)
				}else{
					return 0
				}
				
			}else{
				return 0
			}
		},
		imglist() {
			if(this.pitem.images){
				if (this.pitem.images.length > 3) {
					return this.pitem.images.slice(0, 3);
				} else {
					return this.pitem.images;
				}
			}else{
				return []
			}
		},
		autoType() {
			if(this.type == 7){
				return false
			}else{
				if (this.allFlag) {
					return true;
				} else {
					if (this.pitem.type == 6) {
						return true;
					} else if (this.pitem.type == 7) {
						return false;
					} else {
						return true;
					}
				}
			}
		},
		skillList() {
			if(this.pitem.skill_desc){
				return this.pitem.skill_desc.split(',');
			}
		},
		classObject() {
			if(this.pitem.images){
				var l = this.pitem.images.length;
				if (l == 1) {
					return 'img1';
				} else if (l == 2) {
					return 'img2';
				} else if (l > 2) {
					return 'img3';
				}
			}else{
				return 'img1'
			}
		},
		autoHeight(){
			if(this.pitem.images){
				var l = this.pitem.images.length;
				if (l == 1) {
					return 380;
				} else if (l == 2) {
					return 260;
				} else if (l > 2) {
					return 220;
				}
			}else{
				return 0
			}
		},
		timestamp(){
			var end = this.pitem.endtime ? this.pitem.endtime : 0
			var nows = this.pitem.now_time
			return end - nows
		}
	},
	methods: {
		photoView(current) {
			uni.previewImage({
				current: current, // 当前显示图片的http链接
				urls: this.pitem.images // 需要预览的图片http链接列表
			});
		},
		postDetail() {
			// if (!uni.getStorageSync('token')) {
			// 	this.$emit('toLogin');
			// 	return;
			// } else {
			// 	if (!uni.getStorageSync('community_id')) {
			// 		this.$emit('toLogin');
			// 		return;
			// 	}
			// }
			var type = this.pitem.type;
	
			if(this.pm){
				type = 7
			}
			if(this.pitem.regedit){
				this.$emit('danrenHandler',{})
				return
			}
			var publish_type = this.pitem.publish_type; //2为居委会 3小区
			if(this.pitem.opening == 0){
				console.log(1)
				if(this.pitem.publish_type == 1){
					if(this.pitem.community_id != uni.getStorageSync('community_id')){
						uni.showToast({
							icon:'none',
							title:'本条信息仅限本小区用户可见',
							duration:2000
						})
						return;
					}
				}
			}
			if (type == 5) {
				uni.navigateTo({
					url: '/pages/index/cdetail?dynamics_id=' + this.pitem.object_id + '&type=' + this.pitem.type + '&id=' + this.pitem.object_id
				});
			} else {
			
				if (type == 7 || type == 8) {
					if(!this.pm){
						uni.navigateTo({
							url: '/pages/index/detail?dynamics_id=' + this.pitem.object_id + '&type=' + this.pitem.type + '&id=' + this.pitem.object_id
						});
					}else{
						uni.navigateTo({
							url: '/pages/index/detail?dynamics_id=' + this.pitem.wiki_id + '&type=' + this.type + '&id=' + this.pitem.wiki_id
						});
					}
				} else if(type == 16){
					uni.navigateTo({
						url: '/pages/update/ysdetail?dynamics_id=' + this.pitem.object_id + '&type=' + this.pitem.type + '&id=' + this.pitem.object_id
					});
				}else if(type == 17){
					uni.navigateTo({
						url: '/pages/update/ptdetail?dynamics_id=' + this.pitem.object_id + '&type=' + this.pitem.type + '&id=' + this.pitem.object_id
					});
				}else if(type == 13){
					return
					uni.navigateTo({
						url: '/pages/index/personalcard?user_id=' + this.pitem.user.id + '&community_id=' + this.pitem.user.community_id
					});
				}else{
					uni.navigateTo({
						url: '/pages/index/detail?id=' + this.pitem.object_id + '&type=' + this.pitem.type
					});
				}
			}
		},
		moreClick(obj) {
			this.$emit('moreClick', obj);
		},
		goPer(obj) {
			//个人名片
			if (!uni.getStorageSync('token')) {
				this.$emit('toLogin');
				return;
			} else {
				if(this.pitem.anonymous == 1){
					return this.$u.toast('匿名用户不可看')
				}
				if (!uni.getStorageSync('community_id')) {
					this.$emit('toLogin');
					return;
				}
			}
			uni.navigateTo({
				url: '/pages/index/personalcard?user_id=' + obj.id + '&community_id=' + obj.community_id
			});
		},
		goCom(obj) {
			//居委会详情
			if (!uni.getStorageSync('token')) {
				this.$emit('toLogin');
				return;
			} else {
				if (!uni.getStorageSync('community_id')) {
					this.$emit('toLogin');
					return;
				}
			}
			if (this.pitem.publish_type == 2) {
				uni.navigateTo({
					url: '/pages/update/committee?id=' + obj.committee_id
				});
			}
		},
		//is_kown=-1 是自己，is_kown=0 未认识，is_kown > 0 表明已认识
		knowTodo(){
			console.log(1)
			var data = {
				to_user_id:this.pitem.user.id,
				to_community_id: this.pitem.user.community_id,
				from_community_id: uni.getStorageSync('community_id')
			}
			
			console.log(this.pitem)
			if(this.pitem.is_know == 0){
				console.log(1111)
				this.usersetKown(data)
			}else if(this.pitem.is_know > 0){
					console.log(1112221)
				this.userunSetKown(data)
			}
		},
		//认识
		usersetKown(data){
			this.Api.usersetKown(data).then((result) => {
				if(result.code == 1){
					uni.showToast({
						icon:'success',
						title:result.msg,
						success: () => {
							this.$emit('flush',{})
						}
					})
				}else{
					uni.showToast({
						icon:'none',
						title:result.msg,
						success: () => {
							
						}
					})
				}
			})
		},
		//取消认识
		userunSetKown(data){
			this.Api.userunSetKown(data).then((result) => {
				if(result.code == 1){
					uni.showToast({
						icon:'success',
						title:result.msg,
						success: () => {
							this.$emit('flush',{})
						}
					})
				}else{
					uni.showToast({
						icon:'none',
						title:result.msg,
						success: () => {
							
						}
					})
				}
			})
		},
		//帮助
		helpPush() {
			if (this.pitem.type == 5 || this.pitem.type == 7) {
				this.$emit('helpPush', { id: this.pitem.object_id, type: this.pitem.type });
			} else {
				this.$emit('helpPush', { id: this.pitem.object_id, type: this.pitem.type });
			}
		},
		//分享操作
		shareClick() {
			this.$emit('shareClick', this.pitem);
		},
		danrenHandler(){
			this.$emit('danrenHandler',{})
		}
	}
};
</script>

<style lang="scss" scoped>
.postitem {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding:0 48upx;
	box-sizing: border-box;
	background: white;
	margin-bottom: 11px;
	.postheader {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 35upx;
		padding-bottom: 20upx;
		.headerimg {
			width: 80upx;
			height: 80upx;
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
		.headerimgfix{
			background:#95A0B6;
		}
		.userinfo {
			display: flex;
			flex-direction: column;
			margin-right: 20upx;
			max-width: calc(100% - 286upx);
			.userwrap {
				display: flex;
				flex-direction: row;
				.name {
					height: 36upx;
					width: fit-content;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 26upx;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					line-height: 36upx;
					margin-right: 20upx;
				}
				.titlefix {
					font-size: 34upx;
					height: 52upx;
					line-height: 52upx;
					margin-bottom: 10upx;
					width: 100%;
					font-weight: 500;
					display: inline-block;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.namefix {
					width: calc(100% - 100upx);
					display: inline-block;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.likewrap {
					min-width: 60upx;
					padding-left: 15upx;
					padding-right: 15upx;
					height: 32upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					line-height: 32upx;
					background: #08C299;
					border-radius: 8upx;
					margin-right: 15upx;
					// position: relative;
					.like {
						width: 30upx;
						height: 26upx;
						margin: auto 0;
						margin-right: 10upx;

						// position: absolute;
						// top:50%;
						// left:5upx;
						// transform: translateY(-50%);
					}
					text {
						font-size: 20upx;
						margin-top: 4upx;
						font-weight: 500;
						color: white;
						// line-height: 32upx;
						// height: 32upx;
					}
				}
				.chuang {
					padding-left: 5upx;
					padding-right: 5upx;
					height: 32upx;
					background: rgba(255, 156, 0, 0.1);
					border-radius: 8upx;
					font-size: 20upx;
					font-weight: bold;
					color: #08C299;
					line-height: 32upx;
				}
			}
			.usertime {
				// height: 32upx;
				font-size: 22upx;
				font-weight: 500;
				color: #999;
				line-height: 40upx;
				text-align: left;
				.juli {
					padding-left: 15upx;
				}
				.ph{
					margin-left:20upx;
				}
			}
		}
		.userinfofix {
			width: calc(100% - 100upx);
		}
		.flowwrap{
			width: 143rpx;
			height: 51rpx;
			line-height: 51rpx;
			text-align: center;
			background: linear-gradient(44deg, #FEAA0E, #FFC000);
			border-radius: 10rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			margin-left:auto;
		}
		.morewrap {
			height: 64upx;
			width: 180upx;
			box-sizing: border-box;
			margin-left: auto;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.more {
				width: calc(48upx * 1.2);
				height: calc(48upx * 1.2);
				// transform:rotate(-90deg);
			}
		}
		.morewrapfix {
			width: 100upx;
		}
	}
	.postheaderfix {
		padding-bottom: 5upx !important;
	}
	.posttitle {
		margin-top: 10upx;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		font-size: 30upx;
		line-height: 48upx;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		margin-bottom: 20upx;
	}
	.postcontent {
		position: relative;
		min-height: 48upx;
		box-sizing: border-box;
		margin-bottom: 24upx;
		.ding {
			width: 52upx;
			height: 52upx;
			position: absolute;
			left: -10upx;
			top: 0upx;
		}
		.postcateFix {
			margin-left: 48upx;
		}
		.postcate {
			font-size: 34upx;
			color: #ff9c00;
			line-height: 52upx;
			position: absolute;
			left: 0;
			top: 0;
		}
		.postdesfix {
			text-indent: 5.5em !important;
		}
		.postdesfix2 {
			font-size: 34upx !important;
			text-indent: 0em !important;
		}
		.postdesfix11 {
			text-indent: 0em !important;
		}
		.postdesfix3 {
			text-indent: 4em !important;
		}
		.postdesfix33 {
			text-indent: 3em !important;
		}
		.postdesfix43 {
			text-indent: 4em !important;
		}
		.postdesfix4 {
			text-indent: 4em !important;
		}
		.postdesfix10 {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
		.postdes {
			font-size: 34upx;
			font-weight: 500;
			line-height: 52upx;
			color:#020433;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			// text-indent: 4em;
			// text-align: left;
			// display: block;
			text-indent: 4em;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
		.dalist {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 15upx;
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
				// margin-bottom: 20upx;
			}
		}
	}
	.postimg {
		// margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
		box-sizing: border-box;
		z-index: 3;

		.numwrap {
			position: absolute;
			right: 48upx;
			bottom: 24upx;
			width: 36upx;
			height: 36upx;
			border-radius: 50%;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 20upx;
			font-size: 22upx;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.8);
			text-align: center;
			line-height: 36upx;
			color: white;
			z-index: 4;
		}
		.img3 {
			width: 228upx;
			height: 228upx;
			margin-right: 9upx;
		}
		.img3:nth-child(1) {
			border-radius: 7upx 0 0 7upx;
			overflow: hidden;
		}
		.img3:nth-child(3n) {
			border-radius: 0upx 7upx 7upx 0;
			margin-right: 0upx;
			overflow: hidden;
		}
		.img2 {
			width: calc(50% - 5upx);
			height: 260upx;
			border-radius: 7upx 0 0 7upx;
			overflow: hidden;
		}
		.img2:nth-child(2) {
			width: calc(50% - 5upx);
			margin-left:auto;
			height: 260upx;
			border-radius: 0upx 7upx 7upx 0;
			overflow: hidden;
		}
		.img1 {
			width: 100%;
			height: 380upx;
			border-radius: 7upx;
			overflow: hidden;
		}
	}
	.tuan{
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 26upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #95A0B6;
		margin-bottom: 20upx;
		.ren{
			color:#ED3269;
		}
	}
	.yishi{
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 26upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #95A0B6;
		margin-bottom: 20upx;
		.ren{
			color:#ED3269;
		}
	}
	.posttool {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: calc(100% - 24upx);
		// border-bottom: 1px solid #dedede;
		.toolitem {
			width: 33.33%;
			text-align: center;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding-bottom: 35upx;
			.toolico {
				width: 48upx;
				height: 48upx;
				margin-right: 10upx;
			}
			.tooltext {
				font-size: 26upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 36upx;
			}
		}
	}
	.posttoolfix {
		margin-top: 10upx;
	}
	.darenitem{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding:30rpx 0;
		border-bottom: 2rpx solid #F0F0F0;
		.avatarwrap{
			width:90rpx;
			height:90rpx;
			margin-right:26rpx;
			position: relative;
			.avatar{
				position: absolute;
				left:0;
				top:0;
				width:100%;
				height: 100%;
				border-radius: 50%;
				
			}
			.da{
				width:32rpx;
				height:32rpx;
				border-radius: 50%;
				position: absolute;
				right:0;
				bottom: 0;
			}
		}
	
		.dareninfo{
			display: flex;
			flex-direction: column;
			max-width: 400rpx;
			overflow: hidden;
			.t1{
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #020433;
			}
			.t2{
				display: flex;
				flex-direction: row;
				align-items: center;
				width:100%;
				overflow-x: auto;
				margin-top:10rpx;
				.tagitem{
					padding:5rpx 15rpx;
					width: fit-content;
					background: #95A0B6;
					white-space: nowrap;
					border-radius: 10rpx;
					margin-right: 15rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
				.tagfix{
					background: transparent;
					color:#95A0B6;
					padding-left:0rpx!important;
				}
			}
		}
		.toolitem{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-left:auto;
			.toolico{
				width:38rpx;
				height:38rpx;
			}
			.tooltext{
				font-size: 30rpx;
				font-weight: 500;
				margin-left:14rpx;
			}
		}
		.toolbtn{
			width: 170rpx;
			height: 61rpx;
			line-height: 61rpx;
			background: linear-gradient(44deg, #FEAA0E, #FFC000);
			border-radius: 10rpx;
			text-align: center;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			margin-left:auto;
		}
	}
}
</style>
<style>
	.u-image{
		height:100%!important
	}
</style>
