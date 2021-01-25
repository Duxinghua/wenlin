<template>
	<view class="commentitem">
		<view class="userheader">
			<image :src="pitem.user.avatar" class="useravatar" @click.stop="goPer(pitem)"></image>
			<text class="username" @click.stop="goPer(pitem)">{{pitem.user.user_nickname}}·{{community_id == pitem.user.community_id ? pitem.user.building+'#' : pitem.user.community_name}}</text>
			<view class="like" @click.stop="goPer(pitem)">
				<image src="../../static/like.png" class="likeimg" />
				<text class="liketext">{{pitem.user.love_value}}</text>
			</view>

		</view>
		<view class="commenttext">
		<rich-text class="richtext" :nodes='pitem.nodes' @click="reply" :data-obj="pitem"></rich-text>
		</view>
		<view class="commenttool" v-if="replyFlag">
			<text class="year">{{pitem.create_time | formatTime}}</text>
			<view class="del" @click="del" v-if="uid == pitem.user_id">删除</view>
			<view class="reply"  @click="reply" :data-obj="pitem" v-else>回复</view>
			<view :class="['thank',pitem.thanks == 1 ? 'active' : '']" v-if="type == 1 " @click="thank">答谢 {{pitem.thanks_score != 0 ? pitem.thanks_score : ''}}</view>
			<view class="flover" @click="floverClick">
				<image :src="pitem.user_like == 1 ? '../../static/favourga.png' : '../../static/favourg.png'" class="floverimg" />
				<text class="flovertext" :class="[pitem.user_like == 1 ? 'active':'']">{{pitem.like == 0 ? '' :pitem.like}}</text>
			</view>
		</view>
		<view class="commentlist" v-if="!replyFlag && pitem.reply">
			<view class="commnetwrap">
				<view class="listitem" >
					<text>{{pitem.reply}}
					</text>
					
			<!-- 		<rich-text :nodes='sitem.nodes'></rich-text> -->
				</view>
			</view>
		</view>
		<view class="commentlist" v-if="pitem.children.length && replyFlag">
			<view class="commnetwrap">
				<view class="listitem" v-for="(sitem,index) in list" :key="index" >
<!-- 					<text>{{sitem.user.user_nickname}}·{{sitem.user.community_id == community_id ? sitem.user.building + '#' : sitem.user.community_name}}：
					</text> -->
					<rich-text :nodes='sitem.nodes' @click="reply"  :data-obj="sitem"></rich-text>
				</view>
			</view>
			<view v-if="pitem.children.length > 3">
			<view :class="['last',!allFlay ? 'lastActive' : '']" v-if="!allFlay" @click="allRead">查看全部{{pitem.children.length}}条回复</view>
			<view class="last" v-if="allFlay" @click="allClose">收回</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				allFlay:false,
				community_id:uni.getStorageSync('community_id'),
				uid:uni.getStorageSync('user').id
			}
		},
		computed:{
			autoXb(){
				var community_id = uni.getStorageSync('community_id')
				if(community_id == this.pitem.user.community_id){
					return this.pitem.user.building+'#'
				}else{
					return this.pitem.user.community_name
				}
			},
			list(){
				if(!this.replyFlag){
					if(this.pitem.children){
						if(!this.allFlay){
							if(this.pitem.children.length > 3){
								return  this.pitem.children.slice(0,3)
							}else{
								return this.pitem.children
							}
						}else{
							return this.pitem.children
						}
					}
				}else{
					
						if(this.pitem.children){
							if(!this.allFlay){
								if(this.pitem.children.length > 3){
									return  this.pitem.children.slice(0,3)
								}else{
									return this.pitem.children
								}
							}else{
								return this.pitem.children
							}
						}
					
				}
			}
		},
		watch:{
			
		},
		props:{
			pitem:{
				type: Object
			},
			type:{
				type:Number
			},
			replyFlag:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			allRead(){
				this.allFlay = true
			},
			allClose(){
				this.allFlay = false
			},
			emotion(res) {
				// const list = Array.from({length:100}, (v,k) => k)
				// let index = list.indexOf(res)
				//  请将此处地址更换为自己服务器的地址 https://sq.wenlinapp.com/bkhumor-emoji/
				return `<img src="https://sq.wenlinapp.com/bkhumor-emoji/${res}.gif" align="middle">`
			},
			reply(e){
				var obj = e.target.dataset.obj
				if(obj.user_id == uni.getStorageSync('user').id){
					this.$emit('del',obj)
				}else{
					this.$emit('reply', obj)
				}
				
			},
			floverClick(){
				console.log(1)
				this.$emit('flover',this.pitem)
			},
			del(){
				this.$emit('del',this.pitem)
			},
			thank(){
				this.$emit('thank',this.pitem)
			},
			goPer(item) {
				var obj = item.user
				this.$emit('goPer',obj)
				return;
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
	}
</script>

<style lang="scss" scoped>
	.commentitem{
		display: flex;
		flex-direction: column;
		padding:24upx 0;
		border-bottom: 1upx solid #dedede;
		.userheader{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 24upx;
			.useravatar{
				width:68upx;
				height:68upx;
				border-radius: 50%;
				margin-right:16upx;
			}
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

		}
		.commenttext{
			padding-left:80upx;
			box-sizing: border-box;
			font-size:30upx;
			font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:42upx;
			margin-bottom: 24upx;
			text-align: left;
			.richtext{
				
			}
			rich-text{
				display: inline-flex;
				width:100%;
				justify-content: flex-start;
				align-items: center;
				font-size:31rpx;
				font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:43rpx;
				.imgemoji{
					width:30rpx;
					height:30rpx;
					margin:auto;
				}
			}
		}
		.commenttool{
			padding-left:80upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size:24upx;
			font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
			font-weight:500;
			color:rgba(153,153,153,1);
			line-height:34upx;
			margin-bottom: 24upx;
			.year{
				margin-right:64upx;
			}
			.time{
				margin-right:64upx;
			}
			.del{
				margin-right:64upx;
			}
			.thank{
				margin-left:64upx;
			}
			.active{
				color:rgba(255,156,0,0.8);
			}
			.flover{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				margin-left:auto;
				.floverimg{
					width:34upx;
					height:34upx;
					margin-right:6upx;
				}
				.flovertext{
					font-size:22upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(102,102,102,1);
				}
				.active{
					color:rgba(255,156,0,0.8);
				}
			}
		}
		.commentlist{
			width:calc(100% - 80upx);
			margin-left:80upx;
			height:auto;
			background:rgba(234,234,234,0.3);
			border-radius:8upx;
			padding:16upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.last{
				font-size:24upx;
				font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:rgba(153,153,153,1);
				line-height:34upx;
				text-align: left;
			}
			.lastActive{
				color:#FF9C00;
			}
			.commnetwrap{
				.listitem{
					display: inline-block;
					width:100%;
					font-size:27upx;
					font-family:PingFang-SC-Regular,PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					line-height:42upx;
					margin-bottom: 10upx;
					text:nth-of-type(1){
						color:rgba(255,156,0,1);
						white-space: nowrap;
						float:left;
					}
					text:nth-of-type(2){
						float:left;
						color:#333333;
					}
				}
			}
	
		}
	
	}
</style>
