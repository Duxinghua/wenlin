<template>
	<!-- 积分 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="header">
				<view class="numwrap">
					<text>{{detail.total_score}}</text>
					<image src="../../static/jf.png" class="jfico"></image>
				</view>
				
			</view>
			<view class="listwrap">
				<view class="listitem">
					<view class="listinfo">
						<text class="t1">今日已获得:</text>
						<text class="t2">{{detail.today_score}}</text>
					</view>
					<view class="jfinfo" @click="goMx">
						<image class="mxico" src="../../static/mxico.png"></image>
						<text class="mxtext">明细</text>
					</view>
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">签到</text>
						<text class="t2">+{{detail.task.sign.score}} 积分{{detail.task.sign.num != 0 ? '，剩余'+detail.task.sign.num+'次':''}}</text>
					</view>
				
			
						<navigator  class="jfinfos" url="/pages/my/index" v-if="detail.task.sign.num != 0" >
						去完成
						</navigator>
						<view class="jfinfos1" v-if="detail.task.sign.num == 0">
							已完成
						</view>
				
				
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">发贴</text>
						<text class="t2">+{{detail.task.publish.score}} 积分{{detail.task.publish.num != 0 ? '，剩余'+detail.task.publish.num+'次':''}}</text>
					</view>
					<view  class="jfinfos" @click="goPush" v-if="detail.task.publish.num != 0">
						去完成
					</view>
					<view class="jfinfos1" v-if="detail.task.publish.num == 0">
						已完成
					</view>
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">评论</text>
						<text class="t2">+{{detail.task.comment.score}}积分{{detail.task.comment.num != 0 ? '，剩余'+detail.task.comment.num+'次': ''}}</text>
					</view>
					<navigator  class="jfinfos" url="/pages/index/index?index=1" v-if="detail.task.comment.num != 0">
						去完成
					</navigator>
					<view class="jfinfos1" v-if="detail.task.comment.num == 0">
						已完成
					</view>
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">邀请邻居</text>
						<text class="t2">+{{detail.task.invite_neighbor.score}} 积分, 次数不限</text>
					</view>
					<navigator  class="jfinfos" url="/pages/update/neighbour" >
						去看看
					</navigator>
				<!-- 	<view class="jfinfos1" v-if="detail.task.invite_neighbor.num == 0">
						已完成
					</view> -->
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">报名活动</text>
						<text class="t2">+{{detail.task.join_activity.score}} 积分, 次数不限</text>
					</view>
					<navigator  class="jfinfos" url="/pages/index/index" >
						去看看
					</navigator>
		<!-- 			<view class="jfinfos1" v-if="detail.task.join_activity.num == 0">
						已完成
					</view> -->
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">申请达人</text>
						<text class="t2">+{{detail.task.join_daren.score}} 积分{{detail.task.join_daren.num != 0 ? '，剩余'+detail.task.join_daren.num+'次': ''}}</text>
					</view>
					<navigator  class="jfinfos" url="/pages/push/edit?type=6&source=my" v-if="detail.task.join_daren.num != 0" >
						去完成
					</navigator>
					<view class="jfinfos1" v-if="detail.task.join_daren.num == 0">
						已完成
					</view>
				</view>
				<view class="listitem" v-if="false">
					<view class="listinfos">
						<text class="t1">挑错成功</text>
						<text class="t2">+{{detail.task.wiki_pick.score}} 积分, 次数不限</text>
					</view>
					<navigator  class="jfinfos" url="/pages/index/index" >
						去看看
					</navigator>
			<!-- 		<view class="jfinfos1" v-if="detail.task.wiki_pick.num == 0">
						已完成
					</view> -->
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">意见采纳</text>
						<text class="t2">+{{detail.task.suggestion.score}} 积分, 次数不限</text>
					</view>
					<navigator  class="jfinfos" url="/pages/update/idea" >
						去看看
					</navigator>
		<!-- 			<view class="jfinfos1" v-if="detail.task.suggestion.num == 0">
						已完成
					</view> -->
				</view>
				<view class="listitem">
					<view class="listinfos">
						<text class="t1">贴子举报</text>
						<text class="t2">+{{detail.task.accusation.score}} 积分, 次数不限</text>
					</view>
					<navigator  class="jfinfos" url="/pages/index/index" >
						去看看
					</navigator>
			<!-- 		<view class="jfinfos1" v-if="detail.task.accusation.num == 0">
						已完成
					</view> -->
				</view>
			</view>
		</view>
		<!-- 发布组件 -->
		<Pushedit ref="Pushedit" />
	</view>
</template>

<script>
	import Pushedit from '../../components/pushedit/pushedit.vue'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '积分', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				detail:{},
				taskList:[]
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted(){
			this.getmyScoreTask()
		},
		methods:{
			customConduct(e){
				console.log(e)
			},
			goMx(){
				uni.navigateTo({
					url:'/pages/update/integraldetail?score='+this.detail.total_score
				})
			},
			getmyScoreTask() {
				this.Api.myScoreTask({community_id:uni.getStorageSync('community_id')}).then((result) => {
					if(result.code == 1){
						this.detail = result.data						
					}
				})
			},
			goPush(){
				this.$refs.Pushedit.pushshow()
			}
		},
		components: {
			navigationCustom,
			Pushedit
		}
	};
</script>

<style lang="scss" scoped>
	.integral{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			.header{
				height:172upx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 8upx solid #DEDEDE;
				.numwrap{
					display: flex;
					flex-direction: row;
					align-items: center;
					width:fit-content;
					text{
						font-size:56upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:80upx;
						margin-right:8upx;
					}
					.jfico{
						width:70upx;
						height:70upx;
					}
				}
			}
			.listwrap{
				display: flex;
				flex-direction: column;
				// padding-left:24upx;
				// padding-right:24upx;
				.listitem:first-child{
					width:100%;
					height:132upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					.listinfo{
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-start;
						font-size:32upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						.t1{
							font-weight:bold;
							color:rgba(51,51,51,1);
							margin-right:10upx;
						}
						.t2{
							font-weight:bold;
							color:#FF9C00;
						}
					}
					.jfinfo{
						display: flex;
						flex-direction: row;
						align-items: center;
						.mxico{
							width:40upx;
							height:42upx;
						}
						.mxtext{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(255,156,0,1);
						}
					}
				}
				.listitem{
					height:140upx;
					padding-left:24upx;
					padding-right:24upx;
					border-bottom: 1px solid #DEDEDE;
					display: flex;
					flex-direction: row;
					align-items: center;
					.listinfos{
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;
						width:70%;
						.t1{
							font-size:28upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:bold;
							color:rgba(51,51,51,1);
							line-height:40upx;
						}
						.t2{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:#FF9C00;
							line-height:34upx;
						}
					}
					.jfinfos{
						margin-left:auto;
						width:112upx;
						height:48upx;
						line-height: 48upx;
						text-align: center;
						background:rgba(255,156,0,1);
						border-radius:24upx;
						font-size:24upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(255,255,255,1);
					}
					.jfinfos1{
						font-size:24upx;
						padding-right:20upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
						margin-left: auto;
					}
				}
			}
		}
	}
</style>
