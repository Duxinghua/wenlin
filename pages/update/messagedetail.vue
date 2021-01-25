<template>
	<!-- 消息详情 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
				<view class="listitem" >
					<view class="t1">
						<view class="s1">
							{{detail.title}}
						</view>
						<text class="s2">
							{{detail.create_time | formatTime}}
						</text>
					</view>
					<view class="t2">
						{{detail.content}}
					</view>
				</view>
				<view class="btndel" @click="delhandler(detail.id)">
					删除
				</view>
		</view>

	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '消息详情', //title
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
				headerIndex:1,
				page:1,
				page_size:10,
				type:1,
				sysNoticesList:[],
				total_page:0,
				id:1,
				detail:{}
			};
		},
		mounted() {
			this.id = this.$mp.query.id
			this.sysNoticesDetail()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			delhandler(obj){
				var data = {
					id:obj
				}
				this.Api.delSysNotices(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							duration:2000,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
					}
				})
			},
			sysNoticesDetail(ismore){
				var data = {
					id:this.id
				}
				this.Api.sysNoticesDetail(data).then((result) => {
					if(result.code == 1){

						this.detail = result.data
					}
				})
			}
		},
		components: {
			navigationCustom
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
			.listitem{
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				padding:0 24upx;
				padding-bottom: 24upx;
				box-sizing: border-box;
				.t1{
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					padding-top:24upx;
					box-sizing: border-box;
					width:100%;
					.s1{
						max-width:calc(100% - 140upx);
						width: fit-content;
						font-size:32upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:44upx;
						text-align: left;
						position: relative;
						.st{
							position: absolute;
							width:12upx;
							height:12upx;
							border-radius: 50%;
							background:rgba(255,43,32,1);
							top:6upx;
							right:-12upx;
						}
					}
					.s2{
						width:150upx;
						text-align: right;
						font-size:24upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
						line-height:34upx;
					}
				}
				.t2{
					width:100%;
					font-size:28upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(102,102,102,1);
					line-height:40upx;
					margin-top:16upx;			
				}
			}
			.btndel{
				position: fixed;
				left:24upx;
				bottom: 108upx;
				width:702upx;
				height:80upx;
				background:rgba(216,216,216,1);
				border-radius:40upx;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:80upx;
				letter-spacing:8upx;
				text-align: center;
			}
		
		}	
	}
</style>
