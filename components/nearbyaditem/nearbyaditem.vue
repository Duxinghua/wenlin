<template>
	<view class="postitem" @click="postDetail">
			<view class="postheader">
				<view :class="['headerimg',!pitem.user.avatar ? 'headerimgfix':'']" @click.stop="goPer(pitem.user)">
					<image :src="pitem.user.avatar" class="avatar"></image>
					<image v-if="pitem.user.daren == 1" src="../../static/da.png" class="da"></image>
				</view>
				<view class="userinfo" @click.stop="goPer(pitem.user)">
					<view class="userwrap">
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
				<view class="lovewrap" @click.stop="moreClick(pitem)">
					识认TA
				</view>
			</view>
			<view class="lookperson">
				<view class="looktexts">
					认识TA的人:
				</view>
				<view class="avatarwrap">
					<u-image width="54rpx" height="54rpx" border-radius="27rpx" :src="src"></u-image>
				</view>
			</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
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
		}
	},
	computed: {

	},
	methods: {
		postDetail() {
			if (!uni.getStorageSync('token')) {
				this.$emit('toLogin');
				return;
			} else {
				if (!uni.getStorageSync('community_id')) {
					this.$emit('toLogin');
					return;
				}
			}
			var type = this.pitem.type;
			var publish_type = this.pitem.publish_type; //2为居委会 3小区
			if(this.pitem.opening == 0){
				if(this.pitem.community_id != uni.getStorageSync('community_id')){
					uni.showToast({
						icon:'none',
						title:'本条信息仅限本小区用户可见',
						duration:2000
					})
					return;
				}
			}
			if (type == 5 && publish_type == 2) {
				uni.navigateTo({
					url: '/pages/index/cdetail?dynamics_id=' + this.pitem.id + '&type=' + this.pitem.type + '&id=' + this.pitem.object_id
				});
			} else {
				if (type == 7 || type == 8) {
					uni.navigateTo({
						url: '/pages/index/detail?dynamics_id=' + this.pitem.id + '&type=' + this.pitem.type + '&id=' + this.pitem.object_id
					});
				} else {
					uni.navigateTo({
						url: '/pages/index/detail?id=' + this.pitem.id + '&type=' + this.pitem.type
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
				if (!uni.getStorageSync('community_id')) {
					this.$emit('toLogin');
					return;
				}
			}
			uni.navigateTo({
				url: '/pages/index/personalcard?user_id=' + obj.id + '&community_id=' + obj.community_id
			});
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
		.lovewrap{
			width: 113upx;
			height: 41upx;
			background: linear-gradient(44deg, #FEAA0E, #FFC000);
			border-radius: 10upx;
			font-size: 20upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
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
	.lookperson{
		display: flex;
		flex-direction: row;
		align-items: center;
		.looktexts{
			font-size: 34upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #020433;
		}
		.avatarwrap{
			display: flex;
			flex-direction: row;
			align-items: center;
			/deep/ .u-image{
				margin-right:15upx;
			}
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
}
</style>
<style>
	.u-image{
		height:100%!important
	}
</style>
