<template>
	<!-- 用户头部组件 -->
	<view class="postheader ">
		<view class="headerimg" >
			<image @click.stop="goPer(pitem.user)" v-if="pitem.publish_type == 1" :src="pitem.user.avatar" class="avatar"></image>
			<image @click.stop="goCom" v-if="pitem.publish_type == 2" :src="pitem.communitycommittee.logo" class="avatar"></image>
			<image v-if="pitem.publish_type == 3"  :src="pitem.admin.avatar" class="avatar"></image>
			<image v-if="pitem.create_user.id"  @click.stop="goPer(pitem.create_user)"  :src="pitem.create_user.avatar"  class="avatar"></image>
			<image v-if="pitem.create_user.daren == 1" src="../../static/da.png" class="da"></image>
			<image v-if="pitem.user.daren == 1" src="../../static/da.png" class="da"></image>
			<image v-if="pitem.user.daren == 1" src="../../static/da.png" class="da"></image>
		</view>
		<view class="userinfo" >
			<view class="userwrap" v-if="pitem.publish_type == 1" @click.stop="goPer(pitem.user)">
				<text class="name">{{pitem.user.user_nickname}}·{{ucommunityid == pitem.user.community_id ? pitem.user.building+'#' : pitem.user.community_name}}</text>
				<view class="likewrap">
					<image class="like" src="../../static/like.png"></image>
					<text>{{pitem.user.love_value}}</text>
				</view>

				<text class="chuang" v-if="pitem.user.founder == 1">创</text>
			</view>
			<view class="userwrap" v-if="pitem.create_user.id" @click.stop="goPer(pitem.create_user)">
				<text class="name">{{pitem.create_user.user_nickname}}·{{ucommunityid == pitem.create_user.community_id ? pitem.create_user.building+'#' : pitem.create_user.community_name}}</text>
				<view class="likewrap">
					<image class="like" src="../../static/like.png"></image>
					<text>{{pitem.create_user.love_value}}</text>
				</view>
			
				<text class="chuang" v-if="pitem.create_user.id == pitem.create_user_id">创</text>
			</view>
			<view class="userwrap" v-if="pitem.publish_type == 2"  @click.stop="goCom">
				<text class="name">{{pitem.communitycommittee.title}}</text>
			</view>
			<view class="userwrap" v-if="pitem.publish_type == 3">
				<text class="name">{{pitem.admin.user_nickname}}</text>
			</view>
			<view class="usertime">
				{{pitem.create_time | formatTime}}  <text class="ph">{{pitem.post_hits}}人浏览</text>
			</view>
		</view>
		<view class="morewrap"  @click.stop="moreClick">
			<image src="../../static/more.png" class="more" ></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ucommunityid:uni.getStorageSync('community_id')
			}
		},
		props:{
			pitem:{
				type: Object
			},
			type:{
				type: [Number,String]
			}
		},
		methods:{
			moreClick(){
				this.$emit('moreClick')
			},
			goPer(item){
				if(this.type != 7){
					this.$emit('goPer',item)
				}
			},
			goCom(){
				uni.navigateTo({
					url:'/pages/update/committee?id='+this.pitem.communitycommittee.committee_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.postheader {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-top: 20upx;
	padding-bottom: 20upx;
	padding-left:24upx;
	box-sizing: border-box;
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
	.userinfo {
		display: flex;
		flex-direction: column;
		margin-right: 20upx;
		max-width:calc(100% - 286upx);
		.userwrap {
			display: flex;
			flex-direction: row;
			.name {
				height: 36upx;
				font-size: 26upx;
				font-weight: bold;
				width: fit-content;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: rgba(51, 51, 51, 1);
				line-height: 36upx;
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
				background: #08C299;
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
					color: white;
				}
			}
			.chuang {
				width:37upx;
				height: 32upx;				
				background:  #08C299;
				border-radius: 10upx;
				font-size: 20upx;
				font-weight: bold;
				color: white;
				line-height: 32upx;
				text-align: center;
			}
		}
		.usertime {
			height: 32upx;
			font-size: 22upx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			line-height: 32upx;
			text-align: left;
			margin-top:10upx;
			.juli {
				padding-left: 15upx;
			}
			.ph{
				margin-left:30upx;
			}
		}
	}
	.morewrap{
		margin-left: auto;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height:64upx;
		width:180upx;
		padding-right:29upx;
		box-sizing: border-box;
		
	}
	.more {
		width: calc(48upx * 1.2);
		height: calc(48upx * 1.2);
		// transform: rotate(-90deg);
		margin-right:5upx;
		// margin-left: auto;
	}
}
</style>
